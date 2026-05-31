"use client";

import { useState, useEffect, useTransition } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, X, Loader2, User, Briefcase, Tag, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchProfiles, type SearchResultItem, type SearchFilters } from "@/actions/search";
import { ConnectButton } from "@/components/connections/connect-button";
import { ProfileTags } from "@/components/discover/profile-tags";
import { MatchScore } from "@/components/matches/match-score";
import Link from "next/link";

interface SearchClientProps {
  initialOptions: {
    roles: string[];
    skills: string[];
    interests: string[];
  };
}

function avatarGradient(name: string) {
  const gradients = [
    "linear-gradient(135deg,#e07a5f,#f4a261)",
    "linear-gradient(135deg,#6b9080,#a4c3b2)",
    "linear-gradient(135deg,#8b7355,#c4a882)",
    "linear-gradient(135deg,#7c6d8a,#b5a7c4)",
    "linear-gradient(135deg,#5f7e8a,#8cb4be)",
  ];
  const idx = name.charCodeAt(0) % gradients.length;
  return gradients[idx];
}

export function SearchClient({ initialOptions }: SearchClientProps) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [interestFilter, setInterestFilter] = useState("");
  const [sortBy, setSortBy] = useState<"compatibility" | "name" | "newest">("compatibility");
  
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search trigger
  useEffect(() => {
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
        setResults(res.results);
      }
      setHasSearched(true);
    });
  };

  const clearFilters = () => {
    setRoleFilter("");
    setSkillFilter("");
    setInterestFilter("");
    setQuery("");
  };

  const isAnyFilterActive = roleFilter || skillFilter || interestFilter || query;

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div 
        className="p-6 rounded-[24px]"
        style={{
          background: "rgba(255,252,248,0.7)",
          border: "1px solid rgba(232,226,216,0.9)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Main search bar */}
          <div className="relative w-full md:flex-1">
            <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by name, role, organization, skills..."
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

          {/* Sort selection */}
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

        {/* Dynamic Filters row */}
        <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wider text-neutral-500 mr-2">
            <SlidersHorizontal size={13} />
            Filters:
          </div>

          {/* Role Filter */}
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
            {initialOptions.roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          {/* Skill Filter */}
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
            {initialOptions.skills.map((skill) => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>

          {/* Interest Filter */}
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
            {initialOptions.interests.map((interest) => (
              <option key={interest} value={interest}>{interest}</option>
            ))}
          </select>

          {/* Clear button */}
          {isAnyFilterActive && (
            <button
              onClick={clearFilters}
              className="ml-auto text-[12.5px] font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity"
              style={{ color: "#e07a5f" }}
            >
              Clear Search & Filters
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Loading & Results Grid */}
      <div className="relative min-h-[300px]">
        {isPending && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-[24px]">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin" size={32} style={{ color: "#e07a5f" }} />
              <p className="text-[13px] font-semibold" style={{ color: "#6b6560" }}>Updating results...</p>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!hasSearched ? (
            /* Try searching empty state */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-16 px-6 rounded-[24px]"
              style={{
                background: "rgba(255,252,248,0.5)",
                border: "1px dashed rgba(232,226,216,0.8)",
              }}
            >
              <div className="mx-auto w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(244,162,97,0.15)", color: "#f4a261" }}>
                <Search size={22} />
              </div>
              <h3 className="font-semibold text-[17px] mb-1.5" style={{ color: "#1e1a17" }}>Discover Platform Builders</h3>
              <p className="text-[14px] max-w-sm mx-auto" style={{ color: "#9e9890" }}>
                Try searching by skill, interest or role above to find perfect collaborators.
              </p>
            </motion.div>
          ) : results.length === 0 ? (
            /* No matches found empty state */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-16 px-6 rounded-[24px]"
              style={{
                background: "rgba(255,252,248,0.5)",
                border: "1px dashed rgba(232,226,216,0.8)",
              }}
            >
              <div className="mx-auto w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(224,122,95,0.12)", color: "#e07a5f" }}>
                <Compass size={22} />
              </div>
              <h3 className="font-semibold text-[17px] mb-1.5" style={{ color: "#1e1a17" }}>No profiles found</h3>
              <p className="text-[14px] max-w-sm mx-auto mb-5" style={{ color: "#9e9890" }}>
                No matches found yet. Try adjusting your search query or filters.
              </p>
              <button
                onClick={clearFilters}
                className="px-5 py-2.5 rounded-full text-[13px] font-semibold text-white transition-all"
                style={{ background: "linear-gradient(135deg, #e07a5f, #f4a261)" }}
              >
                Reset Search Filters
              </button>
            </motion.div>
          ) : (
            /* Results grid */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {results.map((profile, idx) => {
                const name = profile.name ?? "Anonymous";
                const initial = name.charAt(0).toUpperCase();

                return (
                  <motion.article
                    key={profile.userId}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    whileHover={{ y: -3, boxShadow: "0 14px 36px rgba(58,53,48,0.08)" }}
                    className="flex flex-col rounded-3xl overflow-hidden transition-shadow duration-300"
                    style={{
                      background: "rgba(255,252,248,0.98)",
                      border: "1px solid rgba(232,226,216,0.9)",
                      boxShadow: "0 2px 12px rgba(58,53,48,0.04)",
                    }}
                  >
                    <div className="h-1.5 w-full" style={{ background: avatarGradient(name) }} />

                    <div className="flex flex-col gap-4 p-5 flex-1">
                      {/* Identity header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div
                            className="h-11 w-11 rounded-2xl flex items-center justify-center text-[16px] font-bold text-white flex-shrink-0"
                            style={{ background: avatarGradient(name) }}
                          >
                            {initial}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[15px] font-semibold truncate" style={{ color: "#1e1a17" }}>
                              {name}
                            </p>
                            {profile.role && (
                              <p className="text-[12.5px] flex items-center gap-1 mt-0.5 truncate" style={{ color: "#9e9890" }}>
                                <Briefcase size={10} />
                                {profile.role}
                                {profile.organization && ` · ${profile.organization}`}
                              </p>
                            )}
                          </div>
                        </div>
                        <MatchScore score={profile.compatibilityScore} size="sm" />
                      </div>

                      {/* AI Summary */}
                      {profile.aiSummary && (
                        <p className="text-[13px] leading-relaxed line-clamp-3" style={{ color: "#6b6560" }}>
                          {profile.aiSummary}
                        </p>
                      )}

                      {/* Skills */}
                      {profile.skills?.length > 0 && (
                        <div className="flex flex-col gap-1.5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] flex items-center gap-1" style={{ color: "#b8b2aa" }}>
                            <Tag size={9} />
                            Skills
                          </p>
                          <ProfileTags items={profile.skills} max={4} variant="skill" />
                        </div>
                      )}

                      {/* Spacer */}
                      <div className="flex-1" />

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-2 border-t border-neutral-100">
                        <Link
                          href={`/dashboard/discover/${profile.userId}`}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-2xl text-[13px] font-semibold transition-all duration-200 hover:shadow-sm"
                          style={{
                            background: "linear-gradient(135deg,#e07a5f 0%,#d4694f 100%)",
                            color: "white",
                            boxShadow: "0 2px 8px rgba(224,122,95,0.2)",
                          }}
                        >
                          View Profile
                        </Link>
                        <ConnectButton
                          targetUserId={profile.userId}
                          initialStatus={profile.connectionStatus}
                          connectionId={profile.connectionId}
                          isSender={profile.isSender}
                          size="sm"
                        />
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
