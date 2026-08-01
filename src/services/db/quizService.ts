import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/database.types';
import type {
  RoadmapQuiz,
  QuizAttempt,
  QuizAttemptAnswer,
  QuizCard,
  StudentAnswerInput,
  NegativeMarkValue,
} from '../../types/quizTypes';
import {
  scoreAttempt,
  deckHasScoredItems,
  pickDisplayScore,
  validateNegativeMarkValue,
} from './quizScoring';
import { getDeckCards } from './practiceDeckService';

type DbTable = keyof Database['public']['Tables'];
type TaskQuizIdRow = Pick<Database['public']['Tables']['roadmap_tasks']['Row'], 'quiz_id'>;

/** Work around Supabase inferring `never` when Relationships are absent from Database types. */
const db = (table: DbTable) => supabase.from(table) as any;

export interface BatchQuizStats {
  quizId: string;
  quizTitle: string;
  enrolledCount: number;
  attemptedCount: number;
  avgBestScore: number;
  avgBestPercent: number;
  itemMeans: { cardId: string; question: string; mean: number; responseCount: number }[];
  itemCorrectRates: { cardId: string; question: string; correctRate: number; responseCount: number }[];
  students: {
    studentId: string;
    name: string;
    bestScore: number | null;
    latestScore: number | null;
    maxScore: number | null;
    attemptCount: number;
  }[];
}

export async function getQuizById(quizId: string): Promise<RoadmapQuiz | null> {
  const { data, error } = await db('roadmap_quizzes')
    .select('*')
    .eq('id', quizId)
    .maybeSingle();
  if (error) {
    console.error('getQuizById', error);
    return null;
  }
  return data as RoadmapQuiz | null;
}

export async function getQuizForTask(taskId: string): Promise<RoadmapQuiz | null> {
  const { data, error } = await db('roadmap_quizzes')
    .select('*')
    .eq('task_id', taskId)
    .eq('is_active', true)
    .maybeSingle();
  if (error) {
    console.error('getQuizForTask', error);
    return null;
  }
  if (data) return data as RoadmapQuiz;

  const { data: taskRow } = await db('roadmap_tasks')
    .select('quiz_id')
    .eq('id', taskId)
    .maybeSingle();

  const task = taskRow as TaskQuizIdRow | null;
  if (!task?.quiz_id) return null;
  return getQuizById(task.quiz_id);
}

export async function getQuizCardsForDeck(deckId: string): Promise<QuizCard[]> {
  const cards = await getDeckCards(deckId);
  return cards
    .filter((c) => c.card_type === 'quiz')
    .map((c) => ({
      id: c.id,
      deck_id: c.deck_id,
      card_type: c.card_type,
      content: c.content as unknown as QuizCard['content'],
      order_index: c.order_index,
    }));
}

export async function getQuizzesForRoadmap(roadmapId: string): Promise<RoadmapQuiz[]> {
  const { data, error } = await db('roadmap_quizzes')
    .select('*')
    .eq('roadmap_id', roadmapId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('getQuizzesForRoadmap', error);
    return [];
  }
  return (data || []) as RoadmapQuiz[];
}

export async function upsertRoadmapQuiz(payload: {
  id?: string;
  roadmap_id: string;
  practice_deck_id: string;
  task_id?: string | null;
  batch_id?: string | null;
  title: string;
  description?: string | null;
  negative_marking_enabled?: boolean;
  negative_mark_value?: number | null;
  default_question_kind?: string | null;
  created_by?: string | null;
}): Promise<RoadmapQuiz | null> {
  const negEnabled = payload.negative_marking_enabled ?? false;
  const negVal = negEnabled && payload.negative_mark_value != null
    ? payload.negative_mark_value
    : null;

  if (negVal != null && !validateNegativeMarkValue(negVal)) {
    throw new Error('Invalid negative mark value');
  }

  const row = {
    ...payload,
    negative_marking_enabled: negEnabled,
    negative_mark_value: negVal,
    is_active: true,
    updated_at: new Date().toISOString(),
  };

  if (payload.id) {
    const { data, error } = await db('roadmap_quizzes')
      .update(row)
      .eq('id', payload.id)
      .select('*')
      .single();
    if (error) throw error;
    return data as RoadmapQuiz;
  }

  const { data, error } = await db('roadmap_quizzes')
    .insert(row)
    .select('*')
    .single();
  if (error) throw error;
  return data as RoadmapQuiz;
}

export async function linkQuizToTask(taskId: string, quizId: string): Promise<void> {
  await db('roadmap_tasks').update({ quiz_id: quizId }).eq('id', taskId);
  await db('roadmap_quizzes').update({ task_id: taskId }).eq('id', quizId);
}

