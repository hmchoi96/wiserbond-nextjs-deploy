// lib/ai/SupportContext.ts

import { searchCorePapers } from "@/lib/coreApi";
import { supportWithClaude } from "@/lib/ai/claude"; // 서폿AI용 summarizer

interface SupportContextOptions {
  topic: string;
  industry?: string;
  country?: string;
  goal?: string;
  situation?: string;
  subIndustry?: string;
  language?: string;
}

export async function getSupportContext(options: SupportContextOptions): Promise<string> {
  const { topic, industry, country, goal, situation, subIndustry, language = "English" } = options;

  // 1️⃣ 질의어 구성
  const queryParts = [topic, industry, country, goal, situation, subIndustry].filter(Boolean);
  const query = queryParts.join(" ");

  // 2️⃣ CORE 논문 검색
  const papers = await searchCorePapers(query);
  if (papers.length === 0) return "No related academic papers found.";

  // 3️⃣ 대표 논문 1~2개 선택 (향후: 더 똑똑한 필터 가능)
  const topPapers = papers.slice(0, 2);

  // 4️⃣ 논문 요약
  const summaries = await Promise.all(
    topPapers.map(async (paper) => {
      const context = `Title: ${paper.title}\nAuthors: ${paper.authors.join(", ")}\nYear: ${paper.year}\nURL: ${paper.url}`;
      const summary = await supportWithClaude(paper.title, language);
      return `• ${summary}\n(${context})`;
    })
  );

  // 5️⃣ 통합 서폿 요약 반환
  return summaries.join("\n\n");
}
