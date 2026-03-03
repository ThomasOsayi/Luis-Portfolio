"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const links = [
  { href: "/work", label: "Work" },
  { href: "/films", label: "Short Films" },
  { href: "/photography", label: "Photography" },
  { href: "/clients", label: "Clients" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [instagram, setInstagram] = useState("https://instagram.com/rodreelz");

  useEffect(() => {
    async function loadSocial() {
      try {
        const snap = await getDoc(doc(db, "siteSettings", "main"));
        if (snap.exists() && snap.data().instagram) {
          setInstagram(snap.data().instagram);
        }
      } catch (_) {}
    }
    loadSocial();
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  if (pathname === "/") return null;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[900] px-6 md:px-11 py-7 flex justify-between items-center bg-gradient-to-b from-bg/85 to-transparent">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-sm font-semibold tracking-[1.5px] uppercase text-tx"
        >
          Luis Rosa
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex gap-8 list-none">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-[10px] font-normal tracking-[2.5px] uppercase transition-colors duration-300 ${
                  pathname === link.href
                    ? "text-tx"
                    : "text-tx-ghost hover:text-tx-dim"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={() => window.dispatchEvent(new Event("open-contact"))}
              className="text-[10px] font-normal tracking-[2.5px] uppercase text-tx-ghost hover:text-tx-dim transition-colors duration-300"
            >
              Contact
            </button>
          </li>
        </ul>

        {/* Right side: Instagram + Hamburger */}
        <div className="flex items-center gap-4">
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-30 hover:opacity-100 transition-opacity hidden md:block"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>

          {/* Hamburger button — mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-[1.5px] bg-tx transition-all duration-300 origin-center ${
                menuOpen ? "rotate-45 translate-y-[6.5px]" : ""
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-tx transition-all duration-300 ${
                menuOpen ? "opacity-0 scale-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-tx transition-all duration-300 origin-center ${
                menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* ═══ MOBILE MENU OVERLAY ═══ */}
      <div
        className={`fixed inset-0 z-[899] bg-bg/95 backdrop-blur-2xl flex flex-col justify-center items-center transition-all duration-500 md:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col items-center gap-7 list-none">
          {links.map((link, i) => (
            <li
              key={link.href}
              className={`transition-all duration-500 ${
                menuOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{
                transitionDelay: menuOpen ? `${80 + i * 60}ms` : "0ms",
              }}
            >
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`font-serif text-3xl font-semibold tracking-wide transition-colors ${
                  pathname === link.href ? "text-gold" : "text-tx hover:text-gold"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li
            className={`transition-all duration-500 ${
              menuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{
              transitionDelay: menuOpen ? `${80 + links.length * 60}ms` : "0ms",
            }}
          >
            <button
              onClick={() => {
                setMenuOpen(false);
                window.dispatchEvent(new Event("open-contact"));
              }}
              className="font-serif text-3xl font-semibold tracking-wide text-tx hover:text-gold transition-colors"
            >
              Contact
            </button>
          </li>
        </ul>

        {/* Social links at bottom */}
        <div
          className={`absolute bottom-12 flex gap-8 transition-all duration-500 ${
            menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: menuOpen ? "400ms" : "0ms" }}
        >
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-[2.5px] uppercase text-tx-ghost hover:text-gold transition-colors"
          >
            Instagram
          </a>
        </div>
      </div>
    </>
  );
}