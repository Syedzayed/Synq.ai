"use server";

/**
 * notifications.ts — Server Actions for the Notification system
 *
 * Security model:
 *  - All read/write operations are scoped to the authenticated session user
 *  - createNotification() is a fire-and-forget internal helper — accepts a userId
 *    but is only called from other server actions (never directly from client)
 *  - Mark read operations validate userId ownership before updating
 */

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/prisma";
import { getServerUser } from "@/lib/auth/supabase-server";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NotificationType =
  | "CONNECTION_REQUEST"
  | "CONNECTION_ACCEPTED"
  | "NEW_MATCH"
  | "PROFILE_VIEW"
  | "AI_RECOMMENDATION"
  | "SYSTEM";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedUserId: string | null;
  relatedEntityId: string | null;
  createdAt: Date;
}

export interface NotificationsData {
  unread: NotificationItem[];
  read: NotificationItem[];
  unreadCount: number;
}

// ─── createNotification (internal helper) ─────────────────────────────────────

/**
 * Internal helper — only called from other server actions, never directly
 * from the client. Silently swallows errors so it never blocks the caller.
 */
export async function createNotification({
  userId,
  type,
  title,
  message,
  relatedUserId,
  relatedEntityId,
}: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedUserId?: string;
  relatedEntityId?: string;
}): Promise<void> {
  try {
    await db.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        relatedUserId: relatedUserId ?? null,
        relatedEntityId: relatedEntityId ?? null,
      },
    });
    revalidatePath("/dashboard/notifications");
    revalidatePath("/dashboard"); // refresh activity widget
  } catch (err) {
    console.error("[createNotification] Failed:", err);
    // Non-fatal — never block the primary action
  }
}

// ─── getUserNotifications ─────────────────────────────────────────────────────

export async function getUserNotifications(limit = 50): Promise<NotificationsData> {
  const user = await getServerUser();
  if (!user) return { unread: [], read: [], unreadCount: 0 };

  const all = await db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  const unread: NotificationItem[] = [];
  const read: NotificationItem[] = [];

  for (const n of all) {
    const item: NotificationItem = {
      id: n.id,
      type: n.type as NotificationType,
      title: n.title,
      message: n.message,
      isRead: n.isRead,
      relatedUserId: n.relatedUserId,
      relatedEntityId: n.relatedEntityId,
      createdAt: n.createdAt,
    };
    if (n.isRead) read.push(item);
    else unread.push(item);
  }

  return { unread, read, unreadCount: unread.length };
}

// ─── getUnreadCount (fast, for layout badge) ──────────────────────────────────

export async function getUnreadNotificationCount(): Promise<number> {
  const user = await getServerUser();
  if (!user) return 0;
  return db.notification.count({ where: { userId: user.id, isRead: false } });
}

// ─── markNotificationRead ─────────────────────────────────────────────────────

export async function markNotificationRead(
  notificationId: string
): Promise<{ success: boolean }> {
  const user = await getServerUser();
  if (!user) return { success: false };

  // Ownership guard
  const notification = await db.notification.findUnique({
    where: { id: notificationId },
    select: { userId: true },
  });
  if (!notification || notification.userId !== user.id) return { success: false };

  await db.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });

  revalidatePath("/dashboard/notifications");
  revalidatePath("/dashboard");
  return { success: true };
}

// ─── markAllNotificationsRead ─────────────────────────────────────────────────

export async function markAllNotificationsRead(): Promise<{ success: boolean }> {
  const user = await getServerUser();
  if (!user) return { success: false };

  await db.notification.updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true },
  });

  revalidatePath("/dashboard/notifications");
  revalidatePath("/dashboard");
  return { success: true };
}
