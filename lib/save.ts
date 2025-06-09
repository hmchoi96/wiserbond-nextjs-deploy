import { supabase } from "@/lib/supabase";

// ✅ URL 기반 APA reference 추출 함수
function extractAPAReferencesFromText(texts: string[]): string[] {
  const urlRegex = /(https?:\/\/[^\s)]+)/g;
  const references = new Set<string>();

  texts.forEach(text => {
    const matches = text.match(urlRegex);
    if (matches) {
      matches.forEach(url => {
        references.add(`Source: ${url}`);
      });
    }
  });

  return Array.from(references);
}

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
  // ✅ 1. 참조 URL 추출
  const allTexts = [big, mid, small, interpretation, executive];
  const references = extractAPAReferencesFromText(allTexts);

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
      created_at: current_date,
      last_checked: current_date,
      recap_needed: false,
      actual_outcome: null,
      prediction_accuracy: null,
      followup_responses: JSON.stringify(followup_answers),
      goal,
      situation,
      industry_detail,
      reference_list: references.join("\n") // ✅ 수정된 필드명
    }
  ]);

  if (error) throw new Error(`Supabase insert error: ${error.message}`);
}
