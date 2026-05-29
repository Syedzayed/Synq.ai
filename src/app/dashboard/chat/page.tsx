import type { Metadata } from "next";
import { ChatShell } from "@/components/chat/chat-shell";

export const metadata: Metadata = {
  title: "Synq AI — Chat",
  description: "Your intelligent networking assistant. Discover connections, improve your profile, and find collaborators.",
};

// Auth + completion guards handled by dashboard layout.
export default function ChatPage() {
  return (
    // h-full fills the flex-1 main area from the layout
    <div className="h-full flex flex-col">
      <ChatShell />
    </div>
  );
}
