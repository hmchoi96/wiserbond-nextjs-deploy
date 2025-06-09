import ReportSectionPDF from "@/components/ReportSectionPDF";

// ✅ URL 기반 APA reference 추출 함수
function extractAPAReferencesFromCards(cards: { content: string }[]): string[] {
  const urlRegex = /(https?:\/\/[^\s)]+)/g;
  const references = new Set<string>();

  for (const card of cards) {
    const matches = card.content.match(urlRegex);
    if (matches) {
      matches.forEach(url => {
        references.add(`Source: ${url}`);
      });
    }
  }

  return Array.from(references);
}

export default function ReportPDFLayout({
  cards,
  topic,
  industry,
  country,
  reportTitle,
}: {
  cards: { title: string; content: string }[];
  topic: string;
  industry: string;
  country: string;
  reportTitle?: string;
}) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const REFERENCE = "references";

  // ✅ 1. 기존 reference 카드 확인
  const hasReferenceCard =
    cards.length > 0 && cards[cards.length - 1].title.toLowerCase().includes(REFERENCE);
  //const referenceCard = hasReferenceCard ? cards[cards.length - 1] : null;
  const contentCards = hasReferenceCard ? cards.slice(0, -1) : cards;

  // ✅ 2. 자동 reference 추출 (없을 경우만)
  const autoReferences = !hasReferenceCard ? extractAPAReferencesFromCards(contentCards) : [];

  // ✅ 3. 최종 카드 구성
  const finalCards = [...contentCards];
  if (!hasReferenceCard && autoReferences.length > 0) {
    finalCards.push({
      title: "References",
      content: autoReferences.join("\n"),
    });
  }

  const referenceLines = finalCards.find(card => card.title.toLowerCase() === REFERENCE)?.content
    .split("\n")
    .filter(line => line.trim() !== "") || [];

  return (
    <div className="pdf-page text-black">
      <h1 className="text-2xl font-bold mb-2">
        {reportTitle || `This report explains how "${topic}" affects "${industry}" in ${country}.`}
      </h1>
      <div className="text-sm text-gray-600 text-right mb-6 italic">{formattedDate}</div>

      {/* ✅ Main content */}
      {finalCards.map((card, idx) =>
        card.title.toLowerCase() !== REFERENCE ? (
          <ReportSectionPDF key={idx} title={card.title} content={card.content} />
        ) : null
      )}

      {/* ✅ APA References */}
      {referenceLines.length > 0 && (
        <div className="mt-10 pt-6 border-t border-gray-300 break-inside-avoid">
          <h2 className="text-xl font-semibold mb-4">References</h2>
          <ul className="list-disc list-inside text-sm space-y-2">
            {referenceLines.map((line, idx) => (
              <li key={idx} className="leading-relaxed">{line.trim()}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
