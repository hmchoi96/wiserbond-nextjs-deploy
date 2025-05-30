// lib/recap.ts

import { supabase } from "@/lib/supabase";
import { shouldRecap, fetchActualOutcome, calculateAccuracy } from "./recapUtils";

export async function runRecap() {
  const { data: reports, error } = await supabase
    .from("reports")
    .select("*")
    .eq("recap_needed", true);

  if (error || !reports) {
    console.error("Error fetching reports:", error);
    return;
  }

  for (const report of reports) {
    if (!shouldRecap(report)) continue;

    const actual = await fetchActualOutcome(report.topic, report.country);
    if (!actual) continue;

    const accuracy = calculateAccuracy(report.interpretation, actual);

    const { error: updateError } = await supabase
      .from("reports")
      .update({
        actual_outcome: actual,
        prediction_accuracy: accuracy,
        last_checked: new Date().toISOString(),
        recap_needed: false
      })
      .eq("id", report.id);

    if (updateError) {
      console.error(`Update failed for report ID ${report.id}:`, updateError);
    }
  }
}
