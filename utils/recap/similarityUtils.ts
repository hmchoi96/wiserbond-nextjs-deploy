/**
 * 두 문장의 의미 유사도(단순 토큰 겹침 기반)를 계산
 * @param predicted 예측 문장
 * @param actual 실제 결과 문장
 * @returns 0 ~ 1 사이 유사도 점수
 */
 export function computeSemanticSimilarity(predicted: string, actual: string): number {
  // 1. 문자열 전처리 및 토큰화
  const normalize = (text: string): string[] =>
    text.toLowerCase().replace(/[^a-z0-9 ]/gi, '').split(' ').filter(Boolean);

  const predictedTokens = normalize(predicted);
  const actualTokens = normalize(actual);

  if (predictedTokens.length === 0 || actualTokens.length === 0) return 0;

  // 2. Set으로 중복 제거
  const pWords = new Set(predictedTokens);
  const aWords = new Set(actualTokens);

  // 3. 겹치는 단어 수 계산
  const overlap = Array.from(pWords).filter(word => aWords.has(word));
  const score = overlap.length / Math.max(pWords.size, aWords.size);

  return score;
}
