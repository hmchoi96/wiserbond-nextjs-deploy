import { useState, useEffect } from "react";
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
  const [stepIndex, setStepIndex] = useState(0);
  const [resultCards, setResultCards] = useState<ReportCard[]>([]);
  const [followup, setFollowup] = useState("");

  const steps = [
    "Fetching recent economic papers...",
    "Analyzing relevant news...",
    "Summarizing institutional forecasts...",
    "Synthesizing insights for your industry...",
    "Finalizing your report..."
  ];

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setStepIndex((prev) => (prev + 1) % steps.length);
      }, 1800);
      return () => clearInterval(interval);
    }
  }, [loading]);

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
      setFollowup("");
    } catch (err) {
      console.error("⚠️ Generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    const pdfData = {
      topic,
      industry,
      country,
      cards: resultCards
    };
    localStorage.setItem("wiserbond_pdf", JSON.stringify(pdfData));
    window.open("/export/pdf", "_blank");
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
          followup_only: true,
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto p-6">
        {/* Left: Input Form */}
        <div className="space-y-4 bg-white p-4 rounded shadow-md max-h-screen overflow-auto">
          <h1 className="text-xl font-bold">Wiserbond Synthesizer</h1>

          <div className="text-sm text-gray-600">
            This tool tells how a macro topic affects an industry in a country.
          </div>

          <input className="w-full border px-2 py-1 rounded text-sm" placeholder="Macro Topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
          <input className="w-full border px-2 py-1 rounded text-sm" placeholder="Industry / Sector" value={industry} onChange={(e) => setIndustry(e.target.value)} />
          <input className="w-full border px-2 py-1 rounded text-sm" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />

          <details className="border px-2 py-2 rounded text-sm">
            <summary className="cursor-pointer font-semibold">Refine your context</summary>
            <div className="mt-2 space-y-2">
              <input className="w-full border px-2 py-1 rounded text-sm" placeholder="Goal" value={goal} onChange={(e) => setGoal(e.target.value)} />
              <input className="w-full border px-2 py-1 rounded text-sm" placeholder="Situation" value={situation} onChange={(e) => setSituation(e.target.value)} />
              <input className="w-full border px-2 py-1 rounded text-sm" placeholder="Sub-sector / Detail" value={industryDetail} onChange={(e) => setIndustryDetail(e.target.value)} />
            </div>
          </details>

          <button onClick={handleFollowupOnly} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full text-sm">
            Generate Follow-Up Questions
          </button>

          <select className="w-full border px-2 py-1 rounded text-sm" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="English">English</option>
            <option value="Korean">Korean</option>
            <option value="Spanish">Spanish</option>
            <option value="Indian">Indian</option>
            <option value="Chinese">Chinese</option>
          </select>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isPro} onChange={() => setIsPro(!isPro)} />
            Pro Mode - Expert-level depth (I know this industry well)
          </label>

          <button onClick={handleGenerate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full text-sm" disabled={loading}>
            {loading ? steps[stepIndex] : "Generate Report"}
          </button>

          {resultCards.length > 0 && (
            <button onClick={handleExportPDF} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full text-sm">
              Export as PDF
            </button>
          )}
        </div>

        {/* Right: Output Display */}
        <div className="space-y-4 overflow-auto">
          {resultCards.map((card) => (
            <ReportSection key={card.id} id={card.id} title={card.title} content={card.content} />
          ))}

          {followup && (
            <div className="p-4 border border-blue-200 bg-blue-50 rounded">
              <h2 className="font-bold text-base text-blue-900 mb-2">
                Answer these (at least one) to get a more personalized report:
              </h2>
              <div className="space-y-4">
                {followup
                  .split("\n")
                  .filter((line) => line.trim().startsWith("-") || line.trim().startsWith("•"))
                  .map((q, idx) => (
                    <div key={idx}>
                      <p className="font-medium text-sm text-gray-800 mb-1">{q.replace(/^[-•]/, "").trim()}</p>
                      <textarea
                        className="w-full border px-2 py-1 rounded bg-white text-sm"
                        placeholder="Your answer..."
                        value={followupAnswers[idx] || ""}
                        onChange={(e) => handleFollowupChange(idx, e.target.value)}
                      />
                    </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}