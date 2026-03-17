import Link from "next/link";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { createClient } from "@/utils/supabase/server";
import Header from "@/components/dashboard/layout/Header";
import DocumentList from "@/components/dashboard/DocumentList";
import Sidebar from "@/components/dashboard/layout/Sidebar";
import SearchAndFilter from "@/components/dashboard/SearchAndFilter";
import Pagination from "@/components/dashboard/Pagination";
import { Home } from "lucide-react";

export const revalidate = 0; // Disable cache so list is always fresh

const ITEMS_PER_PAGE = 25;

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ q?: string, date?: string, page?: string }> }) {
  const supabaseServer = await createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();

  const awaitedSearchParams = await searchParams;
  const q = awaitedSearchParams?.q || "";
  const dateStr = awaitedSearchParams?.date || "";
  const pageStr = awaitedSearchParams?.page || "1";

  const page = parseInt(pageStr) > 0 ? parseInt(pageStr) : 1;
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let query = supabase
    .from("study_documents")
    .select("id, title, status, flashcards, quiz, mindmap, created_at, file_url", { count: "exact" })
    .neq("status", "deleted")
    .eq("status", "completed");

  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  if (dateStr) {
    const startOfDay = new Date(dateStr);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateStr);
    endOfDay.setHours(23, 59, 59, 999);

    query = query.gte("created_at", startOfDay.toISOString());
    query = query.lte("created_at", endOfDay.toISOString());
  }

  const { data: documents, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;

  if (error) {
    console.error("Explore error:", error);
  }

  return (
    <div className="flex h-screen bg-dark overflow-hidden ks-grid-bg relative">
      {user ? (
        <Sidebar />
      ) : (
        <div className="w-20 bg-dark-90 border-r-2 border-white/30 h-screen flex flex-col fixed left-0 top-0 z-20 shadow-[4px_0_0_#ffffff] items-center py-6">
          <Link
            href="/"
            className="w-12 h-12 rounded-xl bg-purple border-2 border-white/30 flex items-center justify-center text-white hover:bg-purple/80 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none shadow-[2px_2px_0px_#ffffff] transition-all"
            title="Kembali ke Beranda"
          >
            <Home className="w-6 h-6" strokeWidth={2.5} />
          </Link>
        </div>
      )}

      <main className={`flex-1 ${user ? 'ml-64' : 'ml-20'} flex flex-col h-screen relative bg-transparent`}>
        <Header
          title="Jelajah Materi"
          subtitle="Jelajahi dan pelajari materi publik dari semua pengguna."
        />

        <div className="flex-1 overflow-y-auto p-8 relative z-0">
          <div className="max-w-7xl mx-auto w-full pb-20">
            <SearchAndFilter />
            <DocumentList documents={documents} error={error} isExplore={true} />
            <Pagination totalPages={totalPages} currentPage={page} />
          </div>
        </div>
      </main>
    </div>
  );
}
