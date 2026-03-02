"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);

  // Listen for custom event to open modal from anywhere
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("open-contact", handler);
    return () => window.removeEventListener("open-contact", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[5000] bg-bg/92 backdrop-blur-xl flex items-center justify-center"
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-9 right-11 text-tx text-3xl font-light opacity-40 hover:opacity-100 transition-opacity"
          >
            ×
          </button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-[440px] w-full px-6"
          >
            <p className="text-[10px] font-bold tracking-[5px] uppercase text-gold mb-6">
              Get In Touch
            </p>
            <h2 className="font-serif text-5xl md:text-6xl font-semibold leading-none mb-4">
              Let&apos;s create<br />
              <em className="italic font-light text-gold">together.</em>
            </h2>
            <p className="text-sm font-light text-tx-dim leading-relaxed mb-11">
              Have a project in mind? Whether it&apos;s a music video, short
              film, commercial, or something entirely new — let&apos;s talk.
            </p>

            <form className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="YOUR NAME"
                  className="bg-transparent border-b border-tx-mute pb-3 text-sm font-light text-tx outline-none focus:border-gold transition-colors placeholder:text-tx-ghost placeholder:text-[10px] placeholder:tracking-[2px]"
                />
                <input
                  type="email"
                  placeholder="EMAIL"
                  className="bg-transparent border-b border-tx-mute pb-3 text-sm font-light text-tx outline-none focus:border-gold transition-colors placeholder:text-tx-ghost placeholder:text-[10px] placeholder:tracking-[2px]"
                />
              </div>
              <input
                type="text"
                placeholder="PROJECT TYPE"
                className="bg-transparent border-b border-tx-mute pb-3 text-sm font-light text-tx outline-none focus:border-gold transition-colors placeholder:text-tx-ghost placeholder:text-[10px] placeholder:tracking-[2px]"
              />
              <textarea
                placeholder="Tell me about your vision..."
                rows={3}
                className="bg-transparent border-b border-tx-mute pb-3 text-sm font-light text-tx outline-none focus:border-gold transition-colors resize-none placeholder:text-tx-ghost placeholder:text-[10px] placeholder:tracking-[2px]"
              />
              <button
                type="submit"
                className="mt-2 bg-tx text-bg text-[10px] font-bold tracking-[4px] uppercase py-4 px-9 hover:bg-gold hover:tracking-[5px] transition-all duration-400"
              >
                Send Message
              </button>
            </form>

            <div className="flex gap-8 justify-center mt-14">
              {["Instagram", "Vimeo", "YouTube"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-[10px] tracking-[2.5px] uppercase text-tx-ghost hover:text-gold transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}