export async function getStudentAttempts(
  studentId: string,
  quizId: string
): Promise<QuizAttempt[]> {
  const { data, error } = await db('quiz_attempts')
    .select('*')
    .eq('student_id', studentId)
    .eq('roadmap_quiz_id', quizId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('getStudentAttempts', error);
    return [];
  }
  return (data || []) as QuizAttempt[];
}

export async function startQuizAttempt(
  studentId: string,
  quiz: RoadmapQuiz,
  batchId?: string | null
): Promise<QuizAttempt | null> {
  const { data, error } = await db('quiz_attempts')
    .insert({
      student_id: studentId,
      roadmap_quiz_id: quiz.id,
      batch_id: batchId ?? null,
      score: 0,
      max_score: 0,
      negative_marking_enabled: quiz.negative_marking_enabled,
      negative_mark_value: quiz.negative_mark_value,
    })
    .select('*')
    .single();
  if (error) {
    console.error('startQuizAttempt', error);
    return null;
  }
  return data as QuizAttempt;
}

export async function submitQuizAttempt(
  attemptId: string,
  quiz: RoadmapQuiz,
  cards: QuizCard[],
  answers: StudentAnswerInput[]
): Promise<{ attempt: QuizAttempt; answers: QuizAttemptAnswer[] } | null> {
  const negVal = quiz.negative_marking_enabled && quiz.negative_mark_value != null
    ? (quiz.negative_mark_value as NegativeMarkValue)
    : null;

  const scored = scoreAttempt(cards, answers, {
    negativeMarkingEnabled: quiz.negative_marking_enabled,
    negativeMarkValue: negVal,
  });

  const answerRows = scored.answers.map((a) => ({
    attempt_id: attemptId,
    card_id: a.cardId,
    selected_option: a.selectedOption,
    selected_options: a.selectedOptions,
    is_correct: a.isCorrect,
    points: a.points,
  }));

  const { error: delErr } = await db('quiz_attempt_answers')
    .delete()
    .eq('attempt_id', attemptId);
  if (delErr) console.error('submitQuizAttempt delete', delErr);

  const { data: inserted, error: ansErr } = await db('quiz_attempt_answers')
    .insert(answerRows)
    .select('*');
  if (ansErr) {
    console.error('submitQuizAttempt answers', ansErr);
    return null;
  }

  const { data: attempt, error: attErr } = await db('quiz_attempts')
    .update({
      score: scored.score,
      max_score: scored.maxScore,
      completed_at: new Date().toISOString(),
    })
    .eq('id', attemptId)
    .select('*')
    .single();
  if (attErr) {
    console.error('submitQuizAttempt attempt', attErr);
    return null;
  }

  return { attempt: attempt as QuizAttempt, answers: (inserted || []) as QuizAttemptAnswer[] };
}

export async function getTaskQuizScoreSummary(
  studentId: string,
  quizId: string,
  cards: QuizCard[]
): Promise<{ score: number; maxScore: number } | null> {
  const attempts = await getStudentAttempts(studentId, quizId);
  const preferBest = deckHasScoredItems(cards);
  return pickDisplayScore(attempts, preferBest);
}

/**
 * Mentor quiz analytics for a roadmap, optionally scoped to one batch/cohort.
 * Attempts are attributed by enrollment when batch_id on the attempt is null
 * (common for early submissions), so results still show.
 */
