"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export default function SettingsAdmin() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState("");
  const [form, setForm] = useState({
    heroImage: "",
    missionText: "I make films for my family and create stories for my people.",
    aboutHeading: "A Dominican-Puerto Rican filmmaker telling stories that matter.",
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

  function handleHeroSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroFile(file);
    setHeroPreview(URL.createObjectURL(file));
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
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Error saving settings");
    } finally {
      setSaving(false);
    }
  }

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl font-semibold mb-8">Site Settings</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Hero Image */}
        <div>
          <label className="text-[10px] font-bold tracking-[3px] uppercase text-tx-ghost block mb-2">
            Enter Gate Hero Image
          </label>
          <div className="border border-tx-mute border-dashed p-6 text-center">
            {heroPreview && (
              <img src={heroPreview} alt="Hero" className="max-h-48 mx-auto object-cover mb-3" />
            )}
            <input type="file" accept="image/*" onChange={handleHeroSelect}
              className="text-sm text-tx-ghost file:mr-4 file:py-2 file:px-4 file:border file:border-tx-mute file:text-[10px] file:font-bold file:tracking-[2px] file:uppercase file:bg-bg-elevated file:text-tx hover:file:bg-gold-dim file:transition-colors file:cursor-pointer"
            />
          </div>
        </div>

        {/* Mission */}
        <div>
          <label className="text-[10px] font-bold tracking-[3px] uppercase text-tx-ghost block mb-2">
            Mission Statement
          </label>
          <textarea value={form.missionText} onChange={(e) => update("missionText", e.target.value)}
            rows={2}
            className="w-full bg-bg-elevated border border-tx-mute px-4 py-3 text-sm text-tx outline-none focus:border-gold transition-colors resize-none"
          />
        </div>

        {/* About */}
        <div>
          <label className="text-[10px] font-bold tracking-[3px] uppercase text-tx-ghost block mb-2">
            About Heading
          </label>
          <input type="text" value={form.aboutHeading} onChange={(e) => update("aboutHeading", e.target.value)}
            className="w-full bg-bg-elevated border border-tx-mute px-4 py-3 text-sm text-tx outline-none focus:border-gold transition-colors"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold tracking-[3px] uppercase text-tx-ghost block mb-2">
            About Paragraph 1
          </label>
          <textarea value={form.aboutPara1} onChange={(e) => update("aboutPara1", e.target.value)} rows={3}
            className="w-full bg-bg-elevated border border-tx-mute px-4 py-3 text-sm text-tx outline-none focus:border-gold transition-colors resize-none"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold tracking-[3px] uppercase text-tx-ghost block mb-2">
            About Paragraph 2
          </label>
          <textarea value={form.aboutPara2} onChange={(e) => update("aboutPara2", e.target.value)} rows={3}
            className="w-full bg-bg-elevated border border-tx-mute px-4 py-3 text-sm text-tx outline-none focus:border-gold transition-colors resize-none"
          />
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4">
          {["basedIn", "education", "focus", "heritage"].map((field) => (
            <div key={field}>
              <label className="text-[10px] font-bold tracking-[3px] uppercase text-tx-ghost block mb-2">
                {field.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <textarea
                value={(form as any)[field]}
                onChange={(e) => update(field, e.target.value)}
                rows={2}
                className="w-full bg-bg-elevated border border-tx-mute px-4 py-3 text-sm text-tx outline-none focus:border-gold transition-colors resize-none"
              />
            </div>
          ))}
        </div>

        {/* Social links */}
        <div>
          <label className="text-[10px] font-bold tracking-[3px] uppercase text-tx-ghost block mb-2">
            Social Links
          </label>
          <div className="flex flex-col gap-3">
            {["instagram", "vimeo", "youtube"].map((field) => (
              <input
                key={field}
                type="url"
                value={(form as any)[field]}
                onChange={(e) => update(field, e.target.value)}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1) + " URL"}
                className="w-full bg-bg-elevated border border-tx-mute px-4 py-3 text-sm text-tx outline-none focus:border-gold transition-colors"
              />
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4 items-center pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-gold text-bg text-[10px] font-bold tracking-[4px] uppercase px-8 py-4 hover:bg-gold/80 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
          {saved && (
            <span className="text-green-400 text-sm">✓ Settings saved</span>
          )}
        </div>
      </form>
    </div>
  );
}