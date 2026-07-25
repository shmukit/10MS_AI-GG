import React, { useEffect, useState } from 'react';
import { Check, CheckCircle2, Copy, Loader2 } from 'lucide-react';
import { Modal } from '../ui/Modal';

/** Prefer fenced prompt blocks so Settings paste is not polluted by WHERE instructions. */
export function extractCopyPayload(details: string): string {
  const blocks: string[] = [];
  const re = /———[^\n]*———\s*([\s\S]*?)———\s*END[^\n]*———/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(details)) !== null) {
    const chunk = m[1].trim();
    if (chunk) blocks.push(chunk);
  }
  if (blocks.length === 0) return details.trim();
  return blocks.join('\n\n---\n\n');
}

export interface TaskDetailModalTask {
  id: string;
  title: string;
  type: string;
  details?: string;
  completed: boolean;
}

interface TaskDetailModalProps {
  open: boolean;
  task: TaskDetailModalTask | null;
  onClose: () => void;
  onComplete: () => void | Promise<void>;
  canComplete: boolean;
  isCompleting?: boolean;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  open,
  task,
  onClose,
  onComplete,
  canComplete,
  isCompleting = false,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open, task?.id]);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(t);
  }, [copied]);

  if (!task) return null;

  const body = (task.details || '').trim();
  const copyText = extractCopyPayload(body) || body || task.title;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
    } catch {
      // Fallback for older browsers / denied permission
      const ta = document.createElement('textarea');
      ta.value = copyText;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={task.title}
      size="lg"
      className="max-h-[90vh] flex flex-col"
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-muted"
          >
            Close
          </button>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleCopy}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200 ${
                copied
                  ? 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-300 scale-[1.02]'
                  : 'border-border text-foreground hover:bg-muted'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => void onComplete()}
              disabled={!canComplete || task.completed || isCompleting}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                task.completed
                  ? 'bg-green-600 text-white cursor-default'
                  : canComplete && !isCompleting
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {isCompleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </>
              ) : task.completed ? (
                <>
                  <Check className="w-4 h-4" />
                  Completed
                </>
              ) : (
                'Mark complete'
              )}
            </button>
          </div>
        </div>
      }
    >
      <div className="max-h-[50vh] overflow-y-auto -mx-1 px-1">
        {body ? (
          <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-foreground">
            {body}
          </pre>
        ) : (
          <p className="text-sm text-muted-foreground">
            No prompt for this task yet. Follow the facilitator, then mark complete.
          </p>
        )}
      </div>
      {copied && (
        <p
          className="mt-3 text-xs font-medium text-green-700 dark:text-green-300 transition-opacity duration-200"
          role="status"
        >
          Copied to clipboard — paste into your AI chat or Settings.
        </p>
      )}
    </Modal>
  );
};
