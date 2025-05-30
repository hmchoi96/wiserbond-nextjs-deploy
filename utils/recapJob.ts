import { supabase } from "@/lib/supabase";
import { evaluateForecastAccuracy } from "./recap/recapEvaluator";
import { getActualOutcome } from "./getActualOutcome";


const db = supabase;

export async function runRecapJob() {
  const today = new Date();

  // Step 1: 리캡 대상 리포트 불러오기
  const { data: reports, error } = await db
    .from("reports")
    .select("*")
    .eq("recap_needed", true)
    .is("recap_done", null);

  if (error || !reports || reports.length === 0) {
    console.log("🔍 No eligible reports to evaluate.");
    return;
  }

  for (const report of reports) {
    const createdAt = new Date(report.created_at);
    const forecastWindow = report.forecast_window ?? "3M";

    // 예측 시점 + forecast_window 기준 날짜 계산
    const deadline = new Date(createdAt);
    if (forecastWindow.includes("12")) deadline.setMonth(deadline.getMonth() + 12);
    else if (forecastWindow.includes("6")) deadline.setMonth(deadline.getMonth() + 6);
    else deadline.setMonth(deadline.getMonth() + 3);

    // 아직 기간 도래 전이면 skip
    if (today < deadline) continue;

    // Step 2: 실제 결과 불러오기 (자동화 or 더미)
    const actual = await getActualOutcome(report.topic, report.country, report.industry);

    if (!actual || !actual.summary || !actual.date) continue;

    // Step 3: 정확도 평가
    const result = evaluateForecastAccuracy({
      predicted: report.interpretation,
      actual: actual.summary,
      forecastWindow,
      datePublished: new Date(report.created_at),
      dateObserved: new Date(actual.date),
    });

    // Step 4: DB 업데이트
    await db.from("reports").update({
      actual_outcome: actual.summary,
      actual_date: actual.date,
      prediction_accuracy: result.finalAccuracy,
      recap_done: true,
      last_checked: today.toISOString()
    }).eq("id", report.id);

    console.log(`✅ Recap completed for report ID ${report.id} - Accuracy: ${result.finalAccuracy}%`);
  }
}
