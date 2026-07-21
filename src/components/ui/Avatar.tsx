import React from 'react';
import { cn } from '../../lib/utils';

export interface AvatarProps {
  name?: string;
  src?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'h-8 w-8 text-caption',
  md: 'h-10 w-10 text-body',
  lg: 'h-12 w-12 text-h3',
};

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md', className }) => {
  const initial = name?.charAt(0)?.toUpperCase() || '?';

  if (src) {
    return (
      <img
        src={src}
        alt={name ? `${name}'s avatar` : 'User avatar'}
        className={cn('rounded-full object-cover', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-accent font-semibold text-primary',
        sizes[size],
        className
      )}
      aria-hidden={!name}
    >
      {initial}
    </div>
  );
};
