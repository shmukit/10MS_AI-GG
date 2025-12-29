import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';

type PracticeDeck = Database['public']['Tables']['practice_decks']['Row'];
type PracticeDeckInsert = Database['public']['Tables']['practice_decks']['Insert'];
type PracticeDeckUpdate = Database['public']['Tables']['practice_decks']['Update'];

type PracticeCard = Database['public']['Tables']['practice_cards']['Row'];
type PracticeCardInsert = Database['public']['Tables']['practice_cards']['Insert'];
type PracticeCardUpdate = Database['public']['Tables']['practice_cards']['Update'];

// ============ DECK OPERATIONS ============

/**
 * Get all decks created by a specific mentor
 */
export const getMentorDecks = async (mentorId: string): Promise<PracticeDeck[]> => {
    try {
        const { data, error } = await supabase
            .from('practice_decks')
            .select('*')
            .eq('created_by', mentorId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching mentor decks:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in getMentorDecks:', error);
        return [];
    }
};

/**
 * Get all public decks or decks linked to a roadmap
 */
export const getAvailableDecks = async (userId: string, roadmapId?: string): Promise<PracticeDeck[]> => {
    try {
        let query = supabase
            .from('practice_decks')
            .select('*');

        // Get public decks OR decks created by this user
        query = query.or(`is_public.eq.true,created_by.eq.${userId}`);

        // Filter by roadmap if provided
        if (roadmapId) {
            query = query.eq('roadmap_id', roadmapId);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching available decks:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in getAvailableDecks:', error);
        return [];
    }
};

/**
 * Get a single deck by ID
 */
export const getDeckById = async (deckId: string): Promise<PracticeDeck | null> => {
    try {
        const { data, error } = await supabase
            .from('practice_decks')
            .select('*')
            .eq('id', deckId)
            .single();

        if (error) {
            console.error('Error fetching deck:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error in getDeckById:', error);
        return null;
    }
};

/**
 * Create a new practice deck
 */
export const createDeck = async (deck: PracticeDeckInsert): Promise<PracticeDeck | null> => {
    try {
        const { data, error } = await supabase
            .from('practice_decks')
            .insert(deck as any)
            .select()
            .single();

        if (error) {
            console.error('Error creating deck:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error in createDeck:', error);
        return null;
    }
};

/**
 * Update an existing practice deck
 */
export const updateDeck = async (deckId: string, updates: PracticeDeckUpdate): Promise<PracticeDeck | null> => {
    try {
        const { data, error } = await supabase
            .from('practice_decks')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            } as unknown as never)
            .eq('id', deckId)
            .select()
            .single();

        if (error) {
            console.error('Error updating deck:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error in updateDeck:', error);
        return null;
    }
};

/**
 * Delete a practice deck (and all its cards via CASCADE)
 */
export const deleteDeck = async (deckId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('practice_decks')
            .delete()
            .eq('id', deckId);

        if (error) {
            console.error('Error deleting deck:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in deleteDeck:', error);
        return false;
    }
};

// ============ CARD OPERATIONS ============

/**
 * Get all cards for a specific deck, ordered by order_index
 */
export const getDeckCards = async (deckId: string): Promise<PracticeCard[]> => {
    try {
        const { data, error } = await supabase
            .from('practice_cards')
            .select('*')
            .eq('deck_id', deckId)
            .order('order_index', { ascending: true });

        if (error) {
            console.error('Error fetching deck cards:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in getDeckCards:', error);
        return [];
    }
};

/**
 * Get a single card by ID
 */
export const getCardById = async (cardId: string): Promise<PracticeCard | null> => {
    try {
        const { data, error } = await supabase
            .from('practice_cards')
            .select('*')
            .eq('id', cardId)
            .single();

        if (error) {
            console.error('Error fetching card:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error in getCardById:', error);
        return null;
    }
};

/**
 * Create a new practice card
 */
export const createCard = async (card: PracticeCardInsert): Promise<PracticeCard | null> => {
    try {
        const { data, error } = await supabase
            .from('practice_cards')
            .insert(card as any)
            .select()
            .single();

        if (error) {
            console.error('Error creating card:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error in createCard:', error);
        return null;
    }
};

/**
 * Update an existing practice card
 */
export const updateCard = async (cardId: string, updates: PracticeCardUpdate): Promise<PracticeCard | null> => {
    try {
        const { data, error } = await supabase
            .from('practice_cards')
            .update(updates as unknown as never)
            .eq('id', cardId)
            .select()
            .single();

        if (error) {
            console.error('Error updating card:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error in updateCard:', error);
        return null;
    }
};

/**
 * Delete a practice card
 */
export const deleteCard = async (cardId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('practice_cards')
            .delete()
            .eq('id', cardId);

        if (error) {
            console.error('Error deleting card:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in deleteCard:', error);
        return false;
    }
};

/**
 * Reorder cards in a deck
 * Takes an array of card IDs in the desired order and updates their order_index
 */
export const reorderCards = async (deckId: string, cardIds: string[]): Promise<boolean> => {
    try {
        // Update each card's order_index based on its position in the array
        const updates = cardIds.map((cardId, index) =>
            supabase
                .from('practice_cards')
                .update({ order_index: index } as unknown as never)
                .eq('id', cardId)
                .eq('deck_id', deckId) // Security: ensure card belongs to this deck
        );

        const results = await Promise.all(updates);

        // Check if any updates failed
        const hasErrors = results.some(result => result.error);

        if (hasErrors) {
            console.error('Error reordering cards:', results.filter(r => r.error));
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in reorderCards:', error);
        return false;
    }
};

/**
 * Batch create multiple cards for a deck
 */
export const createBatchCards = async (cards: PracticeCardInsert[]): Promise<PracticeCard[]> => {
    try {
        const { data, error } = await supabase
            .from('practice_cards')
            .insert(cards as any)
            .select();

        if (error) {
            console.error('Error batch creating cards:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in createBatchCards:', error);
        return [];
    }
};

// ============ STUDENT PROGRESS TRACKING ============

/**
 * Get the highest card index a student has reached in a deck
 * (For "continue where you left off" functionality)
 */
export const getStudentDeckProgress = async (_studentId: string, _deckId: string): Promise<number> => {
    try {
        // This assumes you'll add a student_deck_progress table later
        // For now, return 0 (start from beginning)
        // TODO: Implement when student_deck_progress table is created
        return 0;
    } catch (error) {
        console.error('Error in getStudentDeckProgress:', error);
        return 0;
    }
};

/**
 * Record a student's interaction with a card
 * (For future analytics and spaced repetition)
 */
export const recordCardInteraction = async (
    studentId: string,
    cardId: string,
    batchId: string,
    isCorrect?: boolean
): Promise<boolean> => {
    try {
        console.log('Card interaction recorded:', { studentId, cardId, isCorrect });

        // 1. If correct, award XP
        if (isCorrect && batchId) {
            // Import dynamically to avoid circular dependencies if any (though services should be fine)
            // But we can import at top level. Let's assume top level import.
            const { awardPracticeXP } = await import('./gamificationService');
            await awardPracticeXP(studentId, batchId);
        }

        // 2. TODO: Store the detailed interaction in a dedicated table `student_card_interactions`
        // for spaced repetition algorithms later.

        return true;
    } catch (error) {
        console.error('Error in recordCardInteraction:', error);
        return false;
    }
};
