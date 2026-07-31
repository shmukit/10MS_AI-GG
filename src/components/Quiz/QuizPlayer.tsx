import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import type { QuizCard, QuizCardContent, QuestionKind, RoadmapQuiz } from '../../types/quizTypes';
import { normalizeQuestionKind, isScoredQuestion } from '../../services/db/quizScoring';
import {
  getQuizCardsForDeck,
  startQuizAttempt,
  submitQuizAttempt,
} from '../../services/db/quizService';
import type { StudentAnswerInput } from '../../types/quizTypes';

interface QuizPlayerProps {
  quiz: RoadmapQuiz;
  studentId: string;
  batchId?: string;
  taskId?: string;
  onClose: () => void;
  onComplete?: (score: number, maxScore: number) => void;
}

type Phase = 'intro' | 'question' | 'summary';

function QuestionInput({
  content,
  selectedOption,
  selectedOptions,
  onSelectOption,
  onToggleMulti,
  submitted,
}: {
  content: QuizCardContent;
  selectedOption: number | null;
  selectedOptions: number[];
  onSelectOption: (idx: number) => void;
  onToggleMulti: (idx: number) => void;
  submitted: boolean;
}) {
  const kind: QuestionKind = normalizeQuestionKind(content);
  const options = content.options?.filter((o) => o.trim()) ?? [];

  if (kind === 'likert') {
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
        {options.map((label, idx) => {
          const active = selectedOption === idx;
          return (
            <button
              key={idx}
              type="button"
              disabled={submitted}
              onClick={() => onSelectOption(idx)}
              className={`min-h-[48px] rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                active
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-muted/50 hover:bg-accent'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
  }

  if (kind === 'mcq_multi') {
    return (
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground mb-2">Select all that apply</p>
        {options.map((opt, idx) => {
          const checked = selectedOptions.includes(idx);
          return (
            <label
              key={idx}
              className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 ${
                checked ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'
              } ${submitted ? 'pointer-events-none opacity-80' : ''}`}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={submitted}
                onChange={() => onToggleMulti(idx)}
                className="h-5 w-5 accent-primary"
              />
              <span className="text-sm">{opt}</span>
            </label>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {options.map((opt, idx) => {
        const active = selectedOption === idx;
        return (
          <button
            key={idx}
            type="button"
            disabled={submitted}
            onClick={() => onSelectOption(idx)}
            className={`flex min-h-[48px] w-full items-center rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
              active
                ? 'border-primary bg-primary/10 text-foreground'
                : 'border-border bg-muted/30 hover:bg-accent'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({
  quiz,
  studentId,
  batchId,
  onClose,
  onComplete,
}) => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [cards, setCards] = useState<QuizCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, StudentAnswerInput>>(new Map());
  const [submittedCurrent, setSubmittedCurrent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [finalScore, setFinalScore] = useState<{ score: number; max: number } | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const loaded = await getQuizCardsForDeck(quiz.practice_deck_id);
      setCards(loaded);
      setLoading(false);
    })();
  }, [quiz.practice_deck_id]);

  const currentCard = cards[currentIndex];
  const currentContent = currentCard?.content;
  const currentAnswer = currentCard ? answers.get(currentCard.id) : undefined;
  const selectedOption = currentAnswer?.selectedOption ?? null;
  const selectedOptions = currentAnswer?.selectedOptions ?? [];
  const scored = currentContent ? isScoredQuestion(currentContent) : false;
  const hasScoredInQuiz = useMemo(
    () => cards.some((c) => isScoredQuestion(c.content)),
    [cards]
  );

  const canProceed = useMemo(() => {
    if (!currentContent) return false;
    const kind = normalizeQuestionKind(currentContent);
    if (kind === 'mcq_multi') return selectedOptions.length > 0;
    return selectedOption !== null;
  }, [currentContent, selectedOption, selectedOptions]);

  const startQuiz = async () => {
    const attempt = await startQuizAttempt(studentId, quiz, batchId);
    if (!attempt) {
      alert('Could not start quiz. Try again.');
      return;
    }
    setAttemptId(attempt.id);
    setPhase('question');
  };

  const saveCurrentAnswer = useCallback(
    (patch: Partial<StudentAnswerInput>) => {
      if (!currentCard) return;
      setAnswers((prev) => {
        const next = new Map(prev);
        next.set(currentCard.id, {
          cardId: currentCard.id,
          selectedOption: patch.selectedOption ?? prev.get(currentCard.id)?.selectedOption ?? null,
          selectedOptions: patch.selectedOptions ?? prev.get(currentCard.id)?.selectedOptions ?? null,
        });
        return next;
      });
    },
    [currentCard]
  );

  const handleSubmitQuestion = () => {
    if (!canProceed) return;
    setSubmittedCurrent(true);
  };

  const goNext = async () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSubmittedCurrent(false);
      return;
    }

    if (!attemptId) return;
    setSubmitting(true);
    const answerList = cards.map((c) => answers.get(c.id) ?? { cardId: c.id });
    const result = await submitQuizAttempt(attemptId, quiz, cards, answerList);
    setSubmitting(false);

    if (!result) {
      alert('Could not save quiz. Try again.');
      return;
    }

    setFinalScore({
      score: Number(result.attempt.score),
      max: Number(result.attempt.max_score),
    });
    setPhase('summary');
    onComplete?.(Number(result.attempt.score), Number(result.attempt.max_score));
  };

  const handlePrimaryAction = () => {
    if (phase === 'intro') {
      void startQuiz();
      return;
    }
    if (!submittedCurrent) {
      handleSubmitQuestion();
      return;
    }
    void goNext();
  };

  const feedback = useMemo(() => {
    if (!submittedCurrent || !currentContent || !scored) return null;
    const kind = normalizeQuestionKind(currentContent);
    let correct = false;
    if (kind === 'mcq_multi') {
      const exp = [...(currentContent.correctAnswers ?? [])].sort((a, b) => a - b);
      const sel = [...selectedOptions].sort((a, b) => a - b);
      correct =
        exp.length === sel.length && exp.every((v, i) => v === sel[i]);
    } else if (typeof currentContent.correctAnswer === 'number') {
      correct = selectedOption === currentContent.correctAnswer;
    }
    return correct ? 'correct' : 'incorrect';
  }, [submittedCurrent, currentContent, scored, selectedOption, selectedOptions]);

  const primaryLabel =
    phase === 'intro'
      ? 'Start quiz'
      : !submittedCurrent
        ? 'Confirm answer'
        : currentIndex < cards.length - 1
          ? 'Next question'
          : submitting
            ? 'Saving…'
            : 'Submit quiz';

  const content = (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background">
      <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3 safe-area-inset-top">
        <div className="min-w-0 flex-1 pr-3">
          <h2 className="truncate text-base font-semibold text-foreground">{quiz.title}</h2>
          {phase === 'question' && cards.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Question {currentIndex + 1} of {cards.length}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 hover:bg-accent"
          aria-label="Close quiz"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      {phase === 'question' && cards.length > 0 && (
        <div className="h-1 shrink-0 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentIndex + (submittedCurrent ? 1 : 0)) / cards.length) * 100}%` }}
          />
        </div>
      )}

      <main className="flex-1 overflow-y-auto px-4 py-6 pb-28">
        {loading && <p className="text-muted-foreground">Loading questions…</p>}

        {!loading && cards.length === 0 && (
          <p className="text-muted-foreground">This quiz has no questions yet.</p>
        )}

        {phase === 'intro' && !loading && cards.length > 0 && (
          <div className="mx-auto max-w-lg space-y-4">
            {quiz.description && (
              <p className="text-sm text-muted-foreground">{quiz.description}</p>
            )}
            <p className="text-sm">
              {cards.length} question{cards.length !== 1 ? 's' : ''}.
              {hasScoredInQuiz && quiz.negative_marking_enabled && quiz.negative_mark_value != null && (
                <span className="mt-2 block text-amber-700 dark:text-amber-400">
                  Wrong answers on scored questions: −{quiz.negative_mark_value} pt each.
                </span>
              )}
            </p>
          </div>
        )}

        {phase === 'question' && currentCard && currentContent && (
          <div className="mx-auto max-w-lg space-y-6">
            <p className="text-lg font-medium leading-snug text-foreground">
              {currentContent.question}
            </p>
            <QuestionInput
              content={currentContent}
              selectedOption={selectedOption}
              selectedOptions={selectedOptions}
              submitted={submittedCurrent}
              onSelectOption={(idx) => saveCurrentAnswer({ selectedOption: idx })}
              onToggleMulti={(idx) => {
                const next = selectedOptions.includes(idx)
                  ? selectedOptions.filter((i) => i !== idx)
                  : [...selectedOptions, idx];
                saveCurrentAnswer({ selectedOptions: next });
              }}
            />
            {feedback === 'correct' && (
              <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" /> Correct
              </div>
            )}
            {feedback === 'incorrect' && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-400">
                <XCircle className="h-4 w-4 shrink-0" /> Incorrect
                {quiz.negative_marking_enabled && quiz.negative_mark_value != null && (
                  <span className="ml-1">(−{quiz.negative_mark_value})</span>
                )}
              </div>
            )}
            {submittedCurrent && !scored && (
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0" /> Saved
              </div>
            )}
          </div>
        )}

        {phase === 'summary' && finalScore && (
          <div className="mx-auto max-w-lg space-y-6 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {finalScore.score} / {finalScore.max}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {finalScore.max > 0
                  ? `${Math.round((finalScore.score / finalScore.max) * 100)}%`
                  : 'Complete'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setPhase('intro');
                setCurrentIndex(0);
                setAnswers(new Map());
                setSubmittedCurrent(false);
                setAttemptId(null);
                setFinalScore(null);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm hover:bg-accent"
            >
              <RotateCcw className="h-4 w-4" /> Retake
            </button>
          </div>
        )}
      </main>

      {(phase === 'intro' || phase === 'question') && cards.length > 0 && (
        <footer className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 px-4 py-4 backdrop-blur safe-area-inset-bottom">
          <button
            type="button"
            disabled={
              (phase === 'question' && !submittedCurrent && !canProceed) || submitting
            }
            onClick={handlePrimaryAction}
            className="w-full min-h-[48px] rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {primaryLabel}
          </button>
        </footer>
      )}

      {phase === 'summary' && (
        <footer className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 px-4 py-4 backdrop-blur safe-area-inset-bottom">
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[48px] rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
          >
            Done
          </button>
        </footer>
      )}
    </div>
  );

  return createPortal(content, document.body);
};
