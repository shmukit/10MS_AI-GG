import React, { useEffect, useMemo, useState } from 'react';
import { Check, CheckCircle2, Copy, Loader2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { getTaskVisual } from './taskVisuals';

export type TaskDetailSegment =
  | { type: 'prose'; text: string }
  | { type: 'code'; label: string; text: string };

/** Delimiters in task_details are authoring-only — never shown to students. */
const BLOCK_RE = /———\s*([^\n—]+?)\s*———\s*([\s\S]*?)———\s*END[^\n]*———/gi;
const MD_FENCE_RE = /```(?:[a-zA-Z0-9_-]*)?\n([\s\S]*?)```/g;

function friendlyLabel(raw: string): string {
  const t = raw.trim();
  if (/^COPY\s*BELOW$/i.test(t)) return 'Prompt';
  if (/^THINK\s*FIRST$/i.test(t)) return 'Template';
  const run = t.match(/^RUN\s*(\d+)\s*(.*)$/i);
  if (run) {
    const rest = run[2].replace(/^[—\-:\s]+/, '').trim();
    return rest ? `Run ${run[1]} — ${rest}` : `Run ${run[1]}`;
  }
  return t
    .replace(/\bCOPY\s*BELOW\b/gi, 'Prompt')
    .replace(/\s+/g, ' ')
    .trim() || 'Prompt';
}

/** Split task_details into instructions (prose) + copyable code snippets. */
export function parseTaskDetailSegments(details: string): TaskDetailSegment[] {
  const input = details.trim();
  if (!input) return [];

  const segments: TaskDetailSegment[] = [];
  let cursor = 0;
  let matched = false;

  BLOCK_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = BLOCK_RE.exec(input)) !== null) {
    matched = true;
    const before = input.slice(cursor, m.index).trim();
    if (before) segments.push({ type: 'prose', text: before });
    const code = m[2].trim();
    if (code) segments.push({ type: 'code', label: friendlyLabel(m[1]), text: code });
    cursor = m.index + m[0].length;
  }

  if (!matched) {
    MD_FENCE_RE.lastIndex = 0;
    cursor = 0;
    while ((m = MD_FENCE_RE.exec(input)) !== null) {
      matched = true;
      const before = input.slice(cursor, m.index).trim();
      if (before) segments.push({ type: 'prose', text: before });
      const code = m[1].trim();
      if (code) segments.push({ type: 'code', label: 'Prompt', text: code });
      cursor = m.index + m[0].length;
    }
  }

  const after = input.slice(cursor).trim();
  if (after) segments.push({ type: 'prose', text: after });

  if (segments.length === 0) {
    segments.push({ type: 'prose', text: input });
  }

  return segments;
}

async function writeClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

const PromptCodeBlock: React.FC<{ label: string; code: string }> = ({ label, code }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(t);
  }, [copied]);

  const onCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await writeClipboard(code);
    setCopied(true);
  };

  return (
    <div className="group relative rounded-lg border border-border bg-muted/70 overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 border-b border-border/80 bg-muted">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground truncate">
          {label}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className={`relative inline-flex items-center justify-center rounded-md p-1.5 text-xs font-medium transition-all duration-200 ${
            copied
              ? 'text-green-700 dark:text-green-300 bg-green-500/15'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/80 opacity-70 group-hover:opacity-100'
          }`}
          aria-label={copied ? 'Copied' : 'Copy prompt'}
        >
          {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span
            className={`pointer-events-none absolute -top-9 right-0 z-10 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background shadow-sm transition-opacity ${
              copied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            {copied ? 'Copied' : 'Copy'}
          </span>
        </button>
      </div>
      <pre className="m-0 max-h-[40vh] overflow-auto px-3 py-3 text-[13px] leading-relaxed font-mono text-emerald-800 dark:text-emerald-300/95 whitespace-pre-wrap break-words">
        {code}
      </pre>
    </div>
  );
};

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
  const segments = useMemo(
    () => parseTaskDetailSegments(task?.details || ''),
    [task?.details]
  );

  if (!task) return null;

  const hasCode = segments.some((s) => s.type === 'code');
  const visual = getTaskVisual(task.title, task.type);
  const modalTitle = `${visual.emoji} ${task.title}`;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={modalTitle}
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
      }
    >
      <div className="max-h-[55vh] overflow-y-auto space-y-4 -mx-1 px-1">
        {!task.details?.trim() ? (
          <p className="text-sm text-muted-foreground">
            No prompt for this task yet. Follow the facilitator, then mark complete.
          </p>
        ) : (
          segments.map((seg, i) =>
            seg.type === 'prose' ? (
              <p
                key={i}
                className="text-sm leading-relaxed text-foreground whitespace-pre-wrap break-words"
              >
                {seg.text}
              </p>
            ) : (
              <PromptCodeBlock key={i} label={seg.label} code={seg.text} />
            )
          )
        )}
        {hasCode && (
          <p className="text-xs text-muted-foreground">
            Hover a prompt box → Copy → paste into your AI chat or Project Settings.
          </p>
        )}
      </div>
    </Modal>
  );
};
