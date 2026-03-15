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
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-5xl font-bold text-gray-800">{score}/{questions.length}</p>
          <p className="mt-1 text-gray-500">Skor kamu: <span className="font-semibold text-blue-600">{pct}%</span></p>
          <p className="mt-2 text-2xl">
            {pct >= 80 ? "🎉 Luar biasa!" : pct >= 60 ? "👍 Lumayan!" : "📚 Perlu belajar lagi"}
          </p>

          {/* Answer Review */}
          <div className="mt-6 space-y-3 text-left">
            {answers.map((a, i) => (
              <div key={i} className={`rounded-lg border p-3 text-sm ${a.ok ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                <p className="font-medium text-gray-700">{i + 1}. {a.question}</p>
                {!a.ok && (
                  <p className="mt-1 text-red-600">
                    Jawaban kamu: <span className="font-medium">{a.chosen ?? "⏰ Waktu habis"}</span>
                  </p>
                )}
                <p className={a.ok ? "mt-1 text-green-700" : "text-gray-600"}>
                  ✓ {a.correct}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={restart}
            className="mt-6 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
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
      <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
        <span>Soal {current + 1} / {questions.length}</span>
        <span className={`font-mono text-xl font-bold ${timerColor}`}>{timer}s</span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 h-1.5 w-full rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-blue-500 transition-all"
          style={{ width: `${((current) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{question.source_topic}</p>
          {question.page_number && (
            <p className="text-[10px] font-semibold tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              Halaman {question.page_number}
            </p>
          )}
        </div>
        <p className="text-base font-semibold text-gray-800 leading-relaxed">{question.question}</p>

        {/* Options */}
        <div className="mt-5 space-y-2.5">
          {question.options.map((opt) => {
            let style = "border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50";
            if (answered) {
              if (opt === question.correct_answer) style = "border-green-500 bg-green-50 text-green-800 font-semibold";
              else if (opt === selected) style = "border-red-400 bg-red-50 text-red-700";
              else style = "border-gray-100 bg-gray-50 text-gray-400";
            }
            return (
              <button
                key={opt}
                onClick={() => submitAnswer(opt)}
                disabled={answered}
                className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-all ${style} disabled:cursor-default`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <div className="mt-4 rounded-lg bg-blue-50 border border-blue-100 p-3">
            <p className="text-xs font-semibold text-blue-600 mb-1">💡 Penjelasan</p>
            <p className="text-sm text-blue-800">{question.explanation}</p>
          </div>
        )}
      </div>

      {/* Next Button */}
      {answered && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={next}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
          >
            {current + 1 >= questions.length ? "Lihat Hasil →" : "Soal Berikutnya →"}
          </button>
        </div>
      )}
    </div>
  );
}
