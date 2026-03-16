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
    color: "#ffffff", // white
    rotation: -2,
  },
  {
    icon: BookType,
    title: "Flashcard Pintar",
    desc: "Hafalkan istilah dan konsep penting dengan mudah menggunakan sistem flashcard otomatis yang interaktif.",
    href: "/create",
    color: "#ffd900", // yellow
    rotation: 2,
  },
  {
    icon: Network,
    title: "Mind-Map Visual",
    desc: "Pahami gambaran besar materi. Kami mengubah teks monoton menjadi kerangka visual (mind map) yang rapi.",
    href: "/create",
    color: "#c5d8f1", // light blue
    rotation: -1,
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".feat-hero-text", {
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
      className="relative border-t"
      style={{
        backgroundColor: "var(--light-blue)",
        borderColor: "rgba(24,30,42,0.1)",
        paddingTop: "120px",
        paddingBottom: "120px",
      }}
    >
      <div className="mx-auto px-5 lg:px-14" style={{ maxWidth: 1400 }}>
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">

          {/* Left Content (Sticky) */}
          <div className="lg:w-1/2">
            <div className="lg:sticky lg:top-[15vh]">
              <span className="ks-callout-text block mb-4 feat-hero-text">Fitur Andalan</span>
              <h2
                className="font-bold leading-tight mb-8 feat-hero-text"
                style={{
                  fontSize: "clamp(48px, 5vw, 72px)",
                  letterSpacing: "-0.03em",
                  color: "var(--dark)",
                }}
              >
                Semua yang kamu butuhkan untuk <span style={{ color: "var(--purple)" }}>Kebut</span> yang efektif.
              </h2>
              <p
                className="text-lg md:text-xl font-bold mb-10 max-w-lg feat-hero-text"
                style={{ color: "var(--dark)", opacity: 0.8, lineHeight: 1.6 }}
              >
                Fitur kami bukan cuma sekadar pemanis. Semuanya dirancang khusus agar kamu bisa langsung paham materi tanpa harus membuang banyak waktu.
              </p>
              <div className="feat-hero-text">
                <Link href="/create" className="btn-ks-accent text-lg px-8 py-4 border-2 border-[var(--dark)] shadow-[4px_4px_0px_0px_var(--dark)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--dark)]">
                  Mulai Eksplorasi
                </Link>
              </div>
            </div>
          </div>

          {/* Right Content (Stacking Cards) */}
          <div className="lg:w-1/2 relative mt-16 lg:mt-0 flex flex-col pt-10 pb-[10vh]">
            {features.map((item, i) => {
              // Calculate top offset for stacking effect
              const topOffset = 15 + i * 4;

              return (
                <div
                  key={i}
                  className="sticky w-full border-4 border-[#181e2a] rounded-[2rem] p-8 md:p-12 shadow-[8px_8px_0px_0px_#181e2a] flex flex-col transition-transform duration-300 transform-gpu"
                  style={{
                    top: `${topOffset}vh`, // Sticky positioning makes them stack
                    backgroundColor: item.color,
                    minHeight: "420px",
                    marginBottom: i === features.length - 1 ? "40vh" : "60vh",
                    rotate: `${item.rotation}deg`
                  }}
                >
                   <div
                      className="inline-flex items-center justify-center mb-8 border-[3px] border-[var(--dark)] rounded-2xl"
                      style={{
                        width: 80,
                        height: 80,
                        backgroundColor: "var(--white)",
                        color: "var(--dark)",
                        boxShadow: "4px 4px 0px 0px var(--dark)"
                      }}
                    >
                      <item.icon size={40} strokeWidth={2} />
                    </div>

                    <div>
                      <h3
                        className="text-3xl md:text-4xl font-black mb-6"
                        style={{ color: "var(--dark)", letterSpacing: "-0.03em" }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="text-lg md:text-xl font-bold leading-relaxed mb-10"
                        style={{ color: "var(--dark)", opacity: 0.85 }}
                      >
                        {item.desc}
                      </p>
                    </div>

                    <div className="mt-auto">
                      <Link
                        href={item.href}
                        className="inline-flex items-center text-sm md:text-base font-black uppercase tracking-wider pb-1 hover:opacity-60 transition-all"
                        style={{
                          borderBottom: "3px solid var(--dark)",
                          color: "var(--dark)",
                        }}
                      >
                        Coba Fitur Ini
                      </Link>
                    </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}