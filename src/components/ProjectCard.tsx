"use client";

import { motion } from "framer-motion";

interface ProjectCardProps {
  title: string;
  category: string;
  subtitle?: string;
  gradient?: string;
  imageUrl?: string;
  isVideo?: boolean;
  isFull?: boolean;
}

export function ProjectCard({
  title,
  category,
  subtitle,
  gradient,
  imageUrl,
  isVideo = false,
  isFull = false,
}: ProjectCardProps) {
  console.log("CARD RENDER:", title, "imageUrl:", imageUrl);
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden cursor-pointer group ${
        isFull ? "col-span-2 h-[70vh]" : "h-[50vh]"
      }`}
    >
      {/* Background: real image if available, gradient fallback */}
      {imageUrl ? (
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-[1200ms] ease-smooth group-hover:scale-105 brightness-[0.8] group-hover:brightness-50"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      ) : (
        <div
          className={`w-full h-full ${gradient || "bg-gradient-to-br from-[#1b1f35] via-[#0f1428] to-[#1e2444]"} transition-transform duration-[1200ms] ease-smooth group-hover:scale-105 brightness-[0.8] group-hover:brightness-50`}
        />
      )}

      {/* Info overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-9 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-[450ms] ease-smooth">
        <p className="text-[9px] font-bold tracking-[4px] uppercase text-gold mb-2">
          {category}
        </p>
        <h3 className="font-sans text-xl font-black tracking-tight leading-tight mb-1">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs font-light text-tx-dim">{subtitle}</p>
        )}
      </div>

      {/* Play button */}
      {isVideo && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-[1.5px] border-white/20 flex items-center justify-center opacity-0 scale-[0.85] group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-smooth backdrop-blur-sm bg-white/[0.03]">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="white"
            className="ml-0.5"
          >
            <polygon points="8,4 20,12 8,20" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}