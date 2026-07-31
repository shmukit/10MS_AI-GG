import React, { useState, useEffect } from 'react';
import { X, Save, Type, Image as ImageIcon, Video, HelpCircle } from 'lucide-react';
import { getCardById, createCard, updateCard } from '../../services/db/practiceDeckService';
import type { QuestionKind } from '../../types/quizTypes';
import { LIKERT_DEFAULT_LABELS, QUESTION_KIND_LABELS } from '../../types/quizTypes';

type CardType = 'text' | 'image' | 'video' | 'quiz';

interface CardEditorProps {
    deckId: string;
    cardId?: string | null;
    onClose: () => void;
    onSave: () => void;
}

const inputClass = 'w-full px-4 py-2 rounded-lg border border-border bg-muted text-foreground';

export const CardEditor: React.FC<CardEditorProps> = ({ deckId, cardId, onClose, onSave }) => {
    const [loading, setLoading] = useState(!!cardId);
    const [saving, setSaving] = useState(false);

    const [cardType, setCardType] = useState<CardType>('text');
    const [orderIndex, setOrderIndex] = useState(0);

    const [textContent, setTextContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageCaption, setImageCaption] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [videoDescription, setVideoDescription] = useState('');
    const [quizQuestion, setQuizQuestion] = useState('');
    const [questionKind, setQuestionKind] = useState<QuestionKind>('likert');
    const [quizOptions, setQuizOptions] = useState<string[]>([...LIKERT_DEFAULT_LABELS]);
    const [scaleMin, setScaleMin] = useState(1);
    const [scaleMax, setScaleMax] = useState(5);
    const [hasCorrectAnswer, setHasCorrectAnswer] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);

    useEffect(() => {
        if (cardId) {
            loadCard();
        }
    }, [cardId]);

    const loadCard = async () => {
        if (!cardId) return;

        setLoading(true);
        const card = await getCardById(cardId);

        if (card) {
            setCardType(card.card_type);
            setOrderIndex(card.order_index);

            const content = card.content as any;

            switch (card.card_type) {
                case 'text':
                    setTextContent(content.text || '');
                    break;
                case 'image':
                    setImageUrl(content.imageUrl || '');
                    setImageCaption(content.caption || '');
                    break;
                case 'video':
                    setVideoUrl(content.videoUrl || '');
                    setVideoDescription(content.description || '');
                    break;
                case 'quiz':
                    setQuizQuestion(content.question || '');
                    setQuestionKind(content.questionKind || (typeof content.correctAnswer === 'number' ? 'mcq_single' : 'likert'));
                    setQuizOptions(content.options?.length ? content.options : [...LIKERT_DEFAULT_LABELS]);
                    setScaleMin(content.scaleMin ?? 1);
                    setScaleMax(content.scaleMax ?? 5);
                    setHasCorrectAnswer(content.hasCorrectAnswer ?? typeof content.correctAnswer === 'number');
                    setCorrectAnswer(content.correctAnswer ?? 0);
                    setCorrectAnswers(content.correctAnswers ?? []);
                    break;
            }
        }

        setLoading(false);
    };

    const getContentForType = (): any => {
        switch (cardType) {
            case 'text':
                return { text: textContent };
            case 'image':
                return { imageUrl, caption: imageCaption };
            case 'video':
                return { videoUrl, description: videoDescription };
            case 'quiz':
                return {
                    questionKind,
                    question: quizQuestion,
                    options: quizOptions.filter((o) => o.trim()),
                    ...(questionKind === 'likert' ? { scaleMin, scaleMax } : {}),
                    ...(questionKind === 'binary' || questionKind === 'categorical'
                        ? { hasCorrectAnswer, ...(hasCorrectAnswer ? { correctAnswer } : {}) }
                        : {}),
                    ...(questionKind === 'mcq_single' ? { correctAnswer } : {}),
                    ...(questionKind === 'mcq_multi' ? { correctAnswers } : {}),
                };
        }
    };

    const validateCard = (): string | null => {
        switch (cardType) {
            case 'text':
                if (!textContent.trim()) return 'Please enter text content';
                break;
            case 'image':
                if (!imageUrl.trim()) return 'Please enter an image URL';
                break;
            case 'video':
                if (!videoUrl.trim()) return 'Please enter a video URL';
                break;
            case 'quiz':
                if (!quizQuestion.trim()) return 'Please enter a question';
                if (quizOptions.filter(o => o.trim()).length < 2) return 'Please provide at least 2 options';
                if (questionKind === 'binary' && quizOptions.filter(o => o.trim()).length !== 2) {
                    return 'Binary questions need exactly 2 options';
                }
                if (questionKind === 'mcq_single' && correctAnswer < 0) return 'Select a correct answer';
                if (questionKind === 'mcq_multi' && correctAnswers.length === 0) return 'Select at least one correct answer';
                if ((questionKind === 'binary' || questionKind === 'categorical') && hasCorrectAnswer && correctAnswer < 0) {
                    return 'Select the correct option';
                }
                break;
        }
        return null;
    };

    const handleSave = async () => {
        const validationError = validateCard();
        if (validationError) {
            alert(validationError);
            return;
        }

        setSaving(true);

        try {
            const cardData = {
                deck_id: deckId,
                card_type: cardType,
                content: getContentForType(),
                order_index: orderIndex
            };

            if (cardId) {
                await updateCard(cardId, cardData);
            } else {
                await createCard(cardData);
            }

            onSave();
        } catch (error) {
            console.error('Error saving card:', error);
            alert('Failed to save card. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const cardTypes: { value: CardType; label: string; icon: React.ReactNode; description: string }[] = [
        { value: 'text', label: 'Text', icon: <Type className="w-5 h-5" />, description: 'Plain text content' },
        { value: 'image', label: 'Image', icon: <ImageIcon className="w-5 h-5" />, description: 'Image with caption' },
        { value: 'video', label: 'Video', icon: <Video className="w-5 h-5" />, description: 'YouTube/Vimeo embed' },
        { value: 'quiz', label: 'Quiz', icon: <HelpCircle className="w-5 h-5" />, description: 'Multiple choice question' },
    ];

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
                <div className="p-8 rounded-xl bg-card">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading card...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
            <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-xl bg-card">
                <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-border bg-card">
                    <h3 className="text-xl font-bold text-foreground">
                        {cardId ? 'Edit Card' : 'Add New Card'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg transition-colors hover:bg-accent"
                    >
                        <X className="w-6 h-6 text-muted-foreground" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {!cardId && (
                        <div>
                            <label className="block text-sm font-medium mb-3 text-muted-foreground">
                                Card Type
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {cardTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => setCardType(type.value)}
                                        className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${cardType === type.value
                                            ? 'border-primary bg-primary/10 ring-primary/20'
                                            : 'border-border hover:border-primary/30'
                                            }`}
                                    >
                                        <div className={cardType === type.value ? 'text-primary' : 'text-muted-foreground'}>
                                            {type.icon}
                                        </div>
                                        <div className="text-left">
                                            <div className={`font-medium ${cardType === type.value ? 'text-primary' : 'text-foreground'}`}>
                                                {type.label}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {type.description}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {cardType === 'text' && (
                        <div>
                            <label className="block text-sm font-medium mb-2 text-muted-foreground">
                                Text Content *
                            </label>
                            <textarea
                                value={textContent}
                                onChange={(e) => setTextContent(e.target.value)}
                                rows={6}
                                className={inputClass}
                                placeholder="Enter the text content to display..."
                            />
                        </div>
                    )}

                    {cardType === 'image' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                                    Image URL *
                                </label>
                                <input
                                    type="text"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className={inputClass}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                                    Caption (optional)
                                </label>
                                <input
                                    type="text"
                                    value={imageCaption}
                                    onChange={(e) => setImageCaption(e.target.value)}
                                    className={inputClass}
                                    placeholder="Image caption or description..."
                                />
                            </div>
                            {imageUrl && (
                                <div>
                                    <p className="text-sm mb-2 text-muted-foreground">Preview:</p>
                                    <img src={imageUrl} alt="Preview" className="w-full rounded-lg" onError={(e) => {
                                        e.currentTarget.src = '';
                                        e.currentTarget.alt = 'Failed to load image';
                                    }} />
                                </div>
                            )}
                        </>
                    )}

                    {cardType === 'video' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                                    Video URL * (YouTube or Vimeo)
                                </label>
                                <input
                                    type="text"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    className={inputClass}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                                    Description (optional)
                                </label>
                                <textarea
                                    value={videoDescription}
                                    onChange={(e) => setVideoDescription(e.target.value)}
                                    rows={3}
                                    className={inputClass}
                                    placeholder="What will students learn from this video..."
                                />
                            </div>
                        </>
                    )}

                    {cardType === 'quiz' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                                    Question type
                                </label>
                                <select
                                    value={questionKind}
                                    onChange={(e) => {
                                        const k = e.target.value as QuestionKind;
                                        setQuestionKind(k);
                                        if (k === 'likert') setQuizOptions([...LIKERT_DEFAULT_LABELS]);
                                        if (k === 'binary') setQuizOptions(['Yes', 'No']);
                                        if (k === 'categorical' || k === 'mcq_single' || k === 'mcq_multi') {
                                            setQuizOptions(['', '', '', '']);
                                        }
                                        setCorrectAnswers([]);
                                    }}
                                    className={inputClass}
                                >
                                    {(Object.keys(QUESTION_KIND_LABELS) as QuestionKind[]).map((k) => (
                                        <option key={k} value={k}>{QUESTION_KIND_LABELS[k]}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                                    Question *
                                </label>
                                <textarea
                                    value={quizQuestion}
                                    onChange={(e) => setQuizQuestion(e.target.value)}
                                    rows={3}
                                    className={inputClass}
                                    placeholder="Enter your question..."
                                />
                            </div>
                            {(questionKind === 'binary' || questionKind === 'categorical') && (
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={hasCorrectAnswer}
                                        onChange={(e) => setHasCorrectAnswer(e.target.checked)}
                                    />
                                    Has correct answer (scored)
                                </label>
                            )}
                            <div>
                                <label className="block text-sm font-medium mb-3 text-muted-foreground">
                                    Options *
                                </label>
                                <div className="space-y-3">
                                    {quizOptions.map((option, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            {(questionKind === 'mcq_single' ||
                                              ((questionKind === 'binary' || questionKind === 'categorical') && hasCorrectAnswer)) && (
                                                <input
                                                    type="radio"
                                                    name="correctAnswer"
                                                    checked={correctAnswer === index}
                                                    onChange={() => setCorrectAnswer(index)}
                                                    className="w-4 h-4"
                                                />
                                            )}
                                            {questionKind === 'mcq_multi' && (
                                                <input
                                                    type="checkbox"
                                                    checked={correctAnswers.includes(index)}
                                                    onChange={() => {
                                                        setCorrectAnswers((prev) =>
                                                            prev.includes(index)
                                                                ? prev.filter((i) => i !== index)
                                                                : [...prev, index]
                                                        );
                                                    }}
                                                    className="w-4 h-4"
                                                />
                                            )}
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => {
                                                    const newOptions = [...quizOptions];
                                                    newOptions[index] = e.target.value;
                                                    setQuizOptions(newOptions);
                                                }}
                                                className={`flex-1 ${inputClass}`}
                                                placeholder={`Option ${index + 1}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                                {questionKind !== 'likert' && questionKind !== 'binary' && (
                                    <button
                                        type="button"
                                        onClick={() => setQuizOptions([...quizOptions, ''])}
                                        className="mt-2 text-sm text-primary hover:underline"
                                    >
                                        + Add option
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t border-border bg-card">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg font-medium transition-colors bg-muted hover:bg-accent text-muted-foreground"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Card'}
                    </button>
                </div>
            </div>
        </div>
    );
};
