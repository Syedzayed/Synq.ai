"use client";

import { useState, useEffect, useTransition } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, X, Loader2, Sparkles, Tag, Briefcase, Compass, Users, Star, Flame, CalendarDays, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchProfiles, type SearchResultItem, type SearchFilters } from "@/actions/search";
import { ConnectButton } from "@/components/connections/connect-button";
import { ProfileTags } from "@/components/discover/profile-tags";
import { MatchScore } from "@/components/matches/match-score";
import type { StoredRecommendation } from "@/lib/match/recommendation-service";
import Link from "next/link";

interface DiscoverHubProps {
  initialRecommendations: StoredRecommendation[];
  initialEveryone: SearchResultItem[];
  initialNewest: SearchResultItem[];
  filterOptions: {
    roles: string[];
    skills: string[];
    interests: string[];
  };
}

function avatarGradient(name: string) {
  const gradients = [
    "linear-gradient(135deg, #e07a5f, #f4a261)",
    "linear-gradient(135deg, #6b9080, #a4c3b2)",
    "linear-gradient(135deg, #8b7355, #c4a882)",
    "linear-gradient(135deg, #7c6d8a, #b5a7c4)",
    "linear-gradient(135deg, #5f7e8a, #8cb4be)",
  ];
  const idx = name.charCodeAt(0) % gradients.length;
  return gradients[idx];
}

