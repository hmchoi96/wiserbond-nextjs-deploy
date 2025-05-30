import type { NextApiRequest, NextApiResponse } from 'next';
import { callGPT } from '@/lib/gpt';
import { getContextualPapers } from '@/lib/getContextualPapers';
import { getProjectionPapers } from '@/lib/getProjectionPapers';

import { getBigPrompt } from '@/lib/prompts/getBigPrompt';
import { getMidPrompt } from '@/lib/prompts/getMidPrompt';
import { getSmallPrompt } from '@/lib/prompts/getSmallPrompt';
import { getInterpretationPrompt } from '@/lib/prompts/getInterpretationPrompt';
import { getExecutiveSummaryPrompt } from '@/lib/prompts/getExecutiveSummaryPrompt';
import { getFollowupPrompt } from '@/lib/prompts/getFollowupPrompt';
import saveReport from '@/lib/save';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("💥 Incoming method:", req.method); // ✅ 디버깅용

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST method allowed" });
  }

  const {
    topic,
    industry,
    country,
    language = "English",
    current_date = new Date().toISOString().split("T")[0],
    isPro = false,
    subIndustry = "",
    situation = "",
    goal = "",
    followup_questions = [],
    followup_answers = [],
    user_analysis = "",
    user_forecast = "",
    internal_comment = "",
    user_email = ""
  } = req.body;

  if (!topic || !industry || !country) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Step 1: Fetch Academic Papers
    const contextPapers = await getContextualPapers(
      topic, industry, country, subIndustry, situation, goal, followup_questions.join(" ")
    );
    const projectionPapers = await getProjectionPapers(
      topic, industry, country, subIndustry, situation, goal, followup_questions.join(" ")
    );

    const academicSummary = (papers: { title: string; summary: string; doi: string }[]) =>
      papers.map((p, i) => `Insight ${i + 1}: ${p.summary} (Source: ${p.doi})`).join('\n\n');

    const academicContext = academicSummary(contextPapers);
    const academicProjection = academicSummary(projectionPapers);

    // Step 2: Shared Prompt Parameters
    const sharedParams = {
      topic,
      industry,
      country,
      language,
      current_date,
      situation,
      goal,
      industry_detail: subIndustry,
      followup_questions,
      followup_answers,
      is_pro: isPro,
      academicContext
    };

    // Step 3: Generate Prompts and Call GPT
    const big = await callGPT(getBigPrompt(sharedParams), "gpt-4o");
    const mid = await callGPT(getMidPrompt(sharedParams), "gpt-4o");
    const small = await callGPT(getSmallPrompt(sharedParams), "gpt-4o");


    const interpretationPrompt = getInterpretationPrompt({
      ...sharedParams,
      academicProjection,
      big_picture: big,
      mid_picture: mid,
      small_picture: small,
      internal_comment,
      user_analysis,
      user_forecast
    });

    const interpretation = await callGPT(interpretationPrompt, "o3");

    const summaryPrompt = getExecutiveSummaryPrompt({
      ...sharedParams,
      big_picture: big,
      mid_picture: mid,
      small_picture: small,
      interpretation
    });

    const exec_summary = await callGPT(summaryPrompt, "gpt-4o");

    const followupPrompt = getFollowupPrompt({
      topic,
      industry,
      country,
      subIndustry,
      goal,
      situation,
      language
    });

    const followup = await callGPT(followupPrompt, "gpt-4o");

    // Step 4: Save to Supabase (uses current_date in DB)
    await saveReport({
      topic,
      industry,
      country,
      language,
      current_date,
      user_email,
      big,
      mid,
      small,
      interpretation,
      executive: exec_summary,
      followup_answers,
      goal,
      situation,
      industry_detail: subIndustry
    });

    // Step 5: Return result to frontend
    res.status(200).json({
      cards: [
        { id: "exec_summary", title: "Executive Summary", type: "summary", content: exec_summary },
        { id: "big", title: "Big Picture", type: "analysis", content: big },
        { id: "mid", title: "Mid Picture", type: "analysis", content: mid },
        { id: "small", title: "Small Picture", type: "news", content: small },
        { id: "interpretation", title: "Strategic Outlook", type: "insight", content: interpretation }
      ],
      followup
    });
  } catch (error) {
    console.error("🔥 Error in /api/generate:", error);
    res.status(500).json({ error: "Internal server error", details: String(error) });
  }
}
