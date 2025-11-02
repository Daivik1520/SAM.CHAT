'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Bold,
  Italic,
  Code,
  Quote,
  List,
  Link2,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MessageFormatterProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
}

export function MessageFormatter({
  value,
  onChange,
  onSubmit,
  placeholder = 'Type a message...',
}: MessageFormatterProps) {
  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector(
      'textarea[data-formatter="true"]'
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || 'text';
    const newValue =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newValue);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const formatOptions = [
    {
      icon: Bold,
      label: 'Bold',
      action: () => insertMarkdown('**', '**'),
    },
    {
      icon: Italic,
      label: 'Italic',
      action: () => insertMarkdown('_', '_'),
    },
    {
      icon: Code,
      label: 'Code',
      action: () => insertMarkdown('`', '`'),
    },
    {
      icon: Quote,
      label: 'Quote',
      action: () => insertMarkdown('> ', ''),
    },
    {
      icon: List,
      label: 'List',
      action: () => insertMarkdown('- ', ''),
    },
    {
      icon: Link2,
      label: 'Link',
      action: () => insertMarkdown('[', '](url)'),
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex gap-1 p-2 bg-gray-50 dark:bg-gray-900 rounded-t-lg border border-gray-200 dark:border-gray-800">
        <TooltipProvider>
          {formatOptions.map((option) => (
            <Tooltip key={option.label}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={option.action}
                  className="h-8 w-8 p-0"
                >
                  <option.icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{option.label}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
      <Textarea
        data-formatter="true"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.ctrlKey) {
            onSubmit?.();
          }
        }}
        placeholder={placeholder}
        className="resize-none rounded-b-lg"
        rows={3}
      />
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Supports **bold**, _italic_, `code`, and more. Press Ctrl+Enter to send.
      </div>
    </div>
  );
}

// Component to render formatted message
export function FormattedMessage({ content }: { content: string }) {
  const renderMarkdown = (text: string) => {
    // Simple markdown rendering
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/> (.*?)(?=\n|$)/g, '<blockquote>$1</blockquote>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br />');

    return html;
  };

  return (
    <div
      className="prose dark:prose-invert max-w-none text-sm"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
}
