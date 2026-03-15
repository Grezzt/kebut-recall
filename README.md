# 🚀 Smart-SKS (Sistem Kebut Semalam)

## 📌 Ide Aplikasi
**Smart-SKS** adalah sebuah platform edukasi Generative AI yang berfungsi sebagai Pabrik Pembuat Aplikasi Belajar Mini (*Interactive Study-Kit*).
Sistem ini memecahkan masalah mahasiswa yang harus membaca ratusan halaman dokumen statis (PDF/PPT) sebelum ujian (budaya SKS).

Berbeda dengan sekadar chatbot biasa, Smart-SKS TIDAK menghasilkan paragraf panjang. Aplikasi ini mengekstrak materi menjadi terstruktur menggunakan Gemini AI dan merendernya secara real-time menjadi UI interaktif.

## ✨ Fitur Utama (Gamifikasi UX)
1. **Interactive Flashcards & Matching Game**: Kartu bolak-balik digital untuk *active recall*.
2. **Try-Out Simulator (Gamified Quiz)**: Kuis Pilihan Ganda interaktif dengan timer, skor otomatis, dan referensi jawaban.
3. **Mind-Map Otomatis**: Diagram visual interaktif.

## 🛠️ Arsitektur & Tech Stack
- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Storage, Auth)
- **AI Engine**: Google Gemini API + LangChain
- **UI/Animasi**: Framer Motion, React Flow

---

## 🗺️ Roadmap & Todo List (Pengerjaan)

### Phase 1: Inisialisasi & Persiapan (✅ DONE)
- [x] Setup proyek dengan Next.js
- [x] Instal dependensi (Supabase, Tailwind, Framer Motion)
- [x] Schema Database JSONB di Supabase
- [x] Types/Interfaces di Next.js

### Phase 2: Gamifikasi UI / Front-End Build (🚧 CURRENT)
- [ ] Membuat kerangka Dashboard
- [ ] Komponen **Interactive Flashcard** (Animasi Flip by Framer Motion)
- [ ] Komponen **Quiz Evaluator** (Sistem Skor, Timer, Validasi Jawaban)
- [ ] Integrasi Dummy Data JSON ke Game

### Phase 3: AI Engine & Backend Integration (⏳ TODO)
- [ ] Upload Dokumen PDF ke Supabase
- [ ] Ekstraksi PDF Teks (LangChain chunking)
- [ ] Prompt ke Gemini API untuk ekstrak JSON strict
- [ ] Sinkronisasi status ke Supabase

### Phase 4: Finalisasi (⏳ TODO)
- [ ] Implementasi Supabase Auth
- [ ] Deployment ke Vercel
