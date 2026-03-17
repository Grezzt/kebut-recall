import Link from "next/link";
import { redirect } from 'next/navigation';
import { createClient } from "@/utils/supabase/server";
import Sidebar from "@/components/dashboard/layout/Sidebar";
import Header from "@/components/dashboard/layout/Header";
import FloatingCreateButton from "@/components/dashboard/FloatingCreateButton";
import DocumentList from "@/components/dashboard/DocumentList";
import SearchAndFilter from "@/components/dashboard/SearchAndFilter";

export const revalidate = 0; // Disable cache so list is always fresh

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ q?: string, date?: string }> }) {
  const supabaseServer = await createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const awaitedSearchParams = await searchParams;
  const q = awaitedSearchParams?.q || "";
  const dateStr = awaitedSearchParams?.date || "";

  let query = supabaseServer
    .from("study_documents")
    .select("id, title, status, flashcards, quiz, mindmap, created_at, file_url")
    .eq("user_id", user.id)
    .neq("status", "deleted");

  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  if (dateStr) {
    // Supabase date filtering: we want documents created on that exact day
    const startOfDay = new Date(dateStr);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateStr);
    endOfDay.setHours(23, 59, 59, 999);

    query = query.gte("created_at", startOfDay.toISOString());
    query = query.lte("created_at", endOfDay.toISOString());
  }

  const { data: documents, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Dashboard error:", error);
  }

  return (
    <div className="flex h-screen bg-dark overflow-hidden ks-grid-bg relative">
      <Sidebar />

      <main className="flex-1 ml-64 flex flex-col h-screen relative bg-transparent">
        <Header
          title="Dokumen Saya"
          subtitle="Pilih dokumen yang diproses AI untuk mulai belajar."
        />

        <div className="flex-1 overflow-y-auto p-8 relative z-0">
          <div className="max-w-7xl mx-auto w-full pb-20">
            <SearchAndFilter />
            <DocumentList documents={documents} error={error} />
          </div>
        </div>

        <FloatingCreateButton />
      </main>
    </div>
  );
}
