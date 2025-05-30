// 📌 내부 유틸 함수: forecast window 문자열을 개월 수로 변환
function parseForecastWindow(window: string): number {
    const lower = window?.toLowerCase() || '';
  
    if (lower.includes('12')) return 12;
    if (lower.includes('6')) return 6;
    if (lower.includes('3')) return 3;
    return 3; // 기본값
  }
  
  // 📌 내부 유틸 함수: 단어 기반 유사도 측정
  function computeSemanticSimilarity(predicted: string, actual: string): number {
    const normalize = (text: string) =>
      text.toLowerCase().replace(/[^a-z0-9 ]/gi, '').split(' ');
  
    const pWords = new Set(normalize(predicted));
    const aWords = new Set(normalize(actual));
  
    const overlap = [...pWords].filter(word => aWords.has(word));
    const score = overlap.length / Math.max(pWords.size, aWords.size);
  
    return score;
  }
  
  // 📌 리캡 평가 핵심 함수
  export function evaluateForecastAccuracy({
    predicted,
    actual,
    forecastWindow,
    datePublished,
    dateObserved
  }: {
    predicted: string;
    actual: string;
    forecastWindow: string;      // 예: "3M", "6M"
    datePublished: Date;         // 예측 리포트 작성 시점
    dateObserved: Date;          // 실제 결과가 나온 시점
  }): {
    similarityScore: number;
    timeDeviation: number;       // 예측 기간에서 얼마나 벗어났는지 (%)
    finalAccuracy: number;       // 총합 정확도 점수 (%)
  } {
    const simScore = computeSemanticSimilarity(predicted, actual); // 0 ~ 1
  
    const expectedMonths = parseForecastWindow(forecastWindow);
    const expectedTimeMs = expectedMonths * 30 * 24 * 60 * 60 * 1000; // rough month 기준
    const actualTimeMs = Math.abs(dateObserved.getTime() - datePublished.getTime());
  
    const timeDiffRatio = Math.min(actualTimeMs / expectedTimeMs, 2); // cap at 200%
    const timePenalty = 1 - Math.max(0, (timeDiffRatio - 1)); // 1 이하인 경우만 감점
  
    const finalScore = Math.max(0, Math.min(1, simScore * timePenalty)); // 0 ~ 1
  
    return {
      similarityScore: +(simScore * 100).toFixed(1),      // 퍼센트 (%)
      timeDeviation: +((timeDiffRatio - 1) * 100).toFixed(1), // 초과 비율 (%)
      finalAccuracy: +(finalScore * 100).toFixed(1)       // 최종 예측 적중률
    };
  }
  