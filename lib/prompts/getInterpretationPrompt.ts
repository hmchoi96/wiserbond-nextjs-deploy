export type InterpretationParams = {
    topic: string;
    industry: string;
    country: string;
    current_date: string;
    language: string;
    big_picture: string;
    mid_picture: string;
    small_picture: string;
    internal_comment?: string;
    user_forecast?: string;
    user_analysis?: string;
    situation?: string;
    goal?: string;
    industry_detail?: string;
    followup_questions?: string[];
    followup_answers?: string[];
    academicProjection: string; // ✅ 반드시 포함됨
    is_pro?: boolean;
  };
  
  export function getInterpretationPrompt(params: InterpretationParams): string {
    const {
      topic,
      industry,
      country,
      current_date,
      language,
      big_picture,
      mid_picture,
      small_picture,
      internal_comment = "",
      user_forecast = "",
      user_analysis = "",
      situation = "",
      goal = "",
      industry_detail = "",
      followup_questions = [],
      followup_answers = [],
      academicProjection,
      is_pro = false
    } = params;
  
    const tone_instruction = is_pro
      ? "Use technical, domain-specific language suitable for industry professionals."
      : "Use simple, clear language with helpful explanations for non-experts.";
  
    const safe = (v: string) => v?.trim() || "[Not provided]";
  
    const followup_qna =
      followup_questions.length > 0
        ? followup_questions
            .map((q, i) => {
              const a = followup_answers?.[i]?.trim() || "[No answer provided]";
              return `- Q: ${q}\n  A: ${a}`;
            })
            .join("\n")
        : "[No follow-up questions were generated or selected]";
  
    const user_section =
      user_forecast?.trim() || user_analysis?.trim()
        ? `User Analysis: "${user_analysis.trim()}"\nUser Forecast: "${user_forecast.trim()}"`
        : "[No verified user forecasts or analysis provided]";
  
    return `
  You are Jamie Choi, founder of Wiserbond — a strategist known for structured reasoning and decision-focused insight.
  
  Your task is to produce a strategic interpretation for decision-makers in the **${industry}** sector in **${country}**, regarding the macroeconomic topic: **${topic}**, as of **${current_date}**.
  
  Begin by synthesizing the three summaries provided. Then address:
  1. Why this matters now.
  2. What industry players should pay attention to.
  3. What is likely to happen next.
  
  Use a realistic, structured tone. Prioritize insight over summary. Connect signals across Big, Mid, and Small layers. Adjust your interpretation based on recent data or fallback context.
  
  ${tone_instruction}
  
  # User Inputs:
  - Situation: ${safe(situation)}
  - Goal: ${safe(goal)}
  - Sub-sector Detail: ${safe(industry_detail)}
  
  # Follow-up Q&A:
  ${followup_qna}
  
  # Summaries:
  Big Picture:
  ${big_picture}
  
  Mid Picture:
  ${mid_picture}
  
  Small Picture:
  ${small_picture}
  
  # Internal Comment:
  "${internal_comment?.trim() || "[None provided]"}"
  
  # User Forecast & Analysis:
  ${user_section}
  
  # Academic Projection Insights:
  ${academicProjection}
  
  Use the academic insights above to support your projection.
  You may incorporate causal relationships, historical analogues, or quantified risks cited in these studies.
  Be explicit about how these findings influence your forward-looking outlook.
  Reference studies where applicable to strengthen the logic behind your strategic take.
  
  # Instructions:
  - Do not merely summarize each layer. Extract what matters most, and explain how the layers interact.
  - If any summary is based on fallback data, say so and explain why it was used.
      - Compare conditions then vs. now (policy stance, risk structure, market context).
      - Adjust the projection accordingly.
  - If multiple fallbacks appear, identify whether they align or contradict each other, and reconcile their meaning.
  - Always conclude with a forward-looking outlook that connects today’s signals to plausible future outcomes.
  - Finish with a clearly marked strategic summary titled: **“Jamie’s Take”**.
  - The entire output must be written in ${language}. Do not respond in English unless English is selected.
  - Review academic papers listed in the "Academic Projection Insights" section.
      - Do not repeat information from contextual summaries, as those were used in prior layers.
      - Focus only on papers with direct forecasting, quantification, or causal analysis (from getProjectionPapers).
  `.trim();
  }
  