import React, { useState, useEffect } from 'react';
import { Play, Book, Clock, Trophy } from 'lucide-react';
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
                        <div
                            onClick={startReview}
                            className="group relative rounded-xl border border-border bg-card overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30"
                        >
                            <div className="p-6 md:p-8 flex items-center justify-between">
                                <div className="space-y-2">
                                    <h4 className="text-xl md:text-2xl font-black text-foreground">
                                        Daily Review Session
                                    </h4>
                                    <p className="text-sm md:text-base text-muted-foreground">
                                        You have <span className="font-bold text-primary">{dueCards.length} cards</span> scheduled for review.
                                    </p>
                                </div>
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 bg-primary text-primary-foreground">
                                    <Play className="w-6 h-6 md:w-8 md:h-8 ml-1 fill-current" />
                                </div>
                            </div>
                        </div>
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
                            <div
                                key={deck.id}
                                onClick={() => setSelectedDeck(deck)}
                                className="group relative rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 overflow-hidden cursor-pointer"
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

                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-background/40 backdrop-blur-[2px]">
                                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/20 backdrop-blur-xl flex items-center justify-center border border-primary/30 shadow-lg scale-75 group-hover:scale-100 transition-transform duration-300">
                                            <Play className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground ml-1 fill-current" />
                                        </div>
                                    </div>

                                    {/* Category Tag */}
                                    <div className="absolute top-3 left-3">
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md border bg-primary/10 text-primary border-primary/20">
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
                                            <span>~5 mins</span>
                                        </div>
                                        <div className="flex items-center gap-1 md:gap-1.5 opacity-80 text-muted-foreground">
                                            <Trophy className="w-3 md:w-3.5 h-3 md:h-3.5" />
                                            <span>Earn XP</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
