import type { Metadata } from "next";
import { getUserNotifications } from "@/actions/notifications";
import { NotificationList } from "@/components/notifications/notification-list";

export const metadata: Metadata = {
  title: "Notifications — Synq",
  description: "Stay informed about connections, matches, and activity on Synq.",
};

export default async function NotificationsPage() {
  const data = await getUserNotifications(80);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Page header */}
      <div className="mb-8">
        <p
          className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2"
          style={{ color: "#e07a5f" }}
        >
          Activity
        </p>
        <div className="flex items-end justify-between gap-4">
          <h1
            style={{
              fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              color: "#1e1a17",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Notifications
          </h1>
          {data.unreadCount > 0 && (
            <span
              className="mb-1 px-3 py-1 rounded-full text-[13px] font-semibold"
              style={{
                background: "rgba(224,122,95,0.10)",
                color: "#e07a5f",
                border: "1px solid rgba(224,122,95,0.2)",
              }}
            >
              {data.unreadCount} unread
            </span>
          )}
        </div>
        <p className="mt-2 text-[15px]" style={{ color: "#6b6560" }}>
          Connections, matches, and platform activity — all in one place.
        </p>
      </div>

      <NotificationList data={data} />
    </div>
  );
}
