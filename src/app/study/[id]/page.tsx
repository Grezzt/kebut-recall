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
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">
              ← Kembali ke Dashboard
            </Link>
            <h1 className="mt-2 text-xl font-bold text-gray-900">{doc.title}</h1>
          </div>
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            Dihasilkan oleh AI
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1 w-fit max-w-full">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.key
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:text-gray-800"
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
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center shadow-sm">
              <span className="text-4xl mb-3 opacity-20">🤖</span>
              <p className="font-medium text-gray-800">
                Data {tab} tidak ditemukan.
              </p>
              <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                AI belum selesai memproses bagian ini, atau struktur dokumen awal kurang mendukung pembuatan materi ini.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
