"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";

const navLinks = [
  { label: "Fitur", href: "/#fitur" },
  { label: "Cara Kerja", href: "/#cara-kerja" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className="lg:hidden fixed top-0 inset-x-0 z-50 border-b transition-colors duration-300"
        style={{
          backgroundColor: scrolled ? "var(--dark)" : "var(--dark)",
          borderBottomColor: "rgba(255,255,255,0.15)",
        }}
      >
        <div className="flex items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span
              className="text-2xl font-bold tracking-tight"
              style={{ color: "var(--white)" }}
            >
              Smart
            </span>
            <span
              className="flex items-center justify-center px-1.5 py-0.5 text-xs font-black tracking-widest uppercase"
              style={{
                backgroundColor: "var(--yellow)",
                color: "var(--dark)",
              }}
            >
              SKS
            </span>
          </Link>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="ml-3 flex flex-col gap-1.5 p-2"
          >
            <span className="block h-0.5 w-5 rounded" style={{ backgroundColor: "var(--yellow)" }} />
            <span className="block h-0.5 w-5 rounded" style={{ backgroundColor: "var(--yellow)" }} />
            <span className="block h-0.5 w-5 rounded" style={{ backgroundColor: "var(--yellow)" }} />
          </button>
        </div>

        {mobileOpen && (
          <nav
            className="flex flex-col gap-4 px-5 py-6 border-t"
            style={{
              backgroundColor: "var(--dark-90)",
              borderTopColor: "rgba(255,255,255,0.1)",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-2xl font-normal hover:opacity-70 transition-opacity"
                style={{ color: "var(--white)" }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              className="text-2xl font-semibold mt-2"
              style={{ color: "var(--yellow)" }}
              onClick={() => setMobileOpen(false)}
            >
              Dashboard →
            </Link>
          </nav>
        )}
      </header>

      <header
        className="hidden lg:block fixed top-0 inset-x-0 z-50 transition-shadow duration-300"
        style={{
          backgroundColor: "var(--white)",
          boxShadow: scrolled ? "0 2px 10px 0 rgba(0,0,0,0.10)" : "none",
        }}
      >
        <div
          className="flex items-center justify-between px-6"
          style={{ height: 60 }}
        >
          <Link
            href="/"
            className="flex items-center justify-center gap-2 h-full px-5"
            style={{
              backgroundColor: "var(--dark)",
              minWidth: 160,
              height: "100%",
            }}
          >
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--white)" }}
            >
              Smart
            </span>
            <span
              className="flex items-center px-1.5 py-0.5 text-xs font-black tracking-widest uppercase"
              style={{
                backgroundColor: "var(--yellow)",
                color: "var(--dark)",
              }}
            >
              SKS
            </span>
          </Link>

          <nav className="flex items-center gap-8 px-8 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-bold uppercase tracking-wider hover:underline transition-all"
                style={{
                  color: "var(--dark)",
                  letterSpacing: "1px",
                  textDecorationColor: "var(--yellow)",
                  textUnderlineOffset: "4px",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="/dashboard" className="btn-ks-accent h-full flex items-center px-6">
            Mulai Belajar Sekarang
          </Link>
        </div>
      </header>
    </>
  );
}