export type ExecutiveSummaryParams = {
    topic: string;
    industry: string;
    country: string;
    language: string;
    current_date: string;
    big_picture: string;
    mid_picture: string;
    small_picture: string;
    interpretation: string;
    is_pro?: boolean;
  };
  
  export function getExecutiveSummaryPrompt(params: ExecutiveSummaryParams): string {
    const {
      topic,
      industry,
      country,
      language,
      current_date,
      big_picture,
      mid_picture,
      small_picture,
      interpretation,
      is_pro = false
    } = params;
  
    const tone_instruction = is_pro
      ? "Use technical, domain-specific language relevant to professionals in the selected industry. Avoid oversimplified explanations. Assume the reader is familiar with industry terminology."
      : "Use clear, easy-to-understand language suitable for non-experts. Explain terms where necessary.";
  
    return `
  You are an executive strategy consultant.
  
  Generate a concise executive summary as of ${current_date}, based on the following multi-level analysis of the macroeconomic topic '${topic}' and its impact on the ${industry} sector in ${country}.
  
  # Input Summaries:
  Big Picture:
  ${big_picture}
  
  Mid Picture:
  ${mid_picture}
  
  Small Picture:
  ${small_picture}
  
  Interpretation:
  ${interpretation}
  
  ${tone_instruction}
  
  # Instructions:
  - Write in ${language}, which is selected by the user. Do not answer in English unless English is selected.
  - (Not required, but) consider using bullet points if clarity improves.
  - Limit your summary to **3–5 sentences**, suitable for an executive dashboard or report header.
  - Focus on the most actionable, directional implications from the combined analysis.
  - If any insights were inferred from fallback or historical comparisons due to lack of recent data, briefly indicate this.
  - Do NOT include citations, detailed explanations, or qualifiers unless essential to the message.
  - Maintain a high-level, strategic tone. Avoid emotional or editorial framing.
  - Your response should resemble an executive memo, not a paragraph-style article.
  `.trim();
  }
  