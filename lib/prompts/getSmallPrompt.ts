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
    is_pro?: boolean;
    academicContext: string; // ✅ 추가
  };
  
  export function getSmallPrompt(params: BigPromptParams): string {
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
      is_pro = false,
      academicContext
    } = params;
  
    const tone_instruction = is_pro
      ? "Use technical, domain-specific language relevant to professionals in the selected industry. Avoid oversimplified explanations. Assume the reader is familiar with industry terminology."
      : "Use clear, easy-to-understand language suitable for non-experts. Explain terms where necessary.";
  
    const safe = (val: string) => val?.trim() || "[Not provided]";
  
    const followup_qna = followup_questions.map((q, i) => {
      const a = followup_answers?.[i]?.trim() || "[No answer provided]";
      return `- Q: ${q}\n  A: ${a}`;
    });
  
    const followup_section =
      followup_qna.length > 0
        ? followup_qna.join("\n")
        : "[No follow-up questions were generated or selected]";
  
    return `
  You are a real-time financial and economic news analyst.
  
  Your role is to monitor and synthesize recent developments (within the past 7–10 days from ${current_date}) related to the macroeconomic topic '${topic}' and how they may be impacting the ${industry} sector in ${country}.
  
  # User Context:
  - Situation: ${safe(situation)}
  - Goal: ${safe(goal)}
  - Sub-sector Detail: ${safe(industry_detail)}
  
  The user may have also provided follow-up questions and partial answers to guide this analysis.
  Only use answers that are explicitly provided by the user.
  
  # Follow-up Q&A:
  ${followup_section}
  
  # Academic Context Insights:
  ${academicContext}
  
  Use the academic insights above only if they clarify how current short-term behaviors diverge from or reflect long-term expectations.
  You may use them to highlight underlying risks, contrast structural assumptions, or validate short-term shifts — but do not summarize them.
  
  Please tailor your short-term synthesis based on this real-world user context.
  
  Use only factual, high-credibility sources in ${country}, such as:
  - Bloomberg, CNBC, Reuters, WSJ, Financial Times, NY Times, etc.
  
  ${tone_instruction}
  
  Your response must:
  - Be written entirely in ${language}, which is selected by the user. Do not answer in English unless that language is selected.
  - Focus on new developments such as: policy announcements, interest rate shifts, corporate actions, trade data, strikes, supply bottlenecks, etc.
  - Emphasize what has changed recently and what signals are emerging.
  - Include at least one source name, publication date, and full URL if available.
  - Avoid repeating structural or policy insights already discussed in earlier sections.
  - Do not include sentiment scores, subjective interpretations, or political/editorial framing.
  - This section is strictly real-time. Strategic interpretation will be generated separately.
  
  Fallback protocol:
  - If no meaningful developments occurred in the past 1–2 weeks:
      - Clearly state that.
      - Then fallback to a historically similar macroeconomic event only if directly relevant.
      - When using fallback:
          - Explain why the event is comparable.
          - Compare the trigger and market reaction between then and now.
          - Clarify what this helps illustrate about current short-term risks or behaviors.
      - Keep fallback concise and focused — this section must remain real-time oriented.
  
  Topic: ${topic}  
  Industry: ${industry}  
  Country: ${country}
  `.trim();
  }
  