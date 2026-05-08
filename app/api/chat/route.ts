import { groq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages } from "ai";
import { tavily } from "@tavily/core";
import { SYSTEM_PROMPT } from "@/lib/company-knowledge";

export const maxDuration = 60;

const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY! });

const COMPANY_KEYWORDS = [
  "uispl", "uttam galva", "uttam innovative", "uttam ai", "loopsteel",
  "intellisteel", "yieldmax", "shankar", "rajinder miglani", "anuj miglani",
  "mahesh rajguru", "uttam group", "uttam house",
];

const GREETINGS = /^(hi|hello|hey|namaste|good\s*(morning|evening|afternoon))[!.,\s]*$/i;

function needsWebSearch(text: string): boolean {
  const lower = text.toLowerCase();
  if (GREETINGS.test(lower.trim())) return false;
  if (COMPANY_KEYWORDS.some((kw) => lower.includes(kw))) return false;
  return true;
}

function buildSearchQuery(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("steel price") || lower.includes("steel rate")) {
    return `current steel price India HRC CRC TMT bars per tonne 2025`;
  }
  if (lower.includes("galvanized") || lower.includes("ppgi") || lower.includes("ppgl")) {
    return `galvanized steel price India per tonne 2025`;
  }
  if (lower.includes("steel") || lower.includes("hrc") || lower.includes("crc") || lower.includes("tmt")) {
    return `${text} India steel market price 2025`;
  }
  return text;
}

export async function POST(req: Request) {
  const body = await req.json();
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const recentMessages = messages.slice(-10);
  const webSearchEnabled: boolean = body.webSearch === true;

  const lastMessage = recentMessages[recentMessages.length - 1];
  const lastText: string =
    lastMessage?.parts?.filter((p: any) => p.type === "text").map((p: any) => p.text).join("") ||
    lastMessage?.content || "";

  let systemPrompt = SYSTEM_PROMPT;

  if (webSearchEnabled && lastText && needsWebSearch(lastText)) {
    try {
      const query = buildSearchQuery(lastText);
      const searchResults = await tavilyClient.search(query, {
        maxResults: 5,
        searchDepth: "basic",
      });

      if (searchResults.results.length > 0) {
        const resultsText = searchResults.results
          .map((r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\n${r.content.slice(0, 400)}`)
          .join("\n\n");

        systemPrompt = `${SYSTEM_PROMPT}

---
LIVE WEB SEARCH RESULTS for "${query}":
${resultsText}

CRITICAL: Use ONLY the above search results to answer price/data questions. Do NOT use your training data for prices or statistics — it may be outdated. Always cite the exact source URL from the results above.
After answering, briefly mention that Uttam Galva produces these steel products (HRC, CRC, galvanized steel, PPGI/PPGL) and the user can contact them for direct pricing.
---`;
      }
    } catch {
      // Search failed, continue without it
    }
  }

  const result = streamText({
    model: groq("llama-3.1-8b-instant"),
    system: systemPrompt,
    messages: await convertToModelMessages(recentMessages),
    temperature: 0.7,
  });

  return result.toUIMessageStreamResponse();
}
