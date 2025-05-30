import ReportSectionPDF from "@/components/ReportSectionPDF";

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

  return (
    <div className="pdf-page text-black">
      <h1 className="text-2xl font-bold mb-2">
        {reportTitle || `This report explains how "${topic}" affects "${industry}" in ${country}.`}
      </h1>
      <div className="text-sm text-gray-600 text-right mb-6 italic">{formattedDate}</div>

      {cards.map((card, idx) => (
        <ReportSectionPDF key={idx} title={card.title} content={card.content} />
      ))}
    </div>
  );
}
