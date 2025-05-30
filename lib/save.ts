// lib/save.ts

import { supabase } from "@/lib/supabase";

export default async function saveReport({
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
  current_date = new Date().toISOString().split("T")[0],
  forecast_window = 90,
  followup_answers = [],
  goal = "",
  situation = "",
  industry_detail = ""
}: {
  topic: string;
  industry: string;
  country: string;
  language: string;
  big: string;
  mid: string;
  small: string;
  interpretation: string;
  executive: string;
  user_email?: string;
  current_date?: string;
  forecast_window?: number;
  followup_answers?: string[];
  goal?: string;
  situation?: string;
  industry_detail?: string;
}) {
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
      created_at: current_date,    // ✅ 실제 사용
      last_checked: current_date,  // ✅ 실제 사용
      recap_needed: false,
      actual_outcome: null,
      prediction_accuracy: null,
      followup_responses: JSON.stringify(followup_answers),
      goal,
      situation,
      industry_detail
    }
  ]);

  if (error) throw new Error(`Supabase insert error: ${error.message}`);
}
