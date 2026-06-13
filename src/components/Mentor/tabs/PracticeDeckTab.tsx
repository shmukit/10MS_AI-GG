import React, { useState, useEffect } from 'react';
import { Plus, Book, Edit, Trash2 } from 'lucide-react';
import { getMentorDecks, deleteDeck } from '../../../services/db/practiceDeckService';
import { useAuthContext } from '../../../lib';
import { Database } from '../../../types/database.types';

type PracticeDeck = Database['public']['Tables']['practice_decks']['Row'];

interface PracticeDeckTabProps {
    onCreateDeck: () => void;
    onEditDeck: (deckId: string) => void;
}

export const PracticeDeckTab: React.FC<PracticeDeckTabProps> = ({
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
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-foreground transition-colors duration-200">
                        Practice Decks
                    </h2>
                    <p className="text-sm mt-1 text-muted-foreground transition-colors duration-200">
                        Create micro-learning decks with text, images, videos, and quizzes
                    </p>
                </div>
                <button
                    onClick={onCreateDeck}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create New Deck
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 rounded-xl border border-border bg-card transition-colors duration-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground transition-colors duration-200">
                        Loading decks...
                    </p>
                </div>
            ) : decks.length === 0 ? (
                <div className="text-center py-12 rounded-xl border border-border bg-card transition-colors duration-200">
                    <Book className="w-16 h-16 mx-auto mb-4 text-muted-foreground transition-colors duration-200" />
                    <h3 className="text-lg font-semibold mb-2 text-foreground transition-colors duration-200">
                        No practice decks yet
                    </h3>
                    <p className="text-sm mb-4 text-muted-foreground transition-colors duration-200">
                        Create your first micro-learning deck to help students practice
                    </p>
                    <button
                        onClick={onCreateDeck}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors"
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
                            className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:shadow-lg"
                        >
                            {deck.cover_image ? (
                                <img
                                    src={deck.cover_image}
                                    alt={deck.title}
                                    className="w-full h-40 object-cover"
                                />
                            ) : (
                                <div className="w-full h-40 flex items-center justify-center bg-muted">
                                    <Book className="w-12 h-12 text-muted-foreground" />
                                </div>
                            )}

                            <div className="p-4">
                                <h3 className="font-semibold mb-1 line-clamp-1 text-foreground transition-colors duration-200">
                                    {deck.title}
                                </h3>
                                {deck.description && (
                                    <p className="text-sm mb-3 line-clamp-2 text-muted-foreground transition-colors duration-200">
                                        {deck.description}
                                    </p>
                                )}

                                <div className="flex items-center gap-2 text-xs mb-3 text-muted-foreground transition-colors duration-200">
                                    <span className={`px-2 py-1 rounded ${deck.is_public
                                        ? 'bg-accent text-primary'
                                        : 'bg-muted text-muted-foreground'
                                        }`}>
                                        {deck.is_public ? 'Public' : 'Private'}
                                    </span>
                                    <span>•</span>
                                    <span>Created {new Date(deck.created_at).toLocaleDateString()}</span>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onEditDeck(deck.id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteDeck(deck.id)}
                                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
