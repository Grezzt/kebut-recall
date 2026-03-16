"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = containerRef.current;
    const container = gridRef.current;
    if (!hero || !container) return;

    const CELL = 60;

    const buildGrid = () => {
      container.innerHTML = "";
      const rect = hero.getBoundingClientRect();
      const cols = Math.ceil(rect.width / CELL);
      const rows = Math.ceil(rect.height / CELL);
      container.style.gridTemplateColumns = `repeat(${cols}, ${CELL}px)`;
      container.style.gridTemplateRows = `repeat(${rows}, ${CELL}px)`;

      const frag = document.createDocumentFragment();
      for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement("div");
        cell.className = "ks-grid-cell";
        frag.appendChild(cell);
      }
      container.appendChild(frag);
    };

    buildGrid();
    const ro = new ResizeObserver(buildGrid);
    ro.observe(hero);

    const onMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const cols = Math.ceil(rect.width / CELL);
      const row = Math.floor(mouseY / CELL);
      const col = Math.floor(mouseX / CELL);
      const index = row * cols + col;
      const cells = container.querySelectorAll<HTMLDivElement>(".ks-grid-cell");
      if (index < 0 || index >= cells.length) return;
      const cell = cells[index] as HTMLDivElement & { fadeTimeout?: ReturnType<typeof setTimeout> };
      clearTimeout(cell.fadeTimeout);
      cell.style.backgroundColor = "rgba(255,217,0,0.15)";
      cell.fadeTimeout = setTimeout(() => {
        cell.style.backgroundColor = "transparent";
      }, 300);
    };

    hero.addEventListener("mousemove", onMouseMove);
    return () => {
      ro.disconnect();
      hero.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(
        ".hero-heading",
        { y: "110%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.1 }
      )
        .fromTo(
          ".hero-sub",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.5"
        )
        .fromTo(
          ".hero-btn",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.4"
        )
        .fromTo(
          ".hero-visual",
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 1.0 },
          "<"
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: "var(--dark)",
        paddingTop: 60,
        minHeight: "88vh",
      }}
    >
      <div
        ref={gridRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{ display: "grid" }}
      />

      <div
        className="relative z-10 mx-auto px-5 lg:px-14 py-14 flex flex-col lg:flex-row items-stretch gap-0"
        style={{ maxWidth: 1400 }}
      >
        <div
          className="hero-text-box flex-1 flex flex-col justify-between"
          style={{
            border: "1px solid rgba(255,217,0,0.3)",
            padding: "40px 36px",
            minHeight: 480,
            backgroundColor: "var(--dark)",
          }}
        >
          <div className="overflow-hidden mb-8">
            <h1
              className="hero-heading font-bold leading-tight"
              style={{
                fontSize: "clamp(36px, 5.5vw, 72px)",
                letterSpacing: "-0.02em",
                color: "var(--white)",
                lineHeight: 1.08,
              }}
            >
              Belajar lebih cerdas, <br/>
              bukan lebih keras dengan{" "}
              <span style={{ color: "var(--yellow)" }}>Generative AI</span>.
            </h1>
          </div>

          <div className="flex flex-col gap-6">
            <p
              className="hero-sub"
              style={{
                fontSize: "clamp(16px, 1.6vw, 19px)",
                color: "var(--gray)",
                opacity: 0.85,
                lineHeight: 1.6,
                maxWidth: 500,
              }}
            >
              Ubah materi kuliah, slide, atau catatanmu menjadi Flashcard, Quiz interaktif, dan Mind-Map visual dalam hitungan detik.
            </p>

            <div className="hero-btn flex gap-3 flex-wrap">
              <Link href="/create" className="btn-ks-white whitespace-nowrap">
                Mulai Belajar
              </Link>
              <Link href="#fitur" className="btn-ks-outline whitespace-nowrap">
                Pelajari Fitur
              </Link>
            </div>
          </div>
        </div>

        <div
          className="hero-visual relative overflow-hidden bg-white/5 border border-white/10 flex-1 flex items-center justify-center p-8"
          style={{
            minHeight: 520,
          }}
        >
          {/* Placeholder untuk visual */}
          <div className="text-center">
            <BookOpen className="w-32 h-32 text-yellow mb-6 mx-auto opacity-80" />
            <div className="text-xl text-yellow font-bold opacity-80 uppercase tracking-widest">
              Smart-SKS
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative z-10"
        style={{
          borderTop: "1px solid rgba(255,217,0,0.2)",
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      >
        <div
          className="mx-auto px-5 lg:px-14 py-4 flex flex-wrap items-center gap-8 lg:gap-16"
          style={{ maxWidth: 1300 }}
        >
          {[
            { value: "AI Powered", label: "Generative AI" },
            { value: "Seketika", label: "Quiz & Flashcard" },
            { value: "Visual", label: "Mind-Mapping Otomatis" },
            { value: "Kapan Saja", label: "Akses 24/7" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <span
                style={{
                  color: "var(--yellow)",
                  fontWeight: 800,
                  fontSize: 15,
                  letterSpacing: "-0.01em",
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.65)",
                  fontSize: 13,
                  lineHeight: 1.3,
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}