import type { Metadata } from "next";
import { getConversations } from "@/actions/messages";
import { getServerUser } from "@/lib/auth/supabase-server";
import { ConversationSidebar } from "@/components/messages/conversation-sidebar";

export const metadata: Metadata = {
  title: "Messages — Synq",
  description: "Direct messages with your connections on Synq.",
};

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, conversations] = await Promise.all([
    getServerUser(),
    getConversations(),
  ]);

  return (
    <div
      className="flex h-full"
      style={{ background: "#fdfbf7" }}
    >
      {/* Sidebar — hidden on mobile when a chat is open */}
      <div
        className="w-full md:w-72 lg:w-80 flex-shrink-0 h-full flex flex-col"
        style={{ borderRight: "1px solid rgba(232,226,216,0.9)" }}
      >
        <ConversationSidebar
          conversations={conversations}
          currentUserId={user?.id ?? ""}
        />
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {children}
      </div>
    </div>
  );
}
