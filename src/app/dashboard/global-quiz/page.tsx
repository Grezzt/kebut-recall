import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import GlobalQuizClient from "@/components/dashboard/GlobalQuizClient";
import Sidebar from "@/components/dashboard/layout/Sidebar";
import Header from "@/components/dashboard/layout/Header";
import FloatingCreateButton from "@/components/dashboard/FloatingCreateButton";
import type { QuizQuestion } from "@/types";

export const revalidate = 0; // Disable cache so list is always fresh

// Fisher-Yates shuffle
const shuffleArray = (array: QuizQuestion[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default async function GlobalQuizPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("study_documents")
    .select("title, quiz")
    .eq("user_id", user.id)
    .neq("status", "deleted");

  if (error) {
    console.error("Failed to load documents:", error);
  }

  let questions: QuizQuestion[] = [];
  if (data) {
    const allQuestions = data.flatMap((doc) => {
      const qs: QuizQuestion[] | null = doc.quiz;
      if (!qs || !Array.isArray(qs)) return [];
      return qs.map((q) => ({
        ...q,
        source_topic: `${q.source_topic} (dari ${doc.title})`,
      }));
    });
    questions = shuffleArray(allQuestions);
  }

  return (
    <div className="flex h-screen bg-dark overflow-hidden ks-grid-bg relative">
      <Sidebar />

      <main className="flex-1 ml-64 flex flex-col h-screen relative bg-transparent">
        <Header
          title="Quiz Universal"
          subtitle="Tantang pemahaman Anda dari koleksi semua pertanyaan kuis."
        />

        <div className="flex-1 overflow-y-auto p-8 relative z-0">
          <div className="max-w-[1400px] mx-auto w-full pb-20 mt-4">
            {questions.length > 0 ? (
              <GlobalQuizClient questions={questions} />
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border-[3px] border-dashed border-white/30 bg-dark-90 py-20 px-6 text-center shadow-[8px_8px_0px_#ffffff]">
                <span className="text-6xl mb-6">📝</span>
                <p className="text-xl font-black text-white uppercase tracking-tight mb-2">
                  Belum ada soal kuis.
                </p>
                <p className="font-bold text-gray max-w-md mx-auto">
                  Unggah dokumen dan tunggu AI selesai membuat kuis untuk Anda sebelum bermain.
                </p>
              </div>
            )}
          </div>
        </div>

        <FloatingCreateButton />
      </main>
    </div>
  );
}
