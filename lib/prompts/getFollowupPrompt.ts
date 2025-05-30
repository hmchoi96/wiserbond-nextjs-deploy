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
You are an expert strategy advisor. Based on the following business context, generate 3–5 thought-provoking follow-up questions that challenge assumptions or open up new decision paths.

Context:
- Topic: ${topic}
- Industry: ${industry}
- Country: ${country}
${subIndustry ? `- Sub-sector: ${subIndustry}` : ""}
${goal ? `- Goal: ${goal}` : ""}
${situation ? `- Situation: ${situation}` : ""}

Instructions:
- Push for clarity and insight—questions should explore unknowns or risks.
- Encourage comparative thinking (e.g. before vs after, alternative paths).
- Return the questions as markdown-style bullet points (•).
- Keep questions concise but deep.
- Language: ${language}
`;
}