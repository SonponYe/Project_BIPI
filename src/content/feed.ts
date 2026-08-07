export interface FeedItem {
  id: string;
  headline: string;
  summary: string;
  dateLabel: string;
  sourceLabel: string;
  sourceUrl: string;
}

// Seeded manually from real reporting, not the live "things happening in
// your community" data layer the product direction eventually wants —
// that needs modules/responses tagged by region and a real feed pipeline,
// neither of which exist yet. This is the honest placeholder: real
// headlines, not fabricated ones, so the dashboard doesn't lie to a user
// even before that layer is built.
export const FEED_ITEMS: FeedItem[] = [
  {
    id: "accra-floods-june-2026",
    headline: "Flash floods swept through Accra neighbourhoods",
    summary:
      "Spintex, Adabraka, Achimota and Agbogbloshie went underwater after a violent rainstorm; government released GH₵300 million in emergency relief.",
    dateLabel: "30 June 2026",
    sourceLabel: "Al Jazeera",
    sourceUrl: "https://www.aljazeera.com/news/2026/6/30/heavy-rainfall-kills-dozens-in-ghana-ivory-coast",
  },
  {
    id: "el-nino-drought-risk-2026",
    headline: "After the floods, Ghana braces for possible drought",
    summary:
      "A strengthening El Niño is tilting the rest of the rainy season toward below-normal rainfall and an early end to the rains.",
    dateLabel: "30 July 2026",
    sourceLabel: "Ghana Business News",
    sourceUrl:
      "https://www.ghanabusinessnews.com/2026/07/30/ghana-after-the-floods-comes-super-el-nino-and-potential-droughts/",
  },
  {
    id: "coastal-erosion-keta",
    headline: "Ghana's coastline is losing 2–3 metres a year",
    summary:
      "Areas like Keta, Dzakplagbe and Fuveme are eroding at more than 5 metres a year; roughly two-thirds of the 550km coastline remains unprotected.",
    dateLabel: "Ongoing",
    sourceLabel: "UNESCO Courier",
    sourceUrl: "https://courier.unesco.org/en/articles/ghanas-coastline-swallowed-sea",
  },
  {
    id: "farming-under-climate-stress",
    headline: "Farming under growing climate stress",
    summary:
      "Erratic rainfall and shifting growing seasons are eroding yields for the roughly 45% of Ghana's workforce in agriculture, most on small, rain-fed farms.",
    dateLabel: "Ongoing",
    sourceLabel: "MyJoyOnline",
    sourceUrl: "https://www.myjoyonline.com/climate-evidence-sustaining-ghanas-farming-glory-under-climate-stress/",
  },
  {
    id: "rising-temperatures-ghana",
    headline: "Ghana has warmed by about 1°C over six decades",
    summary:
      "Rising heat and unpredictable rain are already reshaping farming, water access, and health risk across the country — and the pace is accelerating.",
    dateLabel: "Ongoing",
    sourceLabel: "Climate Reality Project",
    sourceUrl: "https://www.climaterealityproject.org/blog/how-climate-crisis-impacting-ghana",
  },
];
