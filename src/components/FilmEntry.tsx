"use client";

import { motion } from "framer-motion";

interface Film {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  subtitle?: string;
  description?: string;
  role?: string;
  gradient?: string;
  imageUrl?: string;
  videoUrl?: string;
  hasVideo?: boolean;
  isVideo?: boolean;
  featured?: boolean;
  isFeatured?: boolean;
  order: number;
}

interface FilmEntryProps {
  film: Film;
  reverse?: boolean;
}

export function FilmEntry({ film, reverse = false }: FilmEntryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`grid grid-cols-1 md:grid-cols-2 gap-0 mb-20 items-center ${
        reverse ? "md:[direction:rtl]" : ""
      }`}
    >
      {/* Video thumbnail */}
      <div
        className={`relative overflow-hidden cursor-pointer group aspect-video bg-bg-elevated ${
          reverse ? "md:[direction:ltr]" : ""
        }`}
        onClick={() => {
          if (film.videoUrl) {
            window.dispatchEvent(
              new CustomEvent("open-video", { detail: film.videoUrl })
            );
          }
        }}
      >
        {film.imageUrl ? (
          <div
            className="w-full h-full bg-cover bg-center transition-all duration-[1000ms] ease-smooth group-hover:scale-[1.04] group-hover:brightness-[0.6] brightness-[0.8]"
            style={{ backgroundImage: `url(${film.imageUrl})` }}
          />
        ) : (
          <div
            className={`w-full h-full ${film.gradient || "bg-gradient-to-br from-[#1b1f35] via-[#0f1428] to-[#1e2444]"} transition-all duration-[1000ms] ease-smooth group-hover:scale-[1.04] group-hover:brightness-[0.6] brightness-[0.8]`}
          />
        )}
        {/* Play button */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-[1.5px] border-white/20 flex items-center justify-center opacity-0 scale-[0.85] group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-smooth backdrop-blur-sm bg-white/[0.03]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="white"
            className="ml-0.5"
          >
            <polygon points="8,4 20,12 8,20" />
          </svg>
        </div>
      </div>

      {/* Text */}
      <div className={`p-8 md:p-14 ${reverse ? "md:[direction:ltr]" : ""}`}>
        <h2 className="font-sans text-2xl md:text-4xl font-black tracking-tight mb-2">
          {film.title}
        </h2>
        <p className="text-[11px] font-light tracking-wide text-tx-dim mb-4">
          {film.role || "Director"}
        </p>
        {film.description && (
          <p className="text-sm font-light leading-relaxed text-tx-dim max-w-[400px]">
            {film.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}