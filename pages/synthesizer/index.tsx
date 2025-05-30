import { useState } from "react";
import ReportSection from "@/components/ReportSection";

interface ReportCard {
  id: string;
  title: string;
  type: string;
  content: string;
}

export default function SynthesizerPage() {
  const [topic, setTopic] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("English");
  const [isPro, setIsPro] = useState(false);
  const [goal, setGoal] = useState("");
  const [situation, setSituation] = useState("");
  const [industryDetail, setIndustryDetail] = useState("");
  const [followupAnswers, setFollowupAnswers] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [resultCards, setResultCards] = useState<ReportCard[]>([]);
  const [followup, setFollowup] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          industry,
          country,
          language,
          isPro,
          goal,
          situation,
          subIndustry: industryDetail,
          followup_answers: followupAnswers
        })
      });

      const rawText = await res.text();
      const data = JSON.parse(rawText);
      setResultCards(data.cards || []);
      setFollowup(""); // reset followup
    } catch (err) {
      console.error("⚠️ Generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowupOnly = async () => {
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          industry,
          country,
          language,
          goal,
          situation,
          subIndustry: industryDetail,
          isPro,
          followup_answers: []
        })
      });

      const raw = await res.json();
      setFollowup(raw.followup || "");
    } catch (err) {
      console.error("⚠️ Follow-up generation failed:", err);
    }
  };

  const handleFollowupChange = (index: number, value: string) => {
    const updated = [...followupAnswers];
    updated[index] = value;
    setFollowupAnswers(updated);
  };

  return (
    <div className="min-h-screen bg-[#f4f4f5] text-black">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Wiserbond Synthesizer</h1>

        <div className="p-4 border bg-yellow-100 rounded text-sm text-yellow-800">
          This tool tells how a macro topic affects an industry in a country, explained in your preferred language.
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-black">Macro Topic</span>
            <input
              className="w-full border p-2 rounded mt-1 text-black bg-white"
              placeholder="e.g., Inflation, Trade War, Fed Policy"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-black">Industry/Sector</span>
            <input
              className="w-full border p-2 rounded mt-1 text-black bg-white"
              placeholder="e.g., Supply Chain, Real Estate"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-black">Country</span>
            <input
              className="w-full border p-2 rounded mt-1 text-black bg-white"
              placeholder="e.g., Canada, Germany, India"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </label>

          <details className="border p-3 rounded bg-white text-black">
            <summary className="cursor-pointer font-semibold">Refine your context to get a more focused report (optional)</summary>
            <div className="mt-4 space-y-3">
              <input
                className="w-full border p-2 rounded bg-white text-black"
                placeholder="What decision are you trying to make? (Your goal)"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
              <input
                className="w-full border p-2 rounded bg-white text-black"
                placeholder="Is there a recent event driving this? (Your situation)"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
              />
              <input
                className="w-full border p-2 rounded bg-white text-black"
                placeholder="What specific industry or sub-sector is this related to?"
                value={industryDetail}
                onChange={(e) => setIndustryDetail(e.target.value)}
              />
            </div>
          </details>

          <label className="block">
            <span className="text-sm font-medium text-black">Output Language</span>
            <select
              className="w-full border p-2 rounded mt-1 text-black bg-white"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="English">English</option>
              <option value="Korean">Korean</option>
              <option value="Spanish">Spanish</option>
              <option value="Indian">Indian</option>
              <option value="Chinese">Chinese</option>
            </select>
          </label>

          <label className="flex items-center gap-2">
            <span className="text-sm text-black">Turn on Pro Mode for expert-level depth and technical precision (optional)</span>
            <input
              type="checkbox"
              checked={isPro}
              onChange={() => setIsPro(!isPro)}
            />
            <span className="text-sm text-black">I’m familiar with this industry (Pro mode)</span>
          </label>

          <button
            onClick={handleGenerate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            disabled={loading}
          >
            {loading ? "Generating your personalized report..." : "Generate Report"}
          </button>

          <button
            onClick={handleFollowupOnly}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 w-full"
            disabled={loading}
          >
            Generate Follow-Up Questions
          </button>
        </div>

        <div className="space-y-4">
          {resultCards.map((card) => (
            <ReportSection
              key={card.id}
              id={card.id}
              title={card.title}
              content={card.content}
            />
          ))}

          {followup && (
            <div className="mt-6 p-4 border border-blue-200 bg-blue-50 rounded text-black">
              <h2 className="font-bold text-lg text-blue-900 mb-2">
                Please answer these follow-up questions to improve report quality:
              </h2>
              <p className="text-sm text-blue-800 whitespace-pre-line mb-4">
                {followup}
              </p>
              <div className="space-y-2">
                {followup
                  .split("\n")
                  .filter((line) => line.trim().startsWith("-") || line.trim().startsWith("•"))
                  .map((q, idx) => (
                    <textarea
                      key={idx}
                      className="w-full border p-2 rounded bg-white text-black"
                      placeholder={`Your answer to: ${q.replace(/^[-•]/, "").trim()}`}
                      value={followupAnswers[idx] || ""}
                      onChange={(e) => handleFollowupChange(idx, e.target.value)}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
