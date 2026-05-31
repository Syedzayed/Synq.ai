"use server";

/**
 * messages.ts — Server Actions for the Direct Messaging system
 *
 * Security model:
 *  - All actions derive userId from the session — never from client input
 *  - Users can only message accepted connections (validated before create)
 *  - Every read/write verifies the caller is a participant of the conversation
 *  - Sending validates participant membership + ownership of senderId
 */

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/prisma";
import { getServerUser } from "@/lib/auth/supabase-server";
import { createNotification } from "./notifications";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ConversationPreview {
  id: string;
  otherUser: {
    userId: string;
    name: string | null;
    role: string | null;
    organization: string | null;
  };
  lastMessage: {
    content: string;
    senderId: string;
    createdAt: Date;
  } | null;
  unreadCount: number;
  updatedAt: Date;
}

export interface MessageItem {
  id: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Verify the two users have an ACCEPTED connection in either direction. */
async function assertAcceptedConnection(userAId: string, userBId: string): Promise<boolean> {
  const connection = await db.connection.findFirst({
    where: {
      OR: [
        { senderId: userAId, receiverId: userBId },
        { senderId: userBId, receiverId: userAId },
      ],
      status: "ACCEPTED",
    },
  });
  return !!connection;
}

/** Verify the caller is a participant of a conversation. */
async function assertParticipant(userId: string, conversationId: string): Promise<boolean> {
  const participant = await db.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  return !!participant;
}

// ─── createConversation ───────────────────────────────────────────────────────

export async function createConversation(
  otherUserId: string
): Promise<{ success: boolean; conversationId?: string; error?: string }> {
  const user = await getServerUser();
  if (!user) return { success: false, error: "Not authenticated." };
  if (user.id === otherUserId) return { success: false, error: "Cannot message yourself." };

  // Permission: must be an accepted connection
  const isConnected = await assertAcceptedConnection(user.id, otherUserId);
  if (!isConnected) return { success: false, error: "You can only message accepted connections." };

  // Check if a conversation already exists between these two users
  const existing = await db.directConversation.findFirst({
    where: {
      participants: {
        every: { userId: { in: [user.id, otherUserId] } },
      },
      AND: {
        participants: { some: { userId: user.id } },
      },
    },
    include: {
      participants: { select: { userId: true } },
    },
  });

  // Verify both participants are present (findFirst may match partial)
  if (existing) {
    const userIds = existing.participants.map((p: { userId: string }) => p.userId);
    if (userIds.includes(user.id) && userIds.includes(otherUserId)) {
      return { success: true, conversationId: existing.id };
    }
  }

  // Create new conversation
  const convo = await db.directConversation.create({
    data: {
      participants: {
        create: [{ userId: user.id }, { userId: otherUserId }],
      },
    },
  });

  revalidatePath("/dashboard/messages");
  return { success: true, conversationId: convo.id };
}

// ─── getConversations ─────────────────────────────────────────────────────────

export async function getConversations(): Promise<ConversationPreview[]> {
  const user = await getServerUser();
  if (!user) return [];

  // Step 1: find all conversation IDs this user belongs to
  const myParticipations = await db.conversationParticipant.findMany({
    where: { userId: user.id },
    select: { conversationId: true },
    orderBy: { conversation: { updatedAt: "desc" } },
  });

  if (myParticipations.length === 0) return []; // ← short-circuit, prevents IN (NULL)

  const convIds = myParticipations.map((p: { conversationId: string }) => p.conversationId);

  // Step 2: fetch conversations with all other participants' profiles — flat, no deep nesting
  const [conversations, allParticipants, lastMessages, unreadCounts] = await Promise.all([
    db.directConversation.findMany({
      where: { id: { in: convIds } },
      orderBy: { updatedAt: "desc" },
    }),
    db.conversationParticipant.findMany({
      where: { conversationId: { in: convIds }, userId: { not: user.id } },
      include: { user: { include: { profile: { select: { name: true, role: true, organization: true } } } } },
    }),
    db.directMessage.findMany({
      where: { conversationId: { in: convIds } },
      orderBy: { createdAt: "desc" },
      distinct: ["conversationId"],
    }),
    db.directMessage.groupBy({
      by: ["conversationId"],
      where: { conversationId: { in: convIds }, senderId: { not: user.id }, isRead: false },
      _count: { id: true },
    }),
  ]);

  // Build lookup maps
  const participantByConvo = new Map<string, any>(allParticipants.map((p: any) => [p.conversationId, p]));
  const lastMsgByConvo = new Map<string, any>(lastMessages.map((m: any) => [m.conversationId, m]));
  const unreadByConvo = new Map<string, number>(unreadCounts.map((u: any) => [u.conversationId, u._count.id]));

  const previews: ConversationPreview[] = [];

  for (const convo of conversations) {
    const other = participantByConvo.get(convo.id);
    if (!other) continue; // skip self-conversations (shouldn't happen)

    const lastMsg = lastMsgByConvo.get(convo.id) ?? null;
    const unreadCount = unreadByConvo.get(convo.id) ?? 0;

    previews.push({
      id: convo.id,
      otherUser: {
        userId: other.userId,
        name: other.user.profile?.name ?? null,
        role: other.user.profile?.role ?? null,
        organization: other.user.profile?.organization ?? null,
      },
      lastMessage: lastMsg
        ? { content: lastMsg.content, senderId: lastMsg.senderId, createdAt: lastMsg.createdAt }
        : null,
      unreadCount,
      updatedAt: convo.updatedAt,
    });
  }

  return previews;
}

// ─── getMessages ──────────────────────────────────────────────────────────────

export async function getMessages(conversationId: string): Promise<{
  messages: MessageItem[];
  otherUser: { userId: string; name: string | null; role: string | null } | null;
}> {
  const user = await getServerUser();
  if (!user) return { messages: [], otherUser: null };

  const isMember = await assertParticipant(user.id, conversationId);
  if (!isMember) return { messages: [], otherUser: null };

  const [messages, participants] = await Promise.all([
    db.directMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    }),
    db.conversationParticipant.findMany({
      where: { conversationId },
      include: { user: { include: { profile: true } } },
    }),
  ]);

  const otherParticipant = participants.find((p: any) => p.userId !== user.id);

  return {
    messages: messages.map((m: any) => ({
      id: m.id,
      senderId: m.senderId,
      content: m.content,
      isRead: m.isRead,
      createdAt: m.createdAt,
    })),
    otherUser: otherParticipant
      ? {
          userId: otherParticipant.userId,
          name: otherParticipant.user.profile?.name ?? null,
          role: otherParticipant.user.profile?.role ?? null,
        }
      : null,
  };
}

