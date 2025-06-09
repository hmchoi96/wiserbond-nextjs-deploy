// lib/openalex.ts
import { Paper } from "@/lib/types/paper";

interface RawOpenAlexItem {
  title: string;
  publication_year?: number;
  authorships?: { author: { display_name: string } }[];
  doi?: string;
  cited_by_count?: number;
}

export async function searchOpenAlexPapers(query: string, limit: number = 5): Promise<Paper[]> {
  const searchUrl = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per-page=${limit}&sort=cited_by_count:desc`;

  const res = await fetch(searchUrl);

  if (!res.ok) {
    console.error("OpenAlex API fetch failed:", res.statusText);
    return [];
  }

  const data = await res.json();

  const papers: Paper[] = data.results.map((item: RawOpenAlexItem) => ({
    title: item.title,
    authors: item.authorships?.map((a) => a.author.display_name) || ["Unknown"],
    year: item.publication_year?.toString() || "N/A",
    url: item.doi ? `https://doi.org/${item.doi}` : "N/A"
  }));

  return papers;
}
