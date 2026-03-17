"use client";

import { useState, useEffect, useCallback } from "react";
import type { QuizQuestion } from "@/types";
import { motion } from "framer-motion";

interface Props {
  questions: QuizQuestion[];
  onUpdate?: (newQuestions: QuizQuestion[]) => void;
}

type Phase = "playing" | "result";

const TIMER_SECONDS = 30;

export default function Quiz({ questions: initialQuestions, onUpdate }: Props) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [phase, setPhase] = useState<Phase>("playing");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [answers, setAnswers] = useState<{
    question: QuizQuestion;
    chosen: string | null;
    ok: boolean
  }[]>([]);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editQ, setEditQ] = useState("");
  const [editOpts, setEditOpts] = useState<string[]>([]);
  const [editAns, setEditAns] = useState("");
  const [editExp, setEditExp] = useState("");

  useEffect(() => {
    setQuestions(initialQuestions);
  }, [initialQuestions]);

  const question = questions[current];

  const submitAnswer = useCallback(
    (choice: string | null) => {
      if (answered || isEditing) return;
      const isCorrect = choice === question.correct_answer;
      setSelected(choice);
      setAnswered(true);
      if (isCorrect) setScore((s) => s + 1);
      setAnswers((prev) => [
        ...prev,
        { question, chosen: choice, ok: isCorrect },
      ]);
    },
    [answered, question, isEditing]
  );

  // Timer countdown
  useEffect(() => {
    if (answered || phase !== "playing" || isEditing) return;
    if (timer === 0) {
      submitAnswer(null);
      return;
    }
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer, answered, phase, submitAnswer, isEditing]);

  const next = () => {
    if (current + 1 >= questions.length) {
      setPhase("result");
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
      setTimer(TIMER_SECONDS);
    }
  };

  const restart = () => {
    setPhase("playing");
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setTimer(TIMER_SECONDS);
    setAnswers([]);
  };

  const startEdit = () => {
    setEditQ(question.question);
    setEditOpts([...question.options]);
    setEditAns(question.correct_answer);
    setEditExp(question.explanation);
    setIsEditing(true);
  };

  const saveEdit = () => {
    const newQuestions = [...questions];
    newQuestions[current] = {
      ...question,
      question: editQ,
      options: editOpts,
      correct_answer: editAns,
      explanation: editExp,
    };
    setQuestions(newQuestions);
    setIsEditing(false);
    if (onUpdate) {
      onUpdate(newQuestions);
    }
  };

  const timerColor = timer > 15 ? "text-green" : timer > 5 ? "text-yellow" : "text-red-500";

  if (phase === "result") {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl"
      >
        <div className="rounded-2xl border-[3px] border-white/30 bg-dark-90 p-8 text-center shadow-[6px_6px_0px_#ffffff]">
          <p className="text-6xl font-black text-white">{score}/{questions.length}</p>
          <p className="mt-2 text-gray font-bold">Skor kamu: <span className="text-purple bg-purple/10 px-2 py-0.5 rounded-md">{pct}%</span></p>
          <p className="mt-3 text-2xl font-bold text-white mb-6">
            {pct >= 80 ? "🎉 Luar biasa!" : pct >= 60 ? "👍 Lumayan!" : "📚 Perlu belajar lagi"}
          </p>

          <hr className="border-white/10 mb-6" />
          <h3 className="text-xl font-black text-white text-left mb-6">Review Modul 📖</h3>

          {/* Answer Review */}
          <div className="space-y-6 text-left">
            {answers.map((a, i) => (
              <div key={i} className={`rounded-xl border-[3px] p-5 shadow-[4px_4px_0px_#ffffff] ${a.ok ? "border-green bg-green/5" : "border-red-500 bg-red-500/5"}`}>
                <div className="flex justify-between items-start mb-3 gap-4">
                  <p className="font-bold text-white text-lg leading-snug">{i + 1}. {a.question.question}</p>
                  {a.question.page_number && (
                    <span className="shrink-0 text-[10px] font-black tracking-widest text-dark bg-yellow px-2 py-1 rounded border border-dark">
                      HAL {a.question.page_number}
                    </span>
                  )}
                </div>

                {!a.ok && (
                  <div className="mt-2 mb-3 bg-red-500/10 border-2 border-red-500/30 p-3 rounded-lg">
                    <p className="text-xs font-black text-red-400 uppercase tracking-widest mb-1">Jawaban Kamu</p>
                    <p className="font-bold text-white/80">{a.chosen ?? "⏳ Waktu habis"}</p>
                  </div>
                )}

                <div className="mt-2 bg-green/10 border-2 border-green/30 p-3 rounded-lg mb-4">
                  <p className="text-xs font-black text-green uppercase tracking-widest mb-1">Jawaban Benar</p>
                  <p className="font-bold text-white">✓ {a.question.correct_answer}</p>
                </div>

                {/* Detailed Explanation Reference */}
                <div className="bg-light-blue/10 border-[2px] border-light-blue/20 p-4 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full -mr-4 -mt-4"></div>
                  <p className="text-xs font-black text-light-blue uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="text-lg">💡</span> Mengapa ini benar?
                  </p>
                  <p className="text-sm font-semibold text-white/80 leading-relaxed">{a.question.explanation}</p>
                  {a.question.source_topic && (
                    <p className="mt-3 text-xs font-bold text-white/50 border-t border-white/10 pt-2">
                      Topik: {a.question.source_topic}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={restart}
            className="mt-10 w-full rounded-xl bg-yellow border-[3px] border-dark px-6 py-4 text-lg font-black text-dark uppercase tracking-widest shadow-[4px_4px_0px_#ffffff] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            Coba Lagi
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between text-sm font-bold text-white">
        <span className="bg-dark-90 border-[2px] border-white/30 px-3 py-1 rounded-lg">Soal {current + 1} / {questions.length}</span>
        <span className={`font-mono text-xl ${timerColor} bg-dark-90 border-[2px] border-white/30 px-3 py-1 rounded-lg`}>{timer}s</span>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 h-3 w-full rounded-full bg-dark/50 border-[2px] border-white/30 overflow-hidden">
        <div
          className="h-full rounded-r-full bg-yellow border-r-[2px] border-white/50 transition-all duration-500"
          style={{ width: `${((current) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="relative rounded-2xl border-[3px] border-white/30 bg-dark-90 p-6 shadow-[6px_6px_0px_#ffffff]">
        {!isEditing && !answered && (
           <button onClick={startEdit} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black uppercase tracking-wider border-[2px] transition-all bg-dark-90 border-white/30 text-white hover:bg-white/20 shadow-[2px_2px_0px_#ffffff] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none">✎</button>
        )}

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-white/50 mb-1 block">Pertanyaan</label>
              <textarea
                className="w-full bg-dark/50 border border-white/30 rounded px-3 py-2 text-white font-bold focus:outline-none resize-none"
                value={editQ}
                onChange={(e) => setEditQ(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-white/50 mb-1 block">Pilihan Jawaban</label>
              {editOpts.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  className="w-full bg-dark/50 border border-white/30 rounded px-3 py-2 text-white text-sm mb-2 focus:outline-none"
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...editOpts];
                    newOpts[idx] = e.target.value;
                    setEditOpts(newOpts);
                  }}
                />
              ))}
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-white/50 mb-1 block">Jawaban Benar (Harus sama persis)</label>
              <select
                 className="w-full bg-dark/50 border border-white/30 rounded px-3 py-2 text-white text-sm focus:outline-none mb-2"
                 value={editAns}
                 onChange={(e) => setEditAns(e.target.value)}
              >
                {editOpts.map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-white/50 mb-1 block">Penjelasan</label>
              <textarea
                className="w-full bg-dark/50 border border-white/30 rounded px-3 py-2 text-white text-sm focus:outline-none resize-none"
                value={editExp}
                onChange={(e) => setEditExp(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-3 pt-2">
               <button onClick={saveEdit} className="flex-1 bg-green text-white py-2 rounded-lg border-[2px] border-green shadow-[2px_2px_0px_var(--green)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all font-black uppercase tracking-wider">Simpan</button>
               <button onClick={() => setIsEditing(false)} className="flex-1 bg-red-500 text-white py-2 rounded-lg border-[2px] border-red-500 shadow-[2px_2px_0px_#ef4444] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all font-black uppercase tracking-wider">Batal</button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs pr-8 font-black uppercase tracking-widest text-white/50">{question.source_topic}</p>
              {question.page_number && (
                <p className="text-[10px] font-black tracking-widest text-dark bg-yellow px-2 py-0.5 rounded-md border border-dark">
                  Hal {question.page_number}
                </p>
              )}
            </div>
            <p className="text-lg font-black text-white leading-snug">{question.question}</p>

            {/* Options */}
            <div className="mt-6 space-y-3">
              {question.options.map((opt) => {
                let style = "border-[3px] border-white/20 bg-dark/50 text-white hover:bg-white/10 shadow-[2px_2px_0px_#ffffff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none";
                if (answered) {
                  if (opt === question.correct_answer) style = "border-[3px] border-green bg-green text-white shadow-none translate-x-0.5 translate-y-0.5";
                  else if (opt === selected) style = "border-[3px] border-red-500 bg-red-500 text-white shadow-none translate-x-0.5 translate-y-0.5";
                  else style = "border-[3px] border-white/10 bg-dark-90 text-white/30 shadow-none";
                }
                return (
                  <button
                    key={opt}
                    onClick={() => submitAnswer(opt)}
                    disabled={answered}
                    className={`w-full rounded-xl px-5 py-3.5 text-left text-sm font-bold transition-all ${style} disabled:cursor-default`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {answered && (
              <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} className="mt-6 rounded-xl bg-light-blue/10 border-[3px] border-light-blue/20 p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full -mr-4 -mt-4"></div>
                <p className="text-xs font-black text-light-blue uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="text-lg">💡</span> Penjelasan Singkat
                </p>
                <p className="text-sm font-semibold text-white leading-relaxed">{question.explanation}</p>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Next Button */}
      {answered && !isEditing && (
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="mt-6 flex justify-end">
          <button
            onClick={next}
            className="rounded-xl border-[3px] border-white/30 bg-purple px-6 py-3.5 text-sm font-black text-white hover:bg-[#5c47d6] uppercase tracking-widest shadow-[4px_4px_0px_#ffffff] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            {current + 1 >= questions.length ? "Lihat Hasil Penuh →" : "Soal Berikutnya →"}
          </button>
        </motion.div>
      )}
    </div>
  );
}
