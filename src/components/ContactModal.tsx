"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [socials, setSocials] = useState({ instagram: "", vimeo: "", youtube: "" });

  const [form, setForm] = useState({
    name: "",
    email: "",
    projectType: "",
    message: "",
  });

  // Load social links from settings
  useEffect(() => {
    async function loadSocials() {
      try {
        const snap = await getDoc(doc(db, "siteSettings", "main"));
        if (snap.exists()) {
          const data = snap.data();
          setSocials({
            instagram: data.instagram || "",
            vimeo: data.vimeo || "",
            youtube: data.youtube || "",
          });
        }
      } catch (_) {}
    }
    loadSocials();
  }, []);

  // Listen for custom event to open modal from anywhere
  useEffect(() => {
    const handler = () => {
      setIsOpen(true);
      setSent(false);
    };
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

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    setSending(true);
    try {
      await addDoc(collection(db, "contactSubmissions"), {
        ...form,
        createdAt: serverTimestamp(),
        read: false,
      });
      setSent(true);
      setForm({ name: "", email: "", projectType: "", message: "" });
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  }

  const activeSocials = [
    { label: "Instagram", url: socials.instagram },
    { label: "Vimeo", url: socials.vimeo },
    { label: "YouTube", url: socials.youtube },
  ].filter((s) => s.url);

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
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-9 right-6 md:right-11 text-tx text-3xl font-light opacity-40 hover:opacity-100 transition-opacity"
          >
            ×
          </button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.1,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-center max-w-[440px] w-full px-6"
          >
            {!sent ? (
              <>
                <p className="text-[10px] font-bold tracking-[5px] uppercase text-gold mb-6">
                  Get In Touch
                </p>
                <h2 className="font-serif text-5xl md:text-6xl font-semibold leading-none mb-4">
                  Let&apos;s create
                  <br />
                  <em className="italic font-light text-gold">together.</em>
                </h2>
                <p className="text-sm font-light text-tx-dim leading-relaxed mb-11">
                  Have a project in mind? Whether it&apos;s a music video, short
                  film, commercial, or something entirely new — let&apos;s talk.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-5">
                    <input
                      type="text"
                      placeholder="YOUR NAME"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      required
                      className="bg-transparent border-b border-tx-mute pb-3 text-sm font-light text-tx outline-none focus:border-gold transition-colors placeholder:text-tx-ghost placeholder:text-[10px] placeholder:tracking-[2px]"
                    />
                    <input
                      type="email"
                      placeholder="EMAIL"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      required
                      className="bg-transparent border-b border-tx-mute pb-3 text-sm font-light text-tx outline-none focus:border-gold transition-colors placeholder:text-tx-ghost placeholder:text-[10px] placeholder:tracking-[2px]"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="PROJECT TYPE"
                    value={form.projectType}
                    onChange={(e) => update("projectType", e.target.value)}
                    className="bg-transparent border-b border-tx-mute pb-3 text-sm font-light text-tx outline-none focus:border-gold transition-colors placeholder:text-tx-ghost placeholder:text-[10px] placeholder:tracking-[2px]"
                  />
                  <textarea
                    placeholder="Tell me about your vision..."
                    rows={3}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    className="bg-transparent border-b border-tx-mute pb-3 text-sm font-light text-tx outline-none focus:border-gold transition-colors resize-none placeholder:text-tx-ghost placeholder:text-[10px] placeholder:tracking-[2px]"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="mt-2 bg-tx text-bg text-[10px] font-bold tracking-[4px] uppercase py-4 px-9 hover:bg-gold hover:tracking-[5px] transition-all duration-400 disabled:opacity-50"
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </>
            ) : (
              /* ─── Success State ─── */
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="text-gold text-5xl mb-6">✓</div>
                <p className="text-[10px] font-bold tracking-[5px] uppercase text-gold mb-6">
                  Message Sent
                </p>
                <h2 className="font-serif text-4xl md:text-5xl font-semibold leading-none mb-4">
                  Thank you.
                </h2>
                <p className="text-sm font-light text-tx-dim leading-relaxed mb-8">
                  I&apos;ll get back to you soon. Looking forward to creating
                  something together.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-tx text-bg text-[10px] font-bold tracking-[4px] uppercase py-4 px-9 hover:bg-gold transition-all duration-400"
                >
                  Close
                </button>
              </motion.div>
            )}

            {/* Social links */}
            <div className="flex gap-8 justify-center mt-14">
              {activeSocials.length > 0
                ? activeSocials.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] tracking-[2.5px] uppercase text-tx-ghost hover:text-gold transition-colors"
                    >
                      {s.label}
                    </a>
                  ))
                : ["Instagram", "Vimeo", "YouTube"].map((s) => (
                    <span
                      key={s}
                      className="text-[10px] tracking-[2.5px] uppercase text-tx-ghost"
                    >
                      {s}
                    </span>
                  ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}