export function DiscoverHub({
  initialRecommendations,
  initialEveryone,
  initialNewest,
  filterOptions,
}: DiscoverHubProps) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [interestFilter, setInterestFilter] = useState("");
  const [sortBy, setSortBy] = useState<"compatibility" | "name" | "newest">("compatibility");

  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const [hasSearched, setHasSearched] = useState(false);
  const [recommendations, setRecommendations] = useState<StoredRecommendation[]>(initialRecommendations);
  const [isRegenerating, startRegen] = useTransition();

  // Debounced search trigger
  useEffect(() => {
    if (!query && !roleFilter && !skillFilter && !interestFilter) {
      setHasSearched(false);
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, roleFilter, skillFilter, interestFilter, sortBy]);

  const handleSearch = () => {
    startTransition(async () => {
      const filters: SearchFilters = {
        role: roleFilter || undefined,
        skill: skillFilter || undefined,
        interest: interestFilter || undefined,
        sortBy,
      };

      const res = await searchProfiles(query, filters);
      if (res.success) {
        setSearchResults(res.results);
      }
      setHasSearched(true);
    });
  };

  const handleRegenerate = () => {
    startRegen(async () => {
      try {
        const res = await fetch("/api/matches/generate", { method: "POST" });
        if (res.ok) {
          window.location.reload();
        }
      } catch (err) {
        console.error("Failed to generate recommendations", err);
      }
    });
  };

  const clearFilters = () => {
    setRoleFilter("");
    setSkillFilter("");
    setInterestFilter("");
    setQuery("");
    setHasSearched(false);
  };

  const isAnyFilterActive = roleFilter || skillFilter || interestFilter || query;

  return (
    <div className="space-y-12">
      {/* ── SEARCH & FILTER SECTION (Primary search bar inside discover hub) ── */}
      <div
        className="p-6 rounded-[24px]"
        style={{
          background: "rgba(255,252,248,0.75)",
          border: "1px solid rgba(232,226,216,0.9)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 20px rgba(58,53,48,0.01)",
        }}
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:flex-1">
            <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search community builders by name, role, organization, skills..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl text-[14.5px] transition-all"
              style={{
                background: "white",
                border: "1px solid rgba(232,226,216,0.9)",
                boxShadow: "0 2px 8px rgba(58,53,48,0.02)",
                outline: "none",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute inset-y-0 right-4 flex items-center text-neutral-400 hover:text-neutral-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <ArrowUpDown size={15} style={{ color: "#9e9890" }} />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-2xl text-[13.5px] font-semibold bg-white cursor-pointer w-full md:w-auto"
              style={{
                border: "1px solid rgba(232,226,216,0.9)",
                outline: "none",
                color: "#1e1a17",
              }}
            >
              <option value="compatibility">Compatibility</option>
              <option value="name">Alphabetical</option>
              <option value="newest">Newest Members</option>
            </select>
          </div>
        </div>

        {/* Filters dropdowns */}
        <div className="mt-4 pt-4 border-t border-[#e8e2d8]/60 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#9e9890] mr-2">
            <SlidersHorizontal size={13} />
            Filters:
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl text-[13px] bg-white cursor-pointer max-w-[180px]"
            style={{
              border: "1px solid rgba(232,226,216,0.8)",
              outline: "none",
              color: roleFilter ? "#c9604a" : "#6b6560",
            }}
          >
            <option value="">All Roles</option>
            {filterOptions.roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl text-[13px] bg-white cursor-pointer max-w-[180px]"
            style={{
              border: "1px solid rgba(232,226,216,0.8)",
              outline: "none",
              color: skillFilter ? "#c9604a" : "#6b6560",
            }}
          >
            <option value="">All Skills</option>
            {filterOptions.skills.map((skill) => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>

          <select
            value={interestFilter}
            onChange={(e) => setInterestFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl text-[13px] bg-white cursor-pointer max-w-[180px]"
            style={{
              border: "1px solid rgba(232,226,216,0.8)",
              outline: "none",
              color: interestFilter ? "#c9604a" : "#6b6560",
            }}
          >
            <option value="">All Interests</option>
            {filterOptions.interests.map((interest) => (
              <option key={interest} value={interest}>{interest}</option>
            ))}
          </select>

          {isAnyFilterActive && (
            <button
              onClick={clearFilters}
              className="ml-auto text-[12.5px] font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity"
              style={{ color: "#e07a5f" }}
            >
              Clear filters
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ── DYNAMIC SEARCH MODE / GRID RESULTS ── */}
      <AnimatePresence mode="wait">
        {hasSearched ? (
          <motion.div
            key="search-results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6 relative"
          >
            {isPending && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-[24px]">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="animate-spin text-[#e07a5f]" size={32} />
                  <p className="text-[13px] font-semibold text-[#6b6560]">Updating search...</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <h2
                  style={{
                    fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
                    fontSize: "1.8rem",
                    color: "#1e1a17",
                    fontWeight: 400,
                  }}
                >
                  Search Results
                </h2>
                <p className="text-[13px] text-[#7e756c] mt-1">
                  Found {searchResults.length} {searchResults.length === 1 ? "builder" : "builders"} matching your query
                </p>
              </div>
            </div>

            {searchResults.length === 0 ? (
              <div
                className="text-center py-16 px-6 rounded-[24px]"
                style={{
                  background: "rgba(255,252,248,0.5)",
                  border: "1px dashed rgba(232,226,216,0.8)",
                }}
              >
                <div className="mx-auto w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(224,122,95,0.12)", color: "#e07a5f" }}>
                  <Compass size={22} />
                </div>
                <h3 className="font-semibold text-[17px] mb-1.5" style={{ color: "#1e1a17" }}>No builders found</h3>
                <p className="text-[14px] max-w-sm mx-auto mb-4" style={{ color: "#9e9890" }}>
                  Try refining your search text or removing filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 rounded-full text-[13px] font-semibold text-white transition-all"
                  style={{ background: "linear-gradient(135deg,#e07a5f,#f4a261)" }}
                >
                  Reset search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((p, idx) => {
                  const name = p.name ?? "Anonymous";
                  const initial = name.charAt(0).toUpperCase();
                  return (
                    <motion.article
                      key={p.userId}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: idx * 0.04 }}
                      whileHover={{ y: -3, boxShadow: "0 14px 36px rgba(58,53,48,0.08)" }}
                      className="flex flex-col rounded-3xl overflow-hidden transition-shadow duration-300"
                      style={{
                        background: "rgba(255,252,248,0.98)",
                        border: "1px solid rgba(232,226,216,0.9)",
                        boxShadow: "0 2px 12px rgba(58,53,48,0.04)",
                      }}
                    >
                      <div className="h-1.5 w-full" style={{ background: avatarGradient(name) }} />
                      <div className="flex flex-col gap-4 p-5 flex-grow">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div
                              className="h-11 w-11 rounded-2xl flex items-center justify-center text-[16px] font-bold text-white flex-shrink-0"
                              style={{ background: avatarGradient(name) }}
                            >
                              {initial}
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="text-[15px] font-bold truncate text-[#1e1a17]">{name}</p>
                              {p.role && (
                                <p className="text-[12.5px] text-[#9e9890] flex items-center gap-1 truncate mt-0.5">
                                  <Briefcase size={10} />
                                  {p.role}
                                </p>
                              )}
                            </div>
                          </div>
                          <MatchScore score={p.compatibilityScore} size="sm" />
                        </div>
                        {p.aiSummary && (
                          <p className="text-[13px] text-[#6b6560] leading-relaxed line-clamp-3">
                            {p.aiSummary}
                          </p>
                        )}
                        {p.skills.length > 0 && (
                          <div className="flex flex-col gap-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#7e756c] flex items-center gap-1">
                              <Tag size={9} />
                              Skills
                            </p>
                            <ProfileTags items={p.skills} max={3} variant="skill" />
                          </div>
                        )}
                        <div className="flex-grow" />
                        <div className="flex gap-2 pt-3 border-t border-[#e8e2d8]/60 mt-2">
                          <Link
                            href={`/dashboard/discover/${p.userId}`}
                            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-2xl text-[12.5px] font-semibold transition-all hover:opacity-90"
                            style={{
                              background: "linear-gradient(135deg,#e07a5f 0%,#d4694f 100%)",
                              color: "white",
                              boxShadow: "0 2px 8px rgba(224,122,95,0.2)",
                            }}
                          >
                            Profile
                          </Link>
                          <ConnectButton
                            targetUserId={p.userId}
                            initialStatus={p.connectionStatus}
                            connectionId={p.connectionId}
                            isSender={p.isSender}
                            size="sm"
                          />
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="discover-hub-sections"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-16"
          >
            {/* ── SECTION 1: RECOMMENDED FOR YOU (AI Recommendations) ── */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-orange-50 text-[#e07a5f]"><Sparkles size={14} /></span>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#e07a5f]">AI Gated Recommendations</p>
                  </div>
                  <h2
                    className="mt-1"
                    style={{
                      fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
                      fontSize: "1.9rem",
                      color: "#1e1a17",
                      fontWeight: 400,
                    }}
                  >
                    Recommended For You
                  </h2>
                  <p className="text-[13.5px] text-[#6b6560] mt-0.5">
                    Premium matches calculated based on your onboarding profile context.
                  </p>
                </div>

                {recommendations.length > 0 && (
                  <button
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12px] font-semibold transition-all"
                    style={{
                      background: "rgba(224,122,95,0.08)",
                      color: "#e07a5f",
                      border: "1px solid rgba(224,122,95,0.2)",
                      opacity: isRegenerating ? 0.6 : 1,
                    }}
                  >
                    <Loader2 size={11} className={isRegenerating ? "animate-spin" : "hidden"} />
                    {isRegenerating ? "Refreshing..." : "Refresh Recommendations"}
                  </button>
                )}
              </div>

              {recommendations.length === 0 ? (
                <div className="text-center py-10 bg-[rgba(255,252,248,0.4)] rounded-3xl border border-dashed border-[#e8e2d8] p-6">
                  <Flame className="mx-auto text-orange-400 mb-3" size={24} />
                  <p className="text-[13px] text-[#9e9890] max-w-sm mx-auto mb-4">
                    AI recommendations take a brief moment to warm up. Generate them instantly now!
                  </p>
                  <button
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                    className="px-5 py-2.5 rounded-2xl text-[13px] font-bold text-white transition-all"
                    style={{
                      background: "linear-gradient(135deg,#e07a5f,#d4694f)",
                      boxShadow: "0 2px 10px rgba(224,122,95,0.2)",
                    }}
                  >
                    {isRegenerating ? "Generating..." : "Generate AI Matches"}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.slice(0, 3).map((rec, i) => {
                    const name = rec.matchedProfile.name ?? "Anonymous";
                    const initial = name.charAt(0).toUpperCase();
                    return (
                      <motion.article
                        key={rec.matchedUserId}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex flex-col rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-lg relative"
                        style={{
                          background: "rgba(255,252,248,0.98)",
                          border: "1px solid rgba(232,226,216,0.9)",
                          boxShadow: "0 4px 15px rgba(58,53,48,0.03)",
                        }}
                      >
                        <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-[#e07a5f]" />
                        <div className="flex flex-col gap-4 p-5 flex-grow">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div
                                className="h-11 w-11 rounded-2xl flex items-center justify-center text-[16px] font-bold text-white flex-shrink-0"
                                style={{ background: avatarGradient(name) }}
                              >
                                {initial}
                              </div>
                              <div className="flex-grow min-w-0">
                                <p className="text-[15px] font-bold truncate text-[#1e1a17]">{name}</p>
                                {rec.matchedProfile.role && (
                                  <p className="text-[12.5px] text-[#7e756c] flex items-center gap-1 truncate mt-0.5">
                                    <Briefcase size={10} />
                                    {rec.matchedProfile.role}
                                  </p>
                                )}
                              </div>
                            </div>
                            <MatchScore score={rec.score} size="sm" />
                          </div>

                          {/* AI Explanation / Reason */}
                          <div className="p-3 rounded-xl bg-orange-50/40 border border-orange-100/50 flex flex-col gap-1.5">
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#e07a5f] flex items-center gap-1">
                              <Sparkles size={9} />
                              AI Compatibility Analysis
                            </p>
                            <p className="text-[12px] leading-relaxed text-[#5a504a] italic line-clamp-3">
                              "{rec.reason}"
                            </p>
                          </div>

                          {rec.matchedProfile.skills?.length > 0 && (
                            <div className="flex flex-col gap-1">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-[#7e756c]">Matched Skills</p>
                              <ProfileTags items={rec.matchedProfile.skills} max={3} variant="skill" />
                            </div>
                          )}

                          <div className="flex-grow" />
                          <div className="flex gap-2 pt-3 border-t border-[#e8e2d8]/60 mt-1">
                            <Link
                              href={`/dashboard/discover/${rec.matchedUserId}`}
                              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-2xl text-[12.5px] font-semibold text-[#e07a5f] transition-all bg-[rgba(224,122,95,0.06)] hover:bg-[rgba(224,122,95,0.1)]"
                            >
                              Explore Profile
                            </Link>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── SECTION 2: RECENTLY JOINED (Sleek Horizontal Carousel/Grid) ── */}
            {initialNewest.length > 0 && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-orange-50 text-[#e07a5f]"><CalendarDays size={14} /></span>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#e07a5f]">Community Freshmen</p>
                  </div>
                  <h2
                    className="mt-1"
                    style={{
                      fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
                      fontSize: "1.9rem",
                      color: "#1e1a17",
                      fontWeight: 400,
                    }}
                  >
                    Recently Joined
                  </h2>
                  <p className="text-[13.5px] text-[#6b6560] mt-0.5">
                    Say hello to the newest members of the Synq network.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {initialNewest.slice(0, 4).map((p, idx) => {
                    const name = p.name ?? "Anonymous";
                    const initial = name.charAt(0).toUpperCase();
                    return (
                      <motion.article
                        key={`new-${p.userId}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.04 }}
                        className="flex flex-col p-4 rounded-2xl relative transition-all duration-300 hover:shadow-md"
                        style={{
                          background: "#ffffff",
                          border: "1px solid rgba(232,226,216,0.8)",
                          boxShadow: "0 2px 10px rgba(58,53,48,0.02)",
                        }}
                      >
                        <span
                          className="absolute top-3 right-3 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full text-white"
                          style={{
                            background: "linear-gradient(135deg,#e07a5f,#f4a261)",
                          }}
                        >
                          New
                        </span>

                        <div className="flex items-center gap-2.5 mb-3">
                          <div
                            className="h-9 w-9 rounded-xl flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0"
                            style={{ background: avatarGradient(name) }}
                          >
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13.5px] font-bold truncate text-[#1e1a17]">{name}</p>
                            <p className="text-[11px] text-[#7e756c] truncate">{p.role ?? "Community Member"}</p>
                          </div>
                        </div>

                        <p className="text-[12px] text-[#6b6560] line-clamp-2 min-h-[32px] leading-relaxed mb-3">
                          {p.aiSummary ?? "Joined the builder ecosystem to collaborate."}
                        </p>

                        <div className="flex gap-2 pt-2 border-t border-[#e8e2d8]/60 mt-auto">
                          <Link
                            href={`/dashboard/discover/${p.userId}`}
                            className="flex-1 flex items-center justify-center text-[11.5px] font-semibold py-1.5 rounded-xl border border-[#e8e2d8] text-[#6b6560] hover:bg-[#fdfbf7]"
                          >
                            Profile
                          </Link>
                          <ConnectButton
                            targetUserId={p.userId}
                            initialStatus={p.connectionStatus}
                            connectionId={p.connectionId}
                            isSender={p.isSender}
                            size="sm"
                          />
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── SECTION 3: EXPLORE EVERYONE (Comprehensive Bento Grid) ── */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-orange-50 text-[#e07a5f]"><Users size={14} /></span>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#e07a5f]">All Developers & Creatives</p>
                </div>
                <h2
                  className="mt-1"
                  style={{
                    fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
                    fontSize: "1.9rem",
                    color: "#1e1a17",
                    fontWeight: 400,
                  }}
                >
                  Explore Everyone
                </h2>
                <p className="text-[13.5px] text-[#6b6560] mt-0.5">
                  Browse through all registered builders sorted by compatibility.
                </p>
              </div>

              {initialEveryone.length === 0 ? (
                <div className="text-center py-16 bg-[#fdfbf7] rounded-3xl border border-[#e8e2d8]">
                  <p className="text-[14px] text-[#7e756c]">No active platform members found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {initialEveryone.map((p, idx) => {
                    const name = p.name ?? "Anonymous";
                    const initial = name.charAt(0).toUpperCase();
                    return (
                      <motion.article
                        key={`explore-${p.userId}`}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: idx * 0.03 }}
                        whileHover={{ y: -3, boxShadow: "0 10px 30px rgba(58,53,48,0.06)" }}
                        className="flex flex-col rounded-3xl overflow-hidden transition-shadow duration-300"
                        style={{
                          background: "#ffffff",
                          border: "1px solid rgba(232,226,216,0.85)",
                          boxShadow: "0 2px 10px rgba(58,53,48,0.02)",
                        }}
                      >
                        <div className="h-1 w-full" style={{ background: avatarGradient(name) }} />
                        <div className="flex flex-col gap-4 p-5 flex-grow">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div
                                className="h-10 w-10 rounded-xl flex items-center justify-center text-[15px] font-bold text-white flex-shrink-0"
                                style={{ background: avatarGradient(name) }}
                              >
                                {initial}
                              </div>
                              <div className="flex-grow min-w-0">
                                <p className="text-[14.5px] font-bold truncate text-[#1e1a17]">{name}</p>
                                {p.role && (
                                  <p className="text-[12.5px] text-[#7e756c] flex items-center gap-1 truncate mt-0.5">
                                    <Briefcase size={10} />
                                    {p.role}
                                  </p>
                                )}
                              </div>
                            </div>
                            <MatchScore score={p.compatibilityScore} size="sm" />
                          </div>

                          {p.aiSummary && (
                            <p className="text-[12.5px] text-[#6b6560] leading-relaxed line-clamp-3">
                              {p.aiSummary}
                            </p>
                          )}

                          {p.skills.length > 0 && (
                            <div className="flex flex-col gap-1 mt-1">
                              <ProfileTags items={p.skills} max={3} variant="skill" />
                            </div>
                          )}

                          <div className="flex-grow" />
                          <div className="flex gap-2 pt-3 border-t border-[#e8e2d8]/60 mt-1">
                            <Link
                              href={`/dashboard/discover/${p.userId}`}
                              className="flex-1 flex items-center justify-center py-2 rounded-xl text-[12px] font-semibold text-[#e07a5f] transition-all bg-[rgba(224,122,95,0.05)] hover:bg-[rgba(224,122,95,0.08)]"
                            >
                              Explore
                            </Link>
                            <ConnectButton
                              targetUserId={p.userId}
                              initialStatus={p.connectionStatus}
                              connectionId={p.connectionId}
                              isSender={p.isSender}
                              size="sm"
                            />
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
