import type {
  NegativeMarkValue,
  QuizCard,
  QuizCardContent,
  QuestionKind,
  ScoredAnswer,
  StudentAnswerInput,
  AttemptScoreResult,
} from '../../types/quizTypes';

export function normalizeQuestionKind(content: QuizCardContent): QuestionKind {
  if (content.questionKind) return content.questionKind;
  if (typeof content.correctAnswer === 'number') return 'mcq_single';
  return 'mcq_single';
}

export function isScoredQuestion(content: QuizCardContent): boolean {
  const kind = normalizeQuestionKind(content);
  if (kind === 'likert') return false;
  if (kind === 'binary' || kind === 'categorical') {
    return content.hasCorrectAnswer === true && typeof content.correctAnswer === 'number';
  }
  if (kind === 'mcq_single') return typeof content.correctAnswer === 'number';
  if (kind === 'mcq_multi') {
    return Array.isArray(content.correctAnswers) && content.correctAnswers.length > 0;
  }
  return false;
}

export function deckHasScoredItems(cards: QuizCard[]): boolean {
  return cards.some((c) => c.card_type === 'quiz' && isScoredQuestion(c.content));
}

export function getQuestionMaxPoints(content: QuizCardContent): number {
  const kind = normalizeQuestionKind(content);
  if (kind === 'likert') {
    const max = content.scaleMax ?? 5;
    return max;
  }
  if (isScoredQuestion(content)) return 1;
  return 0;
}

function arraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort((x, y) => x - y);
  const sb = [...b].sort((x, y) => x - y);
  return sa.every((v, i) => v === sb[i]);
}

export function scoreQuestion(
  content: QuizCardContent,
  answer: StudentAnswerInput,
  opts: { negativeMarkingEnabled: boolean; negativeMarkValue: NegativeMarkValue | null }
): ScoredAnswer {
  const kind = normalizeQuestionKind(content);
  const base: ScoredAnswer = {
    cardId: answer.cardId,
    selectedOption: answer.selectedOption ?? null,
    selectedOptions: answer.selectedOptions ?? null,
    isCorrect: null,
    points: 0,
  };

  if (kind === 'likert') {
    const min = content.scaleMin ?? 1;
    const max = content.scaleMax ?? 5;
    const idx = answer.selectedOption ?? -1;
    const value = min + idx;
    if (idx >= 0 && idx < (content.options?.length ?? max - min + 1)) {
      base.points = value;
    }
    return base;
  }

  if (kind === 'binary' || kind === 'categorical') {
    if (!isScoredQuestion(content)) {
      return base;
    }
    const correct = content.correctAnswer!;
    const selected = answer.selectedOption;
    const ok = selected === correct;
    base.isCorrect = ok;
    if (ok) {
      base.points = 1;
    } else if (selected != null && opts.negativeMarkingEnabled && opts.negativeMarkValue) {
      base.points = -opts.negativeMarkValue;
    }
    return base;
  }

  if (kind === 'mcq_single') {
    const correct = content.correctAnswer!;
    const selected = answer.selectedOption;
    const ok = selected === correct;
    base.isCorrect = ok;
    if (ok) {
      base.points = 1;
    } else if (selected != null && opts.negativeMarkingEnabled && opts.negativeMarkValue) {
      base.points = -opts.negativeMarkValue;
    }
    return base;
  }

  if (kind === 'mcq_multi') {
    const correct = [...(content.correctAnswers ?? [])].sort((a, b) => a - b);
    const selected = [...(answer.selectedOptions ?? [])].sort((a, b) => a - b);
    const ok = arraysEqual(selected, correct);
    base.isCorrect = ok;
    if (ok) {
      base.points = 1;
    } else if (selected.length > 0 && opts.negativeMarkingEnabled && opts.negativeMarkValue) {
      base.points = -opts.negativeMarkValue;
    }
    return base;
  }

  return base;
}

export function scoreAttempt(
  cards: QuizCard[],
  answers: StudentAnswerInput[],
  opts: { negativeMarkingEnabled: boolean; negativeMarkValue: NegativeMarkValue | null }
): AttemptScoreResult {
  const quizCards = cards.filter((c) => c.card_type === 'quiz');
  const answerMap = new Map(answers.map((a) => [a.cardId, a]));
  const scoredAnswers: ScoredAnswer[] = [];
  let maxScore = 0;
  let hasScoredItems = false;

  for (const card of quizCards) {
    const content = card.content;
    maxScore += getQuestionMaxPoints(content);
    if (isScoredQuestion(content)) hasScoredItems = true;
    const input = answerMap.get(card.id) ?? { cardId: card.id };
    scoredAnswers.push(scoreQuestion(content, input, opts));
  }

  const raw = scoredAnswers.reduce((sum, a) => sum + a.points, 0);
  const score = Math.max(0, raw);

  return { score, maxScore, answers: scoredAnswers, hasScoredItems };
}

export function pickDisplayScore(
  attempts: { score: number; max_score: number; completed_at: string | null }[],
  preferBest: boolean
): { score: number; maxScore: number } | null {
  const completed = attempts.filter((a) => a.completed_at);
  if (completed.length === 0) return null;
  if (preferBest) {
    const best = completed.reduce((a, b) => (a.score > b.score ? a : b));
    return { score: Number(best.score), maxScore: Number(best.max_score) };
  }
  const latest = completed.sort(
    (a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime()
  )[0];
  return { score: Number(latest.score), maxScore: Number(latest.max_score) };
}

export function validateNegativeMarkValue(v: number | null): v is NegativeMarkValue {
  return v === 0.25 || v === 0.5 || v === 1.0;
}
