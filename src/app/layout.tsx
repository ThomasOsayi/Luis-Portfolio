import type { Metadata } from "next";
import { Chivo, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ContactModal } from "@/components/ContactModal";
import { FilmGrain } from "@/components/FilmGrain";
import { Footer } from "@/components/Footer";

const chivo = Chivo({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "700", "900"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Luis Rosa — Filmmaker",
  description:
    "Dominican-Puerto Rican filmmaker based in Los Angeles. Music videos, short films, documentaries, and photography.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${chivo.variable} ${cormorant.variable}`}>
      <body className="font-sans">
        <FilmGrain />
        <Navbar />
        <ContactModal />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}