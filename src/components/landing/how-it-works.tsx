"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FileUp, Sparkles, BrainCircuit, GraduationCap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: "01",
    title: "Unggah Materi",
    desc: "Drag-and-drop file PDF materi kuliah, ketik catatan manual, atau tuliskan topik yang ingin dipelajari.",
    icon: <FileUp size={24} strokeWidth={1.5} />,
  },
  {
    num: "02",
    title: "AI Bekerja",
    desc: "Sistem cerdas kami membaca dan merangkum inti materi dalam beberapa detik tanpa perlu pusing.",
    icon: <Sparkles size={24} strokeWidth={1.5} className="text-yellow" />,
  },
  {
    num: "03",
    title: "Pilih Mode Belajar",
    desc: "Kustomisasi cara belajarmu: berlatih dengan Quiz, hafalkan lewat Flashcard, atau pahami konsep dengan Mind-Map.",
    icon: <BrainCircuit size={24} strokeWidth={1.5} />,
  },
  {
    num: "04",
    title: "Siap Ujian",
    desc: "Selesaikan sesi belajar dengan efektif, ulangi yang salah, dan melangkah ke ujian dengan percaya diri penuh.",
    icon: <GraduationCap size={24} strokeWidth={1.5} />,
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".hiw-heading", {
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
        y: 30,
        opacity: 0,
        duration: 0.8,
      });
      gsap.from(".hiw-step", {
        scrollTrigger: { trigger: ".hiw-steps", start: "top 80%" },
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: "power2.out",
      });
    },
    { scope: ref }
  );

  return (
    <section
      id="cara-kerja"
      ref={ref}
      style={{
        backgroundColor: "var(--dark)",
        padding: "100px 0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Label */}
        <p
          style={{
            color: "var(--yellow)",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "2px",
            fontSize: 13,
            marginBottom: 12,
          }}
        >
          Proses Instan
        </p>

        {/* Heading */}
        <h2
          className="hiw-heading"
          style={{
            color: "var(--white)",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            maxWidth: 600,
            marginBottom: 64,
          }}
        >
          Dari materi numpuk ke siap ujian — cuma 4 langkah.
        </h2>

        {/* Steps grid */}
        <div
          className="hiw-steps"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "0",
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="hiw-step"
              style={{
                borderLeft: i === 0 ? "none" : "1px solid rgba(255,217,0,0.15)",
                padding: "0 32px 0 32px",
                marginBottom: 0,
                ...(i === 0 ? { paddingLeft: 0 } : {}),
              }}
            >
              {/* Step number */}
              <div
                style={{
                  color: "var(--yellow)",
                  fontWeight: 900,
                  fontSize: 40,
                  lineHeight: 1,
                  marginBottom: 20,
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.03em",
                  opacity: 0.5,
                }}
              >
                {step.num}
              </div>

              {/* Icon */}
              <div
                style={{
                  color: "var(--white)",
                  marginBottom: 16,
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(255,217,0,0.3)",
                  backgroundColor: "rgba(255,217,0,0.05)",
                }}
              >
                {step.icon}
              </div>

              {/* Text */}
              <h3
                style={{
                  color: "var(--white)",
                  fontWeight: 700,
                  fontSize: 18,
                  marginBottom: 10,
                  lineHeight: 1.3,
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 15,
                  lineHeight: 1.6,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}