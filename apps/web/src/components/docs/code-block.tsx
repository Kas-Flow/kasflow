'use client';

import { useState, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: 'typescript' | 'bash' | 'javascript';
  filename?: string;
}

export function CodeBlock({ code, language = 'typescript', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderHighlightedCode = () => {
    if (language === 'bash') {
      return code.split('\n').map((line, i) => (
        <div key={i}>
          {line.startsWith('#') || line.startsWith('//') ? (
            <span className="text-gray-500 italic">{line}</span>
          ) : (
            <span className="text-gray-100">{line}</span>
          )}
        </div>
      ));
    }

    // TypeScript/JavaScript syntax highlighting
    const lines = code.split('\n');
    return lines.map((line, lineIndex) => {
      // Comments
      if (line.trim().startsWith('//')) {
        return (
          <div key={lineIndex} className="text-gray-500 italic">
            {line}
          </div>
        );
      }

      // Parse and highlight the line
      const tokens: ReactNode[] = [];
      let currentPos = 0;

      // Keywords
      const keywords = /\b(import|from|const|let|var|await|async|if|else|return|export|default|interface|type|function|class|new|as)\b/g;
      // Strings
      const strings = /(['"`])(?:(?=(\\?))\2.)*?\1/g;
      // Numbers
      const numbers = /\b(\d+n?)\b/g;
      // Properties/Methods after dot
      const properties = /\.(\w+)/g;
      // Function calls
      const functions = /\b(\w+)(?=\()/g;

      const segments: Array<{ start: number; end: number; type: string; value: string }> = [];

      // Find all keywords
      let match: RegExpExecArray | null;
      while ((match = keywords.exec(line)) !== null) {
        segments.push({ start: match.index, end: match.index + match[0].length, type: 'keyword', value: match[0] });
      }

      // Find all strings
      while ((match = strings.exec(line)) !== null) {
        segments.push({ start: match.index, end: match.index + match[0].length, type: 'string', value: match[0] });
      }

      // Find all numbers
      while ((match = numbers.exec(line)) !== null) {
        // Don't highlight if it's part of a word
        const beforeChar = line[match.index - 1];
        const afterChar = line[match.index + match[0].length];
        if (!beforeChar || /\W/.test(beforeChar)) {
          if (!afterChar || /\W/.test(afterChar)) {
            segments.push({ start: match.index, end: match.index + match[0].length, type: 'number', value: match[0] });
          }
        }
      }

      // Find all properties
      while ((match = properties.exec(line)) !== null) {
        segments.push({ start: match.index, end: match.index + match[0].length, type: 'property', value: match[0] });
      }

      // Find all functions
      while ((match = functions.exec(line)) !== null) {
        // Check if it's not already a keyword or property
        const isKeyword = segments.some(s => s.start <= match!.index && s.end >= match!.index + match![0].length && s.type === 'keyword');
        if (!isKeyword) {
          segments.push({ start: match.index, end: match.index + match[0].length, type: 'function', value: match[0] });
        }
      }

      // Sort segments by start position
      segments.sort((a, b) => a.start - b.start);

      // Build the highlighted line
      const result: ReactNode[] = [];
      let pos = 0;

      for (const segment of segments) {
        // Add unhighlighted text before this segment
        if (pos < segment.start) {
          result.push(<span key={`text-${pos}`} className="text-gray-100">{line.substring(pos, segment.start)}</span>);
        }

        // Add highlighted segment
        const className = {
          keyword: 'text-purple-400 font-bold',
          string: 'text-green-400 font-bold',
          number: 'text-pink-400 font-bold',
          property: 'text-cyan-400 font-bold',
          function: 'text-amber-400 font-bold',
        }[segment.type] || 'text-gray-100';

        result.push(<span key={`segment-${segment.start}`} className={className}>{segment.value}</span>);
        pos = segment.end;
      }

      // Add remaining unhighlighted text
      if (pos < line.length) {
        result.push(<span key={`text-${pos}`} className="text-gray-100">{line.substring(pos)}</span>);
      }

      return <div key={lineIndex}>{result.length > 0 ? result : <span className="text-gray-100">{line}</span>}</div>;
    });
  };

  return (
    <div className="not-prose my-6 bg-card border-4 border-border rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_var(--shadow-color)]">
      {/* Terminal Header */}
      <div className="bg-neo-cyan border-b-4 border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-neo-pink border-2 border-border"></div>
            <div className="w-3 h-3 rounded-full bg-neo-yellow border-2 border-border"></div>
            <div className="w-3 h-3 rounded-full bg-neo-green border-2 border-border"></div>
          </div>
          {filename && (
            <span className="font-mono text-sm font-black ml-4 text-black">{filename}</span>
          )}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg hover:bg-black/10 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-black" />
          ) : (
            <Copy className="w-4 h-4 text-black" />
          )}
        </button>
      </div>

      {/* Code Content - Dark background with syntax highlighting */}
      <div className="bg-gray-950 p-6 overflow-x-auto">
        <pre className="font-mono text-sm">
          <code>{renderHighlightedCode()}</code>
        </pre>
      </div>
    </div>
  );
}
