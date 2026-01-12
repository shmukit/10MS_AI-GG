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
            // Feature disabled until tables are created
            // const { getDueCards } = await import('../../services/db/spacedRepetitionService');
            // const cards = await getDueCards(user.id);
            setDueCards([]);
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
            <div className={`text-center py-12 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <Book className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    No practice decks yet
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
                        <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            <Clock className="w-5 h-5 text-orange-500" />
                            Due for Review
                        </h3>
                        <div
                            onClick={startReview}
                            className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-r from-orange-500/10 to-red-500/10 ${isDarkMode ? 'border-orange-500/30' : 'border-orange-200'
                                }`}
                        >
                            <div className="p-6 flex items-center justify-between">
                                <div>
                                    <h4 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Daily Review Session
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        You have <span className="font-bold text-orange-500">{dueCards.length} cards</span> scheduled for review today based on your past performance.
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Play className="w-6 h-6 ml-1 fill-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Available Decks */}
                <div className="space-y-4">
                    {dueCards.length > 0 && (
                        <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            <Book className="w-5 h-5 text-blue-500" />
                            All Decks
                        </h3>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {decks.map(deck => (
                            <div
                                key={deck.id}
                                onClick={() => setSelectedDeck(deck)}
                                className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                                    }`}
                            >
                                {/* Cover Image or Fallback */}
                                <div className="h-48 w-full relative overflow-hidden bg-gray-900">
                                    {deck.cover_image ? (
                                        <img
                                            src={deck.cover_image}
                                            alt={deck.title}
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                        />
                                    ) : (
                                        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-purple-600/20`}>
                                            <Book className="w-12 h-12 text-blue-500/50" />
                                        </div>
                                    )}

                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[2px]">
                                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/50">
                                            <Play className="w-8 h-8 text-white ml-1 fill-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className={`text-lg font-bold mb-2 line-clamp-1 group-hover:text-blue-500 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {deck.title}
                                    </h3>

                                    {deck.description && (
                                        <p className={`text-sm line-clamp-2 mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                            }`}>
                                            {deck.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between text-xs mt-auto pt-4 border-t border-dashed border-gray-700/50">
                                        <div className={`flex items-center gap-1.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>~5 mins</span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                            <Trophy className="w-3.5 h-3.5" />
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
