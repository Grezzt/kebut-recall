"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FloatingCreateButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!buttonRef.current) return;

    // Initial animation
    gsap.fromTo(
      buttonRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)", delay: 0.5 }
    );
  }, []);

  const handleMouseEnter = () => {
    // Relying on pure CSS for brutalist hover
  };

  const handleMouseLeave = () => {
    // Relying on pure CSS for brutalist hover
  };

  return (
    <button
      ref={buttonRef}
      onClick={() => router.push("/create")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="fixed bottom-8 right-8 z-30 flex items-center gap-3 bg-yellow text-dark py-4 px-6 rounded-full font-bold uppercase tracking-wider border-[3px] border-dark hover:border-white shadow-[4px_4px_0px_0px_#ffffff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#ffffff] transition-all shrink-0"
      title="Buat Materi Baru"
    >
      <Plus className="w-5 h-5 shrink-0" strokeWidth={3} />
      <span>Buat Materi</span>
    </button>
  );
}
