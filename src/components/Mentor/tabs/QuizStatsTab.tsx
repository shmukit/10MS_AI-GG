import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, Users, PlusCircle } from 'lucide-react';
import { getBatchQuizStats, type BatchQuizStats } from '../../../services/db/quizService';
import type { Batch } from '../../../types/mentor';

interface QuizStatsTabProps {
  batches: Batch[];
  roadmaps: { id: string; title: string }[];
  /** Initial selection from dashboard (Batch & Students / Roadmap tabs) */
  initialBatchId?: string | null;
  initialRoadmapId?: string | null;
  onBatchChange?: (batchId: string) => void;
  onRoadmapChange?: (roadmapId: string) => void;
}

const selectClass =
  'w-full px-3 py-2 border border-border rounded-lg bg-muted text-foreground text-sm focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15';

export const QuizStatsTab: React.FC<QuizStatsTabProps> = ({
  batches,
  roadmaps,
  initialBatchId,
  initialRoadmapId,
  onBatchChange,
  onRoadmapChange,
}) => {
  const [roadmapId, setRoadmapId] = useState(initialRoadmapId || '');
  const [batchId, setBatchId] = useState(initialBatchId || '');
  const [stats, setStats] = useState<BatchQuizStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Keep local selectors in sync when parent selection changes
  useEffect(() => {
    if (initialRoadmapId) setRoadmapId(initialRoadmapId);
  }, [initialRoadmapId]);

  useEffect(() => {
    if (initialBatchId) setBatchId(initialBatchId);
  }, [initialBatchId]);

  // Auto-pick roadmap from selected batch when empty
  useEffect(() => {
    if (roadmapId) return;
    const fromBatch = batches.find((b) => b.id === batchId)?.roadmapId;
    if (fromBatch) {
      setRoadmapId(fromBatch);
      return;
    }
    if (roadmaps.length === 1) setRoadmapId(roadmaps[0].id);
  }, [roadmapId, batchId, batches, roadmaps]);

  const batchesForRoadmap = useMemo(() => {
    if (!roadmapId) return batches;
    return batches.filter((b) => b.roadmapId === roadmapId);
  }, [batches, roadmapId]);

  // If current batch isn't on this roadmap, clear batch (All cohorts)
  useEffect(() => {
    if (!batchId || !roadmapId) return;
    const ok = batches.some((b) => b.id === batchId && b.roadmapId === roadmapId);
    if (!ok) setBatchId('');
  }, [roadmapId, batchId, batches]);

  useEffect(() => {
    if (!roadmapId) {
      setStats([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await getBatchQuizStats(roadmapId, batchId || null);
        if (!cancelled) setStats(data);
      } catch (e) {
        console.error('Quiz stats load failed', e);
        if (!cancelled) {
          setStats([]);
          setLoadError('Could not load quiz results. Try again.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [roadmapId, batchId]);

  const handleRoadmapChange = (id: string) => {
    setRoadmapId(id);
    onRoadmapChange?.(id);
  };

  const handleBatchChange = (id: string) => {
    setBatchId(id);
    if (id) {
      const batch = batches.find((b) => b.id === id);
      if (batch?.roadmapId && batch.roadmapId !== roadmapId) {
        setRoadmapId(batch.roadmapId);
        onRoadmapChange?.(batch.roadmapId);
      }
      onBatchChange?.(id);
    }
  };

  const selectedRoadmapTitle = roadmaps.find((r) => r.id === roadmapId)?.title;
  const selectedBatchName = batches.find((b) => b.id === batchId)?.name;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" /> Quiz results
        </h2>
        <p className="text-sm text-muted-foreground">
          Filter by roadmap and batch/cohort. Likert self-checks show averages; scored quizzes show correct rates.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">Roadmap</label>
          <select
            value={roadmapId}
            onChange={(e) => handleRoadmapChange(e.target.value)}
            className={selectClass}
          >
            <option value="">Select roadmap…</option>
            {roadmaps.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">Batch / cohort</label>
          <select
            value={batchId}
            onChange={(e) => handleBatchChange(e.target.value)}
            className={selectClass}
            disabled={!roadmapId}
          >
            <option value="">All batches on this roadmap</option>
            {batchesForRoadmap.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!roadmapId && (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          Select a roadmap to view quiz results.
        </div>
      )}

      {roadmapId && loading && (
        <p className="text-muted-foreground p-4">Loading quiz stats…</p>
      )}

      {roadmapId && loadError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive text-sm">
          {loadError}
        </div>
      )}

      {roadmapId && !loading && !loadError && stats.length === 0 && (
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <BarChart3 className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No quizzes on this roadmap</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {selectedRoadmapTitle ? (
                <>
                  <span className="font-medium text-foreground">{selectedRoadmapTitle}</span> has no
                  active quizzes linked yet.
                </>
              ) : (
                'This roadmap has no quizzes attached.'
              )}{' '}
              Student answers only appear here after a quiz is linked to an MCQ task.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h4 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
              <PlusCircle className="h-5 w-5 text-primary" /> How to add a quiz
            </h4>
            <ol className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  1
                </span>
                <span>
                  Go to <strong className="text-foreground">Practice Decks</strong> and create a deck
                  with quiz cards (Likert, MCQ, etc.).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  2
                </span>
                <span>
                  Set the deck’s <strong className="text-foreground">Roadmap</strong> so students can
                  see it.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  3
                </span>
                <span>
                  Go to <strong className="text-foreground">Roadmap</strong>, add or edit an{' '}
                  <strong className="text-foreground">MCQ</strong> task, and attach the deck in quiz
                  settings.
                </span>
              </li>
            </ol>
          </div>
        </div>
      )}

      {roadmapId && !loading && stats.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Showing {stats.length} quiz{stats.length !== 1 ? 'zes' : ''}
            {selectedRoadmapTitle ? (
              <>
                {' '}
                on <span className="font-medium text-foreground">{selectedRoadmapTitle}</span>
              </>
            ) : null}
            {selectedBatchName ? (
              <>
                {' '}
                · cohort <span className="font-medium text-foreground">{selectedBatchName}</span>
              </>
            ) : (
              ' · all cohorts'
            )}
          </p>

          {stats.map((q) => {
            const maxLabel =
              q.students.find((s) => s.maxScore != null)?.maxScore ??
              (q.itemMeans.length > 0 ? 40 : null);
            return (
              <div key={q.quizId} className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedQuiz(expandedQuiz === q.quizId ? null : q.quizId)}
                  className="w-full flex flex-wrap items-center justify-between gap-3 p-4 text-left hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-foreground">{q.quizTitle}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {q.attemptedCount} / {q.enrolledCount} attempted
                      {maxLabel != null ? (
                        <>
                          {' '}
                          · avg {q.avgBestScore.toFixed(1)} / {maxLabel} (
                          {q.avgBestPercent.toFixed(0)}%)
                        </>
                      ) : null}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {expandedQuiz === q.quizId ? 'Hide' : 'Details'}
                  </span>
                </button>
                {expandedQuiz === q.quizId && (
                  <div className="border-t border-border p-4 space-y-4">
                    {q.attemptedCount === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No completed attempts for this filter yet.
                      </p>
                    )}
                    {q.itemMeans.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Per-question average (1–5)</p>
                        <ul className="space-y-1 text-sm">
                          {q.itemMeans.map((item) => (
                            <li key={item.cardId} className="flex justify-between gap-2">
                              <span className="text-muted-foreground truncate">{item.question}</span>
                              <span className="font-mono shrink-0">
                                {item.mean.toFixed(2)}{' '}
                                <span className="text-muted-foreground">({item.responseCount})</span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {q.itemCorrectRates.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Scored item correct rate</p>
                        <ul className="space-y-1 text-sm">
                          {q.itemCorrectRates.map((item) => (
                            <li key={item.cardId} className="flex justify-between gap-2">
                              <span className="text-muted-foreground truncate">{item.question}</span>
                              <span className="font-mono shrink-0">
                                {(item.correctRate * 100).toFixed(0)}%
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Users className="h-4 w-4" /> Students
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-muted-foreground border-b border-border">
                              <th className="py-2 pr-4">Name</th>
                              <th className="py-2 pr-4">Best</th>
                              <th className="py-2 pr-4">Latest</th>
                              <th className="py-2">Attempts</th>
                            </tr>
                          </thead>
                          <tbody>
                            {q.students.map((s) => (
                              <tr key={s.studentId} className="border-b border-border/50">
                                <td className="py-2 pr-4">{s.name}</td>
                                <td className="py-2 pr-4 font-mono">
                                  {s.bestScore != null && s.maxScore != null
                                    ? `${s.bestScore}/${s.maxScore}`
                                    : '—'}
                                </td>
                                <td className="py-2 pr-4 font-mono">
                                  {s.latestScore != null && s.maxScore != null
                                    ? `${s.latestScore}/${s.maxScore}`
                                    : '—'}
                                </td>
                                <td className="py-2">{s.attemptCount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
