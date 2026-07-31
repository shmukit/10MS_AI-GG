import React, { useEffect, useState } from 'react';
import { BarChart3, Users, PlusCircle } from 'lucide-react';
import { getBatchQuizStats, type BatchQuizStats } from '../../../services/db/quizService';

interface QuizStatsTabProps {
  selectedBatchId: string | null;
  roadmapId: string | null;
}

export const QuizStatsTab: React.FC<QuizStatsTabProps> = ({ selectedBatchId, roadmapId }) => {
  const [stats, setStats] = useState<BatchQuizStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedBatchId || !roadmapId) {
      setStats([]);
      return;
    }
    (async () => {
      setLoading(true);
      const data = await getBatchQuizStats(selectedBatchId, roadmapId);
      setStats(data);
      setLoading(false);
    })();
  }, [selectedBatchId, roadmapId]);

  if (!selectedBatchId || !roadmapId) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <BarChart3 className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No batch or roadmap selected</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a batch from the Batch & Students tab or the Roadmap tab first, then return here to see quiz results.
        </p>
      </div>
    );
  }

  if (loading) {
    return <p className="text-muted-foreground p-4">Loading quiz stats…</p>;
  }

  if (stats.length === 0) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <BarChart3 className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No quizzes yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            This roadmap has no quizzes attached. Once students complete quizzes, scores and per-question breakdowns will appear here.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h4 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
            <PlusCircle className="h-5 w-5 text-primary" /> How to add a quiz
          </h4>
          <ol className="space-y-4 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">1</span>
              <span>
                Go to <strong className="text-foreground">Practice Decks</strong> and create a deck with quiz cards (Likert, MCQ, etc.).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">2</span>
              <span>
                Set the deck’s <strong className="text-foreground">Roadmap</strong> so students can see it.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">3</span>
              <span>
                Go to <strong className="text-foreground">Roadmap</strong>, add or edit an <strong className="text-foreground">MCQ</strong> task, and attach the deck in the quiz settings.
              </span>
            </li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Quiz results</h2>
      </div>
      {stats.map((q) => (
        <div key={q.quizId} className="rounded-xl border border-border bg-card overflow-hidden">
          <button
            type="button"
            onClick={() => setExpandedQuiz(expandedQuiz === q.quizId ? null : q.quizId)}
            className="w-full flex flex-wrap items-center justify-between gap-3 p-4 text-left hover:bg-muted/50"
          >
            <div>
              <p className="font-medium text-foreground">{q.quizTitle}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {q.attemptedCount} / {q.enrolledCount} attempted · avg{' '}
                {q.avgBestScore.toFixed(1)} / {q.itemMeans.length > 0 ? q.avgBestPercent.toFixed(0) : '—'} (
                {q.avgBestPercent.toFixed(0)}%)
              </p>
            </div>
            <span className="text-xs text-muted-foreground">{expandedQuiz === q.quizId ? 'Hide' : 'Details'}</span>
          </button>
          {expandedQuiz === q.quizId && (
            <div className="border-t border-border p-4 space-y-4">
              {q.itemMeans.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Likert item means</p>
                  <ul className="space-y-1 text-sm">
                    {q.itemMeans.map((item) => (
                      <li key={item.cardId} className="flex justify-between gap-2">
                        <span className="text-muted-foreground truncate">{item.question}</span>
                        <span className="font-mono shrink-0">{item.mean.toFixed(2)}</span>
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
                        <span className="font-mono shrink-0">{(item.correctRate * 100).toFixed(0)}%</span>
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
      ))}
    </div>
  );
};
