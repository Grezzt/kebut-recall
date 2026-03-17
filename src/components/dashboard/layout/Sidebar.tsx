"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderOpen, LogOut, Home, GalleryVerticalEnd, Gamepad2, BrainCircuit, Compass } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function Sidebar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="w-64 bg-dark-90 border-r-2 border-white/30 h-screen flex flex-col fixed left-0 top-0 z-20 shadow-[4px_0_0_#ffffff]">
      <div className="p-6 border-b-2 border-white/30 flex items-center gap-2">
        <h1 className="text-xl font-black tracking-tighter uppercase ml-1 text-white">Kebut<span className="text-purple">Recall</span></h1>
      </div>

      <div className="flex-1 py-6 flex flex-col gap-3 px-4 overflow-y-auto">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
            pathname === '/dashboard'
              ? 'bg-purple border-2 border-white/30 text-white shadow-[3px_3px_0px_#ffffff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#ffffff]'
              : 'border-2 border-transparent text-gray hover:text-white hover:bg-white/10'
          }`}
        >
          <FolderOpen size={18} strokeWidth={2.5} />
          <span>Dokumen Saya</span>
        </Link>
        <Link
          href="/explore"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
            pathname === '/explore'
              ? 'bg-purple border-2 border-white/30 text-white shadow-[3px_3px_0px_#ffffff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#ffffff]'
              : 'border-2 border-transparent text-gray hover:text-white hover:bg-white/10'
          }`}
        >
          <Compass size={18} strokeWidth={2.5} />
          <span>Explore</span>
        </Link>
        <Link
          href="/dashboard/global-flashcard"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
            pathname === '/dashboard/global-flashcard'
              ? 'bg-purple border-2 border-white/30 text-white shadow-[3px_3px_0px_#ffffff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#ffffff]'
              : 'border-2 border-transparent text-gray hover:text-white hover:bg-white/10'
          }`}
        >
          <GalleryVerticalEnd size={18} strokeWidth={2.5} />
          <span>Koleksi Kartu Universal</span>
        </Link>
        <Link
          href="/dashboard/global-matching"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
            pathname === '/dashboard/global-matching'
              ? 'bg-purple border-2 border-white/30 text-white shadow-[3px_3px_0px_#ffffff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#ffffff]'
              : 'border-2 border-transparent text-gray hover:text-white hover:bg-white/10'
          }`}
        >
          <Gamepad2 size={18} strokeWidth={2.5} />
          <span>Game Mencocokkan Universal</span>
        </Link>
        <Link
          href="/dashboard/global-quiz"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
            pathname === '/dashboard/global-quiz'
              ? 'bg-purple border-2 border-white/30 text-white shadow-[3px_3px_0px_#ffffff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#ffffff]'
              : 'border-2 border-transparent text-gray hover:text-white hover:bg-white/10'
          }`}
        >
          <BrainCircuit size={18} strokeWidth={2.5} />
          <span>Kuis Universal</span>
        </Link>
        <Link
          href="/"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
            pathname === '/'
              ? 'bg-purple border-2 border-white/30 text-white shadow-[3px_3px_0px_#ffffff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#ffffff]'
              : 'border-2 border-transparent text-gray hover:text-white hover:bg-white/10'
          }`}
        >
          <Home size={18} strokeWidth={2.5} />
          <span>Beranda</span>
        </Link>
      </div>

      <div className="p-4 border-t-2 border-white/30">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:border-red-500/30 border-2 border-transparent hover:border-2 transition-colors font-bold text-sm"
        >
          <LogOut size={18} strokeWidth={2.5} />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
}
