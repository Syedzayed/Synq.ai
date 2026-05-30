/**
 * Profile completeness scoring — pure utility, safe for client use.
 */

export interface ProfileCompletenessInput {
  name?: string | null;
  role?: string | null;
  organization?: string | null;
  skills: string[];
  interests: string[];
  projects?: string | null;
  goals: string[];
  lookingFor: string[];
  aiSummary?: string | null;
}

export interface CompletenessResult {
  score: number; // 0–100
  factors: { label: string; done: boolean; weight: number }[];
}

const FACTORS = [
  { key: "name",         label: "Name",          weight: 10 },
  { key: "role",         label: "Role",           weight: 10 },
  { key: "organization", label: "Organization",   weight: 5  },
  { key: "skills",       label: "Skills (3+)",    weight: 20 },
  { key: "interests",    label: "Interests (2+)", weight: 15 },
  { key: "goals",        label: "Goals",          weight: 15 },
  { key: "lookingFor",   label: "Looking For",    weight: 10 },
  { key: "projects",     label: "Current Project",weight: 5  },
  { key: "aiSummary",    label: "AI Summary",     weight: 10 },
] as const;

export function calculateCompleteness(p: ProfileCompletenessInput): CompletenessResult {
  const checks: Record<string, boolean> = {
    name:         !!p.name?.trim(),
    role:         !!p.role?.trim(),
    organization: !!p.organization?.trim(),
    skills:       p.skills.length >= 3,
    interests:    p.interests.length >= 2,
    goals:        p.goals.length >= 1,
    lookingFor:   p.lookingFor.length >= 1,
    projects:     !!p.projects?.trim(),
    aiSummary:    !!p.aiSummary?.trim(),
  };

  const factors = FACTORS.map((f) => ({
    label: f.label,
    done: checks[f.key],
    weight: f.weight,
  }));

  const score = factors.reduce((acc, f) => acc + (f.done ? f.weight : 0), 0);

  return { score, factors };
}