export async function getBatchQuizStats(
  roadmapId: string,
  batchId?: string | null
): Promise<BatchQuizStats[]> {
  const quizzes = await getQuizzesForRoadmap(roadmapId);
  if (quizzes.length === 0) return [];

  let students: {
    student_id: string;
    users: { id: string; first_name: string; last_name: string };
  }[] = [];

  if (batchId) {
    const { data: enrollments } = await supabase
      .from('student_batch_assignments')
      .select('student_id, users!inner(id, first_name, last_name)')
      .eq('batch_id', batchId)
      .eq('status', 'active');
    students = (enrollments || []) as typeof students;
  } else {
    // All active students on any batch linked to this roadmap
    const { data: roadmapBatches } = await supabase
      .from('batches')
      .select('id')
      .eq('roadmap_id', roadmapId);
    const batchIds = ((roadmapBatches || []) as { id: string }[]).map((b) => b.id);
    if (batchIds.length > 0) {
      const { data: enrollments } = await supabase
        .from('student_batch_assignments')
        .select('student_id, users!inner(id, first_name, last_name)')
        .in('batch_id', batchIds)
        .eq('status', 'active');
      const seen = new Set<string>();
      for (const row of (enrollments || []) as typeof students) {
        if (seen.has(row.student_id)) continue;
        seen.add(row.student_id);
        students.push(row);
      }
    }
  }

  const enrolledIds = new Set(students.map((s) => s.student_id));
  const results: BatchQuizStats[] = [];

  for (const quiz of quizzes) {
    const cards = await getQuizCardsForDeck(quiz.practice_deck_id);
    const preferBest = deckHasScoredItems(cards);

    // Load all completed attempts for this quiz; filter by cohort in JS so
    // null batch_id attempts still count for enrolled students.
    const { data: attempts } = await db('quiz_attempts')
      .select('*')
      .eq('roadmap_quiz_id', quiz.id)
      .not('completed_at', 'is', null);

    const allAttempts = (attempts || []) as QuizAttempt[];
    const attemptList = allAttempts.filter((a) => {
      if (enrolledIds.size === 0) return true;
      if (!enrolledIds.has(a.student_id)) return false;
      if (!batchId) return true;
      // Match explicit batch, or null batch_id (attribute via enrollment)
      return a.batch_id == null || a.batch_id === batchId;
    });

    // Include attempt students who may not be in the enrollment join (name fallback)
    const studentById = new Map(
      students.map((s) => [
        s.student_id,
        `${s.users.first_name} ${s.users.last_name}`.trim() || 'Student',
      ])
    );
    for (const a of attemptList) {
      if (!studentById.has(a.student_id)) {
        studentById.set(a.student_id, 'Student');
      }
    }

    const studentIdsForTable = batchId
      ? [...new Set([...students.map((s) => s.student_id), ...attemptList.map((a) => a.student_id)])]
      : [...studentById.keys()];

    const studentStats = studentIdsForTable.map((studentId) => {
      const mine = attemptList.filter((a) => a.student_id === studentId);
      const best = pickDisplayScore(mine, preferBest);
      const latest = pickDisplayScore(mine, false);
      return {
        studentId,
        name: studentById.get(studentId) || 'Student',
        bestScore: best?.score ?? null,
        latestScore: latest?.score ?? null,
        maxScore: best?.maxScore ?? latest?.maxScore ?? null,
        attemptCount: mine.length,
      };
    });

    const attemptedIds = new Set(attemptList.map((a) => a.student_id));
    const bestScores = studentStats
      .map((s) => s.bestScore)
      .filter((v): v is number => v != null);
    const avgBest =
      bestScores.length > 0
        ? bestScores.reduce((a, b) => a + b, 0) / bestScores.length
        : 0;
    const maxFromAttempt = attemptList.find((a) => Number(a.max_score) > 0)?.max_score;
    const maxScore =
      maxFromAttempt != null
        ? Number(maxFromAttempt)
        : cards.reduce((s, c) => {
            const kind = c.content.questionKind;
            if (kind === 'likert' || !kind) return s + (c.content.scaleMax ?? 5);
            if (
              kind === 'mcq_single' ||
              kind === 'mcq_multi' ||
              ((kind === 'binary' || kind === 'categorical') && c.content.hasCorrectAnswer)
            ) {
              return s + 1;
            }
            return s;
          }, 0);

    const attemptIds = new Set(attemptList.map((a) => a.id));
    const { data: allAnswers } = await db('quiz_attempt_answers')
      .select('*, quiz_attempts!inner(id, roadmap_quiz_id, batch_id, completed_at, student_id)')
      .eq('quiz_attempts.roadmap_quiz_id', quiz.id);

    const scopedAnswers = ((allAnswers || []) as { card_id: string; points: number; is_correct: boolean | null; attempt_id: string }[])
      .filter((a) => attemptIds.has(a.attempt_id));

    const itemMeans: BatchQuizStats['itemMeans'] = [];
    const itemCorrectRates: BatchQuizStats['itemCorrectRates'] = [];

    for (const card of cards) {
      const cardAnswers = scopedAnswers.filter((a) => a.card_id === card.id);
      if (cardAnswers.length === 0) continue;

      const isSurvey =
        card.content.questionKind === 'likert' ||
        ((card.content.questionKind === 'binary' || card.content.questionKind === 'categorical') &&
          !card.content.hasCorrectAnswer) ||
        (card.content.questionKind == null && typeof card.content.correctAnswer !== 'number');

      if (isSurvey) {
        const pts = cardAnswers.map((a) => Number(a.points));
        itemMeans.push({
          cardId: card.id,
          question: card.content.question,
          mean: pts.length > 0 ? pts.reduce((sum: number, n: number) => sum + n, 0) / pts.length : 0,
          responseCount: pts.length,
        });
      } else {
        const correct = cardAnswers.filter((a) => a.is_correct === true).length;
        itemCorrectRates.push({
          cardId: card.id,
          question: card.content.question,
          correctRate: correct / cardAnswers.length,
          responseCount: cardAnswers.length,
        });
      }
    }

    results.push({
      quizId: quiz.id,
      quizTitle: quiz.title,
      enrolledCount: students.length || studentIdsForTable.length,
      attemptedCount: attemptedIds.size,
      avgBestScore: avgBest,
      avgBestPercent: maxScore > 0 ? (avgBest / maxScore) * 100 : 0,
      itemMeans,
      itemCorrectRates,
      students: studentStats.sort((a, b) => a.name.localeCompare(b.name)),
    });
  }

  return results;
}
