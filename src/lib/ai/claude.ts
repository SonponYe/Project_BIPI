import Anthropic from "@anthropic-ai/sdk";

// Claude API is a build-time and career-advisor tool, not a runtime dependency
// of the core learning loop (pitch Section 11). Callers should be written so
// that a missing ANTHROPIC_API_KEY falls back to lib/ai/fallback.ts rather
// than breaking the request.
const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export async function generateModuleDraft(curriculumBrief: string): Promise<string> {
  if (!client) {
    throw new Error("ANTHROPIC_API_KEY not set — use lib/ai/fallback.ts instead");
  }

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Draft a BIPI module from this GreenRes curriculum brief. Keep language plain and grounded in Ghanaian examples:\n\n${curriculumBrief}`,
      },
    ],
  });

  const [block] = message.content;
  return block.type === "text" ? block.text : "";
}

export async function localise(text: string, language: "tw" | "pcm"): Promise<string> {
  if (!client) {
    throw new Error("ANTHROPIC_API_KEY not set — use lib/ai/fallback.ts instead");
  }

  const targetName = language === "tw" ? "Twi" : "Ghanaian Pidgin English";
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      { role: "user", content: `Translate the following into ${targetName}, keeping climate/agronomic terms accurate:\n\n${text}` },
    ],
  });

  const [block] = message.content;
  return block.type === "text" ? block.text : "";
}
