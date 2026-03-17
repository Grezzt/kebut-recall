"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Flashcard as FlashcardType } from "@/types";

interface Props {
  flashcards: FlashcardType[];
  onFinish?: (mistakes: number, timeSeconds: number, totalPairs: number) => void;
}

interface CardItem {
  id: string; // unique
  text: string;
  type: "term" | "definition";
  matchId: number; // original flashcard index to match term & definition
}

export default function MatchingGame({ flashcards, onFinish }: Props) {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardItem[]>([]);
  const [matchedIds, setMatchedIds] = useState<Set<number>>(new Set());
  const [wrongMatch, setWrongMatch] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());

  // Initialize and shuffle cards
  useEffect(() => {
    // Generate pairs for the game. We can take up to 6 pairs (12 cards) at a time to fit the screen nicely,
    // or just play with all if not too many. For simplicity, let's take up to 8 max to avoid crowding.
    const gamePairs = flashcards.slice(0, 8);

    let initialCards: CardItem[] = [];
    gamePairs.forEach((fc, index) => {
      initialCards.push({
        id: `term-${index}`,
        text: fc.term,
        type: "term",
        matchId: index,
      });
      initialCards.push({
        id: `def-${index}`,
        text: fc.definition,
        type: "definition",
        matchId: index,
      });
    });

    // Fisher-Yates shuffle
    for (let i = initialCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [initialCards[i], initialCards[j]] = [initialCards[j], initialCards[i]];
    }

    setCards(initialCards);
    setMatchedIds(new Set());
    setSelectedCards([]);
    setWrongMatch(false);
    setMistakes(0);
    setStartTime(Date.now());
  }, [flashcards]);

  const handleCardClick = (card: CardItem) => {
    // Prevent clicking if already matched, already 2 cards selected, or card is already selected
    if (
      matchedIds.has(card.matchId) ||
      selectedCards.length === 2 ||
      selectedCards.some((c) => c.id === card.id)
    ) {
      return;
    }

    const newSelection = [...selectedCards, card];
    setSelectedCards(newSelection);

    if (newSelection.length === 2) {
      const [first, second] = newSelection;

      if (first.matchId === second.matchId) {
        // Match!
        setTimeout(() => {
          setMatchedIds((prev) => new Set(prev).add(first.matchId));
          setSelectedCards([]);
          // Check if won
          if (matchedIds.size + 1 === cards.length / 2) {
            const timeSeconds = Math.floor((Date.now() - startTime) / 1000);
            setTimeout(() => {
              if (onFinish) onFinish(mistakes, timeSeconds, cards.length / 2);
            }, 1000);
          }
        }, 500);
      } else {
        // Wrong match
        setWrongMatch(true);
        setMistakes((m) => m + 1);
        setTimeout(() => {
          setSelectedCards([]);
          setWrongMatch(false);
        }, 800);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <div className="mb-6 flex flex-col items-center">
        <h2 className="text-2xl font-black text-white tracking-tight uppercase">Mencocokkan Kartu</h2>
        <p className="text-gray/80 text-sm font-medium mt-1">Cocokkan istilah dengan definisinya!</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl">
        <AnimatePresence>
          {cards.map((card) => {
            const isMatched = matchedIds.has(card.matchId);
            const isSelected = selectedCards.some((c) => c.id === card.id);
            const isWrong = isSelected && wrongMatch;

            if (isMatched) {
               // Render hidden or empty placeholder
               return (
                   <motion.div
                      key={card.id}
                      initial={{ opacity: 1, scale: 1 }}
                      animate={{ opacity: 0, scale: 0.8 }}
                      className="w-full h-[150px] invisible"
                   />
               );
            }

            return (
              <motion.div
                key={card.id}
                layout
                whileHover={!isSelected ? { scale: 1.02 } : {}}
                whileTap={!isSelected ? { scale: 0.98 } : {}}
                onClick={() => handleCardClick(card)}
                className={`relative w-full h-[150px] sm:h-[180px] p-4 flex items-center justify-center text-center cursor-pointer rounded-2xl border-2 transition-colors shadow-lg overflow-hidden
                  ${
                    isWrong
                      ? "bg-red-500/20 border-red-500 text-red-500"
                      : isSelected
                      ? "bg-purple border-purple-400 text-white"
                      : "bg-[#202230] border-white/10 hover:border-white/30 text-[#E2E4E9]"
                  }
                `}
              >
                <span className={`text-sm sm:text-base font-medium line-clamp-6 ${isSelected && !isWrong ? "text-white" : "text-white/90"}`}>
                  {card.text}
                </span>
                {isSelected && (
                    <motion.div
                       layoutId="selectedOutline"
                       className="absolute inset-0 border-4 border-purple-400 rounded-2xl pointer-events-none"
                    />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}