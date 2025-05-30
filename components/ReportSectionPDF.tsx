type SectionPDFProps = {
    title: string;
    content: string;
  };
  
  function cleanMarkdown(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/#+\s*(.*)/g, "$1")
      .replace(/^- /gm, "• ")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
  
  export default function ReportSectionPDF({ title, content }: SectionPDFProps) {
    const cleaned = cleanMarkdown(content);
  
    return (
      <div className="mb-6 break-inside-avoid-page">
        <h2 className="text-lg font-semibold mb-2 text-black">{title}</h2>
        <p className="text-base text-black whitespace-pre-wrap leading-loose">
          {cleaned}
        </p>
      </div>
    );
  }
  