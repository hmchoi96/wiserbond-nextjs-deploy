/**
 * 아래 코드는 예시 코드임
 * 더미 버전, 나중에 대체 가능
 * 임시 실제 결과 생성 함수
 * TODO: FRED API, 뉴스 등 연결해서 자동화할 예정
 */
 export async function getActualOutcome(
    topic: string,
    country: string,
    industry: string
  ): Promise<{ summary: string; date: string } | null> {
    // 임시 데이터: 실제는 API나 크롤링을 통해 불러와야 함
    const today = new Date();
  
    const examples: Record<string, string> = {
      "China GDP": "China's GDP rebounded by 5.1% YoY in Q1 2025",
      "Inflation": "Inflation fell to 2.8% in Canada in April 2025",
      "Unemployment": "US unemployment dropped to 4.1% in May 2025",
    };
  
    const matchedTopic = Object.keys(examples).find(key =>
      topic.toLowerCase().includes(key.toLowerCase())
    );
  
    if (!matchedTopic) {
      console.warn(`❗ No actual data available for topic: ${topic}`);
      return null;
    }
  
    return {
      summary: examples[matchedTopic],
      date: today.toISOString().split("T")[0] // 날짜만
    };
  }
  