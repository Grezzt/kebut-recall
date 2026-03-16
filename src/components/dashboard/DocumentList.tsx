"use client";

import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { FileText, ExternalLink, ChevronRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";

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
}

export default function DocumentList({ documents, error }: DocumentListProps) {
  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-sm text-red-600 border border-red-200">
        <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span className="font-bold">Gagal mengambil data dari database.</span>
        </div>
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="rounded-4xl border-[3px] border-dashed border-dark bg-white py-16 px-6 text-center shadow-[8px_8px_0px_#181e2a]">
        <div className="w-16 h-16 bg-light-blue rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-dark -rotate-6">
            <FileText className="w-8 h-8 text-dark" strokeWidth={2.5} />
        </div>
        <h3 className="text-xl font-black text-dark mb-2 uppercase tracking-tight">Belum Ada Materi</h3>
        <p className="font-bold text-gray-500 max-w-sm mx-auto mb-8">Kamu belum mengunggah dokumen apapun. Mulai unggah PDF untuk membuat bahan belajarmu.</p>
        <Link href="/create" className="btn-ks-accent border-2 border-dark shadow-[4px_4px_0px_0px_var(--dark)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--dark)] transition-all">
            Buat Materi Pertama
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
      {documents.map((doc) => (
        <div key={doc.id} className="ks-hover-card-wrapper transition-all duration-300 rounded-3xl group/card">
          <div className="ks-hover-card-shadow rounded-3xl" />
          <div className="ks-hover-card bg-white h-full flex flex-col border-2 border-dark rounded-3xl box-border">
            <div>
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-white border-2 border-dark rounded-xl ks-hover-card-icon shadow-[2px_2px_0px_#181e2a] group-hover/card:bg-dark! group-hover/card:border-yellow! transition-colors">
                        <FileText className="w-6 h-6 text-dark ks-hover-card-icon group-hover/card:text-yellow!" strokeWidth={2.5} />
                    </div>
                    {doc.status === "completed" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-white text-green border-2 border-green uppercase tracking-wide group-hover/card:border-white! group-hover/card:text-white! group-hover/card:bg-transparent!">
                            <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={3} />
                            Selesai
                        </span>
                    ) : doc.status === "failed" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-red-100 text-red-600 border border-red-200 uppercase tracking-wide">
                            <AlertCircle className="w-3 h-3" />
                            Gagal
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-white text-yellow border-2 border-yellow uppercase tracking-wide">
                            <Clock className="w-3 h-3 animate-pulse" strokeWidth={3} />
                            Proses
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-black text-dark ks-hover-card-heading mb-4 line-clamp-2 leading-tight">{doc.title}</h3>

                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-[11px] font-black px-2.5 py-1 bg-gray/30 text-dark rounded-md border-2 border-dark/10 ks-hover-card-text tracking-wide uppercase group-hover/card:border-white/20!">
                        {doc.flashcards ? (doc.flashcards as any[]).length : 0} Flashcard
                    </span>
                    <span className="text-[11px] font-black px-2.5 py-1 bg-gray/30 text-dark rounded-md border-2 border-dark/10 ks-hover-card-text tracking-wide uppercase group-hover/card:border-white/20!">
                        {doc.quiz ? (doc.quiz as any[]).length : 0} Soal
                    </span>
                    <span className="text-[11px] font-black px-2.5 py-1 bg-gray/30 text-dark rounded-md border-2 border-dark/10 ks-hover-card-text tracking-wide uppercase group-hover/card:border-white/20!">
                        {doc.mindmap ? (doc.mindmap as any[]).length : 0} Map
                    </span>
                </div>
            </div>

            <div className="pt-5 border-t-2 border-gray mt-auto flex flex-col gap-4 ks-hover-card-btn group/btn transition-colors group-hover/card:border-white/20!">
                <span className="text-[13px] text-gray-500 font-bold ks-hover-card-text uppercase tracking-wide">
                    {format(new Date(doc.created_at), "dd MMM yyyy", { locale: idLocale })}
                </span>

                <div className="flex items-center gap-3 w-full">
                    {doc.file_url && (
                        <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-white text-dark rounded-xl transition-all border-2 border-dark shadow-[4px_4px_0px_#181e2a] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#181e2a] group-hover/card:shadow-[4px_4px_0px_#ffffff]! group-hover/card:hover:translate-x-0.5! group-hover/card:hover:translate-y-0.5! group-hover/card:hover:shadow-[2px_2px_0px_#ffffff]! text-sm font-bold"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
                            <span>PDF</span>
                        </a>
                    )}

                    {doc.status === "completed" && (
                        <Link
                            href={`/study/${doc.id}`}
                            className="flex-2 flex items-center justify-center gap-2 p-2.5 bg-yellow text-dark rounded-xl transition-all border-2 border-dark shadow-[4px_4px_0px_#181e2a] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#181e2a] group-hover/card:shadow-[4px_4px_0px_#ffffff]! group-hover/card:hover:translate-x-0.5! group-hover/card:hover:translate-y-0.5! group-hover/card:hover:shadow-[2px_2px_0px_#ffffff]! text-sm font-bold"
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
    </div>
  );
}
