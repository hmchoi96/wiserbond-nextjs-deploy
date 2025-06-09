// lib/getProjectionPapers.ts
// Retrieves forward-looking academic insights (projections, risk models, scenarios)

import { querySupportAI } from "@/lib/supportAI";

export async function getProjectionPapers(
  topic: string,
  industry: string,
  country: string,
  subIndustry?: string,
  situation?: string,
  goal?: string,
  followup?: string
) {
  const instruction = `Find academic papers related to forecasting, projections, or risk modeling for the topic "${topic}" in the ${industry} sector of ${country}.
Emphasize papers using quantified scenarios, causal reasoning, or predictive models.
Include dimensions like "${subIndustry}", "${situation}", "${goal}", or follow-up issues like "${followup}" if helpful.
Summarize the core predictive insights.`;

  const result = await querySupportAI(instruction);

  return result.papers.map((p, i) => ({
    title: p.title,
    summary: result.summary, // shared summary again
    doi: p.url
  }));
}
