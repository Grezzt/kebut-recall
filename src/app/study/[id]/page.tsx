"use client";

import { use, useState, useEffect } from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import type { StudyDocument } from "@/types";
import LoadingScreen from "@/components/LoadingScreen";
import { X, Eye } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function StudyOverviewPage({ params }: Props) {
  const { id } = use(params);
  const [doc, setDoc] = useState<StudyDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

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
    return <LoadingScreen message="Menyiapkan meja belajarmu..." />;
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
                <button
                  onClick={() => setShowPdfPreview(true)}
                  className="rounded-xl border-[2px] border-dark bg-yellow px-4 py-1.5 text-xs font-black text-dark hover:bg-yellow/80 shadow-[2px_2px_0px_#ffffff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2 w-fit uppercase tracking-widest cursor-pointer"
                >
                  <Eye className="w-4 h-4" strokeWidth={3} />
                  Lihat PDF
                </button>
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

      {/* PDF Modal Viewer */}
      {showPdfPreview && doc?.file_url && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6" onClick={() => setShowPdfPreview(false)}>
            <div
                className="w-full max-w-5xl h-full max-h-[90vh] bg-dark-90 rounded-2xl border-[3px] border-white/30 shadow-[8px_8px_0px_#ffffff] flex flex-col relative overflow-hidden animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-none h-14 w-full bg-dark/80 flex items-center justify-between px-6 border-b-[3px] border-white/30 z-10">
                    <div className="flex items-center gap-4 truncate">
                        <div className="flex items-center gap-2 flex-shrink-0 hidden sm:flex">
                            <div className="w-3 h-3 rounded-full bg-red-400 border-2 border-white/30"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow border-2 border-white/30"></div>
                            <div className="w-3 h-3 rounded-full bg-green border-2 border-white/30"></div>
                        </div>
                        <h2 className="text-white font-black truncate max-w-md sm:max-w-xl text-lg flex items-center gap-3">
                            <span className="text-white/60">FILE PREVIEW</span>
                            <span className="text-white/30">|</span>
                            {doc.title}
                        </h2>
                    </div>
                    <button
                        onClick={() => setShowPdfPreview(false)}
                        className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0 border-2 border-transparent hover:border-white/30 cursor-pointer"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                <div className="flex-1 w-full bg-white relative">
                    <iframe
                        src={`${doc.file_url}#view=FitH`}
                        className="w-full h-full border-none absolute inset-0 bg-white"
                        title="PDF Viewer"
                    />
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
