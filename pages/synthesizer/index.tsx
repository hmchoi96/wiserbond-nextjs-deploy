import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ReportSection from "@/components/ReportSection";

interface ReportCard {
  id: string;
  title: string;
  type: string;
  content: string;
}

export default function SynthesizerPage() {
  const router = useRouter();

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
          <input className="w-full border p-2 rounded text-black bg-white" placeholder="Macro Topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
          <input className="w-full border p-2 rounded text-black bg-white" placeholder="Industry / Sector" value={industry} onChange={(e) => setIndustry(e.target.value)} />
          <input className="w-full border p-2 rounded text-black bg-white" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />

          <details className="border p-3 rounded bg-white text-black">
            <summary className="cursor-pointer font-semibold">Refine your context (optional)</summary>
            <div className="mt-4 space-y-3">
              <input className="w-full border p-2 rounded bg-white text-black" placeholder="Goal (Decision you’re making)" value={goal} onChange={(e) => setGoal(e.target.value)} />
              <input className="w-full border p-2 rounded bg-white text-black" placeholder="Situation (Recent event?)" value={situation} onChange={(e) => setSituation(e.target.value)} />
              <input className="w-full border p-2 rounded bg-white text-black" placeholder="Sub-sector / Industry detail" value={industryDetail} onChange={(e) => setIndustryDetail(e.target.value)} />
            </div>
          </details>

          <select className="w-full border p-2 rounded text-black bg-white" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="English">English</option>
            <option value="Korean">Korean</option>
            <option value="Spanish">Spanish</option>
            <option value="Indian">Indian</option>
            <option value="Chinese">Chinese</option>
          </select>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isPro} onChange={() => setIsPro(!isPro)} />
            <span className="text-sm text-black">Pro Mode (Advanced insights)</span>
          </label>

          <button
            onClick={handleGenerate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            disabled={loading}
          >
            {loading ? steps[stepIndex] : "Generate Report"}
          </button>

          <button
            onClick={handleFollowupOnly}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 w-full"
            disabled={loading}
          >
            Generate Follow-Up Questions
          </button>

          {resultCards.length > 0 && (
            <button
              onClick={handleExportPDF}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
            >
              Export as PDF
            </button>
          )}
        </div>

        <div className="space-y-4">
          {resultCards.map((card) => (
            <ReportSection key={card.id} id={card.id} title={card.title} content={card.content} />
          ))}

          {followup && (
            <div className="mt-6 p-4 border border-blue-200 bg-blue-50 rounded text-black">
              <h2 className="font-bold text-lg text-blue-900 mb-2">
                Please answer these follow-up questions to improve report quality:
              </h2>
              <p className="text-sm text-blue-800 whitespace-pre-line mb-4">{followup}</p>
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
