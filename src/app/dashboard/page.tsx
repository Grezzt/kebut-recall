import Link from "next/link";
import { redirect } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import { createClient } from "@/utils/supabase/server";

export const revalidate = 0; // Disable cache so list is always fresh

export default async function DashboardPage() {
  const supabaseServer = await createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: documents, error } = await supabase
    .from("study_documents")
    .select("id, title, status, flashcards, quiz, mindmap, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Dashboard error:", error);
  }

  const signOut = async () => {
    "use server"
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📚 Dokumen Saya</h1>
            <p className="mt-1 text-sm text-gray-500">
              Pilih dokumen hasil proses AI untuk mulai belajar dengan Flashcard, Quiz, atau Mind-Map.
            </p>
          </div>
          <form action={signOut}>
            <button className="text-sm font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors">
              Beres Belajar (Logout)
            </button>
          </form>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            Gagal mengambil data dari database.
          </div>
        )}

        {documents && documents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white py-12 text-center shadow-sm">
            <p className="text-gray-500">Belum ada dokumen yang diproses AI.</p>
            <Link href="/" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-800">
              Buat Materi Baru →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {documents?.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm"
              >
                <div>
                  <p className="font-semibold text-gray-800">{doc.title}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {doc.flashcards ? (doc.flashcards as any[]).length : 0} flashcard ·{" "}
                    {doc.quiz ? (doc.quiz as any[]).length : 0} soal ·{" "}
                    {doc.mindmap ? (doc.mindmap as any[]).length : 0} node map
                  </p>
                  <p className="mt-2 text-[11px] text-gray-300">
                    {new Date(doc.created_at).toLocaleString("id-ID")}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${
                      doc.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : doc.status === "failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {doc.status}
                  </span>
                  
                  {doc.status === "completed" && (
                     <Link
                      href={`/study/${doc.id}`}
                      className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors shrink-0"
                    >
                      Mulai Belajar
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-400 underline hover:text-gray-600">
            ← Kembali Tambah Dokumen Materi
          </Link>
        </div>
      </div>
    </div>
  );
}
