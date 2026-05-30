"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import type { ConversationPreview } from "@/actions/messages";

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

function timeAgo(date: Date): string {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return "now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

interface ConversationSidebarProps {
  conversations: ConversationPreview[];
  currentUserId: string;
}

export function ConversationSidebar({ conversations, currentUserId }: ConversationSidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className="flex flex-col h-full"
      style={{ borderRight: "1px solid rgba(232,226,216,0.9)" }}
    >
      {/* Sidebar header */}
      <div
        className="px-4 py-4 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(232,226,216,0.8)" }}
      >
        <div className="flex items-center gap-2">
          <MessageSquare size={15} style={{ color: "#e07a5f" }} />
          <h2 className="text-[13.5px] font-bold" style={{ color: "#1e1a17" }}>
            Messages
          </h2>
          {conversations.some((c) => c.unreadCount > 0) && (
            <span
              className="ml-auto h-5 min-w-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center"
              style={{ background: "#e07a5f", color: "white" }}
            >
              {conversations.reduce((s, c) => s + c.unreadCount, 0)}
            </span>
          )}
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-4 text-center py-12">
            <div
              className="h-12 w-12 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(224,122,95,0.08)" }}
            >
              <MessageSquare size={20} style={{ color: "#e07a5f" }} />
            </div>
            <div>
              <p className="text-[13px] font-semibold" style={{ color: "#1e1a17" }}>
                No conversations yet.
              </p>
              <p className="text-[12px] mt-1 leading-relaxed" style={{ color: "#9e9890" }}>
                Message an accepted connection to get started.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {conversations.map((convo, i) => {
              const name = convo.otherUser.name ?? "User";
              const isActive = pathname === `/dashboard/messages/${convo.id}`;
              const hasUnread = convo.unreadCount > 0;
              const lastContent = convo.lastMessage
                ? (convo.lastMessage.senderId === currentUserId ? "You: " : "") +
                  (convo.lastMessage.content.length > 40
                    ? convo.lastMessage.content.slice(0, 40) + "…"
                    : convo.lastMessage.content)
                : "Start the conversation";

              return (
                <motion.div
                  key={convo.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={`/dashboard/messages/${convo.id}`}
                    className="flex items-center gap-3 px-4 py-3.5 transition-colors relative"
                    style={{
                      background: isActive ? "rgba(224,122,95,0.06)" : "transparent",
                      borderLeft: isActive ? "2px solid #e07a5f" : "2px solid transparent",
                    }}
                  >
                    {/* Avatar */}
                    <div
                      className="h-10 w-10 rounded-2xl flex items-center justify-center text-[14px] font-bold text-white flex-shrink-0"
                      style={{ background: avatarGradient(name) }}
                    >
                      {name.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p
                          className="text-[13.5px] font-semibold truncate"
                          style={{ color: hasUnread ? "#1e1a17" : "#3a3530" }}
                        >
                          {name}
                        </p>
                        {convo.lastMessage && (
                          <span className="text-[10.5px] flex-shrink-0" style={{ color: "#c8c2ba" }}>
                            {timeAgo(convo.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-1 mt-0.5">
                        <p
                          className="text-[12px] truncate"
                          style={{ color: hasUnread ? "#6b6560" : "#b8b2aa" }}
                        >
                          {lastContent}
                        </p>
                        {hasUnread && (
                          <span
                            className="h-4 min-w-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center flex-shrink-0"
                            style={{ background: "#e07a5f", color: "white" }}
                          >
                            {convo.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
