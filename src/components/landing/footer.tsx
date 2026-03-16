import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative text-white border-t"
      style={{
        backgroundColor: "var(--dark)",
        borderColor: "rgba(255,255,255,0.1)",
        paddingTop: "80px",
        paddingBottom: "40px",
      }}
    >
      <div className="mx-auto px-5 lg:px-14" style={{ maxWidth: 1400 }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <span className="text-2xl font-bold tracking-tight text-white">Kebut</span>
              <span
                className="flex items-center justify-center px-1.5 py-0.5 text-xs font-black tracking-widest uppercase"
                style={{
                  backgroundColor: "var(--purple)",
                  color: "var(--dark)",
                }}
              >
                Recall
              </span>
            </Link>
            <p
              className="text-[15px] leading-relaxed pr-8"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Ubah cara belajarmu. Unggah materi, dan biarkan AI kami
              menyiapkan segalanya dari Quiz, Flashcard, hingga Mind-Map.
              Belajar cepat, hasil maksimal.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4
              className="text-sm font-bold uppercase tracking-wider mb-6"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Fitur
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/create" className="text-[15px] hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.7)" }}>
                  AI Quiz
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-[15px] hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Flashcard
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-[15px] hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Mind-Map
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <div
              className="p-8"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h4 className="text-lg font-bold mb-3">Siap mulai belajar?</h4>
              <p
                className="text-[14px] mb-6"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Langsung coba fitur AI kami sekarang. Gratis untuk mencoba.
              </p>
              <Link href="/create" className="btn-ks-accent w-full justify-center">
                Coba Sekarang
              </Link>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col md:flex-row items-center justify-between pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <p
            className="text-[13px] mb-4 md:mb-0"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            © {currentYear} Kebut Recall.
          </p>
        </div>
      </div>
    </footer>
  );
}