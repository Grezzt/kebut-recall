"use client";

import { use, useState, useEffect } from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import type { StudyDocument } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default function StudyOverviewPage({ params }: Props) {
  const { id } = use(params);
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
            Pilih Mode Belajar
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mt-12 pb-20">
          {/* Flashcard Option */}
          <Link href={`/study/${id}/flashcard`} className="block group">
            <div className="rounded-3xl border-[3px] border-white/30 bg-dark-90 p-8 h-full shadow-[6px_6px_0px_#ffffff] group-hover:bg-purple/20 group-hover:border-purple transition-all group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[2px_2px_0px_#ffffff]">
               <div className="text-6xl mb-6 group-hover:scale-110 transition-transform origin-bottom-left">🃏</div>
               <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Flashcard</h2>
               <p className="font-bold text-gray/80 text-sm">
                 Hafalkan konsep dan istilah penting.
               </p>
               <div className="mt-6 flex items-center gap-2 text-purple font-black uppercase tracking-widest text-xs">
                  Mulai Belajar <span className="text-lg">→</span>
               </div>
            </div>
          </Link>

          {/* Quiz Option */}
          <Link href={`/study/${id}/quiz`} className="block group">
            <div className="rounded-3xl border-[3px] border-white/30 bg-dark-90 p-8 h-full shadow-[6px_6px_0px_#ffffff] group-hover:bg-light-blue/20 group-hover:border-light-blue transition-all group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[2px_2px_0px_#ffffff]">
               <div className="text-6xl mb-6 group-hover:scale-110 transition-transform origin-bottom-left">📝</div>
               <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Quiz</h2>
               <p className="font-bold text-gray/80 text-sm">
                 Uji pemahamanmu dengan latihan soal pilihan ganda.
               </p>
               <div className="mt-6 flex items-center gap-2 text-light-blue font-black uppercase tracking-widest text-xs">
                  Mulai Belajar <span className="text-lg">→</span>
               </div>
            </div>
          </Link>

          {/* Mindmap Option */}
          <Link href={`/study/${id}/mindmap`} className="block group">
            <div className="rounded-3xl border-[3px] border-white/30 bg-dark-90 p-8 h-full shadow-[6px_6px_0px_#ffffff] group-hover:bg-green/20 group-hover:border-green transition-all group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[2px_2px_0px_#ffffff]">
               <div className="text-6xl mb-6 group-hover:scale-110 transition-transform origin-bottom-left">🗺️</div>
               <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Mind-Map</h2>
               <p className="font-bold text-gray/80 text-sm">
                 Lihat gambaran besar dan hubungan antar konsep.
               </p>
               <div className="mt-6 flex items-center gap-2 text-green font-black uppercase tracking-widest text-xs">
                  Mulai Belajar <span className="text-lg">→</span>
               </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
