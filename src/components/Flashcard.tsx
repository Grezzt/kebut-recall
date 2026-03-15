"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Flashcard as FlashcardType } from "@/types";

interface Props {
  flashcards: FlashcardType[];
}

export default function Flashcard({ flashcards }: Props) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [known, setKnown] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setFlipped((prev) => ({ ...prev, [i]: !prev[i] }));

  const toggleKnown = (e: React.MouseEvent, i: number) => {
    e.stopPropagation();
    setKnown((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const knownCount = known.size;

  return (
    <div>
      {/* Progress */}
      <div className="mb-6 flex items-center justify-between text-sm text-gray-500">
        <span>{flashcards.length} kartu</span>
        <span className="font-medium text-green-600">{knownCount} / {flashcards.length} sudah paham ✓</span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {flashcards.map((card, i) => (
          <div
            key={i}
            className="relative cursor-pointer"
            style={{ perspective: "1000px", height: "180px" }}
            onClick={() => toggle(i)}
          >
            <motion.div
              style={{ transformStyle: "preserve-3d" }}
              animate={{ rotateY: flipped[i] ? 180 : 0 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="relative h-full w-full"
            >
              {/* Front */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center rounded-xl border-2 bg-white p-4 text-center ${
                  known.has(i) ? "border-green-400" : "border-gray-200"
                }`}
                style={{ backfaceVisibility: "hidden" }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Istilah</p>
                <p className="text-lg font-bold text-gray-800">{card.term}</p>
                <p className="mt-3 text-xs text-gray-400">klik untuk lihat definisi</p>
              </div>

              {/* Back */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center rounded-xl border-2 bg-gray-50 p-4 text-center ${
                  known.has(i) ? "border-green-400" : "border-gray-200"
                }`}
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">Definisi</p>
                <p className="text-sm text-gray-700 leading-relaxed">{card.definition}</p>
              </div>
            </motion.div>

            {/* Known Button */}
            <button
              onClick={(e) => toggleKnown(e, i)}
              className={`absolute bottom-2 right-2 z-10 rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${
                known.has(i)
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-600"
              }`}
            >
              {known.has(i) ? "✓ Paham" : "Tandai"}
            </button>
          </div>
        ))}
      </div>

      {/* Reset */}
      {knownCount > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => { setKnown(new Set()); setFlipped({}); }}
            className="text-sm text-gray-400 underline hover:text-gray-600"
          >
            Reset semua kartu
          </button>
        </div>
      )}
    </div>
  );
}
