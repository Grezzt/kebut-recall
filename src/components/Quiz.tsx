"use client";

import { useState, useEffect, useCallback } from "react";
import type { QuizQuestion } from "@/types";

interface Props {
  questions: QuizQuestion[];
}

type Phase = "playing" | "result";

const TIMER_SECONDS = 30;

export default function Quiz({ questions }: Props) {
  const [phase, setPhase] = useState<Phase>("playing");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [answers, setAnswers] = useState<{ question: string; chosen: string | null; correct: string; ok: boolean }[]>([]);

  const question = questions[current];

  const submitAnswer = useCallback(
    (choice: string | null) => {
      if (answered) return;
      const isCorrect = choice === question.correct_answer;
      setSelected(choice);
      setAnswered(true);
      if (isCorrect) setScore((s) => s + 1);
      setAnswers((prev) => [
        ...prev,
        { question: question.question, chosen: choice, correct: question.correct_answer, ok: isCorrect },
      ]);
    },
    [answered, question]
  );

  // Timer countdown
  useEffect(() => {
    if (answered || phase !== "playing") return;
    if (timer === 0) {
      submitAnswer(null);
      return;
    }
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer, answered, phase, submitAnswer]);

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

  const timerColor =
    timer > 15 ? "text-green-600" : timer > 5 ? "text-yellow-500" : "text-red-500";

  if (phase === "result") {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="mx-auto max-w-lg">
        <div className="rounded-2xl border-[3px] border-white/30 bg-dark-90 p-8 text-center shadow-[6px_6px_0px_#ffffff]">
          <p className="text-6xl font-black text-white">{score}/{questions.length}</p>
          <p className="mt-2 text-gray font-bold">Skor kamu: <span className="text-purple bg-purple/10 px-2 py-0.5 rounded-md">{pct}%</span></p>
          <p className="mt-3 text-2xl font-bold text-white">
            {pct >= 80 ? "🎉 Luar biasa!" : pct >= 60 ? "👍 Lumayan!" : "📚 Perlu belajar lagi"}
          </p>

          {/* Answer Review */}
          <div className="mt-8 space-y-4 text-left">
            {answers.map((a, i) => (
              <div key={i} className={`rounded-xl border-[3px] p-4 text-sm shadow-[2px_2px_0px_#ffffff] ${a.ok ? "border-green bg-green/10" : "border-red-500 bg-red-500/10"}`}>
                <p className="font-bold text-white mb-2">{i + 1}. {a.question}</p>
                {!a.ok && (
                  <p className="mt-1 text-red-400 font-semibold bg-dark-90 p-2 rounded-lg border-2 border-red-500/30">
                    Satu yang dipilih: <span className="font-bold">{a.chosen ?? "⏰ Waktu habis"}</span>
                  </p>
                )}
                <p className={`mt-2 font-bold p-2 text-sm rounded-lg border-2 bg-dark-90 ${a.ok ? "text-green border-green/30" : "text-green border-green/30"}`}>
                  ✓ {a.correct}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={restart}
            className="mt-8 w-full rounded-xl bg-yellow border-[3px] border-dark px-6 py-3.5 text-base font-black text-dark uppercase tracking-widest shadow-[4px_4px_0px_#ffffff] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            Coba Lagi
          </button>
        </div>
      </div>
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
      <div className="rounded-2xl border-[3px] border-white/30 bg-dark-90 p-6 shadow-[6px_6px_0px_#ffffff]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-black uppercase tracking-widest text-white/50">{question.source_topic}</p>
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
          <div className="mt-6 rounded-xl bg-light-blue/10 border-[3px] border-light-blue/20 p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full -mr-4 -mt-4"></div>
            <p className="text-xs font-black text-light-blue uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="text-lg">💡</span> Penjelasan
            </p>
            <p className="text-sm font-semibold text-white leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </div>

      {/* Next Button */}
      {answered && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={next}
            className="rounded-xl border-[3px] border-white/30 bg-purple px-6 py-3.5 text-sm font-black text-white hover:bg-[#5c47d6] uppercase tracking-widest shadow-[4px_4px_0px_#ffffff] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            {current + 1 >= questions.length ? "Lihat Hasil →" : "Soal Berikutnya →"}
          </button>
        </div>
      )}
    </div>
  );
}
