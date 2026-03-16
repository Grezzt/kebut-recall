"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

export default function Navbar() {
  return (
    <div className="absolute top-4 sm:top-8 inset-x-0 mx-auto z-50 flex justify-center w-full px-4 sm:px-6 pointer-events-none">
      <div className="bg-white rounded-[2rem] flex items-center justify-between pl-4 pr-2 py-2 shadow-lg w-full max-w-[840px] pointer-events-auto h-[60px] sm:h-[72px]">
        {/* Left Box */}
        <div className="flex items-center gap-3 sm:gap-5">
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center">
            <Menu strokeWidth={1.5} className="w-7 h-7 text-black" />
          </button>
          <Link href="/" className="flex items-center gap-4">
            <span className="text-xl sm:text-[22px] font-bold tracking-tight text-gray-900 flex items-center border-r-[1.5px] border-gray-300/80 pr-4 h-[32px]">
              Kebut<span className="text-purple ml-[2px]">Recall</span>
            </span>
            <span className="text-[13px] font-medium text-gray-900 hidden md:block tracking-wide">
              ai learning platform
            </span>
          </Link>
        </div>

        {/* Middle Nav Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 mr-2">
          <Link href="#fitur" className="text-[11px] font-bold text-gray-900 hover:text-gray-500 transition-colors uppercase tracking-[0.08em]">
            Fitur
          </Link>
          <Link href="#cara-kerja" className="text-[11px] font-bold text-gray-900 hover:text-gray-500 transition-colors uppercase tracking-[0.08em]">
            Cara Kerja
          </Link>
        </div>

        {/* Right Box (Button) */}
        <div>
          <Link href="/dashboard" className="bg-[#FFD900] text-black font-bold uppercase tracking-[0.08em] text-[11px] sm:text-[12px] px-7 py-[14px] rounded-full hover:bg-[#ffe64d] transition-all inline-block truncate">
            Mulai Belajar
          </Link>
        </div>
      </div>
    </div>
  );
}