import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST method allowed" });
  }

  const {
    topic,
    industry,
    country,
    language,
    big,
    mid,
    small,
    interpretation,
    executive,
    user_email = "",
    forecast_window = "3M", // ✅ 문자열 기준 (예: "3M", "6M", etc.)
    followup_answers = [],
    goal = "",
    situation = "",
    industry_detail = "",
    support_sources = [] // ✅ 논문 출처 리스트 (array of { title, url, year, authors })
  } = req.body;

  const now = new Date().toISOString();

  const { error } = await supabase.from("reports").insert([
    {
      topic,
      industry,
      country,
      language,
      big,
      mid,
      small,
      interpretation,
      executive,
      user_email,
      forecast_window: String(forecast_window), // ✅ 보강: 항상 문자열로 저장
      created_at: now,
      last_checked: now,
      recap_needed: false,
      actual_outcome: null,
      prediction_accuracy: null,
      followup_responses: JSON.stringify(followup_answers), // ✅ JSON 배열로 직렬화
      goal,
      situation,
      industry_detail,
      support_sources: JSON.stringify(support_sources) // ✅ JSONB로 저장
    }
  ]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: "Saved successfully" });
}
