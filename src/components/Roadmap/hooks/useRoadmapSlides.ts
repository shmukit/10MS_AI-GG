import { useState, useCallback } from 'react';
import type { EnabledSlideDeck } from '../../../services/database';

export function useRoadmapSlides(slideDecks: EnabledSlideDeck[]) {
  const [selectedSlideDeck, setSelectedSlideDeck] = useState<EnabledSlideDeck | null>(null);
  const [showSlidesModal, setShowSlidesModal] = useState(false);
  const [showSlidePicker, setShowSlidePicker] = useState(false);

  const openSlides = useCallback(() => {
    if (slideDecks.length === 0) return;
    if (slideDecks.length === 1) {
      setSelectedSlideDeck(slideDecks[0]);
      setShowSlidesModal(true);
      return;
    }
    setShowSlidePicker(true);
  }, [slideDecks]);

  const selectSlideDeck = useCallback((deck: EnabledSlideDeck) => {
    setSelectedSlideDeck(deck);
    setShowSlidePicker(false);
    setShowSlidesModal(true);
  }, []);

  const closeSlidesModal = useCallback(() => {
    setShowSlidesModal(false);
    setSelectedSlideDeck(null);
  }, []);

  const closeSlidePicker = useCallback(() => {
    setShowSlidePicker(false);
  }, []);

  return {
    selectedSlideDeck,
    showSlidesModal,
    showSlidePicker,
    openSlides,
    selectSlideDeck,
    closeSlidesModal,
    closeSlidePicker,
  };
}