// ─── sendMessage ──────────────────────────────────────────────────────────────

export async function sendMessage(
  conversationId: string,
  content: string
): Promise<{ success: boolean; message?: MessageItem; error?: string }> {
  const user = await getServerUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const trimmed = content.trim();
  if (!trimmed) return { success: false, error: "Message cannot be empty." };
  if (trimmed.length > 4000) return { success: false, error: "Message too long." };

  // Participant guard
  const isMember = await assertParticipant(user.id, conversationId);
  if (!isMember) return { success: false, error: "Not a participant." };

  const message = await db.directMessage.create({
    data: { conversationId, senderId: user.id, content: trimmed },
  });

  // Update conversation updatedAt for sidebar ordering
  await db.directConversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  // Notify the other participant
  const otherParticipant = await db.conversationParticipant.findFirst({
    where: { conversationId, userId: { not: user.id } },
  });
  if (otherParticipant) {
    const senderProfile = await db.profile.findUnique({
      where: { userId: user.id },
      select: { name: true },
    });
    const senderName = senderProfile?.name ?? "Someone";
    await createNotification({
      userId: otherParticipant.userId,
      type: "SYSTEM",
      title: "New Message",
      message: `${senderName} sent you a message.`,
      relatedUserId: user.id,
      relatedEntityId: conversationId,
    });
  }

  revalidatePath(`/dashboard/messages/${conversationId}`);
  revalidatePath("/dashboard/messages");

  return {
    success: true,
    message: {
      id: message.id,
      senderId: message.senderId,
      content: message.content,
      isRead: message.isRead,
      createdAt: message.createdAt,
    },
  };
}

// ─── markMessagesRead ─────────────────────────────────────────────────────────

export async function markMessagesRead(conversationId: string): Promise<void> {
  const user = await getServerUser();
  if (!user) return;

  const isMember = await assertParticipant(user.id, conversationId);
  if (!isMember) return;

  await db.directMessage.updateMany({
    where: {
      conversationId,
      senderId: { not: user.id },
      isRead: false,
    },
    data: { isRead: true },
  });

  revalidatePath("/dashboard/messages");
}

// ─── getTotalUnreadCount (for nav badge) ──────────────────────────────────────

export async function getTotalUnreadMessageCount(): Promise<number> {
  const user = await getServerUser();
  if (!user) return 0;

  const participations = await db.conversationParticipant.findMany({
    where: { userId: user.id },
    select: { conversationId: true },
  });

  if (participations.length === 0) return 0;

  const convIds = participations.map((p: { conversationId: string }) => p.conversationId);
  return db.directMessage.count({
    where: {
      conversationId: { in: convIds },
      senderId: { not: user.id },
      isRead: false,
    },
  });
}
