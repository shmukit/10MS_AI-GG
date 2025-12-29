import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { getDeckCards, recordCardInteraction } from '../../services/db/practiceDeckService';
import { Database } from '../../types/database.types';
import { useAuthContext } from '../../lib';

type PracticeCard = Database['public']['Tables']['practice_cards']['Row'];

interface DeckPlayerProps {
    deckId: string;
    deckTitle: string;
    batchId: string;
    onClose: () => void;
    onComplete?: () => void;
}

export const DeckPlayer: React.FC<DeckPlayerProps> = ({ deckId, deckTitle, batchId, onClose, onComplete }) => {
    const { user } = useAuthContext();
    const [cards, setCards] = useState<PracticeCard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
    const [quizSubmitted, setQuizSubmitted] = useState(false);

    useEffect(() => {
        loadCards();
    }, [deckId]);

    const loadCards = async () => {
        setLoading(true);
        const deckCards = await getDeckCards(deckId);
        setCards(deckCards);
        setLoading(false);
    };

    const handleNext = useCallback(() => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1);
            resetCardState();
        } else {
            // End of deck
            onComplete?.();
            onClose();
        }
    }, [currentIndex, cards.length, onComplete, onClose]);

    const handlePrevious = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            resetCardState();
        }
    }, [currentIndex]);

    const resetCardState = () => {
        setQuizSelectedOption(null);
        setQuizSubmitted(false);
    };

    const handleQuizSubmit = async () => {
        if (quizSelectedOption === null || !user) return;

        setQuizSubmitted(true);
        const card = cards[currentIndex];
        const content = card.content as any;
        const isCorrect = quizSelectedOption === content.correctAnswer;

        // Record interaction
        await recordCardInteraction(user.id, card.id, batchId, isCorrect);

        // Auto advance after short delay if correct? No, let user advance.
    };

    const currentCard = cards[currentIndex];

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrevious();
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrevious, onClose]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    if (cards.length === 0) {
        return (
            <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center text-white p-4">
                <p>This deck has no cards.</p>
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-white/20 rounded-lg">Close</button>
            </div>
        );
    }

    const renderCardContent = () => {
        const content = currentCard.content as any;

        switch (currentCard.card_type) {
            case 'text':
                return (
                    <div className="h-full flex flex-col justify-center items-center p-8 text-center animate-in fade-in slide-in-from-right duration-300">
                        <div className="prose prose-invert prose-lg max-w-none">
                            <p className="text-2xl md:text-3xl font-medium leading-relaxed">
                                {content.text}
                            </p>
                        </div>
                    </div>
                );

            case 'image':
                return (
                    <div className="h-full flex flex-col animate-in fade-in duration-500">
                        <div className="flex-1 relative">
                            <img
                                src={content.imageUrl}
                                alt={content.caption || "Card image"}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        {content.caption && (
                            <div className="bg-black/50 backdrop-blur-sm p-4 text-center">
                                <p className="text-lg font-medium">{content.caption}</p>
                            </div>
                        )}
                    </div>
                );

            case 'video':
                // Simple embed handler. Supports YouTube/Vimeo if URL format is standard.
                // For now, simpler iframe or video tag.
                // Assuming YouTube for MVP
                const getEmbedUrl = (url: string) => {
                    if (url.includes('youtube.com') || url.includes('youtu.be')) {
                        const videoId = url.split('v=')[1] || url.split('/').pop();
                        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                    }
                    return url;
                };

                return (
                    <div className="h-full flex flex-col justify-center bg-black">
                        <div className="aspect-video w-full max-w-4xl mx-auto">
                            <iframe
                                src={getEmbedUrl(content.videoUrl)}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        {content.description && (
                            <div className="p-6 text-center">
                                <p className="text-lg text-gray-300">{content.description}</p>
                            </div>
                        )}
                    </div>
                );

            case 'quiz':
                return (
                    <div className="h-full flex flex-col justify-center items-center p-6 max-w-2xl mx-auto w-full animate-in fade-in duration-300">
                        <h3 className="text-2xl font-bold text-center mb-8">
                            {content.question}
                        </h3>

                        <div className="w-full space-y-3">
                            {content.options.map((option: string, idx: number) => {
                                const isSelected = quizSelectedOption === idx;
                                const isCorrect = idx === content.correctAnswer;
                                let buttonClass = "w-full p-4 rounded-xl text-left transition-all duration-200 border-2 ";

                                if (quizSubmitted) {
                                    if (isCorrect) buttonClass += "bg-green-600 border-green-500 text-white";
                                    else if (isSelected) buttonClass += "bg-red-600 border-red-500 text-white";
                                    else buttonClass += "bg-gray-800 border-gray-700 text-gray-400 opacity-50";
                                } else {
                                    if (isSelected) buttonClass += "bg-blue-600 border-blue-500 text-white transform scale-[1.02]";
                                    else buttonClass += "bg-gray-800 border-gray-700 hover:bg-gray-700 text-white";
                                }

                                return (
                                    <button
                                        key={idx}
                                        disabled={quizSubmitted}
                                        onClick={() => setQuizSelectedOption(idx)}
                                        className={buttonClass}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{option}</span>
                                            {quizSubmitted && isCorrect && <CheckCircle className="w-5 h-5 text-white" />}
                                            {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-white" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {!quizSubmitted && (
                            <button
                                disabled={quizSelectedOption === null}
                                onClick={handleQuizSubmit}
                                className="mt-8 w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Check Answer
                            </button>
                        )}

                        {quizSubmitted && (
                            <div className={`mt-6 p-4 rounded-xl w-full text-center ${quizSelectedOption === content.correctAnswer
                                ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                                : 'bg-red-500/20 text-red-300 border border-red-500/50'
                                }`}>
                                {quizSelectedOption === content.correctAnswer
                                    ? "Correct! Well done."
                                    : "Not quite. Try again next time!"}
                            </div>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-gray-900 text-white flex flex-col overflow-hidden">
            {/* Progress Bar */}
            <div className="h-1 bg-gray-800 w-full">
                <div
                    className="h-full bg-blue-500 transition-all duration-300 ease-out"
                    style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
                />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-4 absolute top-1 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent">
                <div className="flex-1">
                    <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wider truncate">
                        {deckTitle}
                    </h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative flex flex-col">
                {/* Touch Zones for Navigation (Mobile optimized) */}
                <div className="absolute inset-y-0 left-0 w-1/4 z-0 cursor-w-resize" onClick={handlePrevious} />
                <div className="absolute inset-y-0 right-0 w-1/4 z-0 cursor-e-resize" onClick={handleNext} />

                {/* Content Container */}
                <div className="flex-1 z-0 relative overflow-y-auto custom-scrollbar">
                    {renderCardContent()}
                </div>
            </div>

            {/* Footer / Navigation Controls */}
            <div className="p-6 flex items-center justify-between bg-black/20 backdrop-blur-sm relative z-10">
                <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="p-3 rounded-full hover:bg-white/10 disabled:opacity-30 transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="text-sm font-medium text-gray-400">
                    {currentIndex + 1} / {cards.length}
                </div>

                <button
                    onClick={handleNext}
                    className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20"
                >
                    {currentIndex === cards.length - 1 ? (
                        <CheckCircle className="w-6 h-6" />
                    ) : (
                        <ChevronRight className="w-6 h-6" />
                    )}
                </button>
            </div>
        </div>
    );
};
