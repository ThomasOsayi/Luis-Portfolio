"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";

interface SiteSettings {
  aboutHeading: string;
  aboutPara1: string;
  aboutPara2: string;
  basedIn: string;
  education: string;
  focus: string;
  heritage: string;
}

const defaults: SiteSettings = {
  aboutHeading:
    "A Dominican-Puerto Rican filmmaker telling stories that matter.",
  aboutPara1:
    "Born between two cultures, Luis Rosa brings an authentic, cinematic eye to every frame. A graduate of LMU\u2019s School of Film and Television, he creates work that bridges heritage with the pulse of modern visual storytelling.",
  aboutPara2:
    "From music videos for platinum-selling artists to intimate short films exploring identity and family, every project carries the same intention \u2014 tell the truth beautifully.",
  basedIn: "Los Angeles, CA",
  education: "Loyola Marymount\nFilm & Television",
  focus: "Directing\nCinematography\nStorytelling",
  heritage: "Dominican Republic\nPuerto Rico",
};

export default function AboutPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaults);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(db, "siteSettings", "main"));
        if (snap.exists()) {
          const data = snap.data();
          setSettings({
            aboutHeading: data.aboutHeading || defaults.aboutHeading,
            aboutPara1: data.aboutPara1 || defaults.aboutPara1,
            aboutPara2: data.aboutPara2 || defaults.aboutPara2,
            basedIn: data.basedIn || defaults.basedIn,
            education: data.education || defaults.education,
            focus: data.focus || defaults.focus,
            heritage: data.heritage || defaults.heritage,
          });
        }
      } catch (err) {
        console.error("Failed to load site settings:", err);
      }
    }
    load();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen pt-20">
      {/* Photo side */}
      <div className="relative overflow-hidden bg-bg-elevated">
        <div className="w-full h-full min-h-[50vh] md:min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#1a1a2e] via-[#0d1118] to-[#1a1520]" />
        <p className="absolute bottom-8 left-8 text-[9px] tracking-[3px] uppercase text-tx-ghost">
          {settings.basedIn}
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
            {settings.aboutHeading}
          </h2>

          {settings.aboutPara1 && (
            <p className="text-[15px] font-light leading-relaxed text-tx-dim mb-5 max-w-[420px]">
              {settings.aboutPara1}
            </p>
          )}

          {settings.aboutPara2 && (
            <p className="text-[15px] font-light leading-relaxed text-tx-dim mb-10 max-w-[420px]">
              {settings.aboutPara2}
            </p>
          )}

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-tx-mute">
            {[
              { label: "Based In", value: settings.basedIn },
              { label: "Education", value: settings.education },
              { label: "Focus", value: settings.focus },
              { label: "Heritage", value: settings.heritage },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[9px] font-bold tracking-[3px] uppercase text-tx-ghost mb-1">
                  {item.label}
                </p>
                <p className="text-sm font-normal leading-relaxed whitespace-pre-line">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}