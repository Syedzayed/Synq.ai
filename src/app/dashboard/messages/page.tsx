"use client";

import { motion } from "framer-motion";
import { MessageSquare, Users } from "lucide-react";
import Link from "next/link";

export default function MessagesIndexPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center h-full gap-5 px-8 text-center"
    >
      <div
        className="h-16 w-16 rounded-3xl flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg,rgba(224,122,95,0.10),rgba(244,162,97,0.06))",
          border: "1px solid rgba(224,122,95,0.18)",
        }}
      >
        <MessageSquare size={26} style={{ color: "#e07a5f" }} />
      </div>

      <div>
        <h2
          style={{
            fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
            fontSize: "1.5rem",
            color: "#1e1a17",
            fontWeight: 400,
          }}
        >
          Your next collaboration
          <br />
          starts with a conversation.
        </h2>
        <p className="text-[13.5px] mt-2 max-w-xs mx-auto leading-relaxed" style={{ color: "#9e9890" }}>
          Select a conversation on the left, or message one of your connections.
        </p>
      </div>

      <Link
        href="/dashboard/connections"
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[13.5px] font-semibold transition-all duration-200 hover:shadow-md"
        style={{
          background: "rgba(224,122,95,0.08)",
          color: "#e07a5f",
          border: "1px solid rgba(224,122,95,0.2)",
        }}
      >
        <Users size={14} />
        View Connections
      </Link>
    </motion.div>
  );
}
