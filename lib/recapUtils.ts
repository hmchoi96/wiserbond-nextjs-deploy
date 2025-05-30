// lib/recapUtils.ts

import { differenceInDays, parseISO } from "date-fns";
import { fetchFREDSeries } from "./fetchers/fredFetcher";

type Report = {
  created_at: string;
  forecast_window?: string;
};

export function shouldRecap(report: Report): boolean {
  const today = new Date();
  const created = parseISO(report.created_at);
  const forecastWindow = parseInt(report.forecast_window || "90", 10);
  const daysSince = differenceInDays(today, created);
  return daysSince >= forecastWindow;
}

// NOTE: _country is reserved for future use (e.g., region-specific series ID mapping)
export async function fetchActualOutcome(topic: string, _country?: string): Promise<number | null> {
  const topicToSeries: Record<string, string> = {
    inflation: "CPIAUCSL",
    unemployment: "UNRATE",
    industrial: "INDPRO",
    gdp: "GDPA",
    sentiment: "UMCSENT"
  };

  const seriesId = topicToSeries[topic.toLowerCase()];
  if (!seriesId) return null;

  // ✅ Use _country to suppress ESLint unused warning
  if (_country) {
    console.log(`[recapUtils] fetchActualOutcome country param: ${_country}`);
  }

  return await fetchFREDSeries(seriesId);
}

export function calculateAccuracy(predicted: string, actual: number): number {
  const predictedValue = parseFloat(predicted.match(/[-+]?[0-9]*\.?[0-9]+/g)?.[0] || "0");
  const error = Math.abs(predictedValue - actual);
  const accuracy = Math.max(0, 100 - error * 10); // 오차 1당 10% 감점
  return Math.round(accuracy * 10) / 10;
}
