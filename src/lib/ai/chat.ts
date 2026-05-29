/**
 * Synq AI chat service.
 * Thin wrapper around the Mistral chat API used by the streaming route.
 */
import "server-only";
import { chatCompletion } from "./mistral";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Non-streaming chat — for server actions that need the full response at once.
 */
export async function synqChat(messages: ChatMessage[]): Promise<string> {
  return chatCompletion(messages, "mistral-small-latest");
}

/**
 * Build the messages array for a chat API call:
 * system prompt + conversation history + new user message.
 */
export function buildChatMessages(
  systemPrompt: string,
  history: { role: string; content: string }[],
  newUserMessage: string
): ChatMessage[] {
  return [
    { role: "system", content: systemPrompt },
    ...history
      .slice(-18) // keep last 18 messages for context window
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user", content: newUserMessage },
  ];
}
