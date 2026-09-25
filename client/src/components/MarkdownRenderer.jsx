import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
        <span className="font-mono uppercase tracking-wider">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function MarkdownRenderer({ content = '' }) {
  if (!content) return null;

  // Split into lines for structured block rendering
  const lines = content.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  let codeLanguage = '';
  let inList = false;
  let listItems = [];
  let listType = 'ul';

  const flushList = () => {
    if (inList && listItems.length > 0) {
      if (listType === 'ol') {
        elements.push(
          <ol key={`ol-${elements.length}`} className="list-decimal pl-6 my-4 space-y-2 text-slate-300">
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: renderInline(item) }} />
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc pl-6 my-4 space-y-2 text-slate-300">
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: renderInline(item) }} />
            ))}
          </ul>
        );
      }
      listItems = [];
      inList = false;
    }
  };

  const renderInline = (text) => {
    if (!text) return '';
    return text
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em class="text-slate-200 italic">$1</em>')
      // Inline Code
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-indigo-950/60 border border-indigo-500/20 text-indigo-300 font-mono text-sm">$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors">$1</a>');
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block start / end
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <CodeBlock
            key={`code-${elements.length}`}
            code={codeBuffer.join('\n')}
            language={codeLanguage}
          />
        );
        inCodeBlock = false;
        codeBuffer = [];
        codeLanguage = '';
      } else {
        flushList();
        inCodeBlock = true;
        codeLanguage = line.trim().replace(/^```/, '').trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Horizontal Rule
    if (/^(---|___|\*\*\*)$/.test(line.trim())) {
      flushList();
      elements.push(<hr key={`hr-${elements.length}`} className="my-8 border-slate-800" />);
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={`h1-${elements.length}`} className="text-3xl sm:text-4xl font-extrabold text-white mt-8 mb-4 tracking-tight leading-tight">
          {line.replace('# ', '')}
        </h1>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={`h2-${elements.length}`} className="text-2xl sm:text-3xl font-bold text-slate-100 mt-8 mb-4 pb-2 border-b border-slate-800/80 tracking-tight">
          {line.replace('## ', '')}
        </h2>
      );
      continue;
    }
    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${elements.length}`} className="text-xl sm:text-2xl font-semibold text-indigo-200 mt-6 mb-3">
          {line.replace('### ', '')}
        </h3>
      );
      continue;
    }

    // Blockquotes & Callouts
    if (line.startsWith('> ')) {
      flushList();
      const quoteText = line.replace('> ', '');
      elements.push(
        <blockquote
          key={`quote-${elements.length}`}
          className="border-l-4 border-indigo-500 bg-indigo-950/20 px-4 py-3 my-5 rounded-r-lg text-slate-200 italic"
          dangerouslySetInnerHTML={{ __html: renderInline(quoteText) }}
        />
      );
      continue;
    }

    // Unordered List (- or *)
    if (/^(\s*)[-*]\s+/.test(line)) {
      listType = 'ul';
      inList = true;
      listItems.push(line.replace(/^(\s*)[-*]\s+/, ''));
      continue;
    }

    // Ordered List (1. 2.)
    if (/^\s*\d+\.\s+/.test(line)) {
      listType = 'ol';
      inList = true;
      listItems.push(line.replace(/^\s*\d+\.\s+/, ''));
      continue;
    }

    // Empty lines flush lists and paragraph boundaries
    if (!line.trim()) {
      flushList();
      continue;
    }

    // Regular Paragraph
    flushList();
    elements.push(
      <p
        key={`p-${elements.length}`}
        className="my-4 text-slate-300 leading-relaxed text-base sm:text-lg"
        dangerouslySetInnerHTML={{ __html: renderInline(line) }}
      />
    );
  }

  flushList();

  return <div className="prose-container">{elements}</div>;
}
