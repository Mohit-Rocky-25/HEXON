import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeViewerProps {
  code: string;
  filePath?: string;
  language?: string;
  highlightLines?: [number, number]; // [startLine, endLine]
  onLineClick?: (lineNumber: number) => void;
  maxHeight?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  filePath,
  language,
  highlightLines,
  onLineClick,
  maxHeight = "500px"
}) => {
  const [copied, setCopied] = useState(false);
  const lines = code ? code.split("\n") : [];

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHighlighted = (lineNum: number) => {
    if (!highlightLines) return false;
    return lineNum >= highlightLines[0] && lineNum <= highlightLines[1];
  };

  return (
    <div className="w-full bg-[#FFFFFF] border border-console-border rounded-md overflow-hidden font-mono text-xs shadow-xs">
      {/* File header bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#F8F8F6] border-b border-console-border text-console-muted">
        <div className="flex items-center gap-2 truncate">
          <span className="font-semibold text-console-text truncate">
            {filePath || "Code Snippet"}
          </span>
          {language && (
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white border border-console-border text-console-dim">
              {language}
            </span>
          )}
          <span className="text-console-dim text-[11px]">
            {lines.length} lines
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-console-muted hover:text-console-text px-2 py-1 rounded hover:bg-stone-200/50 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-console-success" />
              <span className="text-console-success font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code body with line numbers */}
      <div
        className="overflow-auto select-text bg-[#FFFFFF]"
        style={{ maxHeight }}
      >
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((lineContent, idx) => {
              const lineNum = idx + 1;
              const highlighted = isHighlighted(lineNum);
              return (
                <tr
                  key={lineNum}
                  id={`L${lineNum}`}
                  onClick={() => onLineClick?.(lineNum)}
                  className={`group transition-colors ${
                    highlighted
                      ? "bg-orange-50 border-l-2 border-console-accent"
                      : "hover:bg-[#F8F8F6]"
                  }`}
                >
                  <td className="w-12 select-none text-right pr-3 pl-2 py-0.5 text-stone-400 group-hover:text-stone-600 border-r border-stone-200 font-mono text-[11px] bg-[#FAF9F7]">
                    {lineNum}
                  </td>
                  <td className="pl-3.5 pr-4 py-0.5 whitespace-pre font-mono text-[#1C1917] leading-relaxed">
                    {lineContent || " "}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
