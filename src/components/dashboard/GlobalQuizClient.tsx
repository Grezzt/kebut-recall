"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/types";
import Quiz from "@/components/Quiz";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  questions: QuizQuestion[];
}

export default function GlobalQuizClient({ questions }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(
    Math.min(5, questions.length)
  );

  const availableOptions = [5, 10, 15, 20, 25, questions.length].filter(
    (num, index, self) =>
      num <= questions.length && self.indexOf(num) === index
  ).sort((a, b) => a - b);

  const startGame = () => {
    setIsPlaying(true);
  };

  const handleClose = () => {
    setIsPlaying(false);
  };

  // We take exactly selectedQuestionCount questions.
  // We don't need to shuffle here because the server already shuffled them for us.
  const questionsToPlay = questions.slice(0, selectedQuestionCount);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!isPlaying ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center p-8 bg-dark-90 border-[3px] border-white/30 rounded-2xl shadow-[8px_8px_0px_#ffffff] max-w-2xl mx-auto mt-10"
          >
            <h2 className="text-3xl font-black text-white tracking-tight uppercase mb-4 text-center">
              Persiapan Kuis Universal
            </h2>
            <p className="text-gray text-center font-medium mb-8">
              Pilih jumlah soal kuis yang ingin Anda mainkan. Total soal yang tersedia dari semua dokumen: {questions.length} soal.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              {availableOptions.map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedQuestionCount(num)}
                  className={`px-6 py-3 rounded-xl font-bold border-2 transition-all ${
                    selectedQuestionCount === num
                      ? "bg-blue-500 border-blue-500 text-white shadow-[4px_4px_0px_#ffffff] -translate-y-1"
                      : "bg-transparent border-white/20 text-gray hover:text-white hover:border-white/50"
                  }`}
                >
                  {num} Soal
                </button>
              ))}
            </div>

            <button
              onClick={startGame}
              className="px-8 py-4 bg-green-500 text-white rounded-2xl font-black text-xl border-2 border-green-400 shadow-[4px_4px_0px_#ffffff] hover:translate-x-1 hover:translate-y-1 hover:shadow-[0px_0px_0px_#ffffff] transition-all uppercase tracking-wider"
            >
              Mulai Kuis
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Quiz questions={questionsToPlay} onClose={handleClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
