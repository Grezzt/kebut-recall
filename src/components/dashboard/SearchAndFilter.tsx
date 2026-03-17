"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, Calendar } from "lucide-react";

export default function SearchAndFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [term, setTerm] = useState(searchParams.get("q") || "");
  const [date, setDate] = useState(searchParams.get("date") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (term) params.set("q", term);
    else params.delete("q");

    if (date) params.set("date", date);
    else params.delete("date");

    params.set("page", "1"); // always reset to 1 on new search

    router.push(pathname + "?" + params.toString());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray/50" />
        </div>
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Cari judul materi..."
          className="block w-full pl-12 pr-4 py-3 border-2 border-white/30 rounded-xl bg-dark-90 text-white placeholder-gray/50 focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow shadow-[4px_4px_0px_#ffffff] transition-all"
        />
      </div>
      <div className="relative min-w-[200px]">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Calendar className="h-5 w-5 text-gray/50" />
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="block w-full pl-12 pr-4 py-3 border-2 border-white/30 rounded-xl bg-dark-90 text-white placeholder-gray/50 focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow shadow-[4px_4px_0px_#ffffff] transition-all [color-scheme:dark]"
        />
      </div>
      <button
        type="submit"
        className="px-6 py-3 bg-yellow text-dark font-bold rounded-xl border-2 border-dark shadow-[4px_4px_0px_#ffffff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#ffffff] transition-all"
      >
        Terapkan
      </button>
    </form>
  );
}