"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Play, Sparkles } from "lucide-react";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".hero-text", {
      y: 100,
      opacity: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: "power4.out",
    });
    gsap.from(".hero-image", {
      x: 100,
      opacity: 0,
      duration: 1.5,
      delay: 0.5,
      ease: "power4.out",
    });
  }, { scope: heroRef });

  return (
    <section
      ref={heroRef}
      className="ks-grid-bg relative min-[90vh] lg:min-h-screen flex flex-col justify-center items-center overflow-hidden pt-32 pb-0 lg:py-0"
      style={{
        backgroundColor: "var(--dark)",
      }}
    >
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full h-full mx-auto gap-0 lg:gap-0 pl-6 pr-6 lg:pl-16 lg:pr-0 xl:pl-28">

        {/* Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center text-left py-10 lg:my-auto">
          <h1 className="hero-text text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.1] mb-6 tracking-tight z-10 relative">
            Belajar Jadi Menyenangkan <br />
            <span className="text-yellow italic font-handwriting mt-4 mb-2 inline-block -rotate-[3deg]">
              Kebut Recall
            </span>
          </h1>

          <p className="hero-text text-lg md:text-xl text-white/80 mb-10 max-w-xl leading-relaxed font-medium z-10 relative">
            Ubah Materi Membosankan menjadi Menyenangkan. <br />Semua ada di sini! <br />
          </p>

          <div className="hero-text flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto z-10 relative">
            <Link
              href="/create"
              className="w-full sm:w-auto bg-yellow text-[var(--dark)] px-8 py-4 rounded-xl font-bold text-lg border-2 border-[var(--dark)] shadow-[4px_4px_0px_0px_#ffffff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#ffffff] transition-all flex items-center justify-center gap-2"
            >
              Mulai Belajar
              <Play size={20} fill="currentColor" />
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white border-2 border-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles size={20} />
              Dashboard
            </Link>
          </div>
        </div>

        {/* Image Content */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end items-end hero-image lg:absolute lg:bottom-0 lg:right-0 lg:h-[100vh]">
          {/* Menggunakan h penuh terhadap container parent dan membiarkan object-right-bottom menyesuaikan posisinya */}
          <div className="relative w-full h-[50vh] lg:h-full lg:w-[50vw]">
            <Image
              src="/hero.png"
              alt="Kebut Semalam Hero Illustration"
              fill
              className="object-contain object-bottom lg:object-right-bottom drop-shadow-2xl lg:pr-8"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}