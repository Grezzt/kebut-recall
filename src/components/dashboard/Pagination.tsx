"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-12 mb-8">
      <button
        onClick={() => router.push(createPageUrl(currentPage - 1))}
        disabled={currentPage <= 1}
        className="p-3 bg-dark-90 text-white rounded-xl border-2 border-white/30 hover:border-yellow disabled:opacity-50 disabled:hover:border-white/30 transition-all shadow-[2px_2px_0px_#ffffff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-none"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <span className="text-white font-bold bg-dark-90 px-6 py-2.5 rounded-xl border-2 border-white/30 shadow-[4px_4px_0px_#ffffff]">
        Halaman {currentPage} dari {totalPages}
      </span>

      <button
        onClick={() => router.push(createPageUrl(currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="p-3 bg-dark-90 text-white rounded-xl border-2 border-white/30 hover:border-yellow disabled:opacity-50 disabled:hover:border-white/30 transition-all shadow-[2px_2px_0px_#ffffff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-none"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}