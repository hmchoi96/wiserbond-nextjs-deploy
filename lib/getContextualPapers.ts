// lib/getContextualPapers.ts
// Provides structural context for Big/Mid/Small layers using supportAI

import { querySupportAI } from "@/lib/supportAI";

export async function getContextualPapers(
  topic: string,
  industry: string,
  country: string,
  subIndustry?: string,
  situation?: string,
  goal?: string,
  followup?: string
) {
  const instruction = `Find academic papers that help explain structural context for the topic "${topic}" in the ${industry} sector of ${country}.
Include perspectives related to "${subIndustry}", "${situation}", "${goal}", or follow-up considerations like "${followup}" if relevant.
Summarize the main themes across the most cited or insightful papers.`;

  const result = await querySupportAI(instruction);

  return result.papers.map((p, i) => ({
    title: p.title,
    summary: result.summary, // general summary (shared across all papers)
    doi: p.url
  }));
}
