import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
  checkedItems: Set<string>;
  onCheckboxChange: (index: number, checked: boolean) => void;
}

export default function MarkdownPreview({ 
  content, 
  className,
  checkedItems,
  onCheckboxChange,
}: MarkdownPreviewProps) {
  return (
    <div className={`prose max-w-none p-4 h-full overflow-auto markdown-preview ${className}`}>
      <style>{`
        .markdown-preview h1,
        .markdown-preview h2,
        .markdown-preview h3,
        .markdown-preview h4,
        .markdown-preview h5,
        .markdown-preview h6 {
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .markdown-preview h1 { border-bottom-width: 2px; }
        .markdown-preview input[type="checkbox"] {
          margin-right: 0.5rem;
          cursor: pointer;
        }
      `}</style>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={tomorrow}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          li({node, children, ...props}: any) {
            if (node?.children[0]?.type === 'paragraph' && 
                node?.children[0]?.children[0]?.type === 'text' && 
                (node?.children[0]?.children[0]?.value.startsWith('[ ] ') || 
                 node?.children[0]?.children[0]?.value.startsWith('[x] '))) {
              const index = props.index;
              const isChecked = checkedItems.has(index.toString());
              return (
                <li {...props} style={{ listStyle: 'none' }}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => onCheckboxChange(index, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={isChecked ? 'line-through text-gray-500' : ''}>
                    {node.children[0].children[0].value.substring(4)}
                  </span>
                </li>
              );
            }
            return <li {...props}>{children}</li>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}