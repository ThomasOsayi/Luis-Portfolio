"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/work", label: "Work" },
  { href: "/films", label: "Short Films" },
  { href: "/photography", label: "Photography" },
  { href: "/clients", label: "Clients" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();

  // Hide navbar on the enter gate (homepage)
  if (pathname === "/") return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[900] px-11 py-7 flex justify-between items-center bg-gradient-to-b from-bg/85 to-transparent">
      <Link
        href="/"
        className="font-serif text-sm font-semibold tracking-[1.5px] uppercase text-tx"
      >
        Luis Rosa
      </Link>

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
            className="text-[10px] font-normal tracking-[2.5px] uppercase text-tx-ghost hover:text-tx-dim transition-colors duration-300"
            /* TODO: wire up contact modal state */
          >
            Contact
          </button>
        </li>
      </ul>

      <a
        href="https://instagram.com/rodreelz"
        target="_blank"
        rel="noopener noreferrer"
        className="opacity-30 hover:opacity-100 transition-opacity"
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
    </nav>
  );
}