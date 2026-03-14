-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabel untuk menyimpan Profil Pengguna yang terhubung dengan Supabase Auth
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  university TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel untuk menyimpan Dokumen Materi Kuliah / Data Extraction JSON
CREATE TABLE public.study_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  file_url TEXT, -- Path ke Supabase Storage (bisa null jika hanya memasukkan teks)

  -- Menyimpan data yang sudah diekstrak oleh Gemini API menjadi JSON
  flashcards JSONB, -- Array of { term: string, definition: string }
  mindmap JSONB,    -- Array of { id: string, label: string, parent_id: string }
  quiz JSONB,       -- Array of { question: string, options: string[], correct_answer: string, explanation: string, source_topic: string }

  status TEXT DEFAULT 'processing', -- 'processing', 'completed', 'failed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Turn on Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_documents ENABLE ROW LEVEL SECURITY;

-- Setup RLS Policies
-- Users can read and update their own profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Users can read, insert, update, and delete their own study documents
CREATE POLICY "Users can view own study_documents" ON public.study_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own study_documents" ON public.study_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own study_documents" ON public.study_documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own study_documents" ON public.study_documents FOR DELETE USING (auth.uid() = user_id);

-- 3. Storage Bucket Configuration
-- Create bucket for storing PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('course_materials', 'course_materials', false) ON CONFLICT DO NOTHING;

-- Policies for Storage (Authenticated users can upload and read their files)
CREATE POLICY "Users can read own folder" ON storage.objects FOR SELECT USING (bucket_id = 'course_materials' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can upload to own folder" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'course_materials' AND auth.uid()::text = (storage.foldername(name))[1]);
