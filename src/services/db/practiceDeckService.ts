import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';

type PracticeDeck = Database['public']['Tables']['practice_decks']['Row'];
type PracticeDeckInsert = Database['public']['Tables']['practice_decks']['Insert'];
type PracticeDeckUpdate = Database['public']['Tables']['practice_decks']['Update'];

type PracticeCard = Database['public']['Tables']['practice_cards']['Row'];
type PracticeCardInsert = Database['public']['Tables']['practice_cards']['Insert'];
type PracticeCardUpdate = Database['public']['Tables']['practice_cards']['Update'];

// ============ DECK OPERATIONS ============

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

export const getAvailableDecks = async (userId: string, roadmapId?: string): Promise<PracticeDeck[]> => {
    try {
        let query = supabase
            .from('practice_decks')
            .select('*');

        // Get public decks OR decks created by this user
        query = query.or(`is_public.eq.true,created_by.eq.${userId}`);

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

// Aliases for compatibility
export const getUserDecks = getAvailableDecks;
export const getDeck = getDeckById;

// ============ CARD OPERATIONS ============

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

export const reorderCards = async (deckId: string, cardIds: string[]): Promise<boolean> => {
    try {
        const updates = cardIds.map((cardId, index) =>
            supabase
                .from('practice_cards')
                .update({ order_index: index } as unknown as never)
                .eq('id', cardId)
                .eq('deck_id', deckId)
        );

        const results = await Promise.all(updates);
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

export const getStudentDeckProgress = async (_studentId: string, _deckId: string): Promise<number> => {
    try {
        return 0;
    } catch (error) {
        console.error('Error in getStudentDeckProgress:', error);
        return 0;
    }
};

export const recordCardInteraction = async (
    studentId: string,
    cardId: string,
    batchId: string,
    isCorrect?: boolean
): Promise<boolean> => {
    try {
        console.log('Card interaction recorded:', { studentId, cardId, isCorrect });

        if (isCorrect && batchId) {
            const { awardPracticeXP } = await import('./gamificationService');
            await awardPracticeXP(studentId, batchId);
        }

        try {
            const { processCardReview } = await import('./spacedRepetitionService');
            await processCardReview(studentId, cardId, !!isCorrect);
        } catch (srError) {
            console.error('Error processing spaced repetition:', srError);
        }

        return true;
    } catch (error) {
        console.error('Error in recordCardInteraction:', error);
        return false;
    }
};
