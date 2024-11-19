'use client';

import { RefObject } from 'react';

export function useMarkdownActions(
  markdown: string,
  setMarkdown: (value: string) => void,
  textareaRef: RefObject<HTMLTextAreaElement>
) {
  const handleToolAction = (action: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    let cursorOffset = 0;

    if (action.startsWith('emoji:')) {
      replacement = action.substring(6);
      cursorOffset = 0;
    } else {
      switch (action) {
        case 'bold':
          replacement = `**${selectedText || 'bold text'}**`;
          cursorOffset = selectedText ? 0 : -2;
          break;
        case 'italic':
          replacement = `_${selectedText || 'italic text'}_`;
          cursorOffset = selectedText ? 0 : -1;
          break;
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          const level = action.charAt(1);
          const needsNewline = start > 0 && text[start - 1] !== '\n';
          replacement = `${needsNewline ? '\n' : ''}${'#'.repeat(parseInt(level))} ${selectedText || `Heading ${level}`}\n`;
          cursorOffset = selectedText ? 0 : -1;
          break;
        case 'ul':
          replacement = `\n- ${selectedText || 'List item'}\n`;
          cursorOffset = selectedText ? 0 : -1;
          break;
        case 'ol':
          replacement = `\n1. ${selectedText || 'List item'}\n`;
          cursorOffset = selectedText ? 0 : -1;
          break;
        case 'task':
          replacement = `\n- [ ] ${selectedText || 'Task item'}\n`;
          cursorOffset = selectedText ? 0 : -1;
          break;
        case 'code':
          replacement = `\n\`\`\`\n${selectedText || 'code'}\n\`\`\`\n`;
          cursorOffset = selectedText ? 0 : -4;
          break;
        case 'quote':
          replacement = `\n> ${selectedText || 'quote'}\n`;
          cursorOffset = selectedText ? 0 : -1;
          break;
        case 'table':
          replacement = '\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n';
          break;
        case 'hr':
          replacement = '\n---\n';
          break;
        default:
          if (action.startsWith('link:')) {
            const [text, url] = action.substring(5).split('|');
            replacement = `[${text}](${url})`;
          } else if (action.startsWith('image:')) {
            const [alt, url] = action.substring(6).split('|');
            replacement = `![${alt}](${url})`;
          }
          break;
      }
    }

    const newText = text.substring(0, start) + replacement + text.substring(end);
    setMarkdown(newText);

    setTimeout(() => {
      textarea.focus();
      const newPosition = start + replacement.length + cursorOffset;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setMarkdown(e.target.result);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExport = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    handleToolAction,
    handleFileImport,
    handleExport,
  };
}