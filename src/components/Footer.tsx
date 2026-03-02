"use client";

import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <footer className="px-11 py-8 flex justify-between items-center border-t border-tx-mute text-[9px] tracking-[2px] text-tx-ghost">
      <span>© 2026 LUIS ROSA</span>
      <span>
        Designed by{" "}
        <a href="#" className="text-gold">
          HNO Consulting
        </a>
      </span>
    </footer>
  );
}