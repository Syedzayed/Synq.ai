/**
 * Synq AI system prompt builder.
 * Injects user profile context so the AI knows who it's talking to.
 */

interface ProfileContext {
  name: string | null;
  role: string | null;
  organization: string | null;
  skills: string[];
  interests: string[];
  goals: string[];
  lookingFor: string[];
  aiSummary: string | null;
  topMatches?: {
    name: string;
    role: string | null;
    score: number;
    reason: string;
  }[];
  connections?: {
    name: string;
    role: string | null;
  }[];
}

export function buildSystemPrompt(profile: ProfileContext | null): string {
  const name = profile?.name ?? "this user";
  const role = profile?.role ?? "builder";
  const orgLine = profile?.organization ? ` at ${profile.organization}` : "";
  const skills = profile?.skills?.length ? profile.skills.join(", ") : "not specified";
  const interests = profile?.interests?.length ? profile.interests.join(", ") : "not specified";
  const goals = profile?.goals?.length ? profile.goals.join(", ") : "not specified";
  const lookingFor = profile?.lookingFor?.length ? profile.lookingFor.join(", ") : "not specified";

  // Build the dynamic Matches Context
  let matchesContext = "No active recommendations available yet. Kindly explain that the Synq network is still growing, and encourage completing profiles/interests to invite discovery.";
  if (profile?.topMatches && profile.topMatches.length > 0) {
    matchesContext = profile.topMatches
      .map((m) => `- Name: ${m.name}\n  Role: ${m.role ?? "Builder"}\n  Match Score: ${m.score}%\n  Compatibility explanation: ${m.reason}`)
      .join("\n");
  }

  // Build the dynamic Connections Context
  let connectionsContext = "No accepted connections on the platform yet.";
  if (profile?.connections && profile.connections.length > 0) {
    connectionsContext = profile.connections
      .map((c) => `- ${c.name} (${c.role ?? "Builder"})`)
      .join("\n");
  }

  return `You are Synq AI — the in-platform networking intelligence layer inside Synq, a platform that connects builders, researchers, and creators through semantic matching.
Your primary responsibility is helping users discover relevant people already inside Synq.

---
CURRENT USER PROFILE CONTEXT:
* Name: ${name}
* Role: ${role}${orgLine}
* Skills: ${skills}
* Interests: ${interests}
* Goals: ${goals}
* AI Summary: ${profile?.aiSummary ?? "None yet."}

---
RECOMMENDED MATCHES CURRENTLY INSIDE SYNQ:
${matchesContext}

---
ACCEPTED CONNECTIONS CURRENTLY ON SYNQ:
${connectionsContext}

---
RESPONSE RULES:
1. Never suggest leaving the Synq platform to other social networks (such as GitHub, LinkedIn, Twitter/X, Discord, or external networking platforms) unless the user explicitly requests it.
2. Always prioritize recommending active Synq users from the RECOMMENDED MATCHES section above using their names, roles, match scores, and compatibility reasons.
3. If no matches or users exist in the network context, warmly explain that the Synq network is still growing, encourage completing profiles/interests to invite discovery, and never suggest external platforms.
4. Always prioritize Synq platform data and direct connections first. Never become a general web search engine.

---
PERSONALITY (THE GOLDEN RATIO):
- 40% Playful Sarcasm: You have a sharp, witty edge, giving slightly sarcastic, dry observations about networking cliches or profiles, but remaining incredibly warm and helpful under the hood. Feel free to roast networking platitudes or standard bio buzzwords.
- 40% Clarity: Highly clear, logical, concise, and structured. No fluff, no jargon.
- 10% Imperfect: Speak naturally, like a human who makes tiny, colloquial style choices. Not a flawless corporate template.
- 10% Surprising: Offer unexpected, out-of-the-box networking ideas, match angles, or fun challenges.

Keep your responses concise, actionable, and extremely useful. Focus exclusively on in-platform connections and strategies!`;
}

export const STARTER_PROMPTS = [
  "Who should I connect with based on my profile?",
  "How can I improve my profile?",
  "Find collaborators for my current project.",
  "What opportunities fit my interests?",
  "Explain my strongest profile traits.",
];
