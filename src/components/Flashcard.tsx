"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Flashcard as FlashcardType } from "@/types";

interface Props {
  flashcards: FlashcardType[];
  documentId?: string;
  onUpdate?: (newFlashcards: FlashcardType[]) => void;
}

export default function Flashcard({ flashcards: initialFlashcards, documentId, onUpdate }: Props) {
  const [flashcards, setFlashcards] = useState(initialFlashcards);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTerm, setEditTerm] = useState("");
  const [editDef, setEditDef] = useState("");

  // Update internal state if props change
  useEffect(() => {
    setFlashcards(initialFlashcards);
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
  }, [known, documentId]);

  const toggle = (i: number) => {
    if (editingId !== null) return; // Prevent flip while editing
    setFlipped((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const toggleKnown = (e: React.MouseEvent, i: number) => {
    e.stopPropagation();
    setKnown((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const startEdit = (e: React.MouseEvent, i: number, card: FlashcardType) => {
    e.stopPropagation();
    setEditingId(i);
    setEditTerm(card.term);
    setEditDef(card.definition);
  };

  const saveEdit = (e: React.MouseEvent, i: number) => {
    e.stopPropagation();
    const newCards = [...flashcards];
    newCards[i] = { term: editTerm, definition: editDef };
    setFlashcards(newCards);
    setEditingId(null);
    if (onUpdate) {
      onUpdate(newCards);
    }
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const knownCount = known.size;

  return (
    <div>
      {/* Progress */}
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between font-bold text-white gap-4">
        <span className="bg-dark-90 border-[3px] border-white/30 px-4 py-2 rounded-xl shadow-[4px_4px_0px_#ffffff]">
          {flashcards.length} KARTU
        </span>
        <span className="bg-yellow border-[3px] border-dark text-dark px-4 py-2 rounded-xl shadow-[4px_4px_0px_#ffffff]">
          {knownCount} / {flashcards.length} SUDAH PAHAM ✓
        </span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {flashcards.map((card, i) => (
          <div
            key={i}
            className="relative cursor-pointer group"
            style={{ perspective: "1000px", height: "240px" }}
            onClick={() => toggle(i)}
          >
            <motion.div
              style={{ transformStyle: "preserve-3d" }}
              animate={{ rotateY: flipped[i] ? 180 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative h-full w-full"
            >
              {/* Front */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-[3px] p-6 text-center transition-all overflow-hidden ${
                  known.has(i)
                    ? "border-green bg-green/10 shadow-[4px_4px_0px_var(--green)]"
                    : "border-white/30 bg-dark-90 shadow-[6px_6px_0px_#ffffff]"
                }`}
                style={{ backfaceVisibility: "hidden" }}
              >
                {editingId === i && !flipped[i] ? (
                  <div className="flex flex-col w-full h-full justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      className="w-full bg-dark/50 border border-white/30 rounded px-2 py-1 text-white font-bold focus:outline-none"
                      value={editTerm}
                      onChange={(e) => setEditTerm(e.target.value)}
                      placeholder="Istilah..."
                    />
                    <textarea
                      className="w-full h-full bg-dark/50 border border-white/30 rounded px-2 py-1 text-white text-sm focus:outline-none resize-none"
                      value={editDef}
                      onChange={(e) => setEditDef(e.target.value)}
                      placeholder="Definisi..."
                    />
                    <div className="flex gap-2 justify-center">
                      <button onClick={(e) => saveEdit(e, i)} className="bg-green text-white text-xs px-3 py-1.5 rounded-lg border border-green shadow-[2px_2px_0px_var(--green)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all font-black uppercase tracking-wider">Simpan</button>
                      <button onClick={cancelEdit} className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg border border-red-500 shadow-[2px_2px_0px_#ef4444] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all font-black uppercase tracking-wider">Batal</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-black uppercase tracking-widest text-gray mb-3">Istilah</p>
                    <p className="text-xl font-black text-white leading-snug">{card.term}</p>
                    <p className="mt-auto text-[10px] font-bold text-white/50 uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-lg">
                      klik untuk lihat definisi
                    </p>
                  </>
                )}
              </div>

              {/* Back */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-[3px] p-6 text-center overflow-hidden ${
                  known.has(i)
                    ? "border-green bg-green/5 shadow-[4px_4px_0px_var(--green)] text-white"
                    : "border-white/30 bg-[#202230] shadow-[6px_6px_0px_#ffffff] text-white"
                }`}
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                {editingId === i && flipped[i] ? (
                  <div className="flex flex-col w-full h-full justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      className="w-full bg-dark/50 border border-white/30 rounded px-2 py-1 text-white font-bold focus:outline-none"
                      value={editTerm}
                      onChange={(e) => setEditTerm(e.target.value)}
                      placeholder="Istilah..."
                    />
                    <textarea
                      className="w-full h-full bg-dark/50 border border-white/30 rounded px-2 py-1 text-white text-sm focus:outline-none resize-none"
                      value={editDef}
                      onChange={(e) => setEditDef(e.target.value)}
                      placeholder="Definisi..."
                    />
                    <div className="flex gap-2 justify-center">
                      <button onClick={(e) => saveEdit(e, i)} className="bg-green text-white text-xs px-3 py-1.5 rounded-lg border border-green shadow-[2px_2px_0px_var(--green)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all font-black uppercase tracking-wider">Simpan</button>
                      <button onClick={cancelEdit} className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg border border-red-500 shadow-[2px_2px_0px_#ef4444] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all font-black uppercase tracking-wider">Batal</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-black uppercase tracking-widest text-white/50 mb-3">Definisi</p>
                    <div className="flex-1 overflow-y-auto w-full flex items-center justify-center">
                      <p className="text-sm font-semibold text-white leading-relaxed">{card.definition}</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Actions */}
            {editingId !== i && (
              <>
                <button
                  onClick={(e) => startEdit(e, i, card)}
                  className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black uppercase tracking-wider border-[2px] transition-all bg-dark-90 border-white/30 text-white hover:bg-white/20 shadow-[2px_2px_0px_#ffffff] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none"
                >
                  ✎
                </button>
                <button
                  onClick={(e) => toggleKnown(e, i)}
                  className={`absolute bottom-4 right-4 z-10 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider border-[3px] transition-all hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none ${
                    known.has(i)
                      ? "bg-green border-green text-white shadow-[2px_2px_0px_var(--green)] hover:shadow-none translate-y-0.5 translate-x-0.5"
                      : "bg-dark-90 border-white/30 text-white hover:bg-white/20 shadow-[2px_2px_0px_#ffffff]"
                  }`}
                >
                  {known.has(i) ? "✓ Paham" : "Tandai"}
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Reset */}
      {knownCount > 0 && (
        <div className="mt-10 text-center">
          <button
            onClick={() => {
              setKnown(new Set());
              setFlipped({});
              if (documentId) {
                localStorage.removeItem(`flashcards_known_${documentId}`);
              }
            }}
            className="font-bold text-gray/50 hover:text-white underline decoration-2 underline-offset-4 transition-colors"
          >
            Reset semua kartu
          </button>
        </div>
      )}
    </div>
  );
}
