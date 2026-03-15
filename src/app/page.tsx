"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

async function extractTextFromPDF(file: File) {
  // @ts-expect-error type definitions untuk pdfjs-dist tidak lengkap di versi ini
  const pdfjsLib = await import("pdfjs-dist/build/pdf");
  
  // Memuat standar worker langsung dari node_modules menggunakan Webpack public path
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => ("str" in item ? item.str : ""));
    // Menambahkan PAGE identifier agar AI tahu halaman origin
    text += `\n--- PAGE ${i} ---\n` + strings.join(" ");
  }
  return text;
}

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const file = formData.get("file") as File;

    if (!title || !file) {
      setError("Judul dan file PDF wajib diisi!");
      setLoading(false);
      return;
    }

    try {
      // 1. Ekstrak teks dari PDF di browser pengguna, mencegah payload 10MB limit NextJS
      const content = await extractTextFromPDF(file);

      // 2. Transmit HANYA string teks mentah ke backend (sangat kecil sizenya)
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal memproses materi");

      // Redirect ke halaman flashcard/study baru
      if (data.id) {
        router.push(`/study/${data.id}`);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo / Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">🚀 Smart-SKS</h1>
          <p className="mt-2 text-sm text-gray-500">
            Ubah materi kuliahmu menjadi Flashcard, Quiz, dan Mind-Map interaktif.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-800">Materi Baru</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Judul Materi / Topik
              </label>
              <input
                type="text"
                name="title"
                required
                disabled={loading}
                placeholder="cth: Pengantar Jaringan Komputer"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
              />
            </div>

            <div className="mb-5">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Upload File Materi (PDF)
              </label>
              <input
                type="file"
                name="file"
                accept=".pdf"
                required
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100 file:mr-4 file:rounded-full file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-gray-700"
              />
              <p className="mt-1.5 text-xs text-gray-500">
                AI akan membaca isi PDF dan merangkumnya menjadi Interactive Study Kit.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menganalisa Materi... (Bisa 10-20 detik)
                </>
              ) : (
                "Proses dengan AI →"
              )}
            </button>
          </form>
        </div>

        {/* Quick Access */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Atau langsung lihat riwayat dokumen →{" "}
            <Link href="/dashboard" className="font-medium text-gray-600 underline hover:text-gray-900">
              Dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
