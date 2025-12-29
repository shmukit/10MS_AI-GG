import { supabase } from '../../lib/supabase';

// SM-2 Algorithm Constants
const MIN_EASE_FACTOR = 1.3;
const INITIAL_EASE_FACTOR = 2.5;

interface ReviewResult {
    interval: number; // Days until next review
    repetition: number; // Consecutive successful reviews
    easeFactor: number; // Difficulty multiplier
}

/**
 * Calculates the next review interval using a modified SM-2 algorithm.
 * 
 * @param quality 0-5 rating of the answer quality (0=blackout, 5=perfect)
 *                For our boolean correct/incorrect:
 *                Correct = 4 or 5
 *                Incorrect = 0 or 1
 * @param previousRepetition Number of previous successful reviews
 * @param previousEaseFactor Current ease factor
 * @param previousInterval Previous interval in days
 */
export const calculateNextReview = (
    quality: number,
    previousRepetition: number,
    previousEaseFactor: number = INITIAL_EASE_FACTOR,
    previousInterval: number = 0
): ReviewResult => {
    let interval: number;
    let repetition: number;
    let easeFactor: number;

    if (quality >= 3) {
        // Correct answer logic
        if (previousRepetition === 0) {
            interval = 1;
        } else if (previousRepetition === 1) {
            interval = 6;
        } else {
            interval = Math.round(previousInterval * previousEaseFactor);
        }
        repetition = previousRepetition + 1;
    } else {
        // Incorrect answer logic - reset stats
        repetition = 0;
        interval = 1;
    }

    // Update Ease Factor
    // Formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    easeFactor = previousEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < MIN_EASE_FACTOR) easeFactor = MIN_EASE_FACTOR;

    return { interval, repetition, easeFactor };
};

export const processCardReview = async (
    studentId: string,
    cardId: string,
    isCorrect: boolean
) => {
    try {
        // 1. Get current mastery state
        const { data: currentMastery, error: fetchError } = await supabase
            .from('student_card_mastery')
            .select('*')
            .eq('student_id', studentId)
            .eq('card_id', cardId)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "Row not found"
            console.error('Error fetching card mastery:', fetchError);
            return;
        }

        // Default values for new cards
        const masteryData = currentMastery as any;
        const prevRepetition = masteryData?.streak || 0;
        const prevEaseFactor = masteryData?.mastery_level || INITIAL_EASE_FACTOR;

        // We will repurpose:
        // mastery_level -> Ease Factor (EF)
        // streak -> Repetition count (n)

        const lastPracticed = masteryData?.last_practiced_at ? new Date(masteryData.last_practiced_at).getTime() : Date.now();
        const daysSinceLastPractice = Math.max(1, Math.round((Date.now() - lastPracticed) / (1000 * 60 * 60 * 24)));
        const usedInterval = currentMastery ? daysSinceLastPractice : 0;

        // Quality: 5 for correct, 1 for incorrect (simplified)
        const quality = isCorrect ? 5 : 1;

        const result = calculateNextReview(
            quality,
            prevRepetition,
            prevEaseFactor,
            usedInterval
        );

        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + result.interval);

        // 2. Update/Upsert mastery
        const { error: upsertError } = await supabase
            .from('student_card_mastery')
            .upsert({
                student_id: studentId,
                card_id: cardId,
                mastery_level: result.easeFactor, // Storing EF here
                streak: result.repetition,
                last_practiced_at: new Date().toISOString(),
                next_review_at: nextReviewDate.toISOString()
            } as any);

        if (upsertError) {
            console.error('Error updating card mastery:', upsertError);
        }

    } catch (error) {
        console.error('Error in processCardReview:', error);
    }
};

export const getDueCards = async (studentId: string, limit = 20) => {
    try {
        const now = new Date().toISOString();

        // Fetch cards where next_review_at <= now
        const { data, error } = await supabase
            .from('student_card_mastery')
            .select(`
                card_id,
                next_review_at,
                practice_cards (
                    *
                )
            `)
            .eq('student_id', studentId)
            .lte('next_review_at', now)
            .limit(limit);

        if (error) {
            console.error('Error fetching due cards:', error);
            return [];
        }

        return data.map((item: any) => item.practice_cards);
    } catch (error) {
        console.error('Error in getDueCards:', error);
        return [];
    }
};
