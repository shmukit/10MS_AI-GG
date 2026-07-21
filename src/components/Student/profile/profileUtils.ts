export const displayValue = (value?: string | null) => (value?.trim() ? value.trim() : 'Not set');

export const formatDegreeLine = (degree?: string | null, subject?: string | null, year?: string | null) => {
  const parts = [degree, subject].filter((part) => part?.trim());
  if (parts.length === 0 && !year?.trim()) return 'Not set';
  const degreeText = parts.length > 0 ? parts.join(' ') : 'Not set';
  return year?.trim() ? `${degreeText} • ${year} Year` : degreeText;
};

export const inputClass =
  'w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15';

export const inputDisabledClass =
  'w-full px-3 py-2 rounded-xl border border-input bg-muted text-muted-foreground cursor-not-allowed';

export const readOnlyBadgeClass =
  'absolute right-2 top-2 text-xs px-2 py-1 rounded text-muted-foreground bg-muted';
