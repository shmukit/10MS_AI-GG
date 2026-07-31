import React, { useEffect, useState } from 'react';
import { BarChart3, Users } from 'lucide-react';
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
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        Select a batch with a roadmap to view quiz results.
      </div>
    );
  }

  if (loading) {
    return <p className="text-muted-foreground p-4">Loading quiz stats…</p>;
  }

  if (stats.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        No quizzes on this roadmap yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <BarChart3 className="h-5 w-5" /> Quiz results
      </h2>
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
                {q.avgBestScore.toFixed(1)} / {q.itemMeans.length > 0 ? '40' : '—'} (
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
