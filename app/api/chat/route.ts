import { streamText, gateway } from "ai";
import { SYSTEM_PROMPT } from "@/lib/company-knowledge";

export const maxDuration = 60;

function buildHistory(messages: any[]) {
  const raw = messages.slice(-10).map((m: any) => ({
    role: (m.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
    content: typeof m.content === "string"
      ? m.content
      : m.parts?.filter((p: any) => p.type === "text").map((p: any) => p.text).join("") ?? "",
  })).filter((m: any) => m.content.trim());

  const history: { role: "user" | "assistant"; content: string }[] = [];
  for (const msg of raw) {
    // If the same role as previous, skip (Perplexity strict alternation)
    if (history[history.length - 1]?.role === msg.role) continue;
    history.push(msg);
  }

  // Ensure starts with user
  if (history[0]?.role !== "user") history.shift();
  return history;
}

export async function POST(req: Request) {
  const body = await req.json();
  const messages = Array.isArray(body.messages) ? body.messages : [];

  const result = streamText({
    model: gateway("groq/llama-3.3-70b-versatile"),
    system: SYSTEM_PROMPT,
    messages: buildHistory(messages),
    temperature: 0.7,
  });

  return result.toUIMessageStreamResponse();
}
