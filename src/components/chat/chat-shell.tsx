"use client";

import { useState, useEffect, useCallback } from "react";
import { ChatSidebar } from "./chat-sidebar";
import { ChatWindow } from "./chat-window";
import { ChatInput } from "./chat-input";

interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
}

interface Conversation {
  id: string;
  title: string | null;
  updatedAt: string;
}

export function ChatShell() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load conversation list on mount
  useEffect(() => {
    fetch("/api/chat?action=conversations")
      .then((r) => r.json())
      .then((d) => setConversations(d.conversations ?? []))
      .catch(console.error);
  }, []);

  // Load messages when switching conversations
  const loadConversation = useCallback(async (id: string) => {
    setActiveConvId(id);
    setMessages([]);
    setError(null);
    const res = await fetch(`/api/chat?conversationId=${id}`);
    const data = await res.json();
    setMessages(
      (data.messages ?? []).map((m: { id: string; role: string; content: string; createdAt: string }) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
        createdAt: new Date(m.createdAt),
      }))
    );
  }, []);

  const startNewChat = () => {
    setActiveConvId(null);
    setMessages([]);
    setStreamingContent("");
    setError(null);
  };

  const sendMessage = async (content: string) => {
    if (isStreaming) return;
    setError(null);

    // Optimistically add user message
    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: tempId, role: "user", content, createdAt: new Date() },
    ]);
    setIsStreaming(true);
    setStreamingContent("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, conversationId: activeConvId }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body!.getReader();
      const dec = new TextDecoder();
      let aiContent = "";
      let newConvId: string | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = dec.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          const payload = trimmed.slice(6);
          if (payload === "[DONE]") break;
          try {
            const parsed = JSON.parse(payload);
            if (parsed.conversationId && !newConvId) {
              newConvId = parsed.conversationId;
              setActiveConvId(newConvId);
            }
            if (parsed.delta) {
              aiContent += parsed.delta;
              setStreamingContent(aiContent);
            }
          } catch { /* skip */ }
        }
      }

      // Commit streamed message to state
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: aiContent,
          createdAt: new Date(),
        },
      ]);
      setStreamingContent("");

      // Refresh conversation list (might have a new entry)
      fetch("/api/chat?action=conversations")
        .then((r) => r.json())
        .then((d) => setConversations(d.conversations ?? []))
        .catch(console.error);
    } catch (err) {
      console.error("[ChatShell] stream error:", err);
      setError("Something went wrong. Please try again.");
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex h-full">
      {/* Conversation sidebar — hidden on mobile */}
      <div className="hidden md:flex h-full">
        <ChatSidebar
          conversations={conversations}
          activeId={activeConvId}
          onSelect={loadConversation}
          onNew={startNewChat}
        />
      </div>

      {/* Main chat area */}
      <div className="flex flex-col flex-1 h-full min-h-0">
        {/* Error banner */}
        {error && (
          <div
            className="mx-4 mt-3 px-4 py-2.5 rounded-2xl text-[13px]"
            style={{
              background: "rgba(201,96,74,0.07)",
              border: "1px solid rgba(201,96,74,0.2)",
              color: "#c9604a",
            }}
          >
            {error}
          </div>
        )}

        <ChatWindow
          messages={messages}
          streamingContent={streamingContent}
          isStreaming={isStreaming}
          onStarterClick={sendMessage}
        />

        <ChatInput
          onSend={sendMessage}
          isLoading={isStreaming}
        />
      </div>
    </div>
  );
}
