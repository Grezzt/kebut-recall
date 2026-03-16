"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { getCloudinarySignature } from "@/app/actions/cloudinary";

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

export default function CreatePage() {
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

      // 2. Dapatkan signature dari server untuk upload ke Cloudinary secara aman
      const { timestamp, signature, cloudName, apiKey, folder } = await getCloudinarySignature();

      // 3. Upload file ke Cloudinary
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("api_key", apiKey);
      uploadFormData.append("timestamp", timestamp.toString());
      uploadFormData.append("signature", signature);
      uploadFormData.append("folder", folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        {
          method: "POST",
          body: uploadFormData,
        }
      );

      if (!uploadRes.ok) {
        throw new Error("Gagal mengupload file materi ke Cloudinary.");
      }

      const uploadData = await uploadRes.json();
      const file_url = uploadData.secure_url;

      // 4. Transmit string teks mentah dan URL file PDF ke backend
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, file_url }),
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f1f1f1] px-4 py-12 relative overflow-hidden">
      {/* Background decoration to match landing page */}
      <div className="absolute inset-0 z-0 ks-grid-bg opacity-30 pointer-events-none"></div>

      <div className="w-full max-w-lg relative z-10">
        {/* Logo / Title */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ffd900] rounded-2xl mb-6 border-2 border-[#181e2a] shadow-[4px_4px_0px_#181e2a] transform -rotate-3 transition-transform hover:rotate-0">
            <span className="text-3xl">🚀</span>
          </div>
          <h1 className="text-3xl font-bold text-[#181e2a] uppercase tracking-tighter">Buat Materi Baru</h1>
          <p className="mt-2 text-sm font-medium text-gray-600 max-w-sm mx-auto">
            Unggah file PDF materi, dan AI akan merangkumnya menjadi Interactive Study Kit.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border-2 border-[#181e2a] bg-white p-6 md:p-8 shadow-[8px_8px_0px_#181e2a]">
          <h2 className="mb-6 text-xl font-bold text-[#181e2a] uppercase tracking-tight flex items-center gap-2">
            <span className="w-3 h-3 bg-[#ffd900] rounded-full inline-block border border-[#181e2a]"></span>
            Materi Baru
          </h2>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-600 border-2 border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="mb-2 block text-sm font-bold text-[#181e2a] uppercase tracking-wide">
                Judul Materi / Topik
              </label>
              <input
                type="text"
                name="title"
                required
                disabled={loading}
                placeholder="cth: Pengantar Jaringan Komputer"
                className="w-full rounded-xl border-2 border-[#181e2a] bg-[#f8f9fa] px-4 py-3.5 text-sm font-medium text-[#181e2a] outline-none focus:border-[#4e39c5] focus:bg-white transition-colors disabled:opacity-50"
              />
            </div>

            <div className="mb-8">
              <label className="mb-2 block text-sm font-bold text-[#181e2a] uppercase tracking-wide">
                Upload File Materi (PDF)
              </label>
              <div className="relative">
                <input
                  type="file"
                  name="file"
                  accept=".pdf"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border-2 border-dashed border-[#181e2a] bg-[#f8f9fa] px-4 py-8 text-sm font-medium text-[#181e2a] outline-none focus:border-[#4e39c5] focus:bg-white transition-colors disabled:opacity-50
                  file:mr-4 file:rounded-xl file:border-2 file:border-[#181e2a] file:bg-[#ffd900] file:px-4 file:py-2 file:text-xs file:font-bold file:text-[#181e2a] file:uppercase file:tracking-wide hover:file:bg-[#ffe64d] file:cursor-pointer"
                />
              </div>
              <p className="mt-2 text-xs font-medium text-gray-500">
                AI akan membaca isi PDF dan merangkumnya menjadi Interactive Study Kit.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-[#181e2a] bg-[#4e39c5] py-4 text-sm font-bold uppercase tracking-wide text-white hover:bg-[#5c47d6] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#181e2a] transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Mendalami Materi... <span className="normal-case tracking-normal">(±10-20 dtk)</span>
                </>
              ) : (
                "Proses dengan AI →"
              )}
            </button>
          </form>
        </div>

        {/* Quick Access */}
        <div className="mt-8 text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-[#181e2a] hover:text-[#4e39c5] transition-colors bg-white px-6 py-3 rounded-full border border-[#181e2a] shadow-[2px_2px_0px_#181e2a] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5">
            ← Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
