"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Plus, Trash2 } from "lucide-react";

interface Conversation {
  id: string;
  title: string | null;
  updatedAt: string;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
}: ChatSidebarProps) {
  return (
    <div
      className="flex flex-col h-full"
      style={{ borderRight: "1px solid rgba(232,226,216,0.9)", width: "220px", flexShrink: 0 }}
    >
      {/* Header */}
      <div className="p-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(232,226,216,0.7)" }}>
        <p className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: "#9e9890" }}>
          Chats
        </p>
        <motion.button
          onClick={onNew}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="h-7 w-7 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(224,122,95,0.1)", border: "1px solid rgba(224,122,95,0.2)" }}
          title="New chat"
        >
          <Plus size={13} style={{ color: "#e07a5f" }} />
        </motion.button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-2 px-2 flex flex-col gap-1">
        <AnimatePresence>
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center px-3">
              <MessageSquare size={20} style={{ color: "#d8d2ca" }} className="mb-2" />
              <p className="text-[12px]" style={{ color: "#c8c2ba" }}>No chats yet</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const active = conv.id === activeId;
              return (
                <motion.button
                  key={conv.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => onSelect(conv.id)}
                  className="w-full text-left px-3 py-2.5 rounded-xl transition-colors relative group"
                  style={{
                    background: active ? "rgba(224,122,95,0.08)" : "transparent",
                    border: active ? "1px solid rgba(224,122,95,0.15)" : "1px solid transparent",
                  }}
                >
                  <p
                    className="text-[12.5px] font-medium truncate leading-snug"
                    style={{ color: active ? "#e07a5f" : "#3a3530" }}
                  >
                    {conv.title ?? "New conversation"}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: "#b8b2aa" }}>
                    {timeAgo(conv.updatedAt)}
                  </p>
                </motion.button>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
