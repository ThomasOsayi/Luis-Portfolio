"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
    } catch (err: any) {
      setError("Invalid credentials");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-tx-dim text-sm tracking-widest uppercase">Loading...</p>
      </div>
    );
  }

  // Login screen
  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-3xl font-semibold mb-2 text-center">Admin</h1>
          <p className="text-tx-dim text-xs tracking-widest uppercase text-center mb-10">
            Luis Rosa Portfolio
          </p>
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-bg-elevated border border-tx-mute px-4 py-3 text-sm text-tx outline-none focus:border-gold transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-bg-elevated border border-tx-mute px-4 py-3 text-sm text-tx outline-none focus:border-gold transition-colors"
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              className="bg-gold text-bg text-[10px] font-bold tracking-[4px] uppercase py-4 hover:bg-gold/80 transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated admin layout
  return (
    <div className="min-h-screen bg-bg">
      {/* Admin nav */}
      <nav className="border-b border-tx-mute px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <span className="font-serif text-sm font-semibold tracking-wider uppercase">
            Admin Panel
          </span>
          <div className="flex gap-6">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[10px] tracking-[2px] uppercase transition-colors ${
                  pathname === link.href ? "text-gold" : "text-tx-ghost hover:text-tx-dim"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/work"
            target="_blank"
            className="text-[10px] tracking-[2px] uppercase text-tx-ghost hover:text-tx-dim"
          >
            View Site ↗
          </Link>
          <button
            onClick={() => signOut(auth)}
            className="text-[10px] tracking-[2px] uppercase text-red-400 hover:text-red-300"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="p-6 md:p-10 max-w-6xl mx-auto">{children}</div>
    </div>
  );
}