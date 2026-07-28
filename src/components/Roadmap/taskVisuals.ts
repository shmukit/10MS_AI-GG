/**
 * Stable visual markers for workshop roadmap tasks (by task ID prefix).
 * Shown in the student roadmap list + task detail modal for quick scanning.
 */
export type TaskVisual = {
  emoji: string;
  /** Short plain label for tooltip / a11y */
  label: string;
};

const BY_ID: Record<string, TaskVisual> = {
  '0.0': { emoji: '🧠', label: 'What is AI' },
  '0.1': { emoji: '🖥️', label: 'Open tools' },
  '0.2': { emoji: '📘', label: 'Teacher Settings' },
  '0.3': { emoji: '🤝', label: 'Meet Teacher' },
  '0.4': { emoji: '💬', label: 'Chat vs assistant vs agent' },
  '1.1': { emoji: '📝', label: 'EA brief' },
  '1.2': { emoji: '🧑‍💼', label: 'Work EA + 3 runs' },
  '1.3': { emoji: '🔁', label: 'One coach loop' },
  '1.4': { emoji: '🔒', label: 'Lock process' },
  '1.5': { emoji: '🧰', label: 'Tool fit' },
  '1.6': { emoji: '📁', label: 'Memory / docs' },
  '2.0': { emoji: '🪜', label: 'Pattern ladder' },
  '2.1': { emoji: '🗺️', label: 'Map process' },
  '2.2': { emoji: '✍️', label: 'ETCSLV draft' },
  '2.3': { emoji: '🔍', label: 'ETCSLV critique' },
  '2.4': { emoji: '🌳', label: 'Decision tree' },
  '2.5': { emoji: '🧬', label: 'Workflow brain' },
  '2.6': { emoji: '⚡', label: 'Automation run' },
  '3.0': { emoji: '👔', label: 'Manager framing' },
  '3.1': { emoji: '👥', label: 'AI workforce' },
  '3.2': { emoji: '🛡️', label: 'Harness' },
  '3.3': { emoji: '💥', label: 'Failure lab' },
  '3.4': { emoji: '🚀', label: 'Ship / capstone' },
  '3.5': { emoji: '🎤', label: 'Demo Day' },
  '3.6': { emoji: '📅', label: '30-day plan' },
  '4.1': { emoji: '📖', label: 'Read' },
  '4.2': { emoji: '📖', label: 'Read' },
  '4.3': { emoji: '▶️', label: 'Watch' },
};

const BY_TYPE: Record<string, TaskVisual> = {
  watch: { emoji: '▶️', label: 'Watch' },
  video: { emoji: '▶️', label: 'Watch' },
  read: { emoji: '📖', label: 'Read' },
  reading: { emoji: '📖', label: 'Read' },
  project: { emoji: '🛠️', label: 'Hands-on' },
  exercise: { emoji: '🛠️', label: 'Hands-on' },
  attend: { emoji: '👂', label: 'Attend' },
  written: { emoji: '✏️', label: 'Written' },
  mcq: { emoji: '❓', label: 'MCQ' },
};

/** Extract leading task ID like "1.4" from "1.4 Hands-on: …". */
export function parseTaskId(title: string): string | null {
  const m = title.trim().match(/^(\d+\.\d+)\b/);
  return m ? m[1] : null;
}

export function getTaskVisual(title: string, type?: string): TaskVisual {
  const id = parseTaskId(title);
  if (id && BY_ID[id]) return BY_ID[id];
  const t = (type || '').toLowerCase();
  if (t && BY_TYPE[t]) return BY_TYPE[t];
  return { emoji: '📌', label: 'Task' };
}

export function taskVisualLegend(): Array<{ id: string } & TaskVisual> {
  return Object.entries(BY_ID).map(([id, v]) => ({ id, ...v }));
}
