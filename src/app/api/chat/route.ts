import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";
import { db } from "@/lib/db/prisma";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import { buildChatMessages } from "@/lib/ai/chat";

const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { content, conversationId } = await req.json() as {
    content: string;
    conversationId?: string | null;
  };

  if (!content?.trim()) {
    return new Response("Message content required", { status: 400 });
  }

  // ── Get or create conversation ────────────────────────────────────────────
  let convId = conversationId;
  if (!convId) {
    const conv = await db.conversation.create({
      data: {
        userId: user.id,
        title: content.trim().slice(0, 60),
      },
    });
    convId = conv.id;
  }

  // ── Save user message ─────────────────────────────────────────────────────
  await db.message.create({
    data: { conversationId: convId, role: "user", content: content.trim() },
  });

  // ── Load history + profile ────────────────────────────────────────────────
  const [history, profile] = await Promise.all([
    db.message.findMany({
      where: { conversationId: convId },
      orderBy: { createdAt: "asc" },
      take: 20,
    }),
    db.profile.findUnique({
      where: { userId: user.id },
      select: {
        name: true, role: true, organization: true,
        skills: true, interests: true, goals: true,
        lookingFor: true, aiSummary: true,
      },
    }),
  ]);

  // ── Build messages ────────────────────────────────────────────────────────
  const systemPrompt = buildSystemPrompt(profile);
  // history already includes the user message we just saved, so use all but the last one for context
  const contextHistory = history.slice(0, -1);
  const messages = buildChatMessages(systemPrompt, contextHistory, content.trim());

  // ── Call Mistral (streaming) ──────────────────────────────────────────────
  const mistralRes = await fetch(MISTRAL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: "mistral-small-latest",
      messages,
      stream: true,
      max_tokens: 600,
      temperature: 0.7,
    }),
  });

  if (!mistralRes.ok) {
    const err = await mistralRes.text();
    console.error("[chat/route] Mistral error:", err);
    return new Response("AI service error", { status: 502 });
  }

  // ── Stream response to client + save on completion ───────────────────────
  let fullContent = "";

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();

      // First event: send conversationId so client can persist it
      controller.enqueue(
        enc.encode(`data: ${JSON.stringify({ conversationId: convId })}\n\n`)
      );

      const reader = mistralRes.body!.getReader();
      const dec = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = dec.decode(value, { stream: true });
          for (const line of chunk.split("\n")) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data: ")) continue;
            const payload = trimmed.slice(6);
            if (payload === "[DONE]") {
              controller.enqueue(enc.encode("data: [DONE]\n\n"));
              break;
            }
            try {
              const parsed = JSON.parse(payload);
              const delta = parsed.choices?.[0]?.delta?.content ?? "";
              if (delta) {
                fullContent += delta;
                controller.enqueue(
                  enc.encode(`data: ${JSON.stringify({ delta })}\n\n`)
                );
              }
            } catch { /* skip malformed SSE lines */ }
          }
        }
      } finally {
        // Save AI message after stream complete
        if (fullContent) {
          await db.message.create({
            data: {
              conversationId: convId!,
              role: "assistant",
              content: fullContent,
            },
          }).catch((e) => console.error("[chat/route] Failed to save AI msg:", e));
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

// GET: load conversation history
export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (action === "conversations") {
    const convs = await db.conversation.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      take: 30,
      select: { id: true, title: true, createdAt: true, updatedAt: true },
    });
    return Response.json({ conversations: convs });
  }

  const conversationId = searchParams.get("conversationId");
  if (!conversationId) return Response.json({ messages: [] });

  // Verify ownership
  const conv = await db.conversation.findFirst({
    where: { id: conversationId, userId: user.id },
  });
  if (!conv) return Response.json({ error: "Not found" }, { status: 404 });

  const messages = await db.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
  return Response.json({ messages, conversation: conv });
}
