import React, { useState, useEffect } from 'react';
import { BookOpen, Book, Clock, Trophy, RotateCcw } from 'lucide-react';
import { getAvailableDecks } from '../../services/db/practiceDeckService';
import { Database } from '../../types/database.types';
import { useAuthContext } from '../../lib';
import { DeckPlayer } from './DeckPlayer';

type PracticeDeck = Database['public']['Tables']['practice_decks']['Row'];

interface PracticeDeckListProps {
    isDarkMode: boolean;
    batchId: string;
    roadmapId?: string;
}

export const PracticeDeckList: React.FC<PracticeDeckListProps> = ({ batchId, roadmapId }) => {
    const { user } = useAuthContext();
    const [decks, setDecks] = useState<PracticeDeck[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDeck, setSelectedDeck] = useState<PracticeDeck | null>(null);
    const [dueCards, setDueCards] = useState<any[]>([]);
    const [isReviewMode, setIsReviewMode] = useState(false);

    const loadDecks = async () => {
        if (!user?.id) return;

        setLoading(true);
        try {
            const availableDecks = await getAvailableDecks(user.id, roadmapId);
            setDecks(availableDecks);

            const { getDueCards } = await import('../../services/db/spacedRepetitionService');
            const cards = await getDueCards(user.id);
            setDueCards(cards || []);
        } catch (e) {
            console.error('Error loading practice data:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDecks();
    }, [user, roadmapId]);

    const handleDeckComplete = () => {
        loadDecks();
    };

    const startReview = () => {
        setIsReviewMode(true);
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-64 rounded-xl animate-pulse bg-muted" />
                ))}
            </div>
        );
    }

    if (decks.length === 0 && dueCards.length === 0) {
        return (
            <div className="text-center py-12 rounded-xl border border-border bg-card">
                <Book className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                    No practice decks yet
                </h3>
                <p className="text-sm text-muted-foreground">
                    Check back later for new practice materials.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-8">
                {/* Due for Review Section */}
                {dueCards.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
                            <Clock className="w-5 h-5 text-primary" />
                            Due for Review
                        </h3>
                        <button
                            type="button"
                            onClick={startReview}
                            className="group relative w-full text-left rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-hover hover:-translate-y-1 hover:border-primary/30"
                        >
                            <div className="p-6 md:p-8 flex items-center justify-between">
                                <div className="space-y-2">
                                    <h4 className="font-display text-h2 text-foreground">
                                        Daily review session
                                    </h4>
                                    <p className="text-body text-muted-foreground">
                                        You have <span className="font-semibold text-primary">{dueCards.length} cards</span> scheduled for review.
                                    </p>
                                </div>
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                                    <RotateCcw className="w-6 h-6 md:w-7 md:h-7" aria-hidden />
                                </div>
                            </div>
                        </button>
                    </div>
                )}

                {/* Available Decks */}
                <div className="space-y-4">
                    {dueCards.length > 0 && (
                        <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
                            <Book className="w-5 h-5 text-primary" />
                            All Decks
                        </h3>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {decks.map(deck => (
                            <button
                                key={deck.id}
                                type="button"
                                onClick={() => setSelectedDeck(deck)}
                                className="group relative w-full text-left rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-hover hover:-translate-y-1 hover:border-primary/30 overflow-hidden"
                            >
                                {/* Cover Image or Fallback */}
                                <div className="h-40 md:h-48 w-full relative overflow-hidden">
                                    {deck.cover_image ? (
                                        <div className="relative h-full w-full">
                                            <img
                                                src={deck.cover_image}
                                                alt={deck.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-muted transition-all duration-500 group-hover:bg-accent">
                                            <Book className="w-12 h-12 transition-transform duration-500 group-hover:scale-110 text-primary/50" />
                                        </div>
                                    )}

                                    {/* Hover — practice affordance, not video */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-background/50">
                                        <div className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground text-caption font-semibold">
                                            <BookOpen className="w-4 h-4" aria-hidden />
                                            Start practice
                                        </div>
                                    </div>

                                    {/* Category Tag */}
                                    <div className="absolute top-3 left-3">
                                        <span className="px-2 py-0.5 rounded-full text-overline font-semibold border bg-primary/10 text-primary border-primary/20">
                                            Practice
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 md:p-6">
                                    <h3 className="text-base md:text-lg font-bold mb-2 line-clamp-1 transition-colors text-foreground">
                                        {deck.title}
                                    </h3>

                                    {deck.description && (
                                        <p className="text-xs md:text-sm line-clamp-2 mb-4 leading-relaxed text-muted-foreground">
                                            {deck.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between text-[10px] md:text-xs mt-auto pt-4 border-t border-dashed border-border">
                                        <div className="flex items-center gap-1 md:gap-1.5 text-muted-foreground">
                                            <Clock className="w-3 md:w-3.5 h-3 md:h-3.5" />
                                            <span>Practice deck</span>
                                        </div>
                                        <div className="flex items-center gap-1 md:gap-1.5 opacity-80 text-muted-foreground">
                                            <Trophy className="w-3 md:w-3.5 h-3 md:h-3.5" />
                                            <span>Earn XP</span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Deck Player Overlay */}
            {(selectedDeck || isReviewMode) && (
                <DeckPlayer
                    deckId={selectedDeck?.id || 'review'}
                    batchId={batchId}
                    deckTitle={isReviewMode ? 'Daily Review' : (selectedDeck?.title || 'Practice Deck')}
                    onClose={() => {
                        setSelectedDeck(null);
                        setIsReviewMode(false);
                    }}
                    onComplete={handleDeckComplete}
                    initialCards={isReviewMode ? dueCards : undefined}
                />
            )}
        </>
    );
};
