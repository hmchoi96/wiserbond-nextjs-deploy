export type BigPromptParams = {
    topic: string;
    industry: string;
    country: string;
    current_date: string;
    language: string;
    situation?: string;
    goal?: string;
    industry_detail?: string;
    followup_questions?: string[];
    followup_answers?: string[];
    academicContext: string;
    is_pro?: boolean;
  };
  
  export function getBigPrompt(params: BigPromptParams): string {
    const {
      topic,
      industry,
      country,
      current_date,
      language,
      situation = "",
      goal = "",
      industry_detail = "",
      followup_questions = [],
      followup_answers = [],
      academicContext,
      is_pro = false
    } = params;
  
    const tone_instruction = is_pro
      ? "Use technical, domain-specific language relevant to professionals in the selected industry. Avoid oversimplified explanations. Assume the reader is familiar with industry terminology."
      : "Use clear, easy-to-understand language suitable for non-experts. Explain terms where necessary.";
  
    const safe = (value: string) => value?.trim() || "[Not provided]";
  
    const followup_qna = followup_questions.map((q, i) => {
      const answer = followup_answers?.[i]?.trim() || "[No answer provided]";
      return `- Q: ${q}\n  A: ${answer}`;
    });
  
    const followup_section =
      followup_qna.length > 0
        ? followup_qna.join("\n")
        : "[No follow-up questions were generated or selected]";
  
    return `
  You are a senior macroeconomist working at an international institution.
  Your task is to provide a structural analysis of how the macroeconomic topic '${topic}' affects the ${industry} sector in ${country}.
  
  The user has provided the following context:
  - Current Situation: ${safe(situation)}
  - Goal of Analysis: ${safe(goal)}
  - Sub-sector Detail: ${safe(industry_detail)}
  
  The user may also have provided follow-up questions and partial answers to deepen the analysis.
  Only use follow-up answers that are explicitly provided.
  
  # Follow-up Q&A:
  ${followup_section}
  
  # Academic Context Insights:
  ${academicContext}
  Use the following academic insights to support your structural reasoning.
  You may cite them to justify long-term economic mechanisms, policy impacts, or structural correlations.
  Do not summarize them directly — instead, incorporate their logic into your own framing.
  
  ${tone_instruction}
  
  Your response must:
  - Be written entirely in ${language}, as selected by the user.
  - Reflect the most recent available institutional outlooks, especially from 2024 Q4 or 2025 Q1.
  - Base your interpretation on conditions as of ${current_date}.
  - Focus on structural impacts on the ${industry} sector in ${country}.
  - Use logical cause-effect phrasing where relevant (e.g., "Tariff → cost rise → margin pressure").
  - Include at least one source or report by name (with full URL when available).
  - Avoid sentiment scoring or subjective expressions.
  
  If no meaningful recent institutional data exists:
  - Fallback to a structurally similar macroeconomic episode.
  - Clearly state that this is a fallback case.
  - Explain why that historical event is comparable.
  - Compare core structural conditions such as:
      - Central bank posture
      - Stage of globalization
      - Market interlinkage or capital flow structure
  - Clarify how this comparison helps interpret today's global macro environment.
  
  Topic: ${topic}  
  Industry: ${industry}  
  Country: ${country}
  `.trim();
  }
  