"use client";

import { motion } from "framer-motion";

interface PhotoItemProps {
  label: string;
  gradient?: string;
  imageUrl?: string;
  tall?: boolean;
  wide?: boolean;
}

export function PhotoItem({ label, gradient, imageUrl, tall, wide }: PhotoItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden cursor-pointer group ${
        tall ? "row-span-2" : ""
      } ${wide ? "col-span-2" : ""}`}
    >
      {imageUrl ? (
        <div
          className={`w-full h-full min-h-[240px] ${
            tall ? "min-h-[500px]" : ""
          } bg-cover bg-center transition-all duration-[1000ms] ease-smooth group-hover:scale-[1.06] group-hover:brightness-[0.65]`}
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      ) : (
        <div
          className={`w-full h-full min-h-[240px] ${
            tall ? "min-h-[500px]" : ""
          } ${
            gradient ||
            "bg-gradient-to-br from-[#1b1f35] via-[#0f1428] to-[#1e2444]"
          } transition-all duration-[1000ms] ease-smooth group-hover:scale-[1.06] group-hover:brightness-[0.65]`}
        />
      )}
      <span className="absolute bottom-4 left-4 text-[10px] tracking-[2px] uppercase text-tx opacity-0 group-hover:opacity-100 transition-opacity duration-400">
        {label}
      </span>
    </motion.div>
  );
}