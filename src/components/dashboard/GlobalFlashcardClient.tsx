"use client";

import { useState } from "react";
import Flashcard from "@/components/Flashcard";
import type { Flashcard as FlashcardType } from "@/types";
import { LayoutGrid, RectangleHorizontal } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  flashcards: FlashcardType[];
}

export default function GlobalFlashcardClient({ flashcards }: Props) {
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");

  return (
    <div className="w-full flex flex-col items-center">
      {/* Toggle View Mode */}
      <div className="mb-8 flex space-x-2 bg-dark-90 p-1.5 rounded-xl border-2 border-white/10 w-fit mx-auto shadow-lg">
        <button
          onClick={() => setViewMode("carousel")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            viewMode === "carousel"
              ? "bg-purple text-white shadow-[2px_2px_0px_#ffffff] border-2 border-white/30"
              : "text-gray hover:text-white border-2 border-transparent"
          }`}
        >
          <RectangleHorizontal size={18} />
          Mode Tunggal
        </button>
        <button
          onClick={() => setViewMode("grid")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            viewMode === "grid"
              ? "bg-purple text-white shadow-[2px_2px_0px_#ffffff] border-2 border-white/30"
              : "text-gray hover:text-white border-2 border-transparent"
          }`}
        >
          <LayoutGrid size={18} />
          Mode Grid (4x4)
        </button>
      </div>

      {/* Render based on view mode */}
      <div className="w-full">
        {viewMode === "carousel" ? (
          <Flashcard flashcards={flashcards} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 w-full max-w-6xl mx-auto">
            {flashcards.map((fc, idx) => (
              <GridCard key={idx} flashcard={fc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GridCard({ flashcard }: { flashcard: FlashcardType }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative w-full aspect-square cursor-pointer group"
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Depan (Term) */}
        <div
          className="absolute w-full h-full bg-[#202230] border-2 border-white/20 hover:border-white/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-[4px_4px_0px_#ffffff] transition-colors"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-gray/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">
            Istilah
          </span>
          <h3 className="text-base md:text-lg lg:text-xl font-black text-white line-clamp-4 px-2">
            {flashcard.term}
          </h3>
          <span className="absolute bottom-3 text-gray/50 text-[10px] font-bold">
            Klik untuk balik
          </span>
        </div>

        {/* Belakang (Definition) */}
        <div
          className="absolute w-full h-full bg-purple border-2 border-white/30 rounded-2xl p-4 flex flex-col items-center pt-8 text-center shadow-[4px_4px_0px_#ffffff]"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="absolute top-3 text-white/70 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">
            Definisi
          </span>
          <div className="overflow-y-auto w-full h-full pr-1 pb-4 flex items-center justify-center">
            <p className="text-xs md:text-sm font-medium text-white whitespace-pre-wrap leading-relaxed">
              {flashcard.definition}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
