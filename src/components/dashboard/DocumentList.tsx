"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { FileText, Eye, ChevronRight, Clock, CheckCircle2, AlertCircle, X, Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface Document {
  id: string;
  title: string;
  status: string;
  flashcards: any;
  quiz: any;
  mindmap: any;
  created_at: string;
  file_url: string;
}

interface DocumentListProps {
  documents: Document[] | null;
  error: any;
  isExplore?: boolean;
}

export default function DocumentList({ documents, error, isExplore = false }: DocumentListProps) {
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [docToDelete, setDocToDelete] = useState<Document | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

  const handleSoftDelete = async (id: string) => {
    setIsDeleting(id);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("study_documents")
        .update({ status: "deleted" })
        .eq("id", id);

      if (error) throw error;

      router.refresh();
      setDocToDelete(null);
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Gagal menghapus materi. Silakan coba lagi.");
    } finally {
      setIsDeleting(null);
    }
  };

  if (error) {
    return (
      <div className="rounded-xl bg-red-500/10 p-6 text-sm text-red-400 border border-red-500/30">
        <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span className="font-bold">Gagal mengambil data dari database.</span>
        </div>
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="rounded-4xl border-[3px] border-dashed border-white/30 bg-dark-90 py-16 px-6 text-center shadow-[8px_8px_0px_#ffffff]">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-white/30 -rotate-6">
            <FileText className="w-8 h-8 text-white" strokeWidth={2.5} />
        </div>
        <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">{isExplore ? "Belum Ada Materi Terpublikasi" : "Belum Ada Materi"}</h3>
        <p className="font-bold text-gray max-w-sm mx-auto mb-8">{isExplore ? "Belum ada dokumen publik yang berhasil dibuat dan tersedia untuk umum." : "Kamu belum mengunggah dokumen apapun. Mulai unggah PDF untuk membuat bahan belajarmu."}</p>
        {!isExplore && (
          <Link href="/create" className="btn-ks-accent border-2 border-dark shadow-[4px_4px_0px_0px_#ffffff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#ffffff] transition-all">
              Buat Materi Pertama
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
      {documents.map((doc) => (
        <div key={doc.id} className="ks-hover-card-wrapper transition-all duration-300 rounded-3xl group/card">
          <div className="ks-hover-card-shadow rounded-3xl bg-white border-white shadow-[4px_4px_0px_0px_#ffffff]" />
          <div className="ks-hover-card bg-dark-90 h-full flex flex-col border-2 border-white/30 rounded-3xl box-border hover:bg-dark-90 hover:border-white">
            <div>
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-dark-90 border-2 border-white/30 rounded-xl ks-hover-card-icon shadow-[2px_2px_0px_#ffffff] group-hover/card:bg-white! group-hover/card:border-yellow! transition-colors">
                        <FileText className="w-6 h-6 text-white ks-hover-card-icon group-hover/card:text-dark!" strokeWidth={2.5} />
                    </div>
                    {doc.status === "completed" ? (
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-dark-90 text-green border-2 border-green uppercase tracking-wide group-hover/card:border-white! group-hover/card:text-white! group-hover/card:bg-transparent!">
                                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={3} />
                                Selesai
                            </span>
                            {!isExplore && (
                            <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setDocToDelete(doc);
                                }}
                                disabled={isDeleting === doc.id}
                                className="p-1.5 rounded-full bg-dark-90 border-2 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-colors z-10 relative cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group-hover/card:border-red-500 shadow-[2px_2px_0px_rgba(239,68,68,0.3)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
                                title="Hapus Materi"
                            >
                                <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                            </button>
                            )}
                        </div>
                    ) : doc.status === "failed" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-red-500/10 text-red-500 border border-red-500/30 uppercase tracking-wide">
                            <AlertCircle className="w-3 h-3" />
                            Gagal
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-dark-90 text-yellow border-2 border-yellow uppercase tracking-wide">
                            <Clock className="w-3 h-3 animate-pulse" strokeWidth={3} />
                            Proses
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-black text-white ks-hover-card-heading mb-4 line-clamp-2 leading-tight">{doc.title}</h3>

                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-[11px] font-black px-2.5 py-1 bg-white/10 text-white rounded-md border-2 border-white/20 ks-hover-card-text tracking-wide uppercase group-hover/card:border-white/40!">
                        {doc.flashcards ? (doc.flashcards as any[]).length : 0} Flashcard
                    </span>
                    <span className="text-[11px] font-black px-2.5 py-1 bg-white/10 text-white rounded-md border-2 border-white/20 ks-hover-card-text tracking-wide uppercase group-hover/card:border-white/40!">
                        {doc.quiz ? (doc.quiz as any[]).length : 0} Soal
                    </span>
                    <span className="text-[11px] font-black px-2.5 py-1 bg-white/10 text-white rounded-md border-2 border-white/20 ks-hover-card-text tracking-wide uppercase group-hover/card:border-white/40!">
                        {doc.mindmap ? (doc.mindmap as any[]).length : 0} Map
                    </span>
                </div>
            </div>

            <div className="pt-5 border-t-2 border-white/20 mt-auto flex flex-col gap-4 ks-hover-card-btn group/btn transition-colors group-hover/card:border-white/40!">
                <span className="text-[13px] text-gray/70 font-bold ks-hover-card-text uppercase tracking-wide">
                    {format(new Date(doc.created_at), "dd MMM yyyy", { locale: idLocale })}
                </span>

                <div className="flex items-center gap-3 w-full">
                    {doc.file_url && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setPreviewDoc(doc);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-dark border-white/30 text-white rounded-xl transition-all border-2 shadow-[2px_2px_0px_#ffffff] hover:translate-x-0.5 hover:translate-y-0.5 group-hover/card:hover:shadow-none! group-hover/card:shadow-[4px_4px_0px_#ffffff]! group-hover/card:hover:translate-x-0.5! group-hover/card:hover:translate-y-0.5! group-hover/card:hover:bg-white! group-hover/card:hover:text-dark! group-hover/card:border-white group-hover/card:text-white group-hover/card:hover:border-dark text-sm font-bold cursor-pointer"
                        >
                            <Eye className="w-4 h-4" strokeWidth={2.5} />
                            <span>PDF</span>
                        </button>
                    )}

                    {doc.status === "completed" && (
                        <Link
                            href={`/study/${doc.id}`}
                            className="flex-2 flex items-center justify-center gap-2 p-2.5 bg-yellow text-dark rounded-xl transition-all border-2 border-dark shadow-[2px_2px_0px_#ffffff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none group-hover/card:shadow-[4px_4px_0px_#ffffff]! group-hover/card:hover:translate-x-0.5! group-hover/card:hover:translate-y-0.5! group-hover/card:hover:shadow-[2px_2px_0px_#ffffff]! text-sm font-bold w-1/2"
                            title="Mulai Belajar"
                        >
                            <span>Belajar</span>
                            <ChevronRight className="w-5 h-5 font-bold" strokeWidth={3} />
                        </Link>
                    )}
                </div>
            </div>
          </div>
        </div>
      ))}

      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6" onClick={() => setPreviewDoc(null)}>
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
                            {previewDoc.title}
                        </h2>
                    </div>
                    <button
                        onClick={() => setPreviewDoc(null)}
                        className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0 border-2 border-transparent hover:border-white/30"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                <div className="flex-1 w-full bg-white relative">
                    <iframe
                        src={`${previewDoc.file_url}#view=FitH`}
                        className="w-full h-full border-none absolute inset-0 bg-white"
                        title="PDF Viewer"
                    />
                </div>
            </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {docToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => !isDeleting && setDocToDelete(null)}>
          <div
            className="w-full max-w-md bg-dark-90 rounded-2xl border-[3px] border-white/30 shadow-[8px_8px_0px_#ffffff] p-6 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-red-500/10 border-2 border-red-500/30 rounded-xl">
                <AlertCircle className="w-8 h-8 text-red-500" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white mb-2 tracking-tight">Hapus Materi?</h3>
                <p className="font-bold text-gray/80 text-sm leading-relaxed">
                  Apakah kamu yakin ingin menghapus materi <span className="text-white">"{docToDelete.title}"</span>? Materi ini akan disembunyikan dari daftar kamu.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-8">
              <button
                onClick={() => setDocToDelete(null)}
                disabled={!!isDeleting}
                className="px-5 py-2.5 rounded-xl font-bold text-white border-2 border-white/30 hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={() => handleSoftDelete(docToDelete.id)}
                disabled={!!isDeleting}
                className="px-5 py-2.5 rounded-xl font-bold bg-red-500 text-white border-2 border-red-400 shadow-[4px_4px_0px_rgba(239,68,68,0.3)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isDeleting === docToDelete.id ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                    Hapus Materi
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
