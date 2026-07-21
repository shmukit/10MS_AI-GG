export type SlidesViewerMode = 'pdf' | 'embed';

const PDF_EXTENSIONS = /\.pdf(\?|#|$)/i;
const PPT_EXTENSIONS = /\.pptx?(\?|#|$)/i;

export function hasSlidesUrl(url?: string | null): url is string {
  return typeof url === 'string' && url.trim().length > 0;
}

export function getSlidesViewerMode(url: string): SlidesViewerMode {
  const trimmed = url.trim().toLowerCase();

  if (PDF_EXTENSIONS.test(trimmed)) {
    return 'pdf';
  }

  if (
    trimmed.includes('docs.google.com/presentation') ||
    trimmed.includes('slides.google.com') ||
    trimmed.includes('/pubembed') ||
    trimmed.includes('/embed')
  ) {
    return 'embed';
  }

  if (PPT_EXTENSIONS.test(trimmed)) {
    return 'embed';
  }

  if (trimmed.includes('drive.google.com/file')) {
    return 'pdf';
  }

  // Default: try PDF rendering for direct file hosts; fall back to iframe embed.
  return trimmed.includes('pdf') ? 'pdf' : 'embed';
}

/** Normalize mentor-pasted URLs into viewer-friendly forms. */
export function normalizeSlidesUrl(url: string): string {
  const trimmed = url.trim();

  const slidesEditMatch = trimmed.match(
    /docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/
  );
  if (slidesEditMatch) {
    return `https://docs.google.com/presentation/d/${slidesEditMatch[1]}/embed?start=false&loop=false&delayms=3000`;
  }

  const driveFileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch && getSlidesViewerMode(trimmed) === 'pdf') {
    return `https://drive.google.com/uc?export=download&id=${driveFileMatch[1]}`;
  }

  if (PPT_EXTENSIONS.test(trimmed) && !trimmed.includes('docs.google.com')) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(trimmed)}&embedded=true`;
  }

  return trimmed;
}

export function getSlidesPageLabel(mode: SlidesViewerMode, currentPage: number, totalPages: number): string {
  if (mode === 'embed') {
    return 'Embedded presentation';
  }
  if (totalPages === 0) {
    return 'Loading…';
  }
  return `Page ${currentPage} of ${totalPages}`;
}
