"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

/* ───────── icons ───────── */
function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function VimeoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}
function YoutubeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none" />
    </svg>
  );
}
function MapPinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
function TargetIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

/* ───────── section config ───────── */
const sectionNav = [
  { id: "hero", label: "Hero & Branding" },
  { id: "about", label: "About Page" },
  { id: "details", label: "Details Grid" },
  { id: "social", label: "Social Links" },
];

/* ═══════════════════════════════════════
   SETTINGS ADMIN
   ═══════════════════════════════════════ */
export default function SettingsAdmin() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState("");
  const [activeSection, setActiveSection] = useState("hero");
  const [showPreview, setShowPreview] = useState(true);

  const [form, setForm] = useState({
    heroImage: "",
    missionText: "I make films for my family and create stories for my people.",
    aboutHeading:
      "A Dominican-Puerto Rican filmmaker telling stories that matter.",
    aboutPara1: "",
    aboutPara2: "",
    basedIn: "Los Angeles, CA",
    education: "Loyola Marymount\nFilm & Television",
    focus: "Directing\nCinematography\nStorytelling",
    heritage: "Dominican Republic\nPuerto Rico",
    instagram: "https://instagram.com/rodreelz",
    vimeo: "",
    youtube: "",
  });

  // Load existing settings
  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "siteSettings", "main"));
      if (snap.exists()) {
        setForm((prev) => ({ ...prev, ...snap.data() }));
        if (snap.data().heroImage) setHeroPreview(snap.data().heroImage);
      }
    }
    load();
  }, []);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function handleHeroSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroFile(file);
    setHeroPreview(URL.createObjectURL(file));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      let heroImage = form.heroImage;

      if (heroFile) {
        const fileName = `hero-${Date.now()}.${heroFile.name.split(".").pop()}`;
        const storageRef = ref(storage, `site/${fileName}`);
        await uploadBytes(storageRef, heroFile);
        heroImage = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, "siteSettings", "main"), {
        ...form,
        heroImage,
        updatedAt: serverTimestamp(),
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      console.error(err);
      alert("Error saving settings");
    } finally {
      setSaving(false);
    }
  }

  function scrollTo(id: string) {
    setActiveSection(id);
    document
      .getElementById(`section-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="flex h-[calc(100vh-130px)] overflow-hidden -m-8 animate-fade-in-up">
      {/* ═══ LEFT: FORM PANEL ═══ */}
      <div
        className={`overflow-auto ${
          showPreview ? "w-[55%]" : "w-full"
        } border-r border-tx-mute`}
      >
        <div className="max-w-[640px] p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-7">
            <div>
              <h1 className="font-serif text-[28px] font-normal tracking-wide mb-1">
                Site Settings
              </h1>
              <p className="text-tx-dim text-sm">
                Manage your site content & branding
              </p>
            </div>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-2 px-4 py-2 text-[11px] tracking-[1px] uppercase rounded-lg border transition-colors ${
                showPreview
                  ? "border-gold/30 text-gold bg-gold/[0.06]"
                  : "border-tx-mute text-tx-dim hover:border-tx-ghost hover:text-tx"
              }`}
            >
              <EyeIcon /> {showPreview ? "Hide" : "Preview"}
            </button>
          </div>

          {/* Section Nav Pills */}
          <div className="flex gap-1.5 mb-7 flex-wrap">
            {sectionNav.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`px-4 py-[7px] rounded-full text-xs transition-all border ${
                  activeSection === s.id
                    ? "bg-gold/[0.08] border-gold/25 text-gold"
                    : "border-tx-mute text-tx-dim hover:text-tx-ghost"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* ─── HERO & BRANDING ─── */}
            <div
              id="section-hero"
              className="bg-bg-card border border-tx-mute rounded-xl p-6"
            >
              <h3 className="text-[15px] font-medium mb-1">Hero & Branding</h3>
              <p className="text-xs text-tx-dim mb-5">
                The enter gate background image and mission statement
              </p>

              {/* Hero upload */}
              <div className="mb-5">
                <label className="text-[10px] tracking-[2px] uppercase text-tx-ghost block mb-1.5">
                  Enter Gate Hero Image
                </label>
                <div className="border border-dashed border-tx-mute rounded-xl p-6 hover:border-tx-ghost transition-colors">
                  {heroPreview ? (
                    <div className="mb-4 relative">
                      <img
                        src={heroPreview}
                        alt="Hero"
                        className="max-h-40 mx-auto object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setHeroPreview("");
                          setHeroFile(null);
                          update("heroImage", "");
                        }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white/70 hover:text-white flex items-center justify-center text-xs transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 mb-3">
                      <div className="text-tx-dim">
                        <UploadIcon />
                      </div>
                      <div className="text-sm text-tx-dim">
                        Click to upload hero image
                      </div>
                      <div className="text-xs text-tx-ghost">
                        Recommended: 1920×1080 or larger
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroSelect}
                    className="text-sm text-tx-ghost file:mr-4 file:py-2 file:px-4 file:border file:border-tx-mute file:rounded-md file:text-[10px] file:font-semibold file:tracking-[1.5px] file:uppercase file:bg-bg-elevated file:text-tx hover:file:bg-gold-dim file:transition-colors file:cursor-pointer"
                  />
                </div>
              </div>

              {/* Mission */}
              <div>
                <label className="text-[10px] tracking-[2px] uppercase text-tx-ghost block mb-1.5">
                  Mission Statement
                </label>
                <textarea
                  value={form.missionText}
                  onChange={(e) => update("missionText", e.target.value)}
                  rows={2}
                  className="w-full bg-[#0e0e0e] border border-tx-mute rounded-lg px-3.5 py-2.5 text-sm text-tx outline-none focus:border-gold transition-colors resize-y leading-relaxed"
                />
                <p className="text-[11px] text-tx-ghost mt-1">
                  Shown on the homepage enter gate
                </p>
              </div>
            </div>

            {/* ─── ABOUT PAGE ─── */}
            <div
              id="section-about"
              className="bg-bg-card border border-tx-mute rounded-xl p-6"
            >
              <h3 className="text-[15px] font-medium mb-1">About Page</h3>
              <p className="text-xs text-tx-dim mb-5">
                Your bio heading and paragraphs for the /about page
              </p>

              <div className="mb-4">
                <label className="text-[10px] tracking-[2px] uppercase text-tx-ghost block mb-1.5">
                  About Heading
                </label>
                <input
                  type="text"
                  value={form.aboutHeading}
                  onChange={(e) => update("aboutHeading", e.target.value)}
                  placeholder="e.g. A filmmaker telling stories that matter."
                  className="w-full bg-[#0e0e0e] border border-tx-mute rounded-lg px-3.5 py-2.5 text-sm text-tx outline-none focus:border-gold transition-colors"
                />
              </div>

              <div className="mb-4">
                <label className="text-[10px] tracking-[2px] uppercase text-tx-ghost block mb-1.5">
                  About — Paragraph 1
                </label>
                <textarea
                  value={form.aboutPara1}
                  onChange={(e) => update("aboutPara1", e.target.value)}
                  rows={4}
                  placeholder="Your first bio paragraph..."
                  className="w-full bg-[#0e0e0e] border border-tx-mute rounded-lg px-3.5 py-2.5 text-sm text-tx outline-none focus:border-gold transition-colors resize-y leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[10px] tracking-[2px] uppercase text-tx-ghost block mb-1.5">
                  About — Paragraph 2
                </label>
                <textarea
                  value={form.aboutPara2}
                  onChange={(e) => update("aboutPara2", e.target.value)}
                  rows={4}
                  placeholder="Your second bio paragraph..."
                  className="w-full bg-[#0e0e0e] border border-tx-mute rounded-lg px-3.5 py-2.5 text-sm text-tx outline-none focus:border-gold transition-colors resize-y leading-relaxed"
                />
              </div>
            </div>

            {/* ─── DETAILS GRID ─── */}
            <div
              id="section-details"
              className="bg-bg-card border border-tx-mute rounded-xl p-6"
            >
              <h3 className="text-[15px] font-medium mb-1">Details Grid</h3>
              <p className="text-xs text-tx-dim mb-5">
                The four info blocks displayed on your about page
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] tracking-[2px] uppercase text-tx-ghost mb-1.5 flex items-center gap-1.5">
                    <MapPinIcon /> Based In
                  </label>
                  <input
                    value={form.basedIn}
                    onChange={(e) => update("basedIn", e.target.value)}
                    className="w-full bg-[#0e0e0e] border border-tx-mute rounded-lg px-3.5 py-2.5 text-sm text-tx outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-[2px] uppercase text-tx-ghost mb-1.5 flex items-center gap-1.5">
                    <BookIcon /> Education
                  </label>
                  <textarea
                    value={form.education}
                    onChange={(e) => update("education", e.target.value)}
                    rows={2}
                    className="w-full bg-[#0e0e0e] border border-tx-mute rounded-lg px-3.5 py-2.5 text-sm text-tx outline-none focus:border-gold transition-colors resize-y leading-relaxed"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-[2px] uppercase text-tx-ghost mb-1.5 flex items-center gap-1.5">
                    <TargetIcon /> Focus
                  </label>
                  <textarea
                    value={form.focus}
                    onChange={(e) => update("focus", e.target.value)}
                    rows={2}
                    className="w-full bg-[#0e0e0e] border border-tx-mute rounded-lg px-3.5 py-2.5 text-sm text-tx outline-none focus:border-gold transition-colors resize-y leading-relaxed"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-[2px] uppercase text-tx-ghost mb-1.5 flex items-center gap-1.5">
                    <GlobeIcon /> Heritage
                  </label>
                  <textarea
                    value={form.heritage}
                    onChange={(e) => update("heritage", e.target.value)}
                    rows={2}
                    className="w-full bg-[#0e0e0e] border border-tx-mute rounded-lg px-3.5 py-2.5 text-sm text-tx outline-none focus:border-gold transition-colors resize-y leading-relaxed"
                  />
                </div>
              </div>
              <p className="text-[11px] text-tx-ghost mt-3">
                Use line breaks to separate multiple items
              </p>
            </div>

            {/* ─── SOCIAL LINKS ─── */}
            <div
              id="section-social"
              className="bg-bg-card border border-tx-mute rounded-xl p-6"
            >
              <h3 className="text-[15px] font-medium mb-1">Social Links</h3>
              <p className="text-xs text-tx-dim mb-5">
                Your social media profiles — shown in the navbar and footer
              </p>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] tracking-[2px] uppercase text-tx-ghost mb-1.5 flex items-center gap-1.5">
                    <InstagramIcon /> Instagram
                  </label>
                  <input
                    type="url"
                    value={form.instagram}
                    onChange={(e) => update("instagram", e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="w-full bg-[#0e0e0e] border border-tx-mute rounded-lg px-3.5 py-2.5 text-sm text-tx outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-[2px] uppercase text-tx-ghost mb-1.5 flex items-center gap-1.5">
                    <VimeoIcon /> Vimeo
                  </label>
                  <input
                    type="url"
                    value={form.vimeo}
                    onChange={(e) => update("vimeo", e.target.value)}
                    placeholder="https://vimeo.com/..."
                    className="w-full bg-[#0e0e0e] border border-tx-mute rounded-lg px-3.5 py-2.5 text-sm text-tx outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-[2px] uppercase text-tx-ghost mb-1.5 flex items-center gap-1.5">
                    <YoutubeIcon /> YouTube
                  </label>
                  <input
                    type="url"
                    value={form.youtube}
                    onChange={(e) => update("youtube", e.target.value)}
                    placeholder="https://youtube.com/@..."
                    className="w-full bg-[#0e0e0e] border border-tx-mute rounded-lg px-3.5 py-2.5 text-sm text-tx outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4 pt-2 pb-8">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 bg-gold text-bg text-[11px] font-semibold tracking-[1.5px] uppercase rounded-lg hover:bg-gold/85 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Settings"}
              </button>
              {saved && (
                <span className="flex items-center gap-1.5 text-green-400 text-sm animate-fade-in-up">
                  <CheckIcon /> Settings saved
                </span>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* ═══ RIGHT: LIVE PREVIEW ═══ */}
      {showPreview && (
        <div className="w-[45%] overflow-auto bg-[#080808] flex flex-col">
          {/* Preview Header */}
          <div className="sticky top-0 z-10 px-6 py-3 border-b border-tx-mute bg-[#0a0a0a]/90 backdrop-blur-xl flex items-center gap-2">
            <EyeIcon />
            <span className="text-[11px] tracking-[2px] uppercase text-tx-ghost">
              Live Preview — /about
            </span>
          </div>

          {/* Preview Content */}
          <div className="flex-1 p-8">
            {/* About Heading */}
            <div className="mb-9">
              <div className="text-[9px] tracking-[4px] uppercase text-gold mb-3">
                About
              </div>
              <h2 className="font-serif text-[26px] font-normal leading-snug">
                {form.aboutHeading || (
                  <span className="text-tx-ghost italic">
                    Your heading here...
                  </span>
                )}
              </h2>
            </div>

            {/* Bio Paragraphs */}
            <div className="mb-9">
              {form.aboutPara1 ? (
                <p className="text-sm leading-[1.8] text-tx-dim mb-4">
                  {form.aboutPara1}
                </p>
              ) : null}
              {form.aboutPara2 ? (
                <p className="text-sm leading-[1.8] text-tx-dim">
                  {form.aboutPara2}
                </p>
              ) : null}
              {!form.aboutPara1 && !form.aboutPara2 && (
                <p className="text-sm text-tx-ghost italic">
                  Add your bio paragraphs in the form…
                </p>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-5 py-7 border-t border-tx-mute">
              {[
                {
                  label: "Based In",
                  value: form.basedIn,
                  icon: <MapPinIcon />,
                },
                {
                  label: "Education",
                  value: form.education,
                  icon: <BookIcon />,
                },
                { label: "Focus", value: form.focus, icon: <TargetIcon /> },
                {
                  label: "Heritage",
                  value: form.heritage,
                  icon: <GlobeIcon />,
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-[9px] tracking-[3px] uppercase text-tx-ghost mb-2 flex items-center gap-1.5">
                    {item.icon} {item.label}
                  </div>
                  <div className="text-sm text-tx whitespace-pre-line leading-relaxed">
                    {item.value || (
                      <span className="text-tx-ghost italic">Not set</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex gap-5 pt-6 border-t border-tx-mute">
              {form.instagram && (
                <span className="flex items-center gap-1.5 text-xs text-tx-dim">
                  <InstagramIcon /> Instagram
                </span>
              )}
              {form.vimeo && (
                <span className="flex items-center gap-1.5 text-xs text-tx-dim">
                  <VimeoIcon /> Vimeo
                </span>
              )}
              {form.youtube && (
                <span className="flex items-center gap-1.5 text-xs text-tx-dim">
                  <YoutubeIcon /> YouTube
                </span>
              )}
              {!form.instagram && !form.vimeo && !form.youtube && (
                <span className="text-xs text-tx-ghost italic">
                  No social links added
                </span>
              )}
            </div>
          </div>

          {/* Preview Footer */}
          <div className="px-6 py-3 border-t border-tx-mute text-[11px] text-tx-ghost text-center">
            Preview updates live as you type
          </div>
        </div>
      )}
    </div>
  );
}