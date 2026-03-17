"use client";

import { use, useState, useEffect } from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";
import LoadingScreen from "@/components/LoadingScreen";
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

interface Props {
  params: Promise<{ id: string }>;
}

export default function MindmapStudyPage({ params }: Props) {
  const { id } = use(params);
  const [doc, setDoc] = useState<StudyDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

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
    return <LoadingScreen message="Memuat materi..." />;
  }

  if (!doc) notFound();

  return (
    <div className="min-h-screen bg-dark ks-grid-bg relative px-4 py-10">
      <div className="mx-auto max-w-[1400px] relative z-10">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href={`/study/${id}`} className="text-sm font-bold text-white/60 hover:text-white flex items-center gap-2 mb-2 transition-colors">
              <span className="text-lg leading-none">←</span> Kembali ke Menu
            </Link>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-3xl font-black text-white tracking-tight">Mind-Map: {doc.title}</h1>
            </div>
          </div>
          <span className="rounded-xl border-[2px] border-white/30 bg-green px-4 py-2 text-xs font-black uppercase tracking-widest text-white shadow-[2px_2px_0px_#ffffff] rotate-2">
            Mode Mind-Map
          </span>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6 pb-20 items-stretch">

          {/* Mindmap Section */}
          <div className="flex-1 min-w-0">
            {doc.mindmap && doc.mindmap.length > 0 ? (
              <Mindmap
                nodes={doc.mindmap}
                onNodeClick={(node) => {
                  // asumsikan node punya atribut page_number atau metadata berisi halaman
                  // jika node.page_number ada, set halaman
                  if (node.page_number) {
                    setCurrentPage(Number(node.page_number));
                  } else {
                    // Coba nge-extract dari metadata lain jika page_number tidak langsung di root object
                    const anyNode = node as any;
                    const page = anyNode?.page_number || anyNode?.metadata?.page_number;
                    if (page) {
                       setCurrentPage(Number(page));
                    }
                  }
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border-[3px] border-dashed border-white/30 bg-dark-90 py-20 px-6 text-center shadow-[8px_8px_0px_#ffffff] h-full">
                <span className="text-6xl mb-6">🗺️</span>
                <p className="text-xl font-black text-white uppercase tracking-tight mb-2">
                  Data mindmap tidak ditemukan.
                </p>
                <p className="font-bold text-gray max-w-md mx-auto">
                  AI belum selesai memproses bagian ini, atau struktur dokumen awal kurang mendukung pembuatan materi ini.
                </p>
              </div>
            )}
          </div>

          {/* PDF Viewer Section */}
          {doc.file_url && (
            <div className="w-full lg:w-[500px] xl:w-[600px] flex-shrink-0 flex flex-col rounded-2xl border-[3px] border-white/30 bg-dark-90 shadow-[6px_6px_0px_#ffffff] overflow-hidden" style={{ minHeight: "600px" }}>
               <div className="flex-none h-12 w-full bg-dark/80 flex items-center justify-between px-4 border-b-[3px] border-white/30 z-10 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400 border-2 border-white/30"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow border-2 border-white/30"></div>
                    <div className="w-3 h-3 rounded-full bg-green border-2 border-white/30"></div>
                    <span className="ml-2 text-xs font-black uppercase tracking-widest text-white/80">PDF Viewer {currentPage ? `- Halaman ${currentPage}` : ""}</span>
                  </div>
               </div>

               <div className="flex-1 w-full bg-white relative">
                 <iframe
                   key={currentPage} /* Force reload if page changes to ensure PDF viewer jumps reliably */
                   src={`${doc.file_url}#page=${currentPage}&view=FitH`}
                   className="w-full h-full border-none absolute inset-0"
                   title="PDF Viewer"
                 />
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
