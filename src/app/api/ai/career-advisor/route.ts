import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getPregeneratedCareerAdvice } from "@/lib/ai/fallback";

// The youth track's AI Career Advisor (modules 83, 120) — the one live
// Claude API call during normal user interaction (pitch Section 11,
// Scenario C). Falls back to pre-generated advice if the key is missing
// or the call fails, so the feature degrades rather than breaking.
export async function POST(request: NextRequest) {
  const { query } = await request.json();

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ advice: getPregeneratedCareerAdvice(query), source: "fallback" });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `A Ghanaian youth user asks BIPI's career advisor: "${query}". Give practical, Ghana-specific green-economy career guidance in 3-4 sentences.`,
        },
      ],
    });
    const [block] = message.content;
    return NextResponse.json({ advice: block.type === "text" ? block.text : "", source: "claude" });
  } catch {
    return NextResponse.json({ advice: getPregeneratedCareerAdvice(query), source: "fallback" });
  }
}
