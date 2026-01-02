// ============================================
// Markdown Editor Component
// ============================================

'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered,
  Link,
  Image,
  Code,
  Quote,
  Eye,
  Edit
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils/cn';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  label?: string;
  error?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write your content here...',
  minHeight = '300px',
  label,
  error,
}: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  const insertText = useCallback((before: string, after: string = '') => {
    const textarea = document.querySelector('textarea[data-md-editor]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = 
      value.substring(0, start) + 
      before + 
      selectedText + 
      after + 
      value.substring(end);
    
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  }, [value, onChange]);

  const toolbarButtons = [
    { icon: Bold, action: () => insertText('**', '**'), title: 'Bold' },
    { icon: Italic, action: () => insertText('*', '*'), title: 'Italic' },
    { icon: Heading1, action: () => insertText('# '), title: 'Heading 1' },
    { icon: Heading2, action: () => insertText('## '), title: 'Heading 2' },
    { icon: List, action: () => insertText('- '), title: 'Bullet List' },
    { icon: ListOrdered, action: () => insertText('1. '), title: 'Numbered List' },
    { icon: Link, action: () => insertText('[', '](url)'), title: 'Link' },
    { icon: Image, action: () => insertText('![alt](', ')'), title: 'Image' },
    { icon: Code, action: () => insertText('`', '`'), title: 'Inline Code' },
    { icon: Quote, action: () => insertText('> '), title: 'Quote' },
  ];

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <div className={cn(
        'rounded-lg border overflow-hidden',
        error
          ? 'border-red-500'
          : 'border-dark-200 dark:border-dark-700 focus-within:border-primary-500'
      )}>
        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 bg-dark-50 dark:bg-dark-800 border-b border-dark-200 dark:border-dark-700">
          <div className="flex items-center gap-1">
            {toolbarButtons.map(({ icon: Icon, action, title }) => (
              <button
                key={title}
                type="button"
                onClick={action}
                disabled={isPreview}
                title={title}
                className={cn(
                  'p-1.5 rounded hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors',
                  isPreview && 'opacity-50 cursor-not-allowed'
                )}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          {/* Preview Toggle */}
          <div className="flex items-center gap-1 bg-dark-200 dark:bg-dark-700 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setIsPreview(false)}
              className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded text-sm transition-colors',
                !isPreview
                  ? 'bg-white dark:bg-dark-600 shadow-sm'
                  : 'text-muted-foreground'
              )}
            >
              <Edit className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => setIsPreview(true)}
              className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded text-sm transition-colors',
                isPreview
                  ? 'bg-white dark:bg-dark-600 shadow-sm'
                  : 'text-muted-foreground'
              )}
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </button>
          </div>
        </div>

        {/* Editor / Preview */}
        <div style={{ minHeight }}>
          <AnimatePresence mode="wait">
            {isPreview ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 prose prose-sm dark:prose-invert max-w-none overflow-auto"
                style={{ minHeight }}
              >
                {value ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {value}
                  </ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground italic">
                    Nothing to preview
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <textarea
                  data-md-editor
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  className={cn(
                    'w-full p-4 bg-transparent resize-y focus:outline-none',
                    'font-mono text-sm'
                  )}
                  style={{ minHeight }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Help Text */}
      <p className="text-xs text-muted-foreground">
        Supports Markdown syntax. Use the toolbar or write directly.
      </p>
    </div>
  );
}