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
          Accept: "application/json", // 🔥 이 줄이 중요함
        },
        maxRedirects: 5, // 🔄 리디렉션 따라가게 설정
      }
    );

    const papers: Paper[] = response.data.results.map((item: any) => ({
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
