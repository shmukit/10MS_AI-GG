import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface ClampedTextProps {
  text: string;
  lines?: 2 | 3 | 4;
  className?: string;
  /** Stop click from bubbling (e.g. when parent card is clickable) */
  stopPropagation?: boolean;
}

const lineClampClass: Record<2 | 3 | 4, string> = {
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
};

/** Collapses long copy; expands in place on “Show more”. */
export const ClampedText: React.FC<ClampedTextProps> = ({
  text,
  lines = 3,
  className,
  stopPropagation = true,
}) => {
  const [expanded, setExpanded] = useState(false);
  const trimmed = text.trim();
  if (!trimmed) return null;

  const needsClamp = trimmed.length > 160 || trimmed.split('\n').length > lines;

  return (
    <div className={cn('min-w-0', className)}>
      <p
        className={cn(
          'text-sm whitespace-pre-wrap break-words text-muted-foreground',
          !expanded && needsClamp && lineClampClass[lines]
        )}
      >
        {trimmed}
      </p>
      {needsClamp && (
        <button
          type="button"
          className="mt-1 text-xs font-medium text-primary hover:underline"
          onClick={(e) => {
            if (stopPropagation) {
              e.preventDefault();
              e.stopPropagation();
            }
            setExpanded((v) => !v);
          }}
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};
