type SectionProps = {
  id?: string;
  title: string;
  content: string;
  type?: "summary" | "analysis" | "news" | "insight";
};

// 마크다운 제거 함수
function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")     // **bold** → bold
    .replace(/#+\s*(.*)/g, "$1")         // ## Heading → Heading
    .replace(/^- /gm, "• ")              // - bullet → • bullet
    .replace(/-{3,}/g, "")               // --- separator 제거
    .replace(/\n{3,}/g, "\n\n")          // 너무 많은 줄바꿈 정리
    .trim();
}

export default function ReportSection({ id, title, content }: SectionProps) {
  if (!content) return null;

  const cleanedContent = cleanMarkdown(content);

  return (
    <div id={id} className="p-6 bg-white text-black">
      <h2 className="text-xl font-semibold mb-3">
        {title.replace(/_/g, " ")}
      </h2>
      <p className="whitespace-pre-wrap text-base leading-relaxed">
        {cleanedContent}
      </p>
    </div>
  );
}
