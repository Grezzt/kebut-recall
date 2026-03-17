"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const messages = [
  {
    id: 1,
    sender: "user",
    text: "Besok ujian tapi materi numpuk banget, pusing bacanya gimana dong?",
  },
  {
    id: 2,
    sender: "bot",
    text: "Tenang aja! Drag-and-drop file PDF materimu. Nanti AI kami yang urus semuanya.",
  },
  {
    id: 3,
    sender: "user",
    text: "Wah praktis! Terus habis kelar di-upload bakal diapain materinya?",
  },
  {
    id: 4,
    sender: "bot",
    text: "Sistem cerdas kami langsung merangkum inti dari materi kamu dalam hitungan detik. Nggak perlu pusing baca dari nol!",
  },
  {
    id: 5,
    sender: "bot",
    text: "Setelah itu, kamu bebas pilih cara belajarnya: hafalan cepat pakai Flashcard, uji kemampuan dengan Quiz, atau pahami konsep lewat Mind-Map. Semua dalam satu platform yang mudah digunakan!",
  },
  {
    id: 6,
    sender: "bot",
    text: "Cukup selesaikan sesinya, ulangi yang salah, dan kamu siap maju ujian dengan percaya diri penuh!!!",
  }
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      });

      tl.from(".hiw-heading", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
      });

      messages.forEach((msg) => {
        const indicator =
          msg.sender === "user" ? ".typing-user" : ".typing-bot";

        // Typing indicator muncul
        tl.fromTo(
          indicator,
          { display: "none", opacity: 0, y: 10 },
          { display: "flex", opacity: 1, y: 0, duration: 0.3 }
        );

        // Durasi mengetik
        tl.to({}, { duration: 0.6 });

        // Typing indicator hilang
        tl.to(indicator, {
          opacity: 0,
          y: 10,
          duration: 0.25,
          display: "none",
        });

        // Row muncul
        tl.set(`.chat-row-${msg.id}`, { display: "flex" });

        // Bubble muncul
        tl.from(`.chat-${msg.id}`, {
          opacity: 0,
          y: 20,
          scale: 0.95,
          duration: 0.4,
          ease: "power2.out",
        });

        // Jeda antar pesan
        tl.to({}, { duration: 0.2 });
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="cara-kerja"
      ref={containerRef}
      className="ks-grid-bg py-24 px-4 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--dark)" }}
    >
      <div className="text-center mb-16 px-4">
        <p
          className="hiw-heading mb-3 font-black uppercase tracking-[2px] text-[13px]"
          style={{ color: "var(--yellow)" }}
        >
          Proses Instan
        </p>
        <h2
          className="hiw-heading text-4xl md:text-5xl font-bold tracking-tight max-w-[600px] mx-auto text-balance leading-tight"
          style={{ color: "var(--white)" }}
        >
          Dari materi numpuk ke siap ujian cuma hitungan detik.
        </h2>
      </div>

      <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8 backdrop-blur-sm">
        <div className="flex flex-col gap-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-row-${msg.id} hidden w-full ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`chat-bubble chat-${msg.id} max-w-[90%] md:max-w-[80%] p-4 text-[15px] md:text-base leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-light-blue text-dark font-medium rounded-2xl rounded-tr-none"
                    : "bg-yellow text-dark font-medium rounded-2xl rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing User */}
          <div className="typing-user hidden justify-end">
            <div className="bg-light-blue p-4 rounded-2xl rounded-tr-none flex gap-1.5 items-center">
              <span className="w-2 h-2 bg-dark/60 rounded-full animate-bounce"></span>
              <span
                className="w-2 h-2 bg-dark/60 rounded-full animate-bounce"
                style={{ animationDelay: "0.15s" }}
              ></span>
              <span
                className="w-2 h-2 bg-dark/60 rounded-full animate-bounce"
                style={{ animationDelay: "0.3s" }}
              ></span>
            </div>
          </div>

          {/* Typing Bot */}
          <div className="typing-bot hidden justify-start">
            <div className="bg-yellow p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
              <span className="w-2 h-2 bg-dark/60 rounded-full animate-bounce"></span>
              <span
                className="w-2 h-2 bg-dark/60 rounded-full animate-bounce"
                style={{ animationDelay: "0.15s" }}
              ></span>
              <span
                className="w-2 h-2 bg-dark/60 rounded-full animate-bounce"
                style={{ animationDelay: "0.3s" }}
              ></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}