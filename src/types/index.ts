// src/types/index.ts

export interface Flashcard {
  term: string;
  definition: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string; // Harus sama persis dengan salah satu isi array options
  explanation: string;
  source_topic: string;
  page_number?: number;
}

export interface MindmapNode {
  id: string;
  label: string;
  parent_id: string; // Kosong ("") jika root
  page_number?: number;
}

export interface StudyDocumentData {
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  mindmap: MindmapNode[];
}

export interface StudyDocument {
  id: string;
  user_id: string;
  title: string;
  file_url: string | null;
  flashcards?: Flashcard[];
  mindmap?: MindmapNode[];
  quiz?: QuizQuestion[];
  status: 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}
