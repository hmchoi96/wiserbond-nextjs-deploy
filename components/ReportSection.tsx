type SectionProps = {
  id?: string;
  title: string;
  content: string;
  type?: "summary" | "analysis" | "news" | "insight"; // 아직 있어도 영향 없음
};

// 마크다운 기호 제거 함수
function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")   // **bold** → bold
    .replace(/#+\s*(.*)/g, "$1")       // ## Title → Title
    .replace(/^- /gm, "• ")            // - bullet → • bullet (선택사항)
    .replace(/\n{3,}/g, "\n\n")        // 3줄 이상 줄바꿈 → 2줄로 정리
    .trim();
}

export default function ReportSection({ id, title, content }: SectionProps) {
  if (!content) return null;

  const cleanedContent = cleanMarkdown(content);

  return (
    <div
      id={id}
      className="border border-gray-200 p-4 rounded shadow-sm bg-white text-black"
    >
      <h2 className="text-lg font-bold mb-2 text-blue-800">
        {title.replace("_", " ")}
      </h2>
      <p className="whitespace-pre-wrap text-sm text-gray-900">
        {cleanedContent}
      </p>
    </div>
  );
}
