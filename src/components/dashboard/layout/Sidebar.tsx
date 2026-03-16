import Link from "next/link";
import { FolderOpen, LogOut, Home } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default function Sidebar() {
  const signOut = async () => {
    "use server"
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
  };

  return (
    <div className="w-64 bg-white border-r-2 border-dark h-screen flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6 border-b-2 border-dark flex items-center gap-2">
        <div className="w-8 h-8 bg-yellow border-2 border-dark rounded-md flex items-center justify-center shadow-[2px_2px_0px_#181e2a]">
            <span className="text-dark font-black text-lg">K</span>
        </div>
        <h1 className="text-xl font-black tracking-tighter uppercase ml-1">Kebut<span className="text-purple ml-0.5">Recall</span></h1>
      </div>

      <div className="flex-1 py-6 flex flex-col gap-3 px-4 overflow-y-auto">
        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-light-blue border-2 border-dark rounded-xl text-dark font-bold text-sm shadow-[3px_3px_0px_#181e2a] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#181e2a] transition-all">
          <FolderOpen size={18} strokeWidth={2.5} />
          <span>Dokumen Saya</span>
        </Link>
        <Link href="/" className="flex items-center gap-3 px-4 py-3 border-2 border-transparent text-gray-500 hover:text-dark hover:bg-gray-50 rounded-xl transition-all font-bold text-sm">
          <Home size={18} strokeWidth={2.5} />
          <span>Beranda</span>
        </Link>
      </div>

      <div className="p-4 border-t-2 border-dark">
         <form action={signOut}>
            <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:border-red-200 border-2 border-transparent hover:border-2 transition-colors font-bold text-sm">
              <LogOut size={18} strokeWidth={2.5} />
              <span>Keluar</span>
            </button>
          </form>
      </div>
    </div>
  );
}
