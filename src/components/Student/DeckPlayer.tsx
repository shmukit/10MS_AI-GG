import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { getDeckCards, recordCardInteraction } from '../../services/db/practiceDeckService';
import { Database } from '../../types/database.types';
import { useAuthContext } from '../../lib';
import { posthog } from '../../lib/posthog';
import { Button } from '../ui/Button';

type PracticeCard = Database['public']['Tables']['practice_cards']['Row'];

interface DeckPlayerProps {
    deckId: string;
    deckTitle: string;
    batchId: string;
    onClose: () => void;
    onComplete?: () => void;
    initialCards?: PracticeCard[];
}

export const DeckPlayer: React.FC<DeckPlayerProps> = ({
    deckId,
    deckTitle,
    batchId,
    onClose,
    onComplete,
    initialCards,
}) => {
    const { user } = useAuthContext();
    const [cards, setCards] = useState<PracticeCard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [showSummary, setShowSummary] = useState(false);

    const sessionStartTime = React.useRef(Date.now());
    const cardStartTime = React.useRef(Date.now());
    const correctCount = React.useRef(0);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    useEffect(() => {
        loadCards();
    }, [deckId, initialCards]);

    const loadCards = async () => {
        setLoading(true);
        let loadedCards = [];
        if (initialCards && initialCards.length > 0) {
            loadedCards = initialCards;
        } else {
            loadedCards = await getDeckCards(deckId);
        }
        setCards(loadedCards);
        setLoading(false);

        if (loadedCards.length > 0) {
            sessionStartTime.current = Date.now();
            cardStartTime.current = Date.now();
            correctCount.current = 0;
            posthog?.capture('deck_session_started', {
                deck_id: deckId,
                deck_name: deckTitle,
                total_cards: loadedCards.length,
                batch_id: batchId,
            });
        }
    };

    const resetCardState = () => {
        setQuizSelectedOption(null);
        setQuizSubmitted(false);
    };

    const handleNext = useCallback(() => {
        if (cards[currentIndex]?.card_type === 'quiz' && !quizSubmitted) return;

        if (cards[currentIndex]?.card_type !== 'quiz') {
            posthog?.capture('deck_card_viewed', {
                deck_id: deckId,
                card_id: cards[currentIndex]?.id,
                time_spent_ms: Date.now() - cardStartTime.current,
            });
        }

        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1);
            resetCardState();
            cardStartTime.current = Date.now();
        } else {
            posthog?.capture('deck_session_completed', {
                deck_id: deckId,
                cards_reviewed: cards.length,
                correct_count: correctCount.current,
                total_time_spent_ms: Date.now() - sessionStartTime.current,
            });
            setShowSummary(true);
        }
    }, [currentIndex, cards, quizSubmitted, deckId]);

    const handlePrevious = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            resetCardState();
        }
    }, [currentIndex]);

    const handleQuizSubmit = async () => {
        if (quizSelectedOption === null || !user) return;

        setQuizSubmitted(true);
        const card = cards[currentIndex];
        const content = card.content as { correctAnswer: number };
        const isCorrect = quizSelectedOption === content.correctAnswer;

        if (isCorrect) correctCount.current += 1;

        posthog?.capture('deck_card_answered', {
            deck_id: deckId,
            card_id: card.id,
            outcome: isCorrect ? 'correct' : 'incorrect',
            time_spent_ms: Date.now() - cardStartTime.current,
        });

        await recordCardInteraction(user.id, card.id, batchId, isCorrect);
    };

    const currentCard = cards[currentIndex];
    const isQuiz = currentCard?.card_type === 'quiz';
    const showTouchNav = !isQuiz || quizSubmitted;

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
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary" />
            </div>
        );
    }

    if (cards.length === 0) {
        return (
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background p-6 text-foreground">
                <p className="text-muted-foreground">This deck has no cards.</p>
                <Button variant="secondary" className="mt-4" onClick={onClose}>
                    Close
                </Button>
            </div>
        );
    }

    const handleFinishSession = () => {
        onComplete?.();
        onClose();
    };

    if (showSummary) {
        const quizCards = cards.filter((card) => card.card_type === 'quiz').length;
        const minutes = Math.max(1, Math.round((Date.now() - sessionStartTime.current) / 60000));

        return (
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background p-6 text-foreground">
                <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center">
                    <CheckCircle className="mx-auto mb-4 h-12 w-12 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">Session complete!</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        You reviewed all {cards.length} cards in {deckTitle}.
                    </p>
                    <div className="mt-6 grid grid-cols-3 gap-3 text-left">
                        <div className="rounded-xl bg-muted/50 p-3">
                            <p className="text-xs text-muted-foreground">Cards</p>
                            <p className="text-lg font-semibold text-foreground">{cards.length}</p>
                        </div>
                        <div className="rounded-xl bg-muted/50 p-3">
                            <p className="text-xs text-muted-foreground">Quiz correct</p>
                            <p className="text-lg font-semibold text-foreground">
                                {quizCards > 0 ? `${correctCount.current}/${quizCards}` : '—'}
                            </p>
                        </div>
                        <div className="rounded-xl bg-muted/50 p-3">
                            <p className="text-xs text-muted-foreground">Time</p>
                            <p className="text-lg font-semibold text-foreground">{minutes}m</p>
                        </div>
                    </div>
                    <Button variant="cta" className="mt-8 w-full" onClick={handleFinishSession}>
                        Done
                    </Button>
                </div>
            </div>
        );
    }

    const renderCardContent = () => {
        const content = currentCard.content as Record<string, unknown>;

        switch (currentCard.card_type) {
            case 'text':
                return (
                    <div className="flex min-h-full flex-col items-center justify-center px-6 py-8 text-center animate-in fade-in slide-in-from-right duration-300">
                        <p className="max-w-2xl text-xl font-medium leading-relaxed text-foreground md:text-2xl">
                            {content.text as string}
                        </p>
                    </div>
                );

            case 'image': {
                const imageContent = content as { imageUrl: string; caption?: string };

                return (
                    <div className="flex min-h-full flex-col animate-in fade-in duration-500">
                        <div className="relative flex-1">
                            <img
                                src={imageContent.imageUrl}
                                alt={imageContent.caption || 'Card image'}
                                className="h-full w-full object-contain"
                            />
                        </div>
                        {imageContent.caption ? (
                            <div className="border-t border-border bg-card/90 p-4 text-center backdrop-blur-sm">
                                <p className="text-base font-medium text-foreground">{imageContent.caption}</p>
                            </div>
                        ) : null}
                    </div>
                );
            }

            case 'video': {
                const videoContent = content as { videoUrl: string; description?: string };

                const getEmbedUrl = (url: string) => {
                    if (url.includes('youtube.com') || url.includes('youtu.be')) {
                        const videoId = url.split('v=')[1] || url.split('/').pop();
                        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                    }
                    return url;
                };

                return (
                    <div className="flex min-h-full flex-col justify-center bg-background">
                        <div className="mx-auto aspect-video w-full max-w-4xl">
                            <iframe
                                src={getEmbedUrl(videoContent.videoUrl)}
                                className="h-full w-full rounded-lg border border-border"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Practice video"
                            />
                        </div>
                        {videoContent.description ? (
                            <div className="p-6 text-center">
                                <p className="text-base text-muted-foreground">{videoContent.description}</p>
                            </div>
                        ) : null}
                    </div>
                );
            }

            case 'quiz': {
                const quizContent = content as {
                    question: string;
                    options: string[];
                    correctAnswer: number;
                };

                return (
                    <div className="mx-auto w-full max-w-2xl px-4 py-6 animate-in fade-in duration-300 md:px-6 md:py-8">
                        <h3 className="mb-6 text-center text-xl font-bold text-foreground md:text-2xl">
                            {quizContent.question}
                        </h3>

                        <div className="space-y-3">
                            {quizContent.options.map((option, idx) => {
                                const isSelected = quizSelectedOption === idx;
                                const isCorrect = idx === quizContent.correctAnswer;

                                let optionClass =
                                    'w-full rounded-xl border-2 p-4 text-left transition-all duration-200 ';

                                if (quizSubmitted) {
                                    if (isCorrect) {
                                        optionClass += 'border-primary bg-primary/15 text-foreground';
                                    } else if (isSelected) {
                                        optionClass += 'border-destructive bg-destructive/10 text-foreground';
                                    } else {
                                        optionClass += 'border-border bg-muted/50 text-muted-foreground opacity-60';
                                    }
                                } else if (isSelected) {
                                    optionClass += 'border-primary bg-accent text-accent-foreground';
                                } else {
                                    optionClass += 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/50';
                                }

                                return (
                                    <button
                                        key={idx}
                                        disabled={quizSubmitted}
                                        onClick={() => setQuizSelectedOption(idx)}
                                        className={optionClass}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <span>{option}</span>
                                            {quizSubmitted && isCorrect && (
                                                <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                                            )}
                                            {quizSubmitted && isSelected && !isCorrect && (
                                                <XCircle className="h-5 w-5 shrink-0 text-destructive" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {quizSubmitted && (
                            <div
                                className={`mt-6 w-full rounded-xl border p-4 text-center ${
                                    quizSelectedOption === quizContent.correctAnswer
                                        ? 'border-primary/30 bg-accent text-accent-foreground'
                                        : 'border-destructive/30 bg-destructive/10 text-destructive'
                                }`}
                            >
                                {quizSelectedOption === quizContent.correctAnswer
                                    ? 'Correct! Well done.'
                                    : 'Not quite. Review and continue when ready.'}
                            </div>
                        )}
                    </div>
                );
            }

            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-background text-foreground">
            {/* Session progress */}
            <div className="progress-track h-1 w-full shrink-0">
                <div
                    className="progress-fill h-full transition-all duration-300 ease-out"
                    style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
                />
            </div>

            {/* Header — in document flow, no overlap */}
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
                <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {deckTitle}
                    </p>
                    <p className="text-sm text-foreground">
                        Card {currentIndex + 1} of {cards.length}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full border border-border bg-muted/50 p-2 text-foreground transition-colors hover:bg-muted"
                    aria-label="Close deck"
                >
                    <X className="h-5 w-5" />
                </button>
            </header>

            {/* Scrollable content */}
            <div className="relative min-h-0 flex-1">
                {showTouchNav && (
                    <>
                        <button
                            type="button"
                            aria-label="Previous card"
                            className="absolute inset-y-0 left-0 z-10 w-1/5 md:hidden"
                            onClick={handlePrevious}
                        />
                        <button
                            type="button"
                            aria-label="Next card"
                            className="absolute inset-y-0 right-0 z-10 w-1/5 md:hidden"
                            onClick={handleNext}
                        />
                    </>
                )}

                <div className="custom-scrollbar h-full overflow-y-auto overscroll-contain">
                    {renderCardContent()}
                </div>
            </div>

            {/* Footer — always visible, safe-area aware */}
            <footer className="shrink-0 border-t border-border bg-card px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                {isQuiz && !quizSubmitted ? (
                    <Button
                        variant="cta"
                        className="w-full"
                        disabled={quizSelectedOption === null}
                        onClick={handleQuizSubmit}
                    >
                        Check Answer
                    </Button>
                ) : (
                    <div className="flex items-center justify-between gap-4">
                        <button
                            type="button"
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                            className="rounded-full p-3 text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="Previous card"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>

                        <span className="text-sm font-medium text-muted-foreground">
                            {currentIndex + 1} / {cards.length}
                        </span>

                        <button
                            type="button"
                            onClick={handleNext}
                            className="rounded-full bg-primary p-3 text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                            aria-label={currentIndex === cards.length - 1 ? 'Finish deck' : 'Next card'}
                        >
                            {currentIndex === cards.length - 1 ? (
                                <CheckCircle className="h-6 w-6" />
                            ) : (
                                <ChevronRight className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                )}
            </footer>
        </div>
    );
};
