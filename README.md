# Dokumentasi Proyek Aplikasi Web

## Profil Aplikasi

Nama Website : Kebut-Recall (Aplikasi Pembelajaran Interaktif Menggunakan Metode Belajar Active Recall Otomatis Menggunakan AI)
Nama Tim: CH Lele Mentah Bergizii
Dengan Backend : Tidak
Service Database: Supabase
Service Storage Bucket: Cloudinarry
Daftar Fitur Utama:

1. Interactive Flashcards & Matching Game: Sistem recall aktif menggunakan presentasi kartu digital dan permainan mencocokkan.
2. Try-Out Simulator (Gamified Quiz): Modul evaluasi komprehensif berbasis pilihan ganda dengan pengatur waktu tempuh, kalkulasi skor otomatis, dan referensi presisi.
3. Mind-Map Automation: Generasi diagram visual interaktif secara otomatis dari teks atau dokumen masukan.
4. Pengalaman Belajar Tergamifikasi: Mengintegrasikan elemen permainan interaktif dalam proses belajar untuk menciptakan suasana yang atraktif, dinamis, dan mencegah kebosanan pengguna.

---

## Arsitektur Sistem dan Teknologi

Sistem dirancang dengan arsitektur Berikut.

- Front-End: Next.js, React, Tailwind CSS
- Database Service : Supabase (PostgreSQL, Storage, Authentication)
- Storage Service: Cloudinary
- Kecerdasan Buatan (AI Engine): LLM API terintegrasi
- Antarmuka Visual & Interaksi: Framer Motion, React Flow

## Struktur Direktori Utama

- /src/app: Inti aplikasi yang menjalankan sistem perutean aplikasi.
- /src/components: Komponen modular antarmuka pengguna (Flashcard, Quiz, MatchingGame, Mindmap).
- /src/api: Titik akhir serverless untuk memproses integrasi backend dan komputasi layanan kognitif.
- /supabase: Definisi skema basis data dan berkas migrasi.

## Petunjuk Instalasi Server (Local Deployment)

1. Salin repositori ke dalam ekosistem pengembangan lokal.
2. Lakukan instalasi dependensi menggunakan manajer paket (npm/yarn/pnpm) melalui perintah instalasi standar.
3. Konfigurasikan variabel lingkungan sistem (.env) dan lengkapi konfigurasi peladen basis data serta kredensial API. (Lihat bagian Konfigurasi Variabel Lingkungan di bawah).
4. Inisiasi server pengembangan untuk validasi fungsional aplikasi.

## Konfigurasi Variabel Lingkungan (.env)

Buat file `.env.local` di direktori root aplikasi (sejajar dengan `package.json`) dan sesuaikan nilainya dengan kredensial layanan yang telah Anda konfigurasikan:

```env
# Konfigurasi Supabase (Database & Authentication)
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[SUPABASE_ANON_KEY]

# Konfigurasi Cloudinary (Storage Service)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=[NAMA_CLOUD_CLOUDINARY]
CLOUDINARY_API_KEY=[KUNCI_API_CLOUDINARY]
CLOUDINARY_API_SECRET=[KUNCI_RAHASIA_CLOUDINARY]

# Konfigurasi AI Engine (Generative AI)
GEMINI_API_KEY=[KUNCI_API_GEMINI]
```
