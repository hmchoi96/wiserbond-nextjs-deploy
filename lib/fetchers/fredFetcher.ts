// lib/fetchers/fredFetcher.ts

export async function fetchFREDSeries(series_id: string): Promise<number | null> {
    const apiKey = process.env.FRED_API_KEY;
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series_id}&api_key=${apiKey}&file_type=json`;
  
    try {
      const res = await fetch(url);
      const json = await res.json();
  
      if (!json.observations || json.observations.length === 0) return null;
  
      // 최신 유효 값 찾기
      const latestValid = [...json.observations].reverse().find(obs => obs.value !== ".");
      return latestValid ? parseFloat(latestValid.value) : null;
    } catch (err) {
      console.error("FRED fetch error:", err);
      return null;
    }
  }
  