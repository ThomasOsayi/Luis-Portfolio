"use client";

import { motion } from "framer-motion";
import { clients } from "@/data/projects";

export default function ClientsPage() {
  return (
    <div className="pt-24 pb-20 px-6 md:px-11 min-h-screen flex flex-col justify-center">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-[10px] font-bold tracking-[5px] uppercase text-tx-ghost mb-16 text-center"
      >
        Selected Clients & Collaborators
      </motion.p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-14 md:gap-x-12 md:gap-y-14 max-w-[900px] mx-auto text-center">
        {clients.map((client, i) => (
          <motion.span
            key={client.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.05 * i,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`text-gold/70 hover:text-gold transition-opacity duration-400 cursor-default ${
              client.style === "sans"
                ? "font-sans text-2xl md:text-4xl font-black tracking-tight"
                : "font-serif text-3xl md:text-5xl font-bold tracking-wide"
            }`}
          >
            {client.name}
          </motion.span>
        ))}
      </div>
    </div>
  );
}