"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Lightbulb, RefreshCcw, LayoutTemplate } from "lucide-react";
import type { Flashcard as FlashcardType } from "@/types";

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

  // Sync internal state if props change
  useEffect(() => {
    setFlashcards(initialFlashcards);
    setCurrentIndex(0);
    setFlipped(false);
  }, [initialFlashcards]);

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

  return (
    <div className="w-full flex justify-center py-4 text-[#E2E4E9]">
      <div className="w-full max-w-[1000px] flex flex-col min-h-[600px] bg-[#0A092D] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden font-sans border-2 border-white/5">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-6 border-b border-white/5 gap-4">
            <div className="flex items-center gap-2 font-bold text-lg text-white">
                <div className="bg-blue-600/20 p-1.5 rounded-lg border border-blue-500/30">
                   <LayoutTemplate className="text-blue-400" size={20} />
                </div>
                <span className="cursor-pointer hover:text-blue-400 transition-colors flex items-center gap-2">
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
                className="h-full bg-blue-500 transition-all duration-300 ease-out"
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
                                          className="absolute inset-0 w-full h-full bg-[#202230] rounded-2xl p-6 sm:p-10 flex flex-col text-white shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-2 border-white/5"
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
                                      </div>

                                      {/* Back Face */}
                                      <div
                                          className="absolute inset-0 w-full h-full bg-[#202230] rounded-2xl p-6 sm:p-10 flex flex-col text-white shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-2 border-white/5"
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
