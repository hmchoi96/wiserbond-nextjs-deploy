/**
 * Wiserbond 예측 정확도 계산기
 * @returns 0 ~ 100 (%)
 */
 import { computeSemanticSimilarity } from './similarityUtils';

 export function calculatePredictionAccuracy({
    predicted,
    actual,
    predictedDate,
    forecastWindowMonths,
    actualDate,
  }: {
    predicted: string;
    actual: string;
    predictedDate: Date;
    forecastWindowMonths: number;
    actualDate: Date;
  }): number {
    // 1. 내용 유사도 (텍스트 유사도, 0~1)
    const contentScore = computeSemanticSimilarity(predicted, actual);
  
    // 2. 예측 시점 기준 예상 날짜 계산
    const targetDate = new Date(predictedDate);
    targetDate.setMonth(targetDate.getMonth() + forecastWindowMonths);
  
    const monthDiff = Math.abs(
      (actualDate.getFullYear() - targetDate.getFullYear()) * 12 +
      (actualDate.getMonth() - targetDate.getMonth())
    );
  
    let timeScore = 0;
    if (monthDiff === 0) timeScore = 1;
    else if (monthDiff === 1) timeScore = 0.5;
    else timeScore = 0;
  
    const accuracy = (contentScore * 0.5) + (timeScore * 0.5);
  
    return Math.round(accuracy * 100);
  }
  