"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Lightbulb, RefreshCcw, LayoutTemplate, CheckCircle2 } from "lucide-react";
import type { Flashcard as FlashcardType } from "@/types";
import MatchingGame from "./MatchingGame";

interface Props {
  flashcards: FlashcardType[];
  documentId?: string;
  onUpdate?: (newFlashcards: FlashcardType[]) => void;
}

export default function Flashcard({ flashcards: initialFlashcards, documentId }: Props) {
  const [flashcards, setFlashcards] = useState(initialFlashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [direction, setDirection] = useState(0); // 1 = next, -1 = prev
  const [isTermFirst, setIsTermFirst] = useState(true);

  const [known, setKnown] = useState<Set<number>>(new Set());
  const [isGameMode, setIsGameMode] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [gameStats, setGameStats] = useState({ mistakes: 0, time: 0, totalPairs: 0 });
  const [showCompletion, setShowCompletion] = useState(false);

  // Sync internal state if props change
  useEffect(() => {
    setFlashcards(initialFlashcards);
    setCurrentIndex(0);
    setFlipped(false);
    setIsGameMode(false);
    setIsGameFinished(false);
    setGameStats({ mistakes: 0, time: 0, totalPairs: 0 });
    setShowCompletion(false);
  }, [initialFlashcards]);

  // Load known set from localStorage
  useEffect(() => {
    if (documentId) {
      const stored = localStorage.getItem(`flashcards_known_${documentId}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setKnown(new Set(parsed));
          }
        } catch (e) {}
      }
    }
  }, [documentId]);

  // Save known set to localStorage
  useEffect(() => {
    if (documentId) {
      localStorage.setItem(`flashcards_known_${documentId}`, JSON.stringify(Array.from(known)));
    }

    // Check if fully understood
    if (flashcards.length > 0 && known.size === flashcards.length && !isGameMode && !showCompletion) {
      setShowCompletion(true);
    }
  }, [known, documentId, flashcards.length, isGameMode, showCompletion]);

  const toggleKnown = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setKnown((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const handleStartGame = () => {
    setShowCompletion(false);
    setIsGameMode(true);
  };

  const resetProgress = () => {
    setKnown(new Set());
    setIsGameMode(false);
    setShowCompletion(false);
    setCurrentIndex(0);
    if (documentId) {
      localStorage.removeItem(`flashcards_known_${documentId}`);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when user is interacting with inputs (if any)
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;

      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === " " || e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault(); // prevent page scroll
        setFlipped(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, flashcards.length]);

  const handleNext = () => {
    setDirection(1);
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setFlipped(false);
    setCurrentIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1));
  };

  if (!flashcards || flashcards.length === 0) return null;

  if (isGameMode) {
    if (isGameFinished) {
      const totalAttempts = Math.max(1, gameStats.totalPairs + gameStats.mistakes);
      const accuracy = Math.round((gameStats.totalPairs / totalAttempts) * 100);

      return (
        <div className="w-full flex justify-center py-10">
          <div className="bg-[#202230] border-[3px] border-purple max-w-[600px] w-full rounded-2xl p-10 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
             <div className="w-20 h-20 bg-purple/20 rounded-full flex items-center justify-center mb-6">
                <LayoutTemplate size={40} className="text-purple-400" />
             </div>
             <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Selesai!</h2>

             <div className="flex gap-4 mb-8 w-full justify-center">
               <div className="bg-[#2A2B40] border border-white/10 rounded-xl p-4 flex flex-col items-center min-w-[120px]">
                 <span className="text-xs font-black uppercase text-white/50 mb-1">Waktu</span>
                 <span className="text-2xl font-black text-white">{gameStats.time}s</span>
               </div>
               <div className="bg-[#2A2B40] border border-white/10 rounded-xl p-4 flex flex-col items-center min-w-[120px]">
                 <span className="text-xs font-black uppercase text-white/50 mb-1">Salah</span>
                 <span className="text-2xl font-black text-red-500">{gameStats.mistakes}</span>
               </div>
               <div className="bg-[#2A2B40] border border-white/10 rounded-xl p-4 flex flex-col items-center min-w-[120px]">
                 <span className="text-xs font-black uppercase text-white/50 mb-1">Akurasi</span>
                 <span className="text-2xl font-black text-green">{accuracy}%</span>
               </div>
             </div>

             <p className="text-gray mb-8 font-medium">
               {accuracy >= 80 ? "Luar biasa! Ingatanmu sangat tajam. 🎉" : accuracy >= 50 ? "Bagus! Terus berlatih agar lebih cepat. 👍" : "Ayo coba lagi, kamu pasti bisa! 💪"}
             </p>

             <div className="flex gap-4 w-full">
                <button
                  onClick={() => { setIsGameFinished(false); setIsGameMode(false); }}
                  className="flex-1 py-4 rounded-xl border-2 border-white/20 text-white font-bold hover:bg-white/5 transition-colors"
                >
                  Kembali
                </button>
                <button
                   onClick={() => { setIsGameFinished(false); setGameStats({ mistakes: 0, time: 0, totalPairs: 0 }); }}
                   className="flex-1 py-4 rounded-xl bg-purple border-2 border-purple-400 text-white font-bold shadow-[4px_4px_0px_rgba(255,255,255,0.2)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                >
                  Mainkan Lagi
                </button>
             </div>
          </div>
        </div>
      );
    }

    return (
       <div className="w-full relative pt-8">
          <button
             onClick={() => setIsGameMode(false)}
             className="absolute top-0 left-0 text-sm font-bold text-white/50 hover:text-white transition-colors"
          >
            Kembali
          </button>
          <MatchingGame
            flashcards={flashcards}
            onFinish={(mistakes, time, totalPairs) => {
              setGameStats({ mistakes, time, totalPairs });
              setIsGameFinished(true);
            }}
          />
       </div>
    );
  }

  if (showCompletion) {
    return (
      <div className="w-full flex justify-center py-10">
        <div className="bg-[#202230] border-[3px] border-green max-w-[600px] w-full rounded-2xl p-10 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
           <div className="w-20 h-20 bg-green/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={40} className="text-green" />
           </div>
           <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Luar Biasa!</h2>
           <p className="text-gray mb-8 font-medium">Anda telah menandai semua {flashcards.length} kartu sebagai "Sudah Paham". Mari uji ingatan Anda dengan sesi Mencocokkan Kartu!</p>

           <div className="flex gap-4 w-full">
              <button
                onClick={resetProgress}
                className="flex-1 py-4 rounded-xl border-2 border-white/20 text-white font-bold hover:bg-white/5 transition-colors"
              >
                Ulangi Flashcard
              </button>
              <button
                onClick={handleStartGame}
                className="flex-1 py-4 rounded-xl bg-purple border-2 border-purple-400 text-white font-bold shadow-[4px_4px_0px_rgba(255,255,255,0.2)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                Mulai Mencocokkan
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center py-4 text-[#E2E4E9]">
      <div className="w-full max-w-[1000px] flex flex-col min-h-[600px] bg-[#202230] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden font-sans border-2 border-white/5">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-6 border-b border-white/5 gap-4">
            <div className="flex items-center gap-2 font-bold text-lg text-white">
                <div className="bg-purple-600/20 p-1.5 rounded-lg border border-purple-500/30">
                   <LayoutTemplate className="text-purple-400" size={20} />
                </div>
                <span className="cursor-pointer hover:text-purple-400 transition-colors flex items-center gap-2">
                   Flashcard
                   {/* <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg> */}
                </span>
            </div>

            <div className="flex flex-col items-center">
                <div className="font-bold tracking-widest text-sm text-white/50">
                    <span className="text-white">{currentIndex + 1}</span> / {flashcards.length}
                </div>
            </div>

            {/* <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsTermFirst(!isTermFirst)}
                  className="hidden sm:flex items-center gap-2 border border-white/20 px-4 py-2 rounded-full text-xs font-bold hover:bg-white/10 transition-colors text-white/80"
                >
                    <RefreshCcw size={14}/> {isTermFirst ? "Ubah istilah ini menjadi pertanyaan" : "Ubah pertanyaan menjadi istilah"}
                </button>
            </div> */}
        </div>

        {/* Stepper Progress Bar */}
        <div className="w-full h-1.5 bg-white/5 relative">
            <div
                className="h-full bg-purple transition-all duration-300 ease-out"
                style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
            />
        </div>

        {/* Stacked Cards Layout */}
        <div className="flex-1 w-full flex items-center justify-center relative px-4 py-10 overflow-hidden">
            <div className="relative w-full max-w-[800px] h-[380px] sm:h-[420px]" style={{ perspective: "1500px" }}>
                 <AnimatePresence mode="popLayout" custom={direction}>
                     {flashcards.map((card, index) => {
                         // To create the "stack", we render the current card and the 2 cards behind it.
                         const isVisible = index >= currentIndex && index < currentIndex + 3;
                         if (!isVisible) return null;

                         const offset = index - currentIndex;
                         const isTop = offset === 0;

                         return (
                             <motion.div
                                 key={index}
                                 custom={direction}
                                 variants={{
                                     enter: (dir: number) => ({
                                         x: dir > 0 ? 500 : -500, // slide in from right or left depending on direction
                                         y: 50,
                                         opacity: 0,
                                         scale: 0.8,
                                         zIndex: 10,
                                     }),
                                     center: {
                                         x: 0,
                                         y: offset * 18,        // consecutive cards pushed down
                                         scale: 1 - offset * 0.04, // shrunk to simulate depth
                                         opacity: 1 - offset * 0.3,
                                         zIndex: 10 - offset,   // behind the current card
                                     },
                                     exit: (dir: number) => ({
                                         x: dir > 0 ? -500 : 500, // slide out opposite to incoming
                                         y: 50,
                                         opacity: 0,
                                         scale: 0.8,
                                         zIndex: 0,
                                     })
                                 }}
                                 initial="enter"
                                 animate="center"
                                 exit="exit"
                                 transition={{ duration: 0.4, type: "spring", bounce: 0.15 }}
                                 className={`absolute inset-0 w-full h-full ${isTop ? 'cursor-pointer' : ''}`}
                                 onClick={() => isTop && setFlipped(!flipped)}
                                 style={{ transformStyle: "preserve-3d" }}
                             >
                                 <motion.div
                                    animate={{ rotateX: isTop && flipped ? 180 : 0 }}
                                    transition={{ duration: 0.6, type: "spring", bounce: 0.25 }}
                                    style={{ transformStyle: "preserve-3d", transformOrigin: "center center" }}
                                    className="relative w-full h-full"
                                 >
                                       {/* Front Face */}
                                      <div
                                          className={`absolute inset-0 w-full h-full bg-[#202230] rounded-2xl p-6 sm:p-10 flex flex-col text-white shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-2 ${known.has(index) ? 'border-green' : 'border-white/5'}`}
                                          style={{ backfaceVisibility: "hidden" }}
                                      >
                                          <div className="flex justify-between items-start w-full">
                                              <button className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold">
                                                  <Lightbulb size={16}/> Tampilkan Pemahaman
                                              </button>
                                          </div>
                                          <div className="flex-1 flex items-center justify-center text-center px-4 mt-6">
                                              <p className="text-2xl sm:text-[32px] font-normal leading-relaxed text-white/90">
                                                  {isTermFirst ? card.term : card.definition}
                                              </p>
                                          </div>
                                          {isTop && (
                                              <div className="w-full flex justify-center mt-6">
                                                  <button
                                                      onClick={(e) => toggleKnown(e, index)}
                                                      className={`px-6 py-2.5 rounded-xl font-bold text-sm tracking-wider uppercase transition-all shadow-[2px_2px_0px_rgba(255,255,255,0.2)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none border-2
                                                        ${known.has(index) ? 'bg-[#202230] border-green text-white' : 'border-white/20 text-white/70 hover:text-white hover:border-white'}`}
                                                  >
                                                      {known.has(index) ? "✓ Sudah Paham" : "Tandai Paham"}
                                                  </button>
                                              </div>
                                          )}
                                      </div>

                                      {/* Back Face */}
                                      <div
                                          className={`absolute inset-0 w-full h-full bg-purple rounded-2xl p-6 sm:p-10 flex flex-col text-white shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-2 ${known.has(index) ? 'border-green' : 'border-white/5'}`}
                                          style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
                                      >
                                          <div className="flex justify-between items-start w-full">
                                              <button className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold">
                                                  <Lightbulb size={16}/> Tampilkan Istilah
                                              </button>
                                          </div>
                                          <div className="flex-1 flex items-center justify-center text-center px-4 mt-6">
                                              <p className="text-xl sm:text-[28px] font-normal leading-relaxed text-white/90">
                                                  {isTermFirst ? card.definition : card.term}
                                              </p>
                                          </div>
                                          {isTop && (
                                              <div className="w-full flex justify-center mt-6">
                                                  <button
                                                      onClick={(e) => toggleKnown(e, index)}
                                                      className={`px-6 py-2.5 rounded-xl font-bold text-sm tracking-wider uppercase transition-all shadow-[2px_2px_0px_rgba(255,255,255,0.2)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none border-2
                                                        ${known.has(index) ? 'bg-green border-green text-white' : 'border-white/20 text-white/70 hover:text-white hover:border-white'}`}
                                                  >
                                                      {known.has(index) ? "✓ Sudah Paham" : "Tandai Paham"}
                                                  </button>
                                              </div>
                                          )}
                                      </div>
                                 </motion.div>
                             </motion.div>
                         );
                     })}
                 </AnimatePresence>
            </div>
        </div>

        {/* Bottom Navigation Control */}
        <div className="flex items-center justify-center px-8 py-6 w-full mx-auto border-t border-white/5 bg-transparent">
            {/* Pagination Controls */}
            <div className="flex items-center gap-5">
                 <button
                     onClick={handlePrev}
                     className="w-[50px] h-[50px] rounded-full bg-[#2A2B40] hover:bg-[#3B3C54] flex items-center justify-center text-white transition-colors shadow-lg"
                  >
                     <ChevronLeft size={26} strokeWidth={2.5}/>
                 </button>
                 <button
                     onClick={handleNext}
                     className="w-[50px] h-[50px] rounded-full bg-[#2A2B40] hover:bg-[#3B3C54] flex items-center justify-center text-white transition-colors shadow-lg"
                  >
                     <ChevronRight size={26} strokeWidth={2.5}/>
                 </button>
            </div>
        </div>
      </div>
    </div>
  );
}
