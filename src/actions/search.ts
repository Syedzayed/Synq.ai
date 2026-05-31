"use server";

import { db } from "@/lib/db/prisma";
import { getServerUser } from "@/lib/auth/supabase-server";

export interface SearchFilters {
  role?: string;
  skill?: string;
  interest?: string;
  sortBy?: "compatibility" | "name" | "newest";
}

export interface SearchResultItem {
  id: string;
  userId: string;
  name: string | null;
  role: string | null;
  organization: string | null;
  skills: string[];
  interests: string[];
  aiSummary: string | null;
  compatibilityScore: number;
  connectionStatus: "PENDING" | "ACCEPTED" | "REJECTED" | null;
  connectionId: string | null;
  isSender: boolean;
}

export async function searchProfiles(
  query: string,
  filters: SearchFilters = {}
): Promise<{ success: boolean; results: SearchResultItem[]; error?: string }> {
  const user = await getServerUser();
  if (!user) return { success: false, results: [], error: "Not authenticated." };

  try {
    const trimmedQuery = query.trim();

    // 1. Fetch current user's profile and recommendations for score calculations
    const [myProfile, myRecommendations, myConnections] = await Promise.all([
      db.profile.findUnique({
        where: { userId: user.id },
        select: { skills: true, interests: true },
      }),
      db.matchRecommendation.findMany({
        where: { userId: user.id },
        select: { matchedUserId: true, score: true },
      }),
      db.connection.findMany({
        where: {
          OR: [{ senderId: user.id }, { receiverId: user.id }],
        },
        select: { id: true, senderId: true, receiverId: true, status: true },
      }),
    ]);

    const recommendationMap = new Map(
      myRecommendations.map((r) => [r.matchedUserId, r.score])
    );

    const connectionLookup = new Map<
      string,
      { id: string; status: "PENDING" | "ACCEPTED" | "REJECTED"; isSender: boolean }
    >();
    for (const conn of myConnections) {
      const isMeSender = conn.senderId === user.id;
      const otherUserId = isMeSender ? conn.receiverId : conn.senderId;
      connectionLookup.set(otherUserId, {
        id: conn.id,
        status: conn.status as "PENDING" | "ACCEPTED" | "REJECTED",
        isSender: isMeSender,
      });
    }

    // 2. Build where filters
    const whereConditions: any = {
      userId: { not: user.id }, // exclude self
      completedAt: { not: null }, // exclude incomplete / anonymous draft profiles!
    };

    // Text search (name, role, organization, bio) or array contains (skills, interests)
    if (trimmedQuery) {
      whereConditions.OR = [
        { name: { contains: trimmedQuery, mode: "insensitive" } },
        { role: { contains: trimmedQuery, mode: "insensitive" } },
        { organization: { contains: trimmedQuery, mode: "insensitive" } },
        { bio: { contains: trimmedQuery, mode: "insensitive" } },
        { skills: { hasSome: [trimmedQuery] } },
        { interests: { hasSome: [trimmedQuery] } },
      ];
    }

    // Filters
    if (filters.role) {
      whereConditions.role = { contains: filters.role, mode: "insensitive" };
    }
    if (filters.skill) {
      whereConditions.skills = { has: filters.skill };
    }
    if (filters.interest) {
      whereConditions.interests = { has: filters.interest };
    }

    // 3. Query profiles
    const profiles = await db.profile.findMany({
      where: whereConditions,
      select: {
        id: true,
        userId: true,
        name: true,
        role: true,
        organization: true,
        skills: true,
        interests: true,
        aiSummary: true,
        createdAt: true,
      },
    });

    // 4. Transform results with compatibility score
    const results: SearchResultItem[] = profiles.map((p) => {
      // Lookup recommended score
      let score = recommendationMap.get(p.userId) ?? 0;

      // If not recommended, calculate dynamic fallback compatibility score based on shared skills/interests
      if (!score) {
        let matches = 0;
        const mySkillsSet = new Set((myProfile?.skills ?? []).map((s) => s.toLowerCase()));
        const myInterestsSet = new Set((myProfile?.interests ?? []).map((i) => i.toLowerCase()));

        p.skills.forEach((s) => {
          if (mySkillsSet.has(s.toLowerCase())) matches += 1;
        });
        p.interests.forEach((i) => {
          if (myInterestsSet.has(i.toLowerCase())) matches += 1;
        });

        // Base 60%, + 10% per match, cap at 95%
        score = Math.min(95, 60 + matches * 10);
      }

      const connInfo = connectionLookup.get(p.userId);

      return {
        id: p.id,
        userId: p.userId,
        name: p.name,
        role: p.role,
        organization: p.organization,
        skills: p.skills,
        interests: p.interests,
        aiSummary: p.aiSummary,
        compatibilityScore: score,
        connectionStatus: connInfo ? connInfo.status : null,
        connectionId: connInfo ? connInfo.id : null,
        isSender: connInfo ? connInfo.isSender : false,
      };
    });

    // 5. Apply sorting
    const sortBy = filters.sortBy || "compatibility";
    if (sortBy === "compatibility") {
      results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    } else if (sortBy === "name") {
      results.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "newest") {
      // Sort by original profiles order or created timestamp
      // Profiles are already loaded, just reverse or sort by profile id / date
      results.sort((a, b) => b.id.localeCompare(a.id));
    }

    return { success: true, results };
  } catch (err) {
    console.error("[searchProfiles]", err);
    return { success: false, results: [], error: "Failed to search profiles." };
  }
}

/**
 * Get lists of all unique roles, skills, and interests for dynamic filters
 */
export async function getFilterOptions(): Promise<{
  roles: string[];
  skills: string[];
  interests: string[];
}> {
  try {
    const profiles = await db.profile.findMany({
      where: { completedAt: { not: null } },
      select: {
        role: true,
        skills: true,
        interests: true,
      },
    });

    const rolesSet = new Set<string>();
    const skillsSet = new Set<string>();
    const interestsSet = new Set<string>();

    for (const p of profiles) {
      if (p.role?.trim()) rolesSet.add(p.role.trim());
      p.skills.forEach((s) => s?.trim() && skillsSet.add(s.trim()));
      p.interests.forEach((i) => i?.trim() && interestsSet.add(i.trim()));
    }

    return {
      roles: Array.from(rolesSet).slice(0, 15),
      skills: Array.from(skillsSet).slice(0, 25),
      interests: Array.from(interestsSet).slice(0, 25),
    };
  } catch (err) {
    console.error("[getFilterOptions]", err);
    return { roles: [], skills: [], interests: [] };
  }
}
