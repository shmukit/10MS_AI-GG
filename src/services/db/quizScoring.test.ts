import { describe, it, expect } from 'vitest';
import {
  normalizeQuestionKind,
  isScoredQuestion,
  scoreQuestion,
  scoreAttempt,
  pickDisplayScore,
  deckHasScoredItems,
  validateNegativeMarkValue,
} from './quizScoring';
import type { QuizCard, QuizCardContent } from '../../types/quizTypes';

const likertContent: QuizCardContent = {
  questionKind: 'likert',
  question: 'Q1',
  options: ['1', '2', '3', '4', '5'],
  scaleMin: 1,
  scaleMax: 5,
};

const mcqContent: QuizCardContent = {
  questionKind: 'mcq_single',
  question: 'Q2',
  options: ['A', 'B', 'C'],
  correctAnswer: 1,
};

function card(id: string, content: QuizCardContent): QuizCard {
  return { id, deck_id: 'd', card_type: 'quiz', content, order_index: 0 };
}

describe('quizScoring', () => {
  it('normalizes legacy mcq_single', () => {
    expect(normalizeQuestionKind({ question: 'x', options: [], correctAnswer: 0 })).toBe('mcq_single');
  });

  it('Likert adds scale value to score', () => {
    const r = scoreQuestion(likertContent, { cardId: '1', selectedOption: 4 }, {
      negativeMarkingEnabled: false,
      negativeMarkValue: null,
    });
    expect(r.points).toBe(5);
    expect(r.isCorrect).toBeNull();
  });

  it('8 Likert items max 40', () => {
    const cards = Array.from({ length: 8 }, (_, i) =>
      card(`c${i}`, { ...likertContent, question: `Q${i + 1}` })
    );
    const answers = cards.map((c, i) => ({ cardId: c.id, selectedOption: 4 }));
    const result = scoreAttempt(cards, answers, { negativeMarkingEnabled: false, negativeMarkValue: null });
    expect(result.maxScore).toBe(40);
    expect(result.score).toBe(40);
    expect(result.hasScoredItems).toBe(false);
  });

  it('MCQ correct +1 wrong 0 without negative marking', () => {
    const r = scoreQuestion(mcqContent, { cardId: '1', selectedOption: 0 }, {
      negativeMarkingEnabled: false,
      negativeMarkValue: null,
    });
    expect(r.points).toBe(0);
    expect(r.isCorrect).toBe(false);

    const r2 = scoreQuestion(mcqContent, { cardId: '1', selectedOption: 1 }, {
      negativeMarkingEnabled: false,
      negativeMarkValue: null,
    });
    expect(r2.points).toBe(1);
  });

  it('MCQ wrong applies negative penalty', () => {
    const r = scoreQuestion(mcqContent, { cardId: '1', selectedOption: 0 }, {
      negativeMarkingEnabled: true,
      negativeMarkValue: 0.5,
    });
    expect(r.points).toBe(-0.5);
  });

  it('clamps total score at 0', () => {
    const cards = [card('1', mcqContent), card('2', mcqContent)];
    const answers = [
      { cardId: '1', selectedOption: 0 },
      { cardId: '2', selectedOption: 0 },
    ];
    const result = scoreAttempt(cards, answers, {
      negativeMarkingEnabled: true,
      negativeMarkValue: 1.0,
    });
    expect(result.score).toBe(0);
    expect(result.maxScore).toBe(2);
  });

  it('mcq_multi requires exact match', () => {
    const content: QuizCardContent = {
      questionKind: 'mcq_multi',
      question: 'Pick',
      options: ['A', 'B', 'C'],
      correctAnswers: [0, 2],
    };
    const ok = scoreQuestion(content, { cardId: '1', selectedOptions: [0, 2] }, {
      negativeMarkingEnabled: false,
      negativeMarkValue: null,
    });
    expect(ok.points).toBe(1);

    const partial = scoreQuestion(content, { cardId: '1', selectedOptions: [0] }, {
      negativeMarkingEnabled: false,
      negativeMarkValue: null,
    });
    expect(partial.points).toBe(0);
  });

  it('unscored categorical gives 0 points', () => {
    const content: QuizCardContent = {
      questionKind: 'categorical',
      question: 'Dept?',
      options: ['HR', 'Ops', 'Sales'],
      hasCorrectAnswer: false,
    };
    expect(isScoredQuestion(content)).toBe(false);
    const r = scoreQuestion(content, { cardId: '1', selectedOption: 1 }, {
      negativeMarkingEnabled: true,
      negativeMarkValue: 1.0,
    });
    expect(r.points).toBe(0);
  });

  it('pickDisplayScore best vs latest', () => {
    const attempts = [
      { score: 20, max_score: 40, completed_at: '2026-01-01T10:00:00Z' },
      { score: 32, max_score: 40, completed_at: '2026-01-01T11:00:00Z' },
    ];
    expect(pickDisplayScore(attempts, true)).toEqual({ score: 32, maxScore: 40 });
    expect(pickDisplayScore(attempts, false)).toEqual({ score: 32, maxScore: 40 });
  });

  it('deckHasScoredItems', () => {
    expect(deckHasScoredItems([card('1', likertContent)])).toBe(false);
    expect(deckHasScoredItems([card('1', mcqContent)])).toBe(true);
  });

  it('validateNegativeMarkValue', () => {
    expect(validateNegativeMarkValue(0.25)).toBe(true);
    expect(validateNegativeMarkValue(0.3)).toBe(false);
  });
});
