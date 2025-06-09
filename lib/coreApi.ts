import axios from "axios";
import { Paper } from "@/lib/types/paper";

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
          Authorization: `Bearer ${process.env.CORE_API_KEY}`, // CORE v3 인증 토큰
          Accept: "application/json", // 🔥 이 줄이 없으면 HTML 응답받을 수도 있음
        },
        maxRedirects: 5, // 🔄 리디렉션 대응
      }
    );

    const papers: Paper[] = response.data.results.map((item: Record<string, any>) => ({
      title: item.title || "Untitled",
      authors: item.authors?.map((a: any) => a.name) || ["Unknown"],
      year: item.year_published?.toString() || "N/A",
      url: item.urls?.[0] || "N/A",
    }));

    return papers;
  } catch (error) {
    console.error("❌ CORE API (v3) search failed:", error);
    return [];
  }
}
