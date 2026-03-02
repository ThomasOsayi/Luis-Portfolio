"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useRouter, useSearchParams } from "next/navigation";

const categories = [
  { value: "music-video", label: "Music Video" },
  { value: "film", label: "Short Film" },
  { value: "documentary", label: "Documentary" },
  { value: "photography", label: "Photography" },
];

export default function NewProject() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: "music-video",
    categoryLabel: "Music Video",
    subtitle: "",
    description: "",
    role: "Director",
    videoUrl: "",
    imageUrl: "",
    isVideo: true,
    isFeatured: false,
    order: 0,
  });

  // Load existing project if editing
  useEffect(() => {
    if (!editId) return;
    async function load() {
      const snap = await getDoc(doc(db, "projects", editId!));
      if (snap.exists()) {
        const data = snap.data();
        setForm({
          title: data.title || "",
          category: data.category || "music-video",
          categoryLabel: data.categoryLabel || "Music Video",
          subtitle: data.subtitle || "",
          description: data.description || "",
          role: data.role || "Director",
          videoUrl: data.videoUrl || "",
          imageUrl: data.imageUrl || "",
          isVideo: data.isVideo ?? true,
          isFeatured: data.isFeatured ?? false,
          order: data.order ?? 0,
        });
        if (data.imageUrl) setImagePreview(data.imageUrl);
      }
    }
    load();
  }, [editId]);

  function handleCategoryChange(value: string) {
    const cat = categories.find((c) => c.value === value);
    setForm((prev) => ({
      ...prev,
      category: value,
      categoryLabel: cat?.label || value,
      isVideo: value !== "photography",
    }));
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) return alert("Title is required");
    setSaving(true);

    try {
      let imageUrl = form.imageUrl;

      // Upload image if new file selected
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const storageRef = ref(storage, `projects/${fileName}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const projectData = {
        ...form,
        imageUrl,
        updatedAt: serverTimestamp(),
      };

      if (editId) {
        await updateDoc(doc(db, "projects", editId), projectData);
      } else {
        await addDoc(collection(db, "projects"), {
          ...projectData,
          createdAt: serverTimestamp(),
        });
      }

      router.push("/admin/projects");
    } catch (err) {
      console.error(err);
      alert("Error saving project");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl font-semibold mb-8">
        {editId ? "Edit Project" : "Add New Project"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Title */}
        <div>
          <label className="text-[10px] font-bold tracking-[3px] uppercase text-tx-ghost block mb-2">
            Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="e.g. Luquis — Revolucionario"
            className="w-full bg-bg-elevated border border-tx-mute px-4 py-3 text-sm text-tx outline-none focus:border-gold transition-colors"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-[10px] font-bold tracking-[3px] uppercase text-tx-ghost block mb-2">
            Category *
          </label>
          <select
            value={form.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full bg-bg-elevated border border-tx-mute px-4 py-3 text-sm text-tx outline-none focus:border-gold transition-colors"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Subtitle */}
        <div>
          <label className="text-[10px] font-bold tracking-[3px] uppercase text-tx-ghost block mb-2">
            Subtitle
          </label>
          <input
            type="text"
            value={form.subtitle}
            onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
            placeholder="e.g. Official Video · Director"
            className="w-full bg-bg-elevated border border-tx-mute px-4 py-3 text-sm text-tx outline-none focus:border-gold transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-[10px] font-bold tracking-[3px] uppercase text-tx-ghost block mb-2">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Brief description of the project..."
            rows={3}
            className="w-full bg-bg-elevated border border-tx-mute px-4 py-3 text-sm text-tx outline-none focus:border-gold transition-colors resize-none"
          />
        </div>

        {/* Role */}
        <div>
          <label className="text-[10px] font-bold tracking-[3px] uppercase text-tx-ghost block mb-2">
            Your Role
          </label>
          <input
            type="text"
            value={form.role}
            onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
            placeholder="Director"
            className="w-full bg-bg-elevated border border-tx-mute px-4 py-3 text-sm text-tx outline-none focus:border-gold transition-colors"
          />
        </div>

        {/* Video URL */}
        <div>
          <label className="text-[10px] font-bold tracking-[3px] uppercase text-tx-ghost block mb-2">
            Video URL (YouTube or Vimeo)
          </label>
          <input
            type="url"
            value={form.videoUrl}
            onChange={(e) => setForm((p) => ({ ...p, videoUrl: e.target.value }))}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full bg-bg-elevated border border-tx-mute px-4 py-3 text-sm text-tx outline-none focus:border-gold transition-colors"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="text-[10px] font-bold tracking-[3px] uppercase text-tx-ghost block mb-2">
            Thumbnail Image
          </label>
          <div className="border border-tx-mute border-dashed p-6 text-center">
            {imagePreview ? (
              <div className="mb-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 mx-auto object-cover"
                />
              </div>
            ) : null}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="text-sm text-tx-ghost file:mr-4 file:py-2 file:px-4 file:border file:border-tx-mute file:text-[10px] file:font-bold file:tracking-[2px] file:uppercase file:bg-bg-elevated file:text-tx hover:file:bg-gold-dim file:transition-colors file:cursor-pointer"
            />
          </div>
        </div>

        {/* Options row */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))}
              className="accent-gold"
            />
            <span className="text-sm text-tx-dim">Featured (full-width on Work page)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isVideo}
              onChange={(e) => setForm((p) => ({ ...p, isVideo: e.target.checked }))}
              className="accent-gold"
            />
            <span className="text-sm text-tx-dim">Has video</span>
          </label>
        </div>

        {/* Order */}
        <div>
          <label className="text-[10px] font-bold tracking-[3px] uppercase text-tx-ghost block mb-2">
            Display Order (0 = first)
          </label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))}
            className="w-24 bg-bg-elevated border border-tx-mute px-4 py-3 text-sm text-tx outline-none focus:border-gold transition-colors"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-gold text-bg text-[10px] font-bold tracking-[4px] uppercase px-8 py-4 hover:bg-gold/80 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : editId ? "Update Project" : "Add Project"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/projects")}
            className="border border-tx-mute text-tx-dim text-[10px] font-bold tracking-[4px] uppercase px-8 py-4 hover:border-tx-ghost transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}