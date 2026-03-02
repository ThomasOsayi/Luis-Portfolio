"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function EnterGate() {
  const [exiting, setExiting] = useState(false);
  const router = useRouter();

  function enter() {
    setExiting(true);
    setTimeout(() => router.push("/work"), 700);
  }

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[10000] flex flex-col justify-between"
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/hero.jpeg')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-bg/25 via-bg/8 to-bg/55" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,10,10,0.35)_100%)]" />
          </div>

          {/* Top bar */}
          <div className="relative z-10 flex justify-between items-start px-11 py-9">
            <div>
              <p className="font-serif text-base font-semibold tracking-wide uppercase text-tx">
                Luis Rosa
              </p>
              <p className="font-sans text-[9px] font-light tracking-[3px] uppercase text-tx-dim mt-0.5">
                Filmmaker
              </p>
            </div>

            <div className="flex gap-3.5 items-center">
              <a
                href="https://instagram.com/rodreelz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[38px] h-[38px] border border-tx/20 flex items-center justify-center hover:border-tx hover:bg-tx/[0.06] transition-all"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <button
                onClick={enter}
                className="text-[10px] font-bold tracking-[3px] uppercase text-tx bg-transparent border border-tx/25 px-6 py-3 hover:bg-tx hover:text-bg hover:border-tx transition-all duration-400 ease-smooth"
              >
                Enter
              </button>
              <button
                onClick={() => {
                  enter();
                  setTimeout(() => window.dispatchEvent(new Event("open-contact")), 800);
                }}
                className="text-[10px] font-bold tracking-[3px] uppercase text-tx bg-transparent border border-tx/25 px-6 py-3 hover:bg-tx hover:text-bg hover:border-tx transition-all duration-400 ease-smooth"
              >
                Contact
              </button>
            </div>
          </div>

          {/* Bottom: Name */}
          <div className="relative z-10 px-11 pb-11 flex justify-between items-end">
            <h1 className="font-serif font-semibold leading-[0.86] tracking-tight text-tx text-[clamp(52px,10vw,150px)]">
              Luis<br />
              <em className="italic font-light text-gold">Rosa</em>
            </h1>
            <p className="text-[9px] tracking-[3px] uppercase text-tx-ghost [writing-mode:vertical-rl] animate-pulse hidden md:block">
              Scroll to enter
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}