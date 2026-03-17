"use client";

import { use, useState, useEffect } from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import Quiz from "@/components/Quiz";
import LoadingScreen from "@/components/LoadingScreen";
import type { StudyDocument } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default function QuizStudyPage({ params }: Props) {
  const { id } = use(params);
  const [doc, setDoc] = useState<StudyDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDoc() {
      const supabase = createClient();

      // Fetch by ID only to allow public access
      const { data, error } = await supabase
        .from("study_documents")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Failed to load document:", error);
      }
      setDoc(data);
      setLoading(false);
    }
    loadDoc();
  }, [id]);

  const handleUpdate = async (newQuiz: any[]) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("study_documents")
        .update({ quiz: newQuiz })
        .eq("id", id);

      if (error) throw error;
      setDoc((prev) => prev ? { ...prev, quiz: newQuiz } : null);
    } catch (err) {
      console.error("Failed to update quiz:", err);
      alert("Gagal menyimpan perubahan. Silakan coba lagi.");
    }
  };

  if (loading) {
    return <LoadingScreen message="Memuat materi..." />;
  }

  if (!doc) notFound();

  return (
    <div className="min-h-screen bg-dark ks-grid-bg relative px-4 py-10">
      <div className="mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href={`/study/${id}`} className="text-sm font-bold text-white/60 hover:text-white flex items-center gap-2 mb-2 transition-colors">
              <span className="text-lg leading-none">←</span> Kembali ke Menu
            </Link>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-3xl font-black text-white tracking-tight">Quiz: {doc.title}</h1>
            </div>
          </div>
          <span className="rounded-xl border-[2px] border-white/30 bg-light-blue text-dark px-4 py-2 text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_#ffffff] rotate-2">
            Mode Quiz
          </span>
        </div>

        {/* Content */}
        <div className="pb-20">
          {doc.quiz && doc.quiz.length > 0 ? (
            <Quiz questions={doc.quiz} onUpdate={handleUpdate} />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border-[3px] border-dashed border-white/30 bg-dark-90 py-20 px-6 text-center shadow-[8px_8px_0px_#ffffff]">
              <span className="text-6xl mb-6">🤖</span>
              <p className="text-xl font-black text-white uppercase tracking-tight mb-2">
                Data quiz tidak ditemukan.
              </p>
              <p className="font-bold text-gray max-w-md mx-auto">
                AI belum selesai memproses bagian ini, atau struktur dokumen awal kurang mendukung pembuatan materi ini.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
