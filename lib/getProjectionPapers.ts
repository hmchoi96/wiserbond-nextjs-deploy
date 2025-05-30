// lib/getProjectionPapers.ts
// getProjectionPapers() delivers forecasting-oriented insights—models, quantified risks, 
// and scenario-based implications—to support the strategic interpretation layer only.
import { fetchOpenAlexPapers } from "@/lib/openalex";

export async function getProjectionPapers(
  topic: string,
  industry: string,
  country: string,
  subIndustry?: string,
  situation?: string,
  goal?: string,
  followup?: string
) {
  const projectionKeywords = "projection OR forecast OR scenario OR risk";

  const fullQuery = [
    topic,
    industry,
    subIndustry,
    country,
    situation,
    goal,
    followup,
    projectionKeywords
  ]
    .filter(Boolean)
    .join(" ");

  let papers = await fetchOpenAlexPapers(fullQuery);

  // fallback
  if (!papers || papers.length < 2) {
    const fallbackQuery = [topic, industry, country, projectionKeywords]
      .filter(Boolean)
      .join(" ");
    papers = await fetchOpenAlexPapers(fallbackQuery);
  }

  const topPapers = papers
    .filter((p) => p.abstract && p.doi)
    .sort((a, b) => (b.citationCount || 0) - (a.citationCount || 0))
    .slice(0, 3)
    .map((p) => ({
      title: p.title,
      summary: p.abstract,
      doi: p.doi
    }));

  return topPapers;
}
