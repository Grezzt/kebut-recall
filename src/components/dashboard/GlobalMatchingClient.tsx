"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Flashcard as FlashcardType } from "@/types";
import { CheckCircle2, RefreshCcw, Timer } from "lucide-react";

interface Props {
  flashcards: FlashcardType[];
}

interface CardItem {
  id: string; // unique
  text: string;
  type: "term" | "definition";
  matchId: number; // original index to match term & definition
}

export default function GlobalMatchingClient({ flashcards }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPairCount, setSelectedPairCount] = useState(5);

  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardItem[]>([]);
  const [matchedIds, setMatchedIds] = useState<Set<number>>(new Set());
  const [wrongMatch, setWrongMatch] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState(0);

  const [startTime, setStartTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isFinished, setIsFinished] = useState(false);

  // Maximum pairs to choose from base on flashcards.length
  const possibleOptions = [5, 10, 15, 20, 25].filter((n) => n <= flashcards.length);
  const options = possibleOptions.length > 0 ? possibleOptions : [Math.min(flashcards.length, 5)];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isFinished) {
      interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isFinished]);

  const startGame = () => {
    // Pick the chosen amount of pairs, shuffle first to be random
    const shuffledSource = [...flashcards].sort(() => Math.random() - 0.5);
    const gamePairs = shuffledSource.slice(0, selectedPairCount);

    let initialCards: CardItem[] = [];
    gamePairs.forEach((fc, index) => {
      initialCards.push({
        id: `term-${index}-${Math.random()}`,
        text: fc.term,
        type: "term",
        matchId: index,
      });
      initialCards.push({
        id: `def-${index}-${Math.random()}`,
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
    setCurrentTime(Date.now());
    setIsFinished(false);
    setIsPlaying(true);
  };

  const handleCardClick = (card: CardItem) => {
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
        setTimeout(() => {
          setMatchedIds((prev) => {
            const next = new Set(prev).add(first.matchId);
            if (next.size === cards.length / 2) {
              setIsFinished(true);
            }
            return next;
          });
          setSelectedCards([]);
        }, 500);
      } else {
        setWrongMatch(true);
        setMistakes((m) => m + 1);
        setTimeout(() => {
          setSelectedCards([]);
          setWrongMatch(false);
        }, 800);
      }
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!isPlaying) {
    if (flashcards.length === 0) return null;

    return (
      <div className="flex flex-col items-center justify-center p-8 bg-dark-90 border-[3px] border-white/30 rounded-2xl shadow-[8px_8px_0px_#ffffff] max-w-2xl mx-auto mt-10">
        <h2 className="text-3xl font-black text-white tracking-tight uppercase mb-4 text-center">
          Persiapan Matching Game
        </h2>
        <p className="text-gray text-center font-medium mb-8">
          Pilih berapa banyak pasang kartu yang ingin Anda mainkan. Makin banyak pasangannya, makin menantang!
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          {options.map((num) => (
            <button
              key={num}
              onClick={() => setSelectedPairCount(num)}
              className={`px-6 py-3 rounded-xl font-bold border-2 transition-all ${
                selectedPairCount === num
                  ? "bg-purple border-purple text-white shadow-[4px_4px_0px_#ffffff] -translate-y-1"
                  : "bg-transparent border-white/20 text-gray hover:text-white hover:border-white/50"
              }`}
            >
              {num} Pasang
            </button>
          ))}
        </div>

        <button
          onClick={startGame}
          className="px-8 py-4 bg-green-500 text-white rounded-2xl font-black text-xl border-2 border-green-400 shadow-[4px_4px_0px_#ffffff] hover:translate-x-1 hover:translate-y-1 hover:shadow-[0px_0px_0px_#ffffff] transition-all uppercase tracking-wider"
        >
          Mulai Game
        </button>
      </div>
    );
  }

  const elapsedMs = isFinished ? currentTime - startTime : currentTime - startTime;

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Game Header */}
      <div className="w-full max-w-5xl flex items-center justify-between bg-dark-90 border-2 border-white/30 p-4 rounded-2xl shadow-[4px_4px_0px_#ffffff] mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-dark-80 px-4 py-2 rounded-xl border border-white/10">
            <Timer className="text-purple" size={20} />
            <span className="font-mono font-bold text-xl text-white tracking-widest">{formatTime(elapsedMs)}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-dark-80 border border-white/10 font-bold text-red-400">
            Salah: {mistakes}
          </div>
        </div>

        <div className="font-black text-white tracking-tight">
          MATCHED: {matchedIds.size} / {cards.length / 2}
        </div>

        <button
          onClick={() => setIsPlaying(false)}
          className="px-4 py-2 bg-red-500/20 text-red-500 rounded-xl font-bold border-2 border-transparent hover:border-red-500 transition-all text-sm flex items-center gap-2"
        >
          Berhenti
        </button>
      </div>

      {isFinished ? (
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-dark-90 rounded-2xl p-10 border-[3px] border-white/30 shadow-[8px_8px_0px_#ffffff] flex flex-col items-center max-w-md text-center"
        >
          <div className="bg-green-500/20 p-4 rounded-full mb-6">
            <CheckCircle2 size={64} className="text-green-500" strokeWidth={2.5} />
          </div>
          <h3 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Permainan Selesai!</h3>
          <p className="text-gray font-medium mb-6">Luar biasa! Anda telah menyelesaikan matching game ini.</p>

          <div className="w-full grid grid-cols-2 gap-4 mb-8">
             <div className="bg-dark-80 border border-white/10 p-4 rounded-xl flex flex-col items-center">
                 <span className="text-gray text-xs font-bold uppercase mb-1">Waktu</span>
                 <span className="font-mono text-2xl font-black text-purple tracking-widest">{formatTime(elapsedMs)}</span>
             </div>
             <div className="bg-dark-80 border border-white/10 p-4 rounded-xl flex flex-col items-center">
                 <span className="text-gray text-xs font-bold uppercase mb-1">Kesalahan</span>
                 <span className="text-2xl font-black text-red-400">{mistakes}</span>
             </div>
          </div>

          <button
            onClick={() => setIsPlaying(false)}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-purple text-white rounded-xl font-bold hover:bg-purple-600 transition-colors"
          >
            <RefreshCcw size={20} />
            Main Lagi
          </button>
        </motion.div>
      ) : (
        <div className={`grid gap-4 w-full max-w-6xl ${
          selectedPairCount <= 10 ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5' :
          'grid-cols-3 md:grid-cols-5 lg:grid-cols-6'
        }`}>
          <AnimatePresence>
            {cards.map((card) => {
              const isMatched = matchedIds.has(card.matchId);
              const isSelected = selectedCards.some((c) => c.id === card.id);
              const isWrong = isSelected && wrongMatch;

              if (isMatched) {
                return (
                    <motion.div
                        key={card.id}
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: 0, scale: 0.8 }}
                        className="w-full h-32 md:h-40 invisible"
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
                  className={`relative w-full h-32 md:h-40 p-3 sm:p-4 flex items-center justify-center text-center cursor-pointer rounded-2xl border-2 transition-colors shadow-lg overflow-hidden ${
                      isWrong
                        ? "bg-red-500/20 border-red-500 text-red-500"
                        : isSelected
                        ? "bg-purple border-purple-400 text-white"
                        : "bg-[#202230] border-white/10 hover:border-white/30 text-[#E2E4E9]"
                  }`}
                >
                  <span className={`text-[11px] sm:text-xs md:text-sm font-medium line-clamp-6 ${isSelected && !isWrong ? "text-white" : "text-white/90"}`}>
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
      )}
    </div>
  );
}