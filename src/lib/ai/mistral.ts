/**
 * Mistral AI client wrapper
 *
 * Uses the Mistral REST API directly via fetch.
 * Swap this for @mistralai/mistralai SDK when you add it.
 */

const MISTRAL_BASE_URL = "https://api.mistral.ai/v1";

function getMistralKey(): string {
  const key = process.env.MISTRAL_API_KEY;
  if (!key) throw new Error("MISTRAL_API_KEY is not set in environment.");
  return key;
}

/**
 * Generate a text embedding vector using Mistral's embedding model.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch(`${MISTRAL_BASE_URL}/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getMistralKey()}`,
    },
    body: JSON.stringify({
      model: "mistral-embed",
      input: [text],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Mistral embeddings API error: ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding as number[];
}

/**
 * Chat completion using Mistral.
 */
export async function chatCompletion(
  messages: { role: "user" | "assistant" | "system"; content: string }[],
  model = "mistral-small-latest"
): Promise<string> {
  const response = await fetch(`${MISTRAL_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getMistralKey()}`,
    },
    body: JSON.stringify({ model, messages }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Mistral chat API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content as string;
}
