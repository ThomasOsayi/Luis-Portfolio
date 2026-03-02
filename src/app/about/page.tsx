"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen pt-20">
      {/* Photo side */}
      <div className="relative overflow-hidden bg-bg-elevated">
        <div className="w-full h-full min-h-[50vh] md:min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#1a1a2e] via-[#0d1118] to-[#1a1520]" />
        <p className="absolute bottom-8 left-8 text-[9px] tracking-[3px] uppercase text-tx-ghost">
          Los Angeles, CA
        </p>
      </div>

      {/* Text side */}
      <div className="flex flex-col justify-center px-8 py-16 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[10px] font-bold tracking-[5px] uppercase text-gold mb-8">
            About
          </p>

          <h2 className="font-serif text-2xl md:text-4xl font-semibold leading-snug mb-7">
            A Dominican-Puerto Rican filmmaker telling stories that matter.
          </h2>

          <p className="text-[15px] font-light leading-relaxed text-tx-dim mb-5 max-w-[420px]">
            Born between two cultures, Luis Rosa brings an authentic, cinematic
            eye to every frame. A graduate of LMU&apos;s School of Film and
            Television, he creates work that bridges heritage with the pulse of
            modern visual storytelling.
          </p>

          <p className="text-[15px] font-light leading-relaxed text-tx-dim mb-10 max-w-[420px]">
            From music videos for platinum-selling artists to intimate short
            films exploring identity and family, every project carries the same
            intention — tell the truth beautifully.
          </p>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-tx-mute">
            <div>
              <p className="text-[9px] font-bold tracking-[3px] uppercase text-tx-ghost mb-1">
                Based In
              </p>
              <p className="text-sm font-normal leading-relaxed">
                Los Angeles, CA
              </p>
            </div>
            <div>
              <p className="text-[9px] font-bold tracking-[3px] uppercase text-tx-ghost mb-1">
                Education
              </p>
              <p className="text-sm font-normal leading-relaxed">
                Loyola Marymount
                <br />
                Film & Television
              </p>
            </div>
            <div>
              <p className="text-[9px] font-bold tracking-[3px] uppercase text-tx-ghost mb-1">
                Focus
              </p>
              <p className="text-sm font-normal leading-relaxed">
                Directing
                <br />
                Cinematography
                <br />
                Storytelling
              </p>
            </div>
            <div>
              <p className="text-[9px] font-bold tracking-[3px] uppercase text-tx-ghost mb-1">
                Heritage
              </p>
              <p className="text-sm font-normal leading-relaxed">
                Dominican Republic
                <br />
                Puerto Rico
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}