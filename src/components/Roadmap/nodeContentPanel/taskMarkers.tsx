import { BookOpen, Circle, Code, FileText, Play, Users } from 'lucide-react';
import { getTaskVisual, parseTaskId } from '../taskVisuals';

export function getTaskIcon(type: string) {
  const iconClass = 'w-4 h-4 text-muted-foreground';
  switch (type.toLowerCase()) {
    case 'watch': return <Play className={iconClass} />;
    case 'read': return <BookOpen className={iconClass} />;
    case 'project': return <Code className={iconClass} />;
    case 'attend': return <Users className={iconClass} />;
    case 'mcq': return <FileText className={iconClass} />;
    case 'written': return <FileText className={iconClass} />;
    case 'video': return <Play className={iconClass} />;
    case 'exercise': return <Code className={iconClass} />;
    case 'reading': return <BookOpen className={iconClass} />;
    default: return <Circle className={iconClass} />;
  }
}

/** Prefer workshop emoji marker; fall back to type icon. */
export function TaskMarker({ title, type }: { title: string; type: string }) {
  const visual = getTaskVisual(title, type);
  if (parseTaskId(title) || visual.emoji !== '📌') {
    return (
      <span
        className="text-base leading-none shrink-0"
        title={visual.label}
        aria-label={visual.label}
        role="img"
      >
        {visual.emoji}
      </span>
    );
  }
  return getTaskIcon(type);
}
