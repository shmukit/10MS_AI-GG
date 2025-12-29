import React, { useState, useEffect } from 'react';
import { Plus, Book, Edit, Trash2 } from 'lucide-react';
import { getMentorDecks, deleteDeck } from '../../../services/db/practiceDeckService';
import { useAuthContext } from '../../../lib';
import { Database } from '../../../types/database.types';

type PracticeDeck = Database['public']['Tables']['practice_decks']['Row'];

interface PracticeDeckTabProps {
    isDarkMode: boolean;
    onCreateDeck: () => void;
    onEditDeck: (deckId: string) => void;
}

export const PracticeDeckTab: React.FC<PracticeDeckTabProps> = ({
    isDarkMode,
    onCreateDeck,
    onEditDeck
}) => {
    const { user } = useAuthContext();
    const [decks, setDecks] = useState<PracticeDeck[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDecks();
    }, [user]);

    const loadDecks = async () => {
        if (!user?.id) return;

        setLoading(true);
        const mentorDecks = await getMentorDecks(user.id);
        setDecks(mentorDecks);
        setLoading(false);
    };

    const handleDeleteDeck = async (deckId: string) => {
        if (!confirm('Are you sure you want to delete this deck? This will also delete all cards in it.')) {
            return;
        }

        const success = await deleteDeck(deckId);
        if (success) {
            setDecks(decks.filter(d => d.id !== deckId));
        } else {
            alert('Failed to delete deck. Please try again.');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className={`text-2xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Practice Decks
                    </h2>
                    <p className={`text-sm mt-1 transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Create micro-learning decks with text, images, videos, and quizzes
                    </p>
                </div>
                <button
                    onClick={onCreateDeck}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create New Deck
                </button>
            </div>

            {/* Deck List */}
            {loading ? (
                <div className={`text-center py-12 rounded-xl border transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Loading decks...
                    </p>
                </div>
            ) : decks.length === 0 ? (
                <div className={`text-center py-12 rounded-xl border transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <Book className={`w-16 h-16 mx-auto mb-4 transition-colors duration-200 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <h3 className={`text-lg font-semibold mb-2 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        No practice decks yet
                    </h3>
                    <p className={`text-sm mb-4 transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Create your first micro-learning deck to help students practice
                    </p>
                    <button
                        onClick={onCreateDeck}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Create Deck
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {decks.map(deck => (
                        <div
                            key={deck.id}
                            className={`rounded-xl border overflow-hidden transition-all duration-200 hover:shadow-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                                }`}
                        >
                            {/* Cover Image */}
                            {deck.cover_image ? (
                                <img
                                    src={deck.cover_image}
                                    alt={deck.title}
                                    className="w-full h-40 object-cover"
                                />
                            ) : (
                                <div className={`w-full h-40 flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                                    }`}>
                                    <Book className={`w-12 h-12 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-4">
                                <h3 className={`font-semibold mb-1 line-clamp-1 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    {deck.title}
                                </h3>
                                {deck.description && (
                                    <p className={`text-sm mb-3 line-clamp-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                        {deck.description}
                                    </p>
                                )}

                                {/* Meta Info */}
                                <div className={`flex items-center gap-2 text-xs mb-3 transition-colors duration-200 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'
                                    }`}>
                                    <span className={`px-2 py-1 rounded ${deck.is_public
                                        ? 'bg-green-500/10 text-green-500'
                                        : (isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600')
                                        }`}>
                                        {deck.is_public ? 'Public' : 'Private'}
                                    </span>
                                    <span>•</span>
                                    <span>Created {new Date(deck.created_at).toLocaleDateString()}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onEditDeck(deck.id)}
                                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${isDarkMode
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                            }`}
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteDeck(deck.id)}
                                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${isDarkMode
                                            ? 'bg-red-600 hover:bg-red-700 text-white'
                                            : 'bg-red-600 hover:bg-red-700 text-white'
                                            }`}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
