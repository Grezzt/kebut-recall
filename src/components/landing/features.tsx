"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { BrainCircuit, BookType, Network } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: BrainCircuit,
    title: "AI Quiz Generator",
    desc: "Uji pemahamanmu seketika. AI kami akan membuatkan soal-soal relevan dari materi yang kamu unggah.",
    href: "/create",
  },
  {
    icon: BookType,
    title: "Flashcard Pintar",
    desc: "Hafalkan istilah dan konsep penting dengan mudah menggunakan sistem flashcard otomatis yang interaktif.",
    href: "/create",
  },
  {
    icon: Network,
    title: "Mind-Map Visual",
    desc: "Pahami gambaran besar materi. Kami mengubah teks monoton menjadi kerangka visual (mind map) yang rapi.",
    href: "/create",
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".feat-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="fitur"
      ref={sectionRef}
      className="ks-has-texture relative border-t"
      style={{
        borderColor: "rgba(24,30,42,0.1)",
        paddingTop: "120px",
        paddingBottom: "120px",
      }}
    >
      <div className="mx-auto px-5 lg:px-14" style={{ maxWidth: 1400 }}>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <span className="ks-callout-text block mb-4">Fitur Andalan</span>
            <h2
              className="font-bold leading-tight"
              style={{
                fontSize: "clamp(32px, 4vw, 56px)",
                letterSpacing: "-0.02em",
                color: "var(--dark)",
              }}
            >
              Semua yang kamu butuhkan untuk <span style={{ color: "var(--purple)" }}>Kebut</span> yang efektif.
            </h2>
          </div>
          <div>
            <Link href="/create" className="btn-ks-accent">
              Mulai Eksplorasi
            </Link>
          </div>
        </div>

        {/* Cards */}
        <div
          className="feat-cards grid grid-cols-1 md:grid-cols-3"
          style={{ border: "1.5px solid var(--dark)", borderRight: "none" }}
        >
          {features.map((item, i) => (
            <div key={i} className="ks-hover-card-wrapper feat-card">
              <div className="ks-hover-card-shadow" />
              <div className="ks-hover-card">
                <div>
                  <div
                    className="ks-hover-card-icon inline-flex items-center justify-center mb-10 transition-colors"
                    style={{
                      width: 56,
                      height: 56,
                      backgroundColor: "rgba(24,30,42,0.05)",
                      color: "var(--dark)",
                      borderRadius: "0",
                    }}
                  >
                    <item.icon size={28} strokeWidth={1.5} />
                  </div>
                  <h3
                    className="ks-hover-card-heading text-2xl font-bold mb-4 transition-colors"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="ks-hover-card-text text-base leading-relaxed transition-colors"
                    style={{ color: "rgba(24,30,42,0.7)" }}
                  >
                    {item.desc}
                  </p>
                </div>

                <div className="pt-10">
                  <Link
                    href={item.href}
                    className="ks-hover-card-btn inline-flex items-center text-sm font-bold uppercase tracking-wider pb-1 transition-all"
                    style={{
                      borderBottom: "2px solid var(--dark)",
                      color: "var(--dark)",
                    }}
                  >
                    Coba Fitur
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}