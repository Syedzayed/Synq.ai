"use client";

import { motion } from "framer-motion";
import { Zap, Heart, Target, Users, Brain, CheckCircle } from "lucide-react";
import { TopMatchesWidget } from "@/components/matches/top-matches-widget";
import { ConnectionActivityWidget } from "@/components/connections/connection-activity-widget";
import { ActivityWidget } from "@/components/notifications/activity-widget";
import type { StoredRecommendation } from "@/lib/match/recommendation-service";
import type { NotificationItem } from "@/actions/notifications";

const EASE = [0.22, 1, 0.36, 1] as const;

interface DashboardProfile {
  name: string;
  role: string;
  organization: string | null;
  skills: string[];
  interests: string[];
  goals: string[];
  lookingFor: string[];
  aiSummary: string | null;
}

interface DashboardClientProps {
  profile: DashboardProfile;
  topMatches: StoredRecommendation[];
  pendingConnectionCount: number;
  acceptedConnectionCount: number;
  recentNotifications: NotificationItem[];
  analytics: {
    user: {
      completeness: number;
      totalConnections: number;
      pendingRequests: number;
      conversations: number;
      aiMatchCount: number;
    };
    platform: {
      activeUsers: number;
      commonSkills: string[];
      commonInterests: string[];
    };
  };
}

function StatCard({ icon: Icon, label, count }: { icon: React.ElementType; label: string; count: number }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl p-4 flex items-center gap-3"
      style={{ background: "rgba(255,252,248,0.98)", border: "1px solid rgba(232,226,216,0.9)", boxShadow: "0 2px 12px rgba(58,53,48,0.05)" }}
    >
      <div className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(224,122,95,0.10)" }}>
        <Icon size={16} style={{ color: "#e07a5f" }} />
      </div>
      <div>
        <p className="text-[20px] font-bold" style={{ color: "#1e1a17" }}>{count}</p>
        <p className="text-[12px]" style={{ color: "#9e9890" }}>{label}</p>
      </div>
    </motion.div>
  );
}

function TagBadge({ text }: { text: string }) {
  return (
    <span className="px-3 py-1.5 rounded-full text-[12.5px] font-medium" style={{ background: "#f8f4ef", color: "#3a3530", border: "1px solid rgba(232,226,216,0.9)" }}>
      {text}
    </span>
  );
}

