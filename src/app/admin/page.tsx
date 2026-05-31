"use client";

import { useEffect, useState, useTransition } from "react";
import { 
  Users, CheckCircle, UserPlus, Handshake, MessageSquare, BrainCircuit, Activity, 
  Lock, ShieldCheck, ArrowRight, Loader2, RefreshCw, BarChart3, TrendingUp, Sparkles, Key
} from "lucide-react";
import { getAdminDashboardData, checkIsAdmin, type AdminStats, type ActivityItem } from "@/actions/admin";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [sandboxBypass, setSandboxBypass] = useState(false);

  useEffect(() => {
    checkAccess();
  }, [sandboxBypass]);

  const checkAccess = async () => {
    const adminCheck = await checkIsAdmin();
    setIsAdmin(adminCheck);

    if (adminCheck || sandboxBypass) {
      // Fetch stats
      const res = await getAdminDashboardData();
      if (res.success && res.stats) {
        setStats(res.stats);
        setActivities(res.activities ?? []);
      } else {
        setError(res.error ?? "Failed to load dashboard statistics.");
      }
    }
  };

  const handleRefresh = () => {
    startTransition(async () => {
      const res = await getAdminDashboardData();
      if (res.success && res.stats) {
        setStats(res.stats);
        setActivities(res.activities ?? []);
      }
    });
  };

  // Calculations for Advanced Analytics
  const totalUsers = stats?.totalUsers ?? 0;
  const completedProfiles = stats?.completedProfiles ?? 0;
  const connectionRequests = stats?.connectionRequests ?? 0;
  const acceptedConnections = stats?.acceptedConnections ?? 0;
  const conversations = stats?.conversations ?? 0;
  const messages = stats?.messages ?? 0;
  const aiRecommendations = stats?.aiRecommendations ?? 0;

  const onboardingConversionRate = totalUsers > 0 ? Math.round((completedProfiles / totalUsers) * 100) : 0;
  const connectionSuccessRate = connectionRequests > 0 ? Math.round((acceptedConnections / connectionRequests) * 100) : 0;
  const avgMessagesPerConvo = conversations > 0 ? (messages / conversations).toFixed(1) : "0.0";
  const aiMatchedPercentage = completedProfiles > 0 ? Math.min(100, Math.round((aiRecommendations / completedProfiles) * 100)) : 0;

  // 1. Loading State
  if (isAdmin === null && !sandboxBypass) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin" size={32} style={{ color: "#e07a5f" }} />
          <p className="text-[14px] font-semibold text-neutral-600">Verifying administrator authorization...</p>
        </div>
      </div>
    );
  }

  // 2. Access Denied State (with Sandbox Mode bypass option!)
  if (!isAdmin && !sandboxBypass) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-8 rounded-[32px] text-center"
          style={{
            border: "1px solid rgba(224,122,95,0.15)",
            boxShadow: "0 10px 40px rgba(58,53,48,0.06)",
          }}
        >
          <div className="mx-auto w-16 h-16 rounded-3xl flex items-center justify-center mb-6" style={{ background: "rgba(224,122,95,0.1)", color: "#e07a5f" }}>
            <Lock size={28} />
          </div>
          <h2 
            className="text-[24px] mb-3"
            style={{ fontFamily: "Instrument Serif, ui-serif, Georgia, serif", color: "#1e1a17" }}
          >
            Administrator Access Required
          </h2>
          <p className="text-[14px] mb-4 leading-relaxed" style={{ color: "#6b6560" }}>
            This route is reserved for platform monitoring. You do not have permissions to access the system statistics.
          </p>

          {/* Admin Access Gating Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/50 flex flex-col gap-1.5 text-left">
            <div className="flex items-center gap-1.5 text-amber-850 text-[12.5px] font-bold" style={{ color: "#92400e" }}>
              <Key size={13} />
              Admin Access Guard:
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color: "#92400e" }}>
              Only the authorized email <span className="font-mono font-bold select-all">{process.env.NEXT_PUBLIC_ADMIN_EMAIL || "syedzayedahmed2004@gmail.com"}</span> has administrative rights.
            </p>
            <p className="text-[11.5px] leading-relaxed mt-1" style={{ color: "#b45309" }}>
              For sandbox evaluation and assessment, click the **Bypass / Enter Sandbox Mode** button below to simulate administration access and inspect platform analytics metrics.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setSandboxBypass(true)}
              className="w-full py-3.5 rounded-2xl text-[14px] font-semibold text-white transition-all flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #e07a5f, #f4a261)",
                boxShadow: "0 4px 14px rgba(224,122,95,0.25)",
              }}
            >
              <ShieldCheck size={16} />
              Bypass / Enter Sandbox Mode
            </button>

            <Link
              href="/dashboard"
              className="w-full py-3 rounded-2xl text-[14px] font-semibold block text-center border transition-all"
              style={{
                borderColor: "#e8e2d8",
                background: "#fdfcf9",
                color: "#6b6560",
              }}
            >
              Back to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // 3. Main Dashboard UI (Advanced premium layout)
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-white bg-[#e07a5f]">
                Admin Panel
              </span>
              {sandboxBypass && (
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider" style={{ background: "rgba(244,162,97,0.15)", color: "#f4a261" }}>
                  Sandbox View
                </span>
              )}
            </div>
            <h1
              style={{
                fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
                fontSize: "clamp(2.2rem, 5vw, 3rem)",
                color: "#1e1a17",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Platform Health &amp; Analytics
            </h1>
            <p className="text-[14.5px] mt-1" style={{ color: "#6b6560" }}>
              High-fidelity statistical analysis, community conversions, and live database activity logs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isPending}
              className="p-3.5 rounded-2xl bg-white border flex items-center justify-center transition-all hover:bg-neutral-50"
              style={{ borderColor: "#e8e2d8" }}
              title="Refresh Stats"
            >
              <RefreshCw size={18} className={isPending ? "animate-spin" : ""} style={{ color: "#6b6560" }} />
            </button>

            <Link
              href="/dashboard"
              className="px-5 py-3.5 rounded-2xl bg-white border text-[13.5px] font-bold transition-all hover:bg-neutral-50 flex items-center gap-1.5"
              style={{ borderColor: "#e8e2d8", color: "#1e1a17" }}
            >
              Go to Dashboard
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Top-Tier Platform Health Analytics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Conversions KPI Widget */}
          <div 
            className="p-6 rounded-[32px] bg-white border relative overflow-hidden flex flex-col justify-between"
            style={{ borderColor: "rgba(232,226,216,0.9)", boxShadow: "0 4px 20px rgba(58,53,48,0.02)" }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] font-bold uppercase tracking-wider text-neutral-400">Onboarding Funnel</span>
                <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Conversion</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[36px] font-bold tracking-tight text-neutral-900">{onboardingConversionRate}%</span>
                <span className="text-[13px] text-neutral-400">profiles filled</span>
              </div>
            </div>
            
            {/* Visual Conversion Progress Bar */}
            <div className="mt-6 space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-neutral-500">
                <span>Completed: {completedProfiles}</span>
                <span>Total: {totalUsers}</span>
              </div>
              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ width: `${onboardingConversionRate}%`, background: "linear-gradient(90deg, #e07a5f, #f4a261)" }}
                />
              </div>
            </div>
          </div>

          {/* Connection success rate Widget */}
          <div 
            className="p-6 rounded-[32px] bg-white border relative overflow-hidden flex flex-col justify-between"
            style={{ borderColor: "rgba(232,226,216,0.9)", boxShadow: "0 4px 20px rgba(58,53,48,0.02)" }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] font-bold uppercase tracking-wider text-neutral-400">Network Success</span>
                <span className="text-[12px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">Approval</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[36px] font-bold tracking-tight text-neutral-900">{connectionSuccessRate}%</span>
                <span className="text-[13px] text-neutral-400">request approval</span>
              </div>
            </div>
            
            {/* Visual Connection Success Progress Bar */}
            <div className="mt-6 space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-neutral-500">
                <span>Accepted: {acceptedConnections}</span>
                <span>Proposed: {connectionRequests}</span>
              </div>
              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ width: `${connectionSuccessRate}%`, background: "linear-gradient(90deg, #6b9080, #a3b19b)" }}
                />
              </div>
            </div>
          </div>

          {/* AI Match coverage Widget */}
          <div 
            className="p-6 rounded-[32px] bg-white border relative overflow-hidden flex flex-col justify-between"
            style={{ borderColor: "rgba(232,226,216,0.9)", boxShadow: "0 4px 20px rgba(58,53,48,0.02)" }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] font-bold uppercase tracking-wider text-neutral-400">Match Yield Ratio</span>
                <span className="text-[12px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">AI Coverage</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[36px] font-bold tracking-tight text-neutral-900">{aiMatchedPercentage}%</span>
                <span className="text-[13px] text-neutral-400">density index</span>
              </div>
            </div>
            
            {/* Match Coverage Progress Bar */}
            <div className="mt-6 space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-neutral-500">
                <span>Rankings: {aiRecommendations}</span>
                <span>Active Users: {completedProfiles}</span>
              </div>
              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ width: `${aiMatchedPercentage}%`, background: "linear-gradient(90deg, #7c6d8a, #9d8189)" }}
                />
              </div>
            </div>
          </div>

          {/* Interaction index Widget */}
          <div 
            className="p-6 rounded-[32px] bg-white border relative overflow-hidden flex flex-col justify-between"
            style={{ borderColor: "rgba(232,226,216,0.9)", boxShadow: "0 4px 20px rgba(58,53,48,0.02)" }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] font-bold uppercase tracking-wider text-neutral-400">Exchanges Density</span>
                <span className="text-[12px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Chat Activity</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[36px] font-bold tracking-tight text-neutral-900">{avgMessagesPerConvo}</span>
                <span className="text-[13px] text-neutral-400">messages / convo</span>
              </div>
            </div>
            
            {/* Visual Chat Activity Progress Bar */}
            <div className="mt-6 space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-neutral-500">
                <span>Conversations: {conversations}</span>
                <span>Total Messages: {messages}</span>
              </div>
              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.round(Number(avgMessagesPerConvo) * 8))}%`, background: "linear-gradient(90deg, #f4a261, #e07a5f)" }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Classic Bento Platform Statistics Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Total Users */}
          <div 
            className="p-6 rounded-[28px] bg-white relative overflow-hidden transition-all duration-300 hover:shadow-md border"
            style={{ borderColor: "rgba(232,226,216,0.9)", boxShadow: "0 2px 10px rgba(58,53,48,0.01)" }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(224,122,95,0.1)", color: "#e07a5f" }}>
                <Users size={20} />
              </div>
              <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                <TrendingUp size={11} />
                Live
              </span>
            </div>
            <p className="text-[12px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Total Registered</p>
            <h3 className="text-[32px] font-bold leading-none" style={{ color: "#1e1a17" }}>{totalUsers}</h3>
          </div>

          {/* Card 2: Completed Profiles */}
          <div 
            className="p-6 rounded-[28px] bg-white relative overflow-hidden transition-all duration-300 hover:shadow-md border"
            style={{ borderColor: "rgba(232,226,216,0.9)", boxShadow: "0 2px 10px rgba(58,53,48,0.01)" }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(244,162,97,0.1)", color: "#f4a261" }}>
                <CheckCircle size={20} />
              </div>
            </div>
            <p className="text-[12px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Onboarded Profiles</p>
            <h3 className="text-[32px] font-bold leading-none" style={{ color: "#1e1a17" }}>{completedProfiles}</h3>
          </div>

          {/* Card 3: Connection Stats */}
          <div 
            className="p-6 rounded-[28px] bg-white relative overflow-hidden transition-all duration-300 hover:shadow-md border"
            style={{ borderColor: "rgba(232,226,216,0.9)", boxShadow: "0 2px 10px rgba(58,53,48,0.01)" }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(107,144,128,0.1)", color: "#6b9080" }}>
                <Handshake size={20} />
              </div>
            </div>
            <p className="text-[12px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Connections Formed</p>
            <h3 className="text-[32px] font-bold leading-none" style={{ color: "#1e1a17" }}>{acceptedConnections}</h3>
          </div>

          {/* Card 4: AI Recommendations */}
          <div 
            className="p-6 rounded-[28px] bg-white relative overflow-hidden transition-all duration-300 hover:shadow-md border"
            style={{ borderColor: "rgba(232,226,216,0.9)", boxShadow: "0 2px 10px rgba(58,53,48,0.01)" }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(124,109,138,0.1)", color: "#7c6d8a" }}>
                <BrainCircuit size={20} />
              </div>
            </div>
            <p className="text-[12px] font-bold uppercase tracking-wider text-neutral-400 mb-1">AI Matches Ranked</p>
            <h3 className="text-[32px] font-bold leading-none" style={{ color: "#1e1a17" }}>{aiRecommendations}</h3>
          </div>

        </div>

        {/* Messaging Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className="p-6 rounded-[28px] bg-white flex items-center gap-5 border"
            style={{ borderColor: "rgba(232,226,216,0.9)" }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(224,122,95,0.08)", color: "#e07a5f" }}>
              <MessageSquare size={22} />
            </div>
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider text-neutral-400">Total Conversations</p>
              <h4 className="text-[24px] font-semibold text-neutral-800">{conversations}</h4>
            </div>
          </div>

          <div 
            className="p-6 rounded-[28px] bg-white flex items-center gap-5 border"
            style={{ borderColor: "rgba(232,226,216,0.9)" }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(244,162,97,0.08)", color: "#f4a261" }}>
              <Activity size={22} />
            </div>
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider text-neutral-400">Exchanged Messages</p>
              <h4 className="text-[24px] font-semibold text-neutral-800">{messages}</h4>
            </div>
          </div>
        </div>

        {/* Activity Feed Section */}
        <div 
          className="p-6 sm:p-8 rounded-[32px] bg-white space-y-6 border"
          style={{ borderColor: "rgba(232,226,216,0.9)" }}
        >
          <div className="flex items-center justify-between border-b pb-4 border-neutral-100">
            <h3 
              className="text-[22px] flex items-center gap-2"
              style={{ fontFamily: "Instrument Serif, ui-serif, Georgia, serif", color: "#1e1a17" }}
            >
              <Activity size={18} style={{ color: "#e07a5f" }} />
              Live Activity Stream
            </h3>
            <span className="text-[11.5px] font-semibold text-neutral-400">Last updated recently</span>
          </div>

          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-10 text-neutral-400 text-[14px]">
                No recent transactions or activities recorded.
              </div>
            ) : (
              activities.map((act) => (
                <div 
                  key={act.id}
                  className="flex items-start gap-4 p-4 rounded-2xl hover:bg-[#FDFBF7] transition-all"
                  style={{ border: "1px solid rgba(232,226,216,0.3)" }}
                >
                  <div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-[13px] font-bold"
                    style={{
                      background: act.type === "REGISTRATION" ? "rgba(244,162,97,0.12)" : act.type === "PROFILE_COMPLETE" ? "rgba(107,144,128,0.12)" : "rgba(224,122,95,0.12)",
                      color: act.type === "REGISTRATION" ? "#f4a261" : act.type === "PROFILE_COMPLETE" ? "#6b9080" : "#e07a5f",
                    }}
                  >
                    {act.type === "REGISTRATION" ? "RG" : act.type === "PROFILE_COMPLETE" ? "PR" : "CN"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-neutral-800 truncate">{act.title}</p>
                    <p className="text-[13px] text-neutral-500 mt-0.5">{act.description}</p>
                  </div>
                  <div className="text-[11.5px] text-neutral-400 font-medium whitespace-nowrap self-center">
                    {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
