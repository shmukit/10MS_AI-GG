import React, { useState, useEffect } from 'react';
import { X, Save, Plus, GripVertical, Trash2, Eye, Type, Image as ImageIcon, Video, HelpCircle } from 'lucide-react';
import {
    getDeckById,
    getDeckCards,
    createDeck,
    updateDeck,
    deleteCard
} from '../../services/db/practiceDeckService';
import { CardEditor } from './CardEditor';
import { useAuthContext } from '../../lib';
import { Database } from '../../types/database.types';

type PracticeCard = Database['public']['Tables']['practice_cards']['Row'];
type CardType = 'text' | 'image' | 'video' | 'quiz';

interface CardContent {
    text?: string;
    imageUrl?: string;
    videoUrl?: string;
    question?: string;
    options?: string[];
    correctAnswer?: number;
}

interface DeckEditorProps {
    deckId?: string;
    onClose: () => void;
    onSave: () => void;
}

const inputClass = 'w-full px-4 py-2 rounded-lg border border-border bg-muted text-foreground';

export const DeckEditor: React.FC<DeckEditorProps> = ({ deckId, onClose, onSave }) => {
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(!!deckId);
    const [saving, setSaving] = useState(false);

    // Deck metadata
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [isPublic, setIsPublic] = useState(false);

    // Cards
    const [cards, setCards] = useState<PracticeCard[]>([]);
    const [editingCardId, setEditingCardId] = useState<string | null>(null);
    const [showCardEditor, setShowCardEditor] = useState(false);

    useEffect(() => {
        if (deckId) {
            loadDeck();
        }
    }, [deckId]);

    const loadDeck = async () => {
        if (!deckId) return;

        setLoading(true);
        const [deck, deckCards] = await Promise.all([
            getDeckById(deckId),
            getDeckCards(deckId)
        ]);

        if (deck) {
            setTitle(deck.title);
            setDescription(deck.description || '');
            setCoverImage(deck.cover_image || '');
            setIsPublic(deck.is_public);
        }

        setCards(deckCards);
        setLoading(false);
    };

    const handleSaveDeck = async () => {
        if (!title.trim()) {
            alert('Please enter a deck title');
            return;
        }

        if (!user?.id) {
            alert('User not authenticated');
            return;
        }

        setSaving(true);

        try {
            const deckData = {
                title: title.trim(),
                description: description.trim() || null,
                cover_image: coverImage.trim() || null,
                is_public: isPublic,
                created_by: user.id
            };

            if (deckId) {
                // Update existing deck
                await updateDeck(deckId, deckData);
            } else {
                // Create new deck
                const newDeck = await createDeck(deckData);
                if (!newDeck) {
                    throw new Error('Failed to create deck');
                }
            }

            onSave();
        } catch (error) {
            console.error('Error saving deck:', error);
            alert('Failed to save deck. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleAddCard = () => {
        setEditingCardId(null);
        setShowCardEditor(true);
    };

    const handleEditCard = (cardId: string) => {
        setEditingCardId(cardId);
        setShowCardEditor(true);
    };

    const handleDeleteCard = async (card: PracticeCard) => {
        if (!confirm('Delete this card?')) return;

        const success = await deleteCard(card.id);
        if (success) {
            setCards(cards.filter(c => c.id !== card.id));
        }
    };

    const handleCardSaved = async () => {
        setShowCardEditor(false);
        if (deckId) {
            const updatedCards = await getDeckCards(deckId);
            setCards(updatedCards);
        }
    };

    // Note: Card reordering via drag-and-drop will be implemented in a future update
    // const handleReorder = async (fromIndex: number, toIndex: number) => {
    //     if (!deckId) return;
    //     const newCards = [...cards];
    //     const [movedCard] = newCards.splice( fromIndex, 1);
    //     newCards.splice(toIndex, 0, movedCard);
    //     setCards(newCards);
    //     const cardIds = newCards.map(c => c.id);
    //     await reorderCards(deckId, cardIds);
    // };

    const getCardIcon = (type: CardType) => {
        switch (type) {
            case 'text': return <Type className="w-4 h-4" />;
            case 'image': return <ImageIcon className="w-4 h-4" />;
            case 'video': return <Video className="w-4 h-4" />;
            case 'quiz': return <HelpCircle className="w-4 h-4" />;
        }
    };

    const getCardPreview = (card: PracticeCard) => {
        const content = card.content as CardContent;
        switch (card.card_type) {
            case 'text':
                return <p className="text-sm line-clamp-2">{content.text}</p>;
            case 'image':
                return <p className="text-sm text-muted-foreground">Image: {content.imageUrl}</p>;
            case 'video':
                return <p className="text-sm text-muted-foreground">Video: {content.videoUrl}</p>;
            case 'quiz':
                return <p className="text-sm line-clamp-1">{content.question}</p>;
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="p-8 rounded-xl bg-card">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading deck...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-xl bg-card">
                <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-border bg-card">
                    <h2 className="text-2xl font-bold text-foreground">
                        {deckId ? 'Edit Deck' : 'Create New Deck'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg transition-colors hover:bg-accent"
                    >
                        <X className="w-6 h-6 text-muted-foreground" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Deck Metadata */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-muted-foreground">
                                Deck Title *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className={inputClass}
                                placeholder="Enter deck title..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-muted-foreground">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className={inputClass}
                                placeholder="Describe what this deck teaches..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-muted-foreground">
                                Cover Image URL
                            </label>
                            <input
                                type="text"
                                value={coverImage}
                                onChange={(e) => setCoverImage(e.target.value)}
                                className={inputClass}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isPublic"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                                className="w-4 h-4 rounded border-border"
                            />
                            <label htmlFor="isPublic" className="text-sm text-muted-foreground">
                                Make this deck public (visible to all students)
                            </label>
                        </div>
                    </div>

                    {/* Cards Section */}
                    {deckId && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-foreground">
                                    Cards ({cards.length})
                                </h3>
                                <button
                                    onClick={handleAddCard}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Card
                                </button>
                            </div>

                            {cards.length === 0 ? (
                                <div className="text-center py-8 rounded-lg border border-border bg-muted">
                                    <p className="text-sm text-muted-foreground">
                                        No cards yet. Add your first card to get started.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {cards.map((card) => (
                                        <div
                                            key={card.id}
                                            className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted"
                                        >
                                            <GripVertical className="w-5 h-5 cursor-move text-muted-foreground" />
                                            <div className="p-2 rounded bg-muted border border-border">
                                                {getCardIcon(card.card_type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-medium px-2 py-1 rounded bg-muted text-muted-foreground">
                                                        {card.card_type.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="text-muted-foreground">
                                                    {getCardPreview(card)}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditCard(card.id)}
                                                    className="p-2 rounded transition-colors hover:bg-accent"
                                                >
                                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCard(card)}
                                                    className="p-2 rounded transition-colors hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {!deckId && (
                        <div className="p-4 rounded-lg bg-muted border border-border">
                            <p className="text-sm text-foreground">
                                💡 Save the deck first, then you can add cards to it.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t border-border bg-card">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg font-medium transition-colors bg-muted hover:bg-accent text-muted-foreground"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveDeck}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Deck'}
                    </button>
                </div>
            </div>

            {/* Card Editor Modal */}
            {showCardEditor && deckId && (
                <CardEditor
                    deckId={deckId}
                    cardId={editingCardId}
                    onClose={() => setShowCardEditor(false)}
                    onSave={handleCardSaved}
                />
            )}
        </div>
    );
};
