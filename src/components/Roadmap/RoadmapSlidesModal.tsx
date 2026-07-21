import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Presentation } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  getSlidesViewerMode,
  getSlidesPageLabel,
  normalizeSlidesUrl,
  SlidesViewerMode,
} from '../../utils/slidesUtils';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface RoadmapSlidesModalProps {
  isOpen: boolean;
  onClose: () => void;
  slidesUrl: string;
  roadmapTitle?: string;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.15;

export const RoadmapSlidesModal: React.FC<RoadmapSlidesModalProps> = ({
  isOpen,
  onClose,
  slidesUrl,
  roadmapTitle,
}) => {
  const normalizedUrl = useMemo(() => normalizeSlidesUrl(slidesUrl), [slidesUrl]);
  const mode: SlidesViewerMode = useMemo(() => getSlidesViewerMode(normalizedUrl), [normalizedUrl]);

  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setPageNumber(1);
    setNumPages(0);
    setZoom(1);
    setPdfError(null);
  }, [isOpen, normalizedUrl]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
      if (mode === 'pdf') {
        if (event.key === 'ArrowRight') {
          setPageNumber((p) => Math.min(p + 1, numPages || p));
        }
        if (event.key === 'ArrowLeft') {
          setPageNumber((p) => Math.max(p - 1, 1));
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, mode, numPages, onClose]);

  const goPrev = useCallback(() => {
    setPageNumber((p) => Math.max(p - 1, 1));
  }, []);

  const goNext = useCallback(() => {
    setPageNumber((p) => Math.min(p + 1, numPages || p));
  }, [numPages]);

  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(MIN_ZOOM, Math.round((z - ZOOM_STEP) * 100) / 100));
  }, []);

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(MAX_ZOOM, Math.round((z + ZOOM_STEP) * 100) / 100));
  }, []);

  if (!isOpen) return null;

  const canGoPrev = mode === 'pdf' && pageNumber > 1;
  const canGoNext = mode === 'pdf' && numPages > 0 && pageNumber < numPages;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Workshop slides"
      onClick={onClose}
    >
      <div
        className="flex flex-col w-full max-w-5xl h-[90vh] rounded-xl bg-card border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Presentation className="w-5 h-5 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {roadmapTitle ? `${roadmapTitle} — Slides` : 'Workshop Slides'}
              </p>
              <p className="text-xs text-muted-foreground">
                {getSlidesPageLabel(mode, pageNumber, numPages)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
            aria-label="Close slides"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 px-4 py-2 border-b border-border bg-muted/30 shrink-0">
          <button
            type="button"
            onClick={goPrev}
            disabled={!canGoPrev}
            className="p-2 rounded-lg border border-border bg-card disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
            className="p-2 rounded-lg border border-border bg-card disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-border mx-1" />
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom <= MIN_ZOOM}
            className="p-2 rounded-lg border border-border bg-card disabled:opacity-40 hover:bg-accent"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-muted-foreground w-14 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom >= MAX_ZOOM}
            className="p-2 rounded-lg border border-border bg-card disabled:opacity-40 hover:bg-accent"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-muted/20 p-4">
          {mode === 'pdf' ? (
            <div className="flex justify-center min-h-full">
              {pdfError ? (
                <div className="text-center py-12 px-4">
                  <p className="text-muted-foreground mb-2">Could not load PDF slides.</p>
                  <p className="text-sm text-muted-foreground">{pdfError}</p>
                  <a
                    href={normalizedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-4 text-sm text-primary hover:underline"
                  >
                    Open in new tab
                  </a>
                </div>
              ) : (
                <Document
                  file={normalizedUrl}
                  onLoadSuccess={({ numPages: total }) => {
                    setNumPages(total);
                    setPageNumber(1);
                    setPdfError(null);
                  }}
                  onLoadError={(error) => {
                    setPdfError(error.message || 'Failed to load PDF');
                  }}
                  loading={
                    <div className="py-16 text-muted-foreground text-sm">Loading slides…</div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={zoom}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="shadow-lg"
                  />
                </Document>
              )}
            </div>
          ) : (
            <div
              className="mx-auto origin-top transition-transform duration-200"
              style={{
                transform: `scale(${zoom})`,
                width: `${100 / zoom}%`,
                height: `${100 / zoom}%`,
                minHeight: '100%',
              }}
            >
              <iframe
                src={normalizedUrl}
                title="Workshop slides"
                className="w-full h-full min-h-[70vh] rounded-lg border border-border bg-white"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {mode === 'embed' && (
          <p className="text-xs text-center text-muted-foreground px-4 py-2 border-t border-border shrink-0">
            Use the controls inside the presentation to move between slides. Zoom uses the buttons above.
          </p>
        )}
      </div>
    </div>
  );
};
