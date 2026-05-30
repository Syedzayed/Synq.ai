"use server";

/**
 * connections.ts — Server Actions for the Connection Request system
 *
 * Security model:
 *  - All actions verify the caller is the authenticated user
 *  - Only the receiver can accept/reject
 *  - Only the sender can cancel a PENDING request
 *  - Self-connections are blocked
 *  - Duplicate requests are blocked at DB level (@@unique) and pre-checked
 */

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/prisma";
import { getServerUser } from "@/lib/auth/supabase-server";
import { createNotification } from "./notifications";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ConnectionStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface ConnectionUser {
  userId: string;
  name: string | null;
  role: string | null;
  organization: string | null;
  aiSummary: string | null;
}

export interface ConnectionRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: ConnectionStatus;
  createdAt: Date;
  otherUser: ConnectionUser;
}

export interface ConnectionsData {
  incoming: ConnectionRequest[];
  sent: ConnectionRequest[];
  accepted: ConnectionRequest[];
  pendingIncomingCount: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function profileToUser(profile: {
  userId: string;
  name: string | null;
  role: string | null;
  organization: string | null;
  aiSummary: string | null;
} | null | undefined, userId: string): ConnectionUser {
  return {
    userId,
    name: profile?.name ?? null,
    role: profile?.role ?? null,
    organization: profile?.organization ?? null,
    aiSummary: profile?.aiSummary ?? null,
  };
}

// ─── sendConnectionRequest ────────────────────────────────────────────────────

export async function sendConnectionRequest(
  receiverId: string
): Promise<{ success: boolean; error?: string }> {
  const user = await getServerUser();
  if (!user) return { success: false, error: "Not authenticated." };
  if (user.id === receiverId) return { success: false, error: "Cannot connect with yourself." };

  // Check if a connection already exists in either direction
  const existing = await db.connection.findFirst({
    where: {
      OR: [
        { senderId: user.id, receiverId },
        { senderId: receiverId, receiverId: user.id },
      ],
    },
  });

  if (existing) {
    if (existing.status === "ACCEPTED") return { success: false, error: "Already connected." };
    if (existing.status === "PENDING") return { success: false, error: "Request already pending." };
    // REJECTED — allow re-send by upserting
  }

  try {
    await db.connection.upsert({
      where: { senderId_receiverId: { senderId: user.id, receiverId } },
      create: { senderId: user.id, receiverId, status: "PENDING" },
      update: { status: "PENDING", updatedAt: new Date() },
    });

    // Notify the receiver
    const senderProfile = await db.profile.findUnique({
      where: { userId: user.id },
      select: { name: true },
    });
    const senderName = senderProfile?.name ?? "Someone";
    await createNotification({
      userId: receiverId,
      type: "CONNECTION_REQUEST",
      title: "New Connection Request",
      message: `${senderName} wants to connect with you.`,
      relatedUserId: user.id,
    });

    revalidatePath("/dashboard/connections");
    revalidatePath("/dashboard/discover");
    revalidatePath(`/dashboard/discover/${receiverId}`);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to send request." };
  }
}

// ─── acceptConnectionRequest ──────────────────────────────────────────────────

export async function acceptConnectionRequest(
  connectionId: string
): Promise<{ success: boolean; error?: string }> {
  const user = await getServerUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const connection = await db.connection.findUnique({ where: { id: connectionId } });
  if (!connection) return { success: false, error: "Request not found." };
  if (connection.receiverId !== user.id) return { success: false, error: "Not authorized." };
  if (connection.status !== "PENDING") return { success: false, error: "Request is not pending." };

  await db.connection.update({
    where: { id: connectionId },
    data: { status: "ACCEPTED", updatedAt: new Date() },
  });

  // Notify the original sender that their request was accepted
  const accepterProfile = await db.profile.findUnique({
    where: { userId: user.id },
    select: { name: true },
  });
  const accepterName = accepterProfile?.name ?? "Someone";
  await createNotification({
    userId: connection.senderId,
    type: "CONNECTION_ACCEPTED",
    title: "Connection Accepted",
    message: `${accepterName} accepted your connection request.`,
    relatedUserId: user.id,
    relatedEntityId: connectionId,
  });

  revalidatePath("/dashboard/connections");
  revalidatePath("/dashboard");
  return { success: true };
}

// ─── rejectConnectionRequest ──────────────────────────────────────────────────

export async function rejectConnectionRequest(
  connectionId: string
): Promise<{ success: boolean; error?: string }> {
  const user = await getServerUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const connection = await db.connection.findUnique({ where: { id: connectionId } });
  if (!connection) return { success: false, error: "Request not found." };
  if (connection.receiverId !== user.id) return { success: false, error: "Not authorized." };

  await db.connection.update({
    where: { id: connectionId },
    data: { status: "REJECTED", updatedAt: new Date() },
  });

  revalidatePath("/dashboard/connections");
  return { success: true };
}

// ─── getUserConnections ───────────────────────────────────────────────────────

export async function getUserConnections(): Promise<ConnectionsData> {
  const user = await getServerUser();
  if (!user) return { incoming: [], sent: [], accepted: [], pendingIncomingCount: 0 };

  const all = await db.connection.findMany({
    where: {
      OR: [{ senderId: user.id }, { receiverId: user.id }],
      NOT: { status: "REJECTED" },
    },
    include: {
      sender: { include: { profile: true } },
      receiver: { include: { profile: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const incoming: ConnectionRequest[] = [];
  const sent: ConnectionRequest[] = [];
  const accepted: ConnectionRequest[] = [];

  for (const c of all) {
    const isReceiver = c.receiverId === user.id;
    const otherUser = isReceiver
      ? profileToUser(c.sender.profile, c.senderId)
      : profileToUser(c.receiver.profile, c.receiverId);

    const req: ConnectionRequest = {
      id: c.id,
      senderId: c.senderId,
      receiverId: c.receiverId,
      status: c.status as ConnectionStatus,
      createdAt: c.createdAt,
      otherUser,
    };

    if (c.status === "ACCEPTED") {
      accepted.push(req);
    } else if (c.status === "PENDING" && isReceiver) {
      incoming.push(req);
    } else if (c.status === "PENDING" && !isReceiver) {
      sent.push(req);
    }
  }

  return {
    incoming,
    sent,
    accepted,
    pendingIncomingCount: incoming.length,
  };
}

// ─── getConnectionStatus ──────────────────────────────────────────────────────

/** Returns the connection relationship between the current user and a target. */
export async function getConnectionStatus(
  targetUserId: string
): Promise<{ status: ConnectionStatus | null; connectionId: string | null; isSender: boolean }> {
  const user = await getServerUser();
  if (!user) return { status: null, connectionId: null, isSender: false };

  const connection = await db.connection.findFirst({
    where: {
      OR: [
        { senderId: user.id, receiverId: targetUserId },
        { senderId: targetUserId, receiverId: user.id },
      ],
    },
  });

  if (!connection) return { status: null, connectionId: null, isSender: false };

  return {
    status: connection.status as ConnectionStatus,
    connectionId: connection.id,
    isSender: connection.senderId === user.id,
  };
}

/** Fast count of pending incoming requests — used for notification badge. */
export async function getPendingIncomingCount(): Promise<number> {
  const user = await getServerUser();
  if (!user) return 0;
  return db.connection.count({
    where: { receiverId: user.id, status: "PENDING" },
  });
}
