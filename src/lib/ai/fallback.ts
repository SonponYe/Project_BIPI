// Scenario A/C fallback (pitch Section 11): pre-generated content used when
// the Claude API is unavailable or rate-limited, so the demo and the core
// learning loop never depend on a live model call.

export function getPregeneratedCareerAdvice(query: string): string {
  const common: Record<string, string> = {
    "solar installer":
      "Solar installation is a growing green trade in Ghana. Start with a certified electrical or renewable-energy course, then look for apprenticeships with local solar suppliers.",
    "climate researcher":
      "University of Ghana's Geography and Climate Science departments offer relevant degree paths; volunteering with EPA Ghana or NADMO is a common entry point.",
  };

  const match = Object.keys(common).find((key) =>
    query.toLowerCase().includes(key)
  );

  return (
    (match && common[match]) ??
    "This career path isn't in the offline advisor yet — try again once you're back online, or browse the Career Pathway Explorer's curated list."
  );
}
