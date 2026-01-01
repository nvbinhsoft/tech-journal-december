import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { ghcolors } from 'react-syntax-highlighter/dist/esm/styles/prism';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // Import GitHub light theme for HTML content
import type { Components } from 'react-markdown';
import '../editor/editor-styles.css';

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  // Check if content is HTML (starts with < and contains tags) or Markdown
  const isHTML = content.trim().startsWith('<') && content.includes('</');

  // If it's HTML, render it directly
  if (isHTML) {
    const htmlContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (htmlContainerRef.current) {
        const blocks = htmlContainerRef.current.querySelectorAll('pre code');
        blocks.forEach((block) => {
          hljs.highlightElement(block as HTMLElement);
        });
      }
    }, [content]);

    return (
      <div
        ref={htmlContainerRef}
        className="ProseMirror article-content font-sans text-lg leading-relaxed lining-nums"
        style={{
          fontVariantNumeric: 'lining-nums tabular-nums',
          fontFeatureSettings: '"lnum" 1, "onum" 0, "pnum" 0, "tnum" 1',
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Otherwise, render as Markdown
  const components: Components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';

      // Code block (not inline)
      if (!inline && language) {
        return (
          <div className="my-6 rounded-lg overflow-hidden border border-slate-700/50">
            {/* Language label - simple and clean like GitHub */}
            <div className="flex items-center px-4 py-2 bg-[#f6f8fa] border-b border-[#d0d7de]">
              <span className="text-xs font-medium text-slate-500">
                {language}
              </span>
            </div>
            {/* Code content */}
            <SyntaxHighlighter
              style={ghcolors}
              language={language}
              PreTag="div"
              customStyle={{
                margin: 0,
                padding: '1rem 1.25rem',
                background: '#ffffff',
                fontSize: '0.875rem',
                lineHeight: '1.6',
                borderRadius: 0,
              }}
              codeTagProps={{
                style: {
                  fontFamily: "'SF Mono', 'Fira Code', 'Monaco', 'Consolas', monospace",
                }
              }}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        );
      }

      // Inline code
      return (
        <code
          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-sm font-mono text-pink-600 dark:text-pink-400"
          {...props}
        >
          {children}
        </code>
      );
    },
    h1: ({ children }) => (
      <h1 className="font-serif text-3xl font-bold mt-8 mb-4 text-foreground">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-sans text-2xl font-semibold mt-6 mb-3 text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-sans text-xl font-semibold mt-5 mb-2 text-foreground">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="mb-4 leading-relaxed text-foreground lining-nums font-sans">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc pl-6 mb-4 space-y-2">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-foreground lining-nums font-sans">
        {children}
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary/50 pl-4 my-6 italic bg-secondary/50 py-4 pr-4 rounded-r-lg">
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-primary underline underline-offset-2 hover:text-primary/80"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    img: ({ src, alt }) => (
      <img
        src={src}
        alt={alt || ''}
        className="rounded-lg max-w-full my-4"
      />
    ),
    hr: () => (
      <hr className="border-t border-border my-8" />
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic">
        {children}
      </em>
    ),
  };

  return (
    <div
      className="article-content font-sans text-lg leading-relaxed lining-nums"
      style={{
        fontVariantNumeric: 'lining-nums tabular-nums',
        fontFeatureSettings: '"lnum" 1, "onum" 0, "pnum" 0, "tnum" 1',
      }}
    >
      <ReactMarkdown components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
