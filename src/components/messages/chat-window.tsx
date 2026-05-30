"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Briefcase, MessageSquare } from "lucide-react";
import Link from "next/link";
import { MessageBubble, DateDivider } from "./message-bubble";
import { MessageInput } from "./message-input";
import { markMessagesRead } from "@/actions/messages";
import type { MessageItem } from "@/actions/messages";

function avatarGradient(name: string) {
  const gradients = [
    "linear-gradient(135deg,#e07a5f,#f4a261)",
    "linear-gradient(135deg,#6b9080,#a4c3b2)",
    "linear-gradient(135deg,#8b7355,#c4a882)",
    "linear-gradient(135deg,#7c6d8a,#b5a7c4)",
    "linear-gradient(135deg,#5f7e8a,#8cb4be)",
  ];
  return gradients[(name?.charCodeAt(0) ?? 65) % gradients.length];
}

function isSameDay(a: Date, b: Date) {
  const da = new Date(a), db = new Date(b);
  return da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate();
}

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
  otherUser: { userId: string; name: string | null; role: string | null } | null;
  initialMessages: MessageItem[];
}

export function ChatWindow({
  conversationId,
  currentUserId,
  otherUser,
  initialMessages,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const name = otherUser?.name ?? "User";

  // Mark messages read on mount
  useEffect(() => {
    markMessagesRead(conversationId);
  }, [conversationId]);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMessageSent = (msg: MessageItem) => {
    setMessages((prev) => [...prev, msg]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{
          borderBottom: "1px solid rgba(232,226,216,0.9)",
          background: "rgba(253,251,247,0.98)",
        }}
      >
        <Link
          href="/dashboard/messages"
          className="md:hidden p-1.5 rounded-xl hover:bg-[rgba(232,226,216,0.5)] transition-colors"
        >
          <ArrowLeft size={16} style={{ color: "#6b6560" }} />
        </Link>

        {otherUser ? (
          <>
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-[14px] font-bold text-white flex-shrink-0"
              style={{ background: avatarGradient(name) }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold truncate" style={{ color: "#1e1a17" }}>
                {name}
              </p>
              {otherUser.role && (
                <p className="text-[11.5px] flex items-center gap-1" style={{ color: "#9e9890" }}>
                  <Briefcase size={10} />
                  {otherUser.role}
                </p>
              )}
            </div>
            <Link
              href={`/dashboard/discover/${otherUser.userId}`}
              className="text-[12px] font-medium px-3 py-1.5 rounded-xl transition-colors hover:bg-[rgba(232,226,216,0.5)]"
              style={{ color: "#9e9890" }}
            >
              View Profile
            </Link>
          </>
        ) : (
          <p className="text-[14px] font-semibold" style={{ color: "#1e1a17" }}>
            Conversation
          </p>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center flex-1 gap-4 py-16"
          >
            <div
              className="h-14 w-14 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(224,122,95,0.08)" }}
            >
              <MessageSquare size={22} style={{ color: "#e07a5f" }} />
            </div>
            <div className="text-center">
              <p
                className="text-[15px] font-medium"
                style={{
                  fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
                  color: "#1e1a17",
                }}
              >
                Say hello.
              </p>
              <p className="text-[13px] mt-1 max-w-xs" style={{ color: "#9e9890" }}>
                Great projects usually start with a simple message.
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            {messages.map((msg, i) => {
              const prev = messages[i - 1];
              const showDate = !prev || !isSameDay(prev.createdAt, msg.createdAt);
              // Show timestamp on last message or when next message is from a different sender
              const next = messages[i + 1];
              const showTimestamp = !next || next.senderId !== msg.senderId;
              const isOwn = msg.senderId === currentUserId;

              return (
                <div key={msg.id}>
                  {showDate && <DateDivider date={msg.createdAt} />}
                  <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-1`}>
                    <MessageBubble
                      content={msg.content}
                      isOwn={isOwn}
                      createdAt={msg.createdAt}
                      isRead={msg.isRead}
                      showTimestamp={showTimestamp}
                    />
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Composer */}
      <MessageInput
        conversationId={conversationId}
        onMessageSent={handleMessageSent}
      />
    </div>
  );
}
