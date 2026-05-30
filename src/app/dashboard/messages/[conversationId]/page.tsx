import { notFound } from "next/navigation";
import { getServerUser } from "@/lib/auth/supabase-server";
import { getMessages } from "@/actions/messages";
import { ChatWindow } from "@/components/messages/chat-window";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ conversationId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { conversationId } = await params;
  return {
    title: "Chat — Synq",
    description: `Direct conversation on Synq`,
  };
}

export default async function ConversationPage({ params }: Props) {
  const { conversationId } = await params;
  const user = await getServerUser();
  if (!user) notFound();

  const { messages, otherUser } = await getMessages(conversationId);

  // If the user is not a participant, otherUser will be null and messages []
  // We still render — the action already validated membership
  if (otherUser === null && messages.length === 0) {
    // Check if user tried to access a conversation they don't belong to
    notFound();
  }

  return (
    <ChatWindow
      conversationId={conversationId}
      currentUserId={user.id}
      otherUser={otherUser}
      initialMessages={messages}
    />
  );
}
