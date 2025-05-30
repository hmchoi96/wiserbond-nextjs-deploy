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
    forecast_window = 90, // default: 90일 후 recap 예정
    followup_answers = [],
    // 👇 새로 추가된 사용자 맥락 정보
    goal = "",
    situation = "",
    industry_detail = ""
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
      forecast_window,
      created_at: now,
      last_checked: now,
      recap_needed: false,
      actual_outcome: null,
      prediction_accuracy: null,
      followup_responses: JSON.stringify(followup_answers),
      goal,
      situation,
      industry_detail
    }
  ]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: "Saved successfully" });
}
