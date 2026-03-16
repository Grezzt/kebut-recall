// @/components/landing/circular-cta.tsx
"use client";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CircularCTASection = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGSVGElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. Scroll-Driven Spin
      gsap.to(ringRef.current, {
        rotation: 360,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // 2. Center Element Pop
      gsap.from(contentRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: "elastic.out(1, 0.75)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "center 80%",
        },
      });
    },
    { scope: containerRef }
  );

  // Text to repeat
  const text = " • BELAJAR MINIMAL HASIL MAKSIMAL • KEBUT SEMALAM • SIAP UJIAN BESOK";
  // Repeat it enough times to fill a large circle
  const repeatedText = Array(4).fill(text).join("");

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center py-32 border-t-[1.5px] border-[var(--dark)]"
      style={{ backgroundColor: "var(--purple)" }}
    >
      {/* The Ring (Background Layer) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 select-none">
        <svg
          ref={ringRef}
          className="w-[150vmax] h-[150vmax]"
          style={{ color: "var(--yellow)" }}
          viewBox="0 0 1000 1000"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <path
              id="textCircle"
              d="M 500, 500 m -400, 0 a 400,400 0 1,1 800,0 a 400,400 0 1,1 -800,0"
            />
          </defs>
          <text width="500">
            <textPath
              xlinkHref="#textCircle"
              className="text-[42px] font-black uppercase fill-current tracking-[0.2em]"
              startOffset="0%"
              lengthAdjust="spacingAndGlyphs"
            >
              {repeatedText}
            </textPath>
          </text>
        </svg>
      </div>

      {/* The Core (Foreground Layer) */}
      <div ref={contentRef} className="relative z-10 text-center px-4 max-w-4xl">
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight drop-shadow-lg font-sans">
          Siap Hadapi <br />
          <span style={{ color: "var(--yellow)" }}>Ujian Besok?</span>
        </h2>
        <p className="text-xl md:text-2xl text-white/90 mb-10 font-medium max-w-2xl mx-auto">
          Sekarang Giliranmu! Mulai belajar pintar pakai AI.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="group px-8 md:px-12 py-5 rounded-full font-black text-xl md:text-2xl hover:scale-105 transition-transform flex items-center gap-4 mx-auto border-[3px]"
          style={{
            backgroundColor: "var(--yellow)",
            color: "var(--dark)",
            borderColor: "var(--dark)",
            boxShadow: "8px 8px 0px 0px var(--dark)"
          }}
        >
          <span>MULAI BELAJAR SEKARANG</span>
        </button>
      </div>
    </section>
  );
};

export default CircularCTASection;