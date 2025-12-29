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
}

export const PracticeDeckList: React.FC<PracticeDeckListProps> = ({ isDarkMode, batchId }) => {
    const { user } = useAuthContext();
    const [decks, setDecks] = useState<PracticeDeck[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDeck, setSelectedDeck] = useState<PracticeDeck | null>(null);

    useEffect(() => {
        loadDecks();
    }, [user]);

    const loadDecks = async () => {
        if (!user?.id) return;

        setLoading(true);
        // Pass undefined for roadmapId to get all available decks
        const availableDecks = await getAvailableDecks(user.id);
        setDecks(availableDecks);
        setLoading(false);
    };

    const handleDeckComplete = () => {
        // Refresh decks or update progress? 
        // Ideally we would fetch updated progress here
        loadDecks();
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

    if (decks.length === 0) {
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

            {/* Deck Player Overlay */}
            {selectedDeck && (
                <DeckPlayer
                    deckId={selectedDeck.id}
                    batchId={batchId}
                    deckTitle={selectedDeck.title || 'Practice Deck'}
                    onClose={() => setSelectedDeck(null)}
                    onComplete={handleDeckComplete}
                />
            )}
        </>
    );
};
