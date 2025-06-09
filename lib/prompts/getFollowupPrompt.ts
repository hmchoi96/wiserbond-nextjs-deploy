type FollowupPromptParams = {
  topic: string;
  industry: string;
  country: string;
  subIndustry?: string;
  goal?: string;
  situation?: string;
  language?: string;
};

export function getFollowupPrompt({
  topic,
  industry,
  country,
  subIndustry = "",
  goal = "",
  situation = "",
  language = "English"
}: FollowupPromptParams) {
  return `
You are a strategic research assistant helping to generate a personalized macroeconomic insight report.

Based on the following user-provided context, generate 3–5 clarifying questions to gather missing information that could improve the relevance and accuracy of the report.

Context:
- Topic: ${topic}
- Industry: ${industry}
- Country: ${country}
${subIndustry ? `- Sub-sector: ${subIndustry}` : ""}
${goal ? `- Goal: ${goal}` : ""}
${situation ? `- Situation: ${situation}` : ""}

Instructions:
- Focus on what *you still need to know* to improve the report quality.
- Ask about user constraints, timeline, specific focus, or organizational context.
- Do NOT ask opinion-based or brainstorming-style questions.
- The questions should help you understand their specific situation more clearly.
- Write 3–5 questions, using markdown-style bullet points (•).
- Keep questions short, clear, and factual.
- Language: ${language}
`;
}
