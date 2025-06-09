type SectionProps = {
  id?: string;
  title: string;
  content: string;
  type?: "summary" | "analysis" | "news" | "insight";
};

// 마크다운 제거 + 포맷 보정
function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")     // **bold**
    .replace(/#+\s*(.*)/g, "$1")         // headings
    .replace(/^- /gm, "• ")              // bullet
    .replace(/_{3,}|-{3,}/g, "")         // --- or ___ 구분 제거
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")  // [링크텍스트](url) → 링크텍스트
    .replace(/!\[.*?\]\(.*?\)/g, "")     // 이미지 제거
    .replace(/\n{3,}/g, "\n\n")          // 줄바꿈 정리
    .trim();
}

export default function ReportSection({ id, title, content, type }: SectionProps) {
  if (!content?.trim()) return null;

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
