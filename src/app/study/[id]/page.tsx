"use client";

import { use, useState, useEffect } from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";
import Flashcard from "@/components/Flashcard";
import Quiz from "@/components/Quiz";
import type { StudyDocument } from "@/types";

// Mindmap loads client-side only (React Flow / Mermaid requires browser)
const Mindmap = dynamic(() => import("@/components/Mindmap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 w-full items-center justify-center rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-400">
      Memuat diagram materi...
    </div>
  ),
});

type Tab = "flashcard" | "quiz" | "mindmap";

interface Props {
  params: Promise<{ id: string }>;
}

export default function StudyPage({ params }: Props) {
  const { id } = use(params);
  const [tab, setTab] = useState<Tab>("flashcard");

  const [doc, setDoc] = useState<StudyDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDoc() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        redirect("/login");
        return;
      }

      // Restrict fetch to doc ID AND user ID for security
      const { data, error } = await supabase
        .from("study_documents")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Failed to load document:", error);
      }
      setDoc(data);
      setLoading(false);
    }
    loadDoc();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-sm">Memuat materi...</div>
      </div>
    );
  }

  if (!doc) notFound();

  const tabs: { key: Tab; label: string }[] = [
    { key: "flashcard", label: "🃏 Flashcard" },
    { key: "quiz", label: "📝 Quiz" },
    { key: "mindmap", label: "🗺️ Mind-Map" },
  ];

  return (
    <div className="min-h-screen bg-dark ks-grid-bg relative px-4 py-10">
      <div className="mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/dashboard" className="text-sm font-bold text-white/60 hover:text-white flex items-center gap-2 mb-2 transition-colors">
              <span className="text-lg leading-none">←</span> Kembali ke Dashboard
            </Link>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-3xl font-black text-white tracking-tight">{doc.title}</h1>
              {doc.file_url && (
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border-[2px] border-dark bg-yellow px-4 py-1.5 text-xs font-black text-dark hover:bg-yellow/80 shadow-[2px_2px_0px_#ffffff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2 w-fit uppercase tracking-widest"
                >
                  Lihat PDF
                </a>
              )}
            </div>
          </div>
          <span className="rounded-xl border-[2px] border-white/30 bg-green px-4 py-2 text-xs font-black uppercase tracking-widest text-white shadow-[2px_2px_0px_#ffffff] rotate-2">
            Dihasilkan oleh AI
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="mb-10 flex gap-2 overflow-x-auto w-fit max-w-full pb-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 rounded-xl border-[3px] px-6 py-3 text-sm font-black uppercase tracking-widest transition-all ${
                tab === t.key
                  ? "border-white/30 bg-purple text-white shadow-[4px_4px_0px_#ffffff] -translate-y-1"
                  : "border-white/20 bg-dark-90 text-white hover:bg-white/10 shadow-[2px_2px_0px_#ffffff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="pb-20">
          {tab === "flashcard" && doc.flashcards && doc.flashcards.length > 0 && (
            <Flashcard flashcards={doc.flashcards} />
          )}
          {tab === "quiz" && doc.quiz && doc.quiz.length > 0 && (
            <Quiz questions={doc.quiz} />
          )}
          {tab === "mindmap" && doc.mindmap && doc.mindmap.length > 0 && (
            <Mindmap nodes={doc.mindmap} />
          )}

          {/* Empty State */}
          {((tab === "flashcard" && (!doc.flashcards || doc.flashcards.length === 0)) ||
           (tab === "quiz" && (!doc.quiz || doc.quiz.length === 0)) ||
           (tab === "mindmap" && (!doc.mindmap || doc.mindmap.length === 0))) && (
            <div className="flex flex-col items-center justify-center rounded-2xl border-[3px] border-dashed border-white/30 bg-dark-90 py-20 px-6 text-center shadow-[8px_8px_0px_#ffffff]">
              <span className="text-6xl mb-6">🤖</span>
              <p className="text-xl font-black text-white uppercase tracking-tight mb-2">
                Data {tab} tidak ditemukan.
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
