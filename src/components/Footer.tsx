"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <footer className="px-11 py-8 flex justify-between items-center border-t border-tx-mute text-[9px] tracking-[2px] text-tx-ghost">
      <span>© 2026 LUIS ROSA</span>
      <div className="flex items-center gap-4">
        <span>
          Designed by{" "}
          <a href="#" className="text-gold">
            HNO Consulting
          </a>
        </span>
        <Link
          href="/login"
          className="text-gold opacity-30 hover:opacity-100 transition-opacity"
          aria-label="Admin login"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </Link>
      </div>
    </footer>
  );
}