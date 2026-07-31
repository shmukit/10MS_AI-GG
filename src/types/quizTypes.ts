export type QuestionKind =
  | 'likert'
  | 'binary'
  | 'categorical'
  | 'mcq_single'
  | 'mcq_multi';

export type NegativeMarkValue = 0.25 | 0.5 | 1.0;

export interface QuizCardContent {
  questionKind?: QuestionKind;
  question: string;
  options: string[];
  scaleMin?: number;
  scaleMax?: number;
  hasCorrectAnswer?: boolean;
  correctAnswer?: number;
  correctAnswers?: number[];
}

export interface StudentAnswerInput {
  cardId: string;
  selectedOption?: number | null;
  selectedOptions?: number[] | null;
}

export interface ScoredAnswer {
  cardId: string;
  selectedOption: number | null;
  selectedOptions: number[] | null;
  isCorrect: boolean | null;
  points: number;
}

export interface AttemptScoreResult {
  score: number;
  maxScore: number;
  answers: ScoredAnswer[];
  hasScoredItems: boolean;
}

export interface RoadmapQuiz {
  id: string;
  roadmap_id: string;
  practice_deck_id: string;
  task_id: string | null;
  batch_id: string | null;
  title: string;
  description: string | null;
  is_active: boolean;
  negative_marking_enabled: boolean;
  negative_mark_value: number | null;
  default_question_kind: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: string;
  student_id: string;
  roadmap_quiz_id: string;
  batch_id: string | null;
  score: number;
  max_score: number;
  negative_marking_enabled: boolean;
  negative_mark_value: number | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export interface QuizAttemptAnswer {
  id: string;
  attempt_id: string;
  card_id: string;
  selected_option: number | null;
  selected_options: number[] | null;
  is_correct: boolean | null;
  points: number;
  created_at: string;
}

export interface QuizCard {
  id: string;
  deck_id: string;
  card_type: string;
  content: QuizCardContent;
  order_index: number;
}

export const LIKERT_DEFAULT_LABELS = [
  '1 — Not at all',
  '2',
  '3 — A little',
  '4',
  '5 — Yes, confidently',
];

export const QUESTION_KIND_LABELS: Record<QuestionKind, string> = {
  likert: 'Likert scale (1–5)',
  binary: 'Binary (2 options)',
  categorical: 'Categorical (single choice)',
  mcq_single: 'MCQ (one correct)',
  mcq_multi: 'MCQ (one or more correct)',
};
