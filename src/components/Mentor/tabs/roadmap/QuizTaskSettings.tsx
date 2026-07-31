import React, { useEffect, useState } from 'react';
import { getAvailableDecks } from '../../../../services/db/practiceDeckService';
import { getQuizForTask, getQuizCardsForDeck } from '../../../../services/db/quizService';
import { deckHasScoredItems } from '../../../../services/db/quizScoring';
import type { NegativeMarkValue } from '../../../../types/quizTypes';
import { useAuthContext } from '../../../../lib';

export interface QuizTaskFormData {
  quizId?: string;
  quizDeckId: string;
  quizTitle: string;
  quizNegativeMarkingEnabled: boolean;
  quizNegativeMarkValue: NegativeMarkValue;
}

export const DEFAULT_QUIZ_TASK: QuizTaskFormData = {
  quizDeckId: '',
  quizTitle: '',
  quizNegativeMarkingEnabled: false,
  quizNegativeMarkValue: 0.25,
};

interface QuizTaskSettingsProps {
  taskId?: string;
  taskName: string;
  roadmapId: string;
  batchId?: string;
  quizData: QuizTaskFormData;
  setQuizData: (data: QuizTaskFormData) => void;
}

const inputClass =
  'w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15 transition-colors duration-200 bg-muted text-foreground';

export const QuizTaskSettings: React.FC<QuizTaskSettingsProps> = ({
  taskId,
  taskName,
  roadmapId,
  batchId,
  quizData,
  setQuizData,
}) => {
  const { user } = useAuthContext();
  const [decks, setDecks] = useState<{ id: string; title: string }[]>([]);
  const [deckHasScored, setDeckHasScored] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || !roadmapId) {
      setDecks([]);
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      const available = await getAvailableDecks(user.id, roadmapId);
      setDecks(available.map((d) => ({ id: d.id, title: d.title })));
      setLoading(false);
    })();
  }, [user?.id, roadmapId]);

  useEffect(() => {
    if (!taskId) return;
    (async () => {
      const quiz = await getQuizForTask(taskId);
      if (!quiz) return;
      setQuizData({
        quizId: quiz.id,
        quizDeckId: quiz.practice_deck_id,
        quizTitle: quiz.title,
        quizNegativeMarkingEnabled: quiz.negative_marking_enabled,
        quizNegativeMarkValue: (quiz.negative_mark_value as NegativeMarkValue) ?? 0.25,
      });
    })();
  }, [taskId, setQuizData]);

  useEffect(() => {
    if (!quizData.quizDeckId) {
      setDeckHasScored(false);
      return;
    }
    (async () => {
      const cards = await getQuizCardsForDeck(quizData.quizDeckId);
      setDeckHasScored(deckHasScoredItems(cards));
    })();
  }, [quizData.quizDeckId]);

  useEffect(() => {
    if (!quizData.quizTitle && taskName) {
      setQuizData({ ...quizData, quizTitle: taskName });
    }
  }, [taskName]);

  return (
    <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-4">
      <p className="text-sm font-medium text-foreground">Quiz settings</p>
      <p className="text-xs text-muted-foreground">
        Attach a practice deck with quiz cards. Students launch the quiz from the roadmap map.
      </p>

      <div>
        <label className="block text-sm font-medium mb-2 text-muted-foreground">Practice deck</label>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading decks…</p>
        ) : decks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No decks linked to this roadmap. Create one in Practice Decks and set its roadmap.
          </p>
        ) : (
          <select
            value={quizData.quizDeckId}
            onChange={(e) =>
              setQuizData({
                ...quizData,
                quizDeckId: e.target.value,
                quizTitle: quizData.quizTitle || taskName,
              })
            }
            className={inputClass}
          >
            <option value="">No quiz (task only)</option>
            {decks.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {quizData.quizDeckId && (
        <>
          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">Quiz title</label>
            <input
              type="text"
              value={quizData.quizTitle}
              onChange={(e) => setQuizData({ ...quizData, quizTitle: e.target.value })}
              className={inputClass}
              placeholder="Quiz title shown to students"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={quizData.quizNegativeMarkingEnabled}
                disabled={!deckHasScored}
                onChange={(e) =>
                  setQuizData({ ...quizData, quizNegativeMarkingEnabled: e.target.checked })
                }
              />
              Negative marking on wrong answers
            </label>
            {!deckHasScored && (
              <p className="text-xs text-muted-foreground">
                Applies only to questions with a correct answer. This deck has none (e.g. Likert-only).
              </p>
            )}
            {quizData.quizNegativeMarkingEnabled && deckHasScored && (
              <select
                value={quizData.quizNegativeMarkValue}
                onChange={(e) =>
                  setQuizData({
                    ...quizData,
                    quizNegativeMarkValue: parseFloat(e.target.value) as NegativeMarkValue,
                  })
                }
                className={inputClass}
              >
                <option value={0.25}>−0.25 per wrong</option>
                <option value={0.5}>−0.5 per wrong</option>
                <option value={1}>−1.0 per wrong</option>
              </select>
            )}
          </div>

          {batchId && (
            <p className="text-xs text-muted-foreground">
              Stats for this quiz will filter to the selected batch when viewing Quiz Results.
            </p>
          )}
        </>
      )}
    </div>
  );
};
