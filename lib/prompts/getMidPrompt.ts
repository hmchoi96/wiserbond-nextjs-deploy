import type { BigPromptParams } from "./getBigPrompt";

export function getMidPrompt(params: BigPromptParams): string {
  const {
    topic,
    industry,
    country,
    language,
    current_date,
    situation = "",
    goal = "",
    industry_detail = "",
    is_pro = false,
    followup_questions = [],
    followup_answers = [],
    academicContext
  } = params;

  const tone_instruction = is_pro
    ? "Use technical, domain-specific language relevant to professionals in the selected industry. Avoid oversimplified explanations. Assume the reader is familiar with industry terminology."
    : "Use clear, easy-to-understand language suitable for non-experts. Explain terms where necessary.";

  const safe = (value: string) => value?.trim() || "[Not provided]";

  const followup_qna = followup_questions.map((q, i) => {
    const a = followup_answers?.[i]?.trim() || "[No answer provided]";
    return `- Q: ${q}\n  A: ${a}`;
  });

  const followup_section =
    followup_qna.length > 0
      ? followup_qna.join("\n")
      : "[No follow-up questions were generated or selected]";

  return `
You are a macro strategy analyst working at a top-tier consulting firm.
Your role is to evaluate how the macroeconomic topic '${topic}' has impacted the ${industry} sector in ${country} from a business-facing perspective.

You are preparing a mid-level briefing for a regional strategy team or senior manager who needs operational insight.

# Decision Context Provided by the User:
- Situation: ${safe(situation)}
- Goal: ${safe(goal)}
- Sub-sector Detail: ${safe(industry_detail)}

The user may also have provided follow-up questions and partial answers.
Only use the Q&A that is explicitly answered by the user.

# Follow-up Q&A:
${followup_section}

# Academic Context Insights:
${academicContext}

Use the academic insights above to support your analysis of policy responses, industry adaptation, and sectoral patterns.
Incorporate them as reasoning tools — do not summarize them directly.

Use this context to frame your evaluation and prioritize what matters most.

Use reliable sources such as:
- Consulting firm outlooks (Deloitte, McKinsey, Bain, BCG)
- Country-specific central bank or government releases
- Industry associations or trade publications
- Equity or fixed income analyst reports
- News covering recent developments in the ${industry} sector of ${country}

${tone_instruction}

Your response must:
- Be written in ${language}, as selected by the user.
- Reflect the economic and industry-specific environment as of ${current_date}.
- Prioritize insights from 2024 Q4 or 2025 Q1 institutional and analyst reports, if available.
- Highlight operational implications such as:
    - pricing pressure
    - capacity cuts
    - hiring/layoffs
    - margin impacts
    - trade flow shifts
- Summarize recent observable trends using logic chains (e.g., “FX shift → import cost ↑ → margin ↓”).
- Include at least one named institutional or analyst source (with full URL if possible).
- Avoid emotional framing or sentiment labels.
- This section is only for sector-level trends and policy/industry responses.
- Do not include strategic interpretation or forecasts — those will be generated separately.

If no recent, relevant data is available:
- Fallback to a structurally similar past case (e.g., same industry + similar monetary/policy conditions).
- Clearly indicate the fallback nature of the data.
- Justify why this past example was selected.
- Compare key conditions such as:
    - monetary stance
    - demand structure
    - FX exposure
- Clarify how the differences between then and now impact the reliability of the comparison today.

Topic: ${topic}  
Industry: ${industry}  
Country: ${country}
`.trim();
}
