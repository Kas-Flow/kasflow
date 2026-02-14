'use client';

import { useState } from 'react';
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

      {/* Code Content - Dark background with light text */}
      <div className="bg-gray-950 p-6 overflow-x-auto">
        <pre className="font-mono text-sm text-gray-100">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
