"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/";

  return (
    <>
      {!isAdmin && <Navbar />}
      <main>
        {isAdmin || isHome ? (
          children
        ) : (
          <PageTransition>{children}</PageTransition>
        )}
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}