"use client";

import Link from "next/link";
import { Menu, X, Home, FolderOpen, MessageCircle, Contact } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dotlottieRef = useRef<any>(null);
  const lottieContainerRef = useRef<HTMLDivElement>(null);

  // Handle mouse move untuk control Lottie
  useEffect(() => {
    // Tunggu sampai dotlottie instance tersedia
    const interval = setInterval(() => {
      if (lottieContainerRef.current) {
        const canvas = lottieContainerRef.current.querySelector("canvas");
        if (canvas && (canvas as any).dotlottie) {
          dotlottieRef.current = (canvas as any).dotlottie;
          clearInterval(interval);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!lottieContainerRef.current || !dotlottieRef.current) return;

      const rect = lottieContainerRef.current.getBoundingClientRect();
      const containerWidth = rect.width;
      const mouseX = e.clientX - rect.left;

      // Hitung progress (0-1) berdasarkan posisi horizontal mouse
      const progress = Math.max(0, Math.min(1, mouseX / containerWidth));

      // Kontrol dotlottie playback menggunakan goToAndStop
      try {
        if (dotlottieRef.current && dotlottieRef.current.totalFrames) {
          const frame = Math.floor(progress * dotlottieRef.current.totalFrames);
          dotlottieRef.current.goToAndStop(frame);
        }
      } catch (error) {
        // Silent fail jika belum ready
      }
    };

    const container = lottieContainerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  useGSAP(() => {
    if (!menuRef.current) return;

    if (isMenuOpen) {
      gsap.to(menuRef.current, {
        y: "-100vh",
        duration: 0.7,
        ease: "power4.out",
      });
    } else {
      gsap.to(menuRef.current, {
        y: "0",
        duration: 0.5,
        ease: "power3.in",
      });
    }
  }, [isMenuOpen]);

  return (
    <>
      <div className="fixed top-4 sm:top-8 inset-x-0 mx-auto z-50 flex justify-center w-full px-4 sm:px-6 pointer-events-none">
        <div className="bg-white rounded-[2rem] flex items-center justify-between pl-4 pr-2 py-2 shadow-lg w-full max-w-[840px] pointer-events-auto h-[60px] sm:h-[72px]">
          {/* Left Box */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
            >
              {isMenuOpen ? (
                <X strokeWidth={1.5} className="w-7 h-7 text-black" />
              ) : (
                <Menu strokeWidth={1.5} className="w-7 h-7 text-black" />
              )}
            </button>
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4">
              <span className="text-xl sm:text-[22px] font-bold tracking-tight text-gray-900 flex items-center border-r-[1.5px] border-gray-300/80 pr-4 h-[32px]">
                Kebut<span className="text-purple ml-[2px]">Recall</span>
              </span>
              <span className="text-[13px] font-medium text-gray-900 hidden md:block tracking-wide">
                ai learning platform
              </span>
            </Link>
          </div>

          {/* Middle Nav Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 mr-2">
            <Link href="#fitur" className="text-[11px] font-bold text-gray-900 hover:text-gray-500 transition-colors uppercase tracking-[0.08em]">
              Fitur
            </Link>
            <Link href="#cara-kerja" className="text-[11px] font-bold text-gray-900 hover:text-gray-500 transition-colors uppercase tracking-[0.08em]">
              Cara Kerja
            </Link>
          </div>

          {/* Right Box (Button) */}
          <div>
            <Link href="/dashboard" className="bg-[#FFD900] text-black font-bold uppercase tracking-[0.08em] text-[11px] sm:text-[12px] px-7 py-[14px] rounded-full hover:bg-[#ffe64d] transition-all inline-block truncate">
              Mulai Belajar
            </Link>
          </div>
        </div>
      </div>

      {/* Full Screen Menu Overlay */}
      <div
        ref={menuRef}
        className="fixed top-[100vh] left-0 right-0 h-[100vh] z-40 bg-white flex flex-col justify-center items-center overflow-hidden"
      >
        <div className="w-full max-w-6xl px-6 min-h-[500px] flex flex-col md:flex-row items-center justify-between gap-12 pt-20">
          {/* Navigation Links Large */}
          <div className="flex flex-col gap-6 md:gap-10 w-full md:w-1/2">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="group flex items-center gap-6">
              <Home className="w-8 h-8 md:w-10 md:h-10 text-gray-800 group-hover:text-[#FFD900] transition-colors" />
              <span className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 uppercase">Home</span>
            </Link>
            <Link href="#fitur" onClick={() => setIsMenuOpen(false)} className="group flex items-center gap-6">
              <FolderOpen className="w-8 h-8 md:w-10 md:h-10 text-gray-800 group-hover:text-[#FFD900] transition-colors" />
              <span className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 uppercase">Fitur</span>
            </Link>
            <Link href="#cara-kerja" onClick={() => setIsMenuOpen(false)} className="group flex items-center gap-6">
              <MessageCircle className="w-8 h-8 md:w-10 md:h-10 text-gray-800 group-hover:text-[#FFD900] transition-colors" />
              <span className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 uppercase">Cara Kerja</span>
            </Link>
            <Link href="#kontak" onClick={() => setIsMenuOpen(false)} className="group flex items-center gap-6">
              <Contact className="w-8 h-8 md:w-10 md:h-10 text-gray-800 group-hover:text-[#FFD900] transition-colors" />
              <span className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 uppercase">Kontak</span>
            </Link>
          </div>

          {/* Illustration/Asset Area */}
          <div
            ref={lottieContainerRef}
            className="w-full md:w-1/2 flex justify-center items-center relative cursor-pointer group"
          >

            <div className="relative w-full max-w-[500px] aspect-square flex justify-center items-center">
               <DotLottieReact
                  src="/694e530de557b65510d5d671_Artboard 1.lottie"
                  autoplay={false}
                  className="w-full h-full object-contain"
               />
            </div>

            {/* Dekorasi Bubble Chat - ala gambar referensi Fooror */}
            <div className="absolute top-0 right-0 md:-right-10 bg-white border-[3px] border-gray-900 rounded-[50%] p-6 shadow-sm hidden md:block">
              <p className="font-bold text-xl md:text-2xl text-center max-w-[150px] text-gray-900">
                Siapp Kebut Belajar?
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}