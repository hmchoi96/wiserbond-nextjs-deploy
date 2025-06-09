import axios from "axios";
import { Paper } from "@/lib/types/paper";

interface CoreAuthor {
  name: string;
}

interface CoreItem {
  title?: string;
  authors?: CoreAuthor[];
  year_published?: number;
  urls?: string[];
}

export async function searchCorePapers(
  query: string,
  limit: number = 5
): Promise<Paper[]> {
  try {
    const response = await axios.get(
      "https://api.core.ac.uk/v3/search/works",
      {
        params: {
          q: query,
          limit: limit,
        },
        headers: {
          Authorization: `Bearer ${process.env.CORE_API_KEY}`,
          Accept: "application/json",
        },
        maxRedirects: 5,
      }
    );

    const papers: Paper[] = response.data.results.map((item: CoreItem) => ({
      title: item.title || "Untitled",
      authors: item.authors?.map((a) => a.name) || ["Unknown"],
      year: item.year_published?.toString() || "N/A",
      url: item.urls?.[0] || "N/A",
    }));

    return papers;
  } catch (error) {
    console.error("❌ CORE API (v3) search failed:", error);
    return [];
  }
}
