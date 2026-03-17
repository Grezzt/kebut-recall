"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function VideoGrow() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Kata yang akan dianimasikan
  const text = "Makin Seru";
  const chars = text.split("");

  // Fix untuk masalah ScrollTrigger layout shift (seperti saat chat bubble atasnya expand)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const observer = new ResizeObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    });

    observer.observe(document.body);
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const video = videoRef.current;
      const img = imgRef.current;
      const titleChars = titleRef.current?.querySelectorAll(".char");

      if (!section || !video || !img || !titleChars) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          invalidateOnRefresh: true,
          scrub: 1,
        },
      });

      tl.fromTo(
        titleChars,
        {
          scale: 0,
          rotation: () => Math.random() * 360 - 180,
        },
        {
          scale: 1,
          duration: 0.2,
          rotation: 0,
          ease: "expo.out",
          stagger: {
            each: 0.05,
            from: "random",
          },
        }
      );

      tl.fromTo(
        video,
        {
          clipPath: "inset(10% 50% 10% 50%)",
          yPercent: 100,
        },
        {
          ease: "power3",
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1,
          yPercent: 0,
        },
        0.3
      );

      tl.fromTo(
        video,
        {
          scale: 0.5,
        },
        {
          ease: "back.inOut(0.2)",
          scale: 1,
          duration: 0.8,
        },
        "<"
      );

      tl.fromTo(
        img,
        {
          scale: 2.8,
          yPercent: 40,
        },
        {
          scale: 1.2,
          duration: 0.8,
          delay: 0.2,
          yPercent: 0,
        },
        "<"
      );

      tl.to(video, {
        scale: 0.9,
        ease: "linear",
      });

      tl.to(
        img,
        {
          scale: 1,
          ease: "linear",
        },
        "<"
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: "400svh", backgroundColor: "var(--dark)" }}
    >
      <div className="sticky top-0 w-full h-[100svh] flex justify-center items-center overflow-hidden">
        {/* Layer 1: Title (Behind Video) */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
          <div
            ref={titleRef}
            className="text-white uppercase font-bold tracking-tight text-[12vw] sm:text-[14vw] leading-none text-center"
          >
            {chars.map((char, i) => (
              <span key={i} className="char inline-block will-change-transform">
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Layer 2: Video/Image (In Front of Title) */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-10 flex-col py-10">
          <div
            ref={videoRef}
            className="relative overflow-hidden w-[90%] sm:w-[75%] max-w-[1100px] h-[45vh] sm:h-[65vh] rounded-2xl sm:rounded-3xl pointer-events-auto"
            style={{ willChange: "transform, clip-path" }}
          >
            <Image
              ref={imgRef as any}
              src="/study_session.png"
              alt="Study Session"
              priority
              fill
              sizes="(max-width: 768px) 90vw, 75vw"
              className="object-cover will-change-transform"
            />
          </div>
        </div>
      </div>
    </section>
  );
}