export function DashboardClient({ 
  profile, 
  topMatches, 
  pendingConnectionCount, 
  acceptedConnectionCount, 
  recentNotifications,
  analytics
}: DashboardClientProps) {
  const firstName = profile.name.split(" ")[0];

  return (
    <div className="relative overflow-auto" style={{ minHeight: "100%" }}>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-8"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: "#e07a5f" }}>Dashboard</p>
          <h1 style={{ fontFamily: "Instrument Serif, ui-serif, Georgia, serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#1e1a17", fontWeight: 400, letterSpacing: "-0.02em" }}>
            Welcome back, <span className="italic" style={{ color: "#e07a5f" }}>{firstName}.</span>
          </h1>
          <p className="mt-2 text-[15px]" style={{ color: "#6b6560" }}>
            {profile.aiSummary
              ? "Your profile is live. Synq is preparing your first intelligent connections."
              : "Your profile is set up. AI processing will complete shortly."}
          </p>
        </motion.div>

        {/* Success banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          className="mb-8 rounded-2xl p-4 flex items-start gap-3"
          style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)" }}
        >
          <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[14px] font-semibold text-green-800">Profile completed successfully!</p>
            <p className="text-[13px] text-green-700 mt-0.5">Synq is preparing your first intelligent connections based on your profile.</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column — profile card + stats */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* Profile card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
              className="rounded-2xl p-5"
              style={{ background: "rgba(255,252,248,0.98)", border: "1px solid rgba(232,226,216,0.9)", boxShadow: "0 2px 12px rgba(58,53,48,0.05)" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #e07a5f, #f4a261)" }}>
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[15px] font-semibold" style={{ color: "#1e1a17" }}>{profile.name}</p>
                  <p className="text-[12.5px]" style={{ color: "#9e9890" }}>
                    {profile.role}{profile.organization ? ` · ${profile.organization}` : ""}
                  </p>
                </div>
              </div>
              {profile.aiSummary && (
                <p className="text-[13px] leading-relaxed" style={{ color: "#6b6560" }}>{profile.aiSummary}</p>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
              className="grid grid-cols-2 gap-3"
            >
              <StatCard icon={Zap} label="Skills" count={profile.skills.length} />
              <StatCard icon={Heart} label="Interests" count={profile.interests.length} />
              <StatCard icon={Target} label="Goals" count={profile.goals.length} />
              <StatCard icon={Users} label="Looking For" count={profile.lookingFor.length} />
            </motion.div>

            {/* Platform Trends Widget (Bento) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
              className="rounded-2xl p-5 space-y-4"
              style={{ background: "rgba(255,252,248,0.98)", border: "1px solid rgba(232,226,216,0.9)", boxShadow: "0 2px 12px rgba(58,53,48,0.05)" }}
            >
              <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-neutral-400">Platform Analytics</p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[13.5px]">
                  <span className="text-neutral-500 font-medium">Active Users</span>
                  <span className="font-bold text-neutral-800">{analytics.platform.activeUsers}</span>
                </div>
                
                <div className="space-y-1.5">
                  <span className="text-[12px] font-semibold text-neutral-400 block uppercase">Trending Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {analytics.platform.commonSkills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#FDFBF7] text-[#e07a5f] border border-[#e8e2d8]">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[12px] font-semibold text-neutral-400 block uppercase">Trending Interests</span>
                  <div className="flex flex-wrap gap-1">
                    {analytics.platform.commonInterests.map(i => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#FDFBF7] text-[#f4a261] border border-[#e8e2d8]">{i}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right column — activity + coming soon */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            
            {/* User Analytics / Completeness Widget */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
              className="rounded-2xl p-5 space-y-4"
              style={{ background: "rgba(255,252,248,0.98)", border: "1px solid rgba(232,226,216,0.9)", boxShadow: "0 2px 12px rgba(58,53,48,0.05)" }}
            >
              <div className="flex justify-between items-center">
                <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-neutral-400">Profile Completeness</p>
                <span className="text-[13px] font-bold text-[#e07a5f]">{analytics.user.completeness}%</span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${analytics.user.completeness}%`,
                    background: "linear-gradient(90deg, #e07a5f, #f4a261)"
                  }}
                />
              </div>

              {/* Stats overview */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                <div className="p-3 bg-[#FDFBF7] rounded-xl border border-neutral-100">
                  <p className="text-[18px] font-bold text-neutral-800">{analytics.user.conversations}</p>
                  <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Conversations</p>
                </div>
                <div className="p-3 bg-[#FDFBF7] rounded-xl border border-neutral-100">
                  <p className="text-[18px] font-bold text-neutral-800">{analytics.user.aiMatchCount}</p>
                  <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">AI Matches</p>
                </div>
                <div className="p-3 bg-[#FDFBF7] rounded-xl border border-neutral-100">
                  <p className="text-[18px] font-bold text-neutral-800">{analytics.user.totalConnections}</p>
                  <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Connections</p>
                </div>
              </div>
            </motion.div>

            {/* AI Summary card */}
            {profile.aiSummary && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
                className="rounded-2xl p-5"
                style={{ background: "linear-gradient(135deg, rgba(224,122,95,0.06) 0%, rgba(244,162,97,0.04) 100%)", border: "1px solid rgba(224,122,95,0.2)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={15} style={{ color: "#e07a5f" }} />
                  <p className="text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: "#e07a5f" }}>AI Profile Summary</p>
                </div>
                <p className="text-[14px] leading-relaxed" style={{ color: "#3a3530" }}>
                  &ldquo;{profile.aiSummary}&rdquo;
                </p>
              </motion.div>
            )}

            {/* Skills & Interests */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
              className="rounded-2xl p-5"
              style={{ background: "rgba(255,252,248,0.98)", border: "1px solid rgba(232,226,216,0.9)", boxShadow: "0 2px 12px rgba(58,53,48,0.05)" }}
            >
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em] mb-3" style={{ color: "#9e9890" }}>Your Skills</p>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s) => <TagBadge key={s} text={s} />)}
              </div>
            </motion.div>

            {/* Top Matches Widget */}
            <TopMatchesWidget matches={topMatches} />

            {/* Connection Activity Widget */}
            <ConnectionActivityWidget
              pendingCount={pendingConnectionCount}
              acceptedCount={acceptedConnectionCount}
            />

            {/* Recent Activity Widget */}
            <ActivityWidget notifications={recentNotifications} />
          </div>
        </div>
      </main>
    </div>
  );
}

