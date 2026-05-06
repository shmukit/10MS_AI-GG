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

export const PracticeDeckList: React.FC<PracticeDeckListProps> = ({ isDarkMode, batchId, roadmapId }) => {
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
            // Load Decks
            const availableDecks = await getAvailableDecks(user.id, roadmapId);
            setDecks(availableDecks);

            // Load Due Cards for Spaced Repetition
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
        // Refresh decks or update progress? 
        // Ideally we would fetch updated progress here
        loadDecks();
    };

    const startReview = () => {
        setIsReviewMode(true);
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`h-64 rounded-xl animate-pulse ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
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
                        <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-foreground'}`}>
                            <Clock className={`w-5 h-5 ${isDarkMode ? 'text-orange-400' : 'text-orange-500'}`} />
                            Due for Review
                        </h3>
                        <div
                            onClick={startReview}
                            className={`group relative rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${isDarkMode
                                ? 'bg-gradient-to-r from-orange-900/20 to-red-900/20 border-orange-500/30'
                                : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 shadow-sm'
                                }`}
                        >
                            <div className="p-6 md:p-8 flex items-center justify-between">
                                <div className="space-y-2">
                                    <h4 className={`text-xl md:text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Daily Review Session
                                    </h4>
                                    <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                                        You have <span className={`font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>{dueCards.length} cards</span> scheduled for review.
                                    </p>
                                </div>
                                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 ${isDarkMode ? 'bg-orange-500 text-white shadow-orange-500/20' : 'bg-orange-600 text-white shadow-orange-600/20'
                                    }`}>
                                    <Play className="w-6 h-6 md:w-8 md:h-8 ml-1 fill-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Available Decks */}
                <div className="space-y-4">
                    {dueCards.length > 0 && (
                        <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
                            <Book className="w-5 h-5 text-[var(--primary-accent)]" />
                            All Decks
                        </h3>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {decks.map(deck => (
                            <div
                                key={deck.id}
                                onClick={() => setSelectedDeck(deck)}
                                className={`group relative rounded-2xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden cursor-pointer ${isDarkMode
                                    ? 'bg-gray-700/50 border-gray-600 hover:border-[var(--primary-accent)]/50 hover:bg-gray-700/70'
                                    : 'bg-white border-gray-100 hover:border-[var(--primary-accent)]/20 shadow-sm'
                                    }`}
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
                                            <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-gray-900/80 via-transparent' : 'from-black/40 via-transparent'} to-transparent`} />
                                        </div>
                                    ) : (
                                        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br transition-all duration-500 ${isDarkMode
                                            ? 'from-[var(--primary-accent)]/20 to-purple-900/40 group-hover:from-[var(--primary-accent)]/40 group-hover:to-purple-800/60'
                                            : 'from-[var(--accent-soft)] to-purple-50 group-hover:from-[var(--accent-soft)]/20 group-hover:to-purple-100'
                                            }`}>
                                            <Book className={`w-12 h-12 transition-transform duration-500 group-hover:scale-110 text-[var(--primary-accent)]/50`} />
                                        </div>
                                    )}

                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-[2px]">
                                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
                                            <Play className="w-6 h-6 md:w-8 md:h-8 text-white ml-1 fill-white" />
                                        </div>
                                    </div>

                                    {/* Category Tag (Optional) */}
                                    <div className="absolute top-3 left-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md border ${isDarkMode
                                            ? 'bg-[var(--primary-accent)]/20 text-[var(--primary-accent)] border-[var(--primary-accent)]/30'
                                            : 'bg-[var(--primary-accent)]/10 text-[var(--primary-accent)] border-[var(--primary-accent)]/20'
                                            }`}>
                                            Practice
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 md:p-6">
                                    <h3 className={`text-base md:text-lg font-bold mb-2 line-clamp-1 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {deck.title}
                                    </h3>

                                    {deck.description && (
                                        <p className={`text-xs md:text-sm line-clamp-2 mb-4 leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                            }`}>
                                            {deck.description}
                                        </p>
                                    )}

                                    <div className={`flex items-center justify-between text-[10px] md:text-xs mt-auto pt-4 border-t border-dashed ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
                                        }`}>
                                        <div className="flex items-center gap-1 md:gap-1.5 text-muted-foreground">
                                            <Clock className="w-3 md:w-3.5 h-3 md:h-3.5" />
                                            <span>~5 mins</span>
                                        </div>
                                        <div className="flex items-center gap-1 md:gap-1.5 opacity-80">
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
