"use client";

import { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ───────── icons ───────── */
function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function ProjectsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}
function ClientsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-200"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
function LogOutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
/* ───────── nav config ───────── */
const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: DashboardIcon, exact: true },
  { href: "/admin/projects", label: "Projects", icon: ProjectsIcon, exact: false },
  { href: "/admin/clients", label: "Clients", icon: ClientsIcon, exact: false },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon, exact: false },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Invalid credentials");
    }
  }

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  /* ── loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-tx-dim text-sm tracking-widest uppercase">
          Loading…
        </p>
      </div>
    );
  }

  /* ── login ── */
  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-3xl font-semibold mb-2 text-center">
            Admin
          </h1>
          <p className="text-tx-dim text-xs tracking-widest uppercase text-center mb-10">
            Luis Rosa Portfolio
          </p>
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-bg-elevated border border-tx-mute px-4 py-3 text-sm text-tx outline-none focus:border-gold transition-colors rounded-md"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-bg-elevated border border-tx-mute px-4 py-3 text-sm text-tx outline-none focus:border-gold transition-colors rounded-md"
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              className="bg-gold text-bg text-[10px] font-bold tracking-[4px] uppercase py-4 hover:bg-gold/80 transition-colors rounded-md"
            >
              Sign In
            </button>
          </form>
          <p className="mt-6 text-center">
            <Link
              href="/"
              className="text-[10px] tracking-[2px] uppercase text-tx-ghost hover:text-tx transition-colors"
            >
              ← Return to site
            </Link>
          </p>
        </div>
      </div>
    );
  }

  /* ── authenticated layout ── */
  return (
    <div className="min-h-screen bg-bg flex">
      {/* ═══ SIDEBAR ═══ */}
      <aside
        className="admin-sidebar flex flex-col border-r border-tx-mute bg-[#0d0d0d] shrink-0 transition-all duration-300"
        style={{ width: collapsed ? 72 : 240 }}
      >
        {/* Brand */}
        <div
          className={`border-b border-tx-mute flex items-center gap-3 min-h-[72px] ${
            collapsed ? "justify-center px-0" : "px-5"
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-[#A88B5A] flex items-center justify-center text-bg text-sm font-bold font-serif shrink-0">
            LR
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <div className="font-serif text-[15px] font-semibold leading-tight tracking-wide">
                Luis Rosa
              </div>
              <div className="text-[9px] tracking-[2.5px] uppercase text-tx-ghost mt-0.5">
                Admin Panel
              </div>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-2 pt-4 pb-2">
          {!collapsed && (
            <div className="text-[9px] tracking-[2.5px] uppercase text-tx-ghost px-3 mb-2">
              Menu
            </div>
          )}
          {adminLinks.map((link) => {
            const active = isActive(link.href, link.exact);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`admin-nav-item group relative flex items-center gap-3 rounded-lg mb-0.5 transition-all duration-200 ${
                  collapsed ? "justify-center py-3 px-0" : "py-2.5 px-3"
                } ${
                  active
                    ? "bg-gold/8 text-gold"
                    : "text-tx-dim hover:text-tx hover:bg-gold/[0.04]"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gold rounded-r-full" />
                )}
                <Icon />
                {!collapsed && (
                  <span className="text-[13px] font-medium tracking-wide">
                    {link.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-tx-mute px-2 py-3 flex flex-col gap-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex items-center gap-2 text-tx-ghost hover:text-tx-dim text-xs rounded-md py-2 transition-colors ${
              collapsed ? "justify-center px-0" : "px-3"
            }`}
          >
            <ChevronIcon open={!collapsed} />
            {!collapsed && "Collapse"}
          </button>

          {!collapsed && (
            <>
              <Link
                href="/work"
                target="_blank"
                className="flex items-center gap-2 text-tx-ghost hover:text-tx-dim text-xs px-3 py-2 rounded-md transition-colors"
              >
                <ExternalIcon /> View Live Site
              </Link>
              <button
                onClick={() => signOut(auth)}
                className="flex items-center gap-2 text-red-400/60 hover:text-red-400 text-xs px-3 py-2 rounded-md transition-colors text-left"
              >
                <LogOutIcon /> Sign Out
              </button>
            </>
          )}
        </div>
      </aside>

      {/* ═══ MAIN ═══ */}
      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-8 h-16 border-b border-tx-mute bg-bg/80 backdrop-blur-xl shrink-0">
          <h1 className="font-serif text-xl font-normal tracking-wide capitalize">
            {adminLinks.find((l) => isActive(l.href, l.exact))?.label ??
              "Admin"}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full border border-tx-mute flex items-center justify-center text-xs text-tx-dim cursor-default">
              LR
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">{children}</main>

        {/* Footer */}
        <footer className="px-8 py-5 border-t border-tx-mute flex items-center justify-between text-[11px] text-tx-ghost">
          <span>&copy; 2026 Luis Rosa</span>
          <span>
            Designed by{" "}
            <span className="text-gold font-medium">HNO Consulting</span>
          </span>
        </footer>
      </div>
    </div>
  );
}