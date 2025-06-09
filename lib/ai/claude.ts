// lib/claude.ts
import axios from "axios";

const WRTN_API_KEY = process.env.WRTN_API_KEY;
const WRTN_API_URL = "https://api.wrtn.ai/v1/completion"; // 실제 엔드포인트 확인 필요

export async function supportWithClaude(prompt: string, language: string = "English"): Promise<string> {
  const translatedPrompt =
    language === "Korean"
      ? `다음 내용을 한국어로 간결하게 요약해줘:\n${prompt}`
      : language === "Spanish"
      ? `Resume brevemente el siguiente contenido en español:\n${prompt}`
      : `Briefly summarize the following content:\n${prompt}`;

  try {
    const response = await axios.post(
      WRTN_API_URL,
      {
        prompt: translatedPrompt,
        model: "claude-3-haiku", // 필요한 모델로 변경 가능
        max_tokens: 500,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${WRTN_API_KEY}`,
        },
      }
    );

    return response.data?.completion || "No summary generated.";
  } catch (err) {
    console.error("❌ Claude API 호출 실패:", err);
    return "Claude API 호출 실패.";
  }
}
