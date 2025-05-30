import { useEffect, useState } from "react";
import ReportPDFLayout from "@/components/ReportPDFLayout";

// ✅ 자동 제목 생성 함수
function generateTitle(topic: string, industry: string, country: string): string {
  return `How ${topic} Affects the ${industry} Sector in ${country}`;
}

export default function PDFPage() {
  const [topic, setTopic] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [cards, setCards] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("wiserbond_pdf");
    if (raw) {
      const data = JSON.parse(raw);
      setTopic(data.topic);
      setIndustry(data.industry);
      setCountry(data.country);
      setCards(data.cards || []);
      setLoaded(true);
    }
  }, []);

  if (!loaded) return <div className="p-10 text-gray-500">Loading PDF preview...</div>;

  return (
    <div className="p-12 bg-white text-black">
      <ReportPDFLayout
        cards={cards}
        topic={topic}
        industry={industry}
        country={country}
        reportTitle={generateTitle(topic, industry, country)} // ✅ 자동 제목
      />

      <div className="mt-6 print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
}
