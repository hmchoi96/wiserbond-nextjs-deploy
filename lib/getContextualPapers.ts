// lib/getContextualPapers.ts
//provides background context and structural understanding for Big-Mid-Small layers.
import { fetchOpenAlexPapers } from "@/lib/openalex";

export async function getContextualPapers(
  topic: string,
  industry: string,
  country: string,
  subIndustry?: string,
  situation?: string,
  goal?: string,
  followup?: string
) {
  const fullQuery = [
    topic,
    industry,
    subIndustry,
    country,
    situation,
    goal,
    followup
  ]
    .filter(Boolean)
    .join(" ");

  let papers = await fetchOpenAlexPapers(fullQuery);

  // fallback: 핵심 키워드만으로 재시도
  if (!papers || papers.length < 2) {
    const fallbackQuery = [topic, industry, country].filter(Boolean).join(" ");
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


