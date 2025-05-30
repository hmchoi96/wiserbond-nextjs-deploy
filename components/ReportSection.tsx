// components/ReportSection.tsx

type SectionProps = {
  id?: string;
  title: string;
  content: string;
  type?: "summary" | "analysis" | "news" | "insight"; // 아직 있어도 영향 없음
};

export default function ReportSection({ id, title, content }: SectionProps) {
  if (!content) return null;

  const sectionStyle = "bg-white border-gray-200";

  return (
    <div
      id={id}
      className={`border p-4 rounded shadow-sm ${sectionStyle} dark:bg-neutral-900`}
    >
      <h2 className="text-lg font-bold mb-2 text-blue-700 dark:text-blue-300">
        {title.replace("_", " ")}
      </h2>
      <p className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
        {content}
      </p>
    </div>
  );
}
