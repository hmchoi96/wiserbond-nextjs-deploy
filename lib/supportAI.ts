import { searchCorePapers } from "@/lib/coreApi";
import { searchOpenAlexPapers } from "@/lib/openalex";
import { callGPT } from "@/lib/ai/gpt";
import { Paper } from "@/lib/types/paper";

export interface SupportSummary {
  summary: string;
  papers: Paper[];
}

function deduplicatePapers(papers: Paper[]): Paper[] {
  const seen = new Set<string>();
  return papers.filter((p) => {
    const key = `${p.title}-${p.year}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function querySupportAI(
  instruction: string,
  limit: number = 5
): Promise<SupportSummary> {
  // 1. GPT로부터 검색 키워드 추출
  const keywordExtractPrompt = `
You are an assistant that extracts academic research search terms.

Given the instruction: "${instruction}", identify 3–5 precise keywords or phrases 
(separated by commas) suitable for searching academic papers.

Respond only with keywords. No explanation.`;
  const rawKeywords = await callGPT(keywordExtractPrompt);
  const query = rawKeywords.replace(/\n/g, " ").trim();

  // 2. OpenAlex + CORE API 병렬 호출
  const [corePapers, openAlexPapers] = await Promise.all([
    searchCorePapers(query, limit),
    searchOpenAlexPapers(query, limit)
  ]);

  // 3. 중복 제거 및 통합
  const combined = deduplicatePapers([...corePapers, ...openAlexPapers]);

  if (combined.length === 0) {
    return { summary: "No relevant academic papers found.", papers: [] };
  }

  // 4. 요약용 컨텍스트 구성
  const context = combined
    .map(
      (p, i) =>
        `#${i + 1} "${p.title}" (${p.year}) by ${p.authors.join(", ")}\nURL: ${p.url}`
    )
    .join("\n\n");

  const gptPrompt = `You are a strategic research assistant.

Based on the following academic papers, summarize the key insights related to the instruction: "${instruction}".

${context}

Write a clear, concise, and insight-driven summary (max 300 words). Focus on strategic implications or findings.`;

  const summary = await callGPT(gptPrompt);

  return { summary, papers: combined };
}
