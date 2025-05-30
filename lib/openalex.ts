interface RawOpenAlexItem {
  title: string;
  abstract_inverted_index?: { [key: string]: number[] };
  doi?: string;
  cited_by_count?: number;
}
import { Paper } from "@/lib/types/paper";

export async function fetchOpenAlexPapers(query: string): Promise<Paper[]> {
  const searchUrl = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per-page=10&sort=cited_by_count:desc`;

  const res = await fetch(searchUrl);

  if (!res.ok) {
    console.error("OpenAlex API fetch failed:", res.statusText);
    return [];
  }

  const data = await res.json();

  const papers: Paper[] = data.results.map((item: RawOpenAlexItem) => ({
    title: item.title,
    abstract: item.abstract_inverted_index
      ? Object.keys(item.abstract_inverted_index).join(" ")
      : "No abstract available.",
    doi: item.doi,
    citationCount: item.cited_by_count ?? 0
  }));

  return papers;
}
