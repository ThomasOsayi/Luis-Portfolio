"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useRouter, useSearchParams } from "next/navigation";

/* ───────── constants ───────── */
const categories = [
  { value: "music-video", label: "Music Video" },
  { value: "film", label: "Short Film" },
  { value: "documentary", label: "Documentary" },
];

/* ───────── icons ───────── */
function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
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
function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none">
      <polygon points="8 5 19 12 8 19 8 5" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
function VideoUploadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}
function FilmIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
      <line x1="17" y1="17" x2="22" y2="17" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ═══════════════════════════════════════
   ADD / EDIT PROJECT — SPLIT VIEW
   ═══════════════════════════════════════ */
export default function NewProject() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [saving, setSaving] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(!!editId);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [previewMode, setPreviewMode] = useState<"card" | "detail">("card");

  const [autoThumbnail, setAutoThumbnail] = useState("");

  // Video upload state
  const [videoSource, setVideoSource] = useState<"url" | "upload">("url");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "music-video",
    categoryLabel: "Music Video",
    subtitle: "",
    description: "",
    role: "Director",
    videoUrl: "",
    imageUrl: "",
    gradient: "",
    hasVideo: true,
    featured: false,
    order: 0,
  });

  // Extract YouTube video ID from various URL formats
  function extractYouTubeId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  // Auto-fetch YouTube thumbnail when video URL changes
  function handleVideoUrlChange(url: string) {
    setForm((p) => ({ ...p, videoUrl: url }));
    const ytId = extractYouTubeId(url);
    if (ytId) {
      const thumbUrl = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
      const fallbackUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      const img = new Image();
      img.onload = () => {
        if (img.naturalWidth > 200) {
          setAutoThumbnail(thumbUrl);
          if (!imagePreview && !form.imageUrl) {
            setImagePreview(thumbUrl);
          }
        } else {
          setAutoThumbnail(fallbackUrl);
          if (!imagePreview && !form.imageUrl) {
            setImagePreview(fallbackUrl);
          }
        }
      };
      img.onerror = () => {
        setAutoThumbnail(fallbackUrl);
        if (!imagePreview && !form.imageUrl) {
          setImagePreview(fallbackUrl);
        }
      };
      img.src = thumbUrl;
    } else {
      setAutoThumbnail("");
    }
  }

  // Handle video file selection
  function handleVideoFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate file type
    if (!file.type.startsWith("video/")) {
      alert("Please select a video file (MP4, MOV, WebM, etc.)");
      return;
    }
    // Warn if file is very large
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > 500) {
      alert("File is over 500MB. Consider compressing it first for faster upload.");
      return;
    }
    setVideoFile(file);
    setForm((p) => ({ ...p, hasVideo: true }));
  }

  // Detect if a videoUrl is a direct file (not YouTube/Vimeo)
  function isDirectVideoUrl(url: string): boolean {
    if (!url) return false;
    const ytId = extractYouTubeId(url);
    if (ytId) return false;
    if (url.includes("vimeo.com")) return false;
    // Firebase Storage URLs or direct file URLs
    if (url.includes("firebasestorage.googleapis.com")) return true;
    if (/\.(mp4|mov|webm|avi|mkv)(\?|$)/i.test(url)) return true;
    return false;
  }

  // Load existing project when editing
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
          role: data.role || "",
          videoUrl: data.videoUrl || "",
          imageUrl: data.imageUrl || "",
          gradient: data.gradient || "",
          hasVideo: data.hasVideo ?? data.isVideo ?? true,
          featured: data.featured ?? data.isFeatured ?? false,
          order: data.order ?? 0,
        });
        if (data.imageUrl) setImagePreview(data.imageUrl);

        // Detect if existing video is uploaded vs URL
        if (data.videoUrl && isDirectVideoUrl(data.videoUrl)) {
          setVideoSource("upload");
        }

        // Auto-detect YouTube thumbnail if project has a video URL
        const ytId = (() => {
          const url = data.videoUrl || "";
          const patterns = [
            /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
            /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
            /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
            /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
          ];
          for (const p of patterns) {
            const m = url.match(p);
            if (m) return m[1];
          }
          return null;
        })();
        if (ytId) {
          setAutoThumbnail(
            `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
          );
        }
      }
      setLoadingEdit(false);
    }
    load();
  }, [editId]);

  function handleCategoryChange(value: string) {
    const cat = categories.find((c) => c.value === value);
    setForm((prev) => ({
      ...prev,
      category: value,
      categoryLabel: cat?.label || value,
    }));
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setAutoThumbnail("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) return alert("Title is required");
    setSaving(true);

    try {
      let imageUrl = form.imageUrl;
      let videoUrl = form.videoUrl;

      // Upload image if new file selected
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const storageRef = ref(storage, `projects/${fileName}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Upload video if new file selected
      if (videoFile) {
        setVideoUploading(true);
        setVideoUploadProgress("Uploading video…");
        const ext = videoFile.name.split(".").pop() || "mp4";
        const fileName = `video-${Date.now()}.${ext}`;
        const storageRef = ref(storage, `projects/videos/${fileName}`);
        await uploadBytes(storageRef, videoFile);
        videoUrl = await getDownloadURL(storageRef);
        setVideoUploading(false);
        setVideoUploadProgress("");
      }

      const projectData = {
        title: form.title,
        category: form.category,
        categoryLabel: form.categoryLabel,
        subtitle: form.subtitle,
        description: form.description,
        role: form.role,
        videoUrl,
        imageUrl,
        gradient: form.gradient,
        hasVideo: form.hasVideo,
        featured: form.featured,
        order: form.order,
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
      setVideoUploading(false);
      setVideoUploadProgress("");
    } finally {
      setSaving(false);
    }
  }

  // Fallback gradient for preview
  const previewBg = imagePreview
    ? `url(${imagePreview}) center/cover`
    : autoThumbnail
    ? `url(${autoThumbnail}) center/cover`
    : form.gradient
    ? undefined
    : "linear-gradient(135deg, #1b1f35, #0f1428, #1e2444)";

  if (loadingEdit) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-tx-dim text-sm tracking-widest uppercase">
          Loading project…
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-130px)] overflow-hidden -m-8">
      {/* ═══ LEFT: FORM PANEL ═══ */}
      <div className="w-1/2 overflow-auto p-8 border-r border-tx-mute">
        {/* Back + Title */}
        <div className="flex items-center gap-3 mb-7">
          <button
            onClick={() => router.push("/admin/projects")}
            className="w-[34px] h-[34px] rounded-lg border border-tx-mute flex items-center justify-center text-tx-dim hover:border-tx-ghost hover:text-tx transition-colors"
          >
            <BackIcon />
          </button>
          <div>
            <h1 className="font-serif text-[22px] font-normal tracking-wide">
              {editId ? "Edit Project" : "New Project"}
            </h1>
            <p className="text-xs text-tx-dim mt-0.5">
              {editId ? form.title || "Loading…" : "Fill in the details below"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="text-[10px] tracking-[2px] uppercase text-tx-ghost block mb-1.5">
              Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="e.g. Luquis — Revolucionario"
              className="w-full bg-[#0e0e0e] border border-tx-mute rounded-lg px-3.5 py-2.5 text-sm text-tx outline-none focus:border-gold transition-colors"
            />
          </div>

          {/* Category + Role row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] tracking-[2px] uppercase text-tx-ghost block mb-1.5">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-[#0e0e0e] border border-tx-mute rounded-lg px-3.5 py-2.5 text-sm text-tx outline-none focus:border-gold transition-colors appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A8478' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                }}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] tracking-[2px] uppercase text-tx-ghost block mb-1.5">
                Your Role
              </label>
              <input
                type="text"
                value={form.role}
                onChange={(e) =>
                  setForm((p) => ({ ...p, role: e.target.value }))
                }
                placeholder="e.g. Director"
                className="w-full bg-[#0e0e0e] border border-tx-mute rounded-lg px-3.5 py-2.5 text-sm text-tx outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>

          {/* Subtitle */}
          <div>
            <label className="text-[10px] tracking-[2px] uppercase text-tx-ghost block mb-1.5">
              Subtitle
            </label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) =>
                setForm((p) => ({ ...p, subtitle: e.target.value }))
              }
              placeholder="e.g. Official Video · Director"
              className="w-full bg-[#0e0e0e] border border-tx-mute rounded-lg px-3.5 py-2.5 text-sm text-tx outline-none focus:border-gold transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] tracking-[2px] uppercase text-tx-ghost block mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Brief description of the project..."
              rows={3}
              className="w-full bg-[#0e0e0e] border border-tx-mute rounded-lg px-3.5 py-2.5 text-sm text-tx outline-none focus:border-gold transition-colors resize-y leading-relaxed"
            />
          </div>

          {/* ─── VIDEO SECTION ─── */}
          <div>
            <label className="text-[10px] tracking-[2px] uppercase text-tx-ghost block mb-2">
              Video
            </label>

            {/* Source toggle */}
            <div className="flex gap-0.5 bg-[#0e0e0e] rounded-lg p-0.5 mb-3 w-fit border border-tx-mute">
              <button
                type="button"
                onClick={() => setVideoSource("url")}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-[11px] rounded-md transition-all ${
                  videoSource === "url"
                    ? "bg-bg-elevated text-tx border border-tx-mute"
                    : "text-tx-ghost hover:text-tx-dim border border-transparent"
                }`}
              >
                <LinkIcon /> Paste URL
              </button>
              <button
                type="button"
                onClick={() => setVideoSource("upload")}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-[11px] rounded-md transition-all ${
                  videoSource === "upload"
                    ? "bg-bg-elevated text-tx border border-tx-mute"
                    : "text-tx-ghost hover:text-tx-dim border border-transparent"
                }`}
              >
                <VideoUploadIcon /> Upload File
              </button>
            </div>

            {videoSource === "url" ? (
              /* URL input */
              <div>
                <input
                  type="url"
                  value={form.videoUrl}
                  onChange={(e) => handleVideoUrlChange(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                  className="w-full bg-[#0e0e0e] border border-tx-mute rounded-lg px-3.5 py-2.5 text-sm text-tx outline-none focus:border-gold transition-colors"
                />
                <p className="text-[11px] text-tx-ghost mt-1.5">
                  YouTube or Vimeo links — thumbnail auto-detected
                </p>
              </div>
            ) : (
              /* File upload */
              <div>
                {/* Show existing uploaded video */}
                {form.videoUrl && isDirectVideoUrl(form.videoUrl) && !videoFile && (
                  <div className="mb-3 border border-green-400/20 rounded-xl p-4 bg-green-400/[0.03]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-green-400"><CheckIcon /></span>
                      <span className="text-xs text-green-400 font-medium">
                        Video uploaded
                      </span>
                    </div>
                    <p className="text-[11px] text-tx-dim truncate">
                      {form.videoUrl.split("/").pop()?.split("?")[0] || "video file"}
                    </p>
                  </div>
                )}

                {/* New file selected */}
                {videoFile && (
                  <div className="mb-3 border border-gold/20 rounded-xl p-4 bg-gold/[0.03]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-gold"><FilmIcon /></span>
                        <div>
                          <p className="text-xs text-tx font-medium truncate max-w-[240px]">
                            {videoFile.name}
                          </p>
                          <p className="text-[11px] text-tx-dim">
                            {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setVideoFile(null)}
                        className="w-6 h-6 rounded-full bg-black/40 text-white/60 hover:text-white flex items-center justify-center text-xs transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload area */}
                {!videoFile && (
                  <label className="block cursor-pointer">
                    <div className="border border-dashed border-tx-mute rounded-xl p-6 hover:border-tx-ghost transition-colors flex flex-col items-center gap-2">
                      <span className="text-tx-dim"><UploadIcon /></span>
                      <p className="text-sm text-tx-dim">Click to upload video</p>
                      <p className="text-xs text-tx-ghost">
                        MP4, MOV, WebM · Up to 500MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileSelect}
                      className="hidden"
                    />
                  </label>
                )}

                <p className="text-[11px] text-tx-ghost mt-1.5">
                  Video will be uploaded to Firebase Storage on save
                </p>
              </div>
            )}
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="text-[10px] tracking-[2px] uppercase text-tx-ghost block mb-1.5">
              Thumbnail Image
            </label>

            {/* Auto YouTube thumbnail detected */}
            {autoThumbnail && !imageFile && (
              <div className="mb-3 border border-gold/20 rounded-xl p-4 bg-gold/[0.03]">
                <div className="flex items-center gap-2 mb-2.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" strokeLinecap="round" strokeLinejoin="round"/>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none"/>
                  </svg>
                  <span className="text-xs text-gold font-medium">
                    YouTube thumbnail detected
                  </span>
                </div>
                <img
                  src={autoThumbnail}
                  alt="YouTube thumbnail"
                  className="w-full max-h-36 object-cover rounded-lg mb-3"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(autoThumbnail);
                    setForm((p) => ({ ...p, imageUrl: autoThumbnail }));
                  }}
                  className="text-[10px] tracking-[1.5px] uppercase font-semibold px-4 py-2 bg-gold text-bg rounded-md hover:bg-gold/85 transition-colors"
                >
                  Use This Thumbnail
                </button>
                <span className="text-[11px] text-tx-ghost ml-3">
                  or upload your own below
                </span>
              </div>
            )}

            <div className="border border-dashed border-tx-mute rounded-xl p-6 hover:border-tx-ghost transition-colors">
              {imagePreview ? (
                <div className="mb-4 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-40 mx-auto object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview("");
                      setImageFile(null);
                      setForm((p) => ({ ...p, imageUrl: "" }));
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
                    Click to upload or drag & drop
                  </div>
                  <div className="text-xs text-tx-ghost">
                    JPG, PNG up to 5MB
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="text-sm text-tx-ghost file:mr-4 file:py-2 file:px-4 file:border file:border-tx-mute file:rounded-md file:text-[10px] file:font-semibold file:tracking-[1.5px] file:uppercase file:bg-bg-elevated file:text-tx hover:file:bg-gold-dim file:transition-colors file:cursor-pointer"
              />
            </div>
          </div>

          {/* Toggle switches */}
          <div className="flex gap-8">
            {/* Featured */}
            <label className="flex items-center gap-3 cursor-pointer text-sm">
              <button
                type="button"
                onClick={() =>
                  setForm((p) => ({ ...p, featured: !p.featured }))
                }
                className={`relative w-[38px] h-[22px] rounded-full transition-colors ${
                  form.featured ? "bg-gold" : "bg-tx-mute"
                }`}
              >
                <span
                  className="absolute top-[3px] w-4 h-4 rounded-full bg-white transition-all"
                  style={{ left: form.featured ? 19 : 3 }}
                />
              </button>
              <span className="text-tx-dim">Featured</span>
            </label>
            {/* Has Video */}
            <label className="flex items-center gap-3 cursor-pointer text-sm">
              <button
                type="button"
                onClick={() =>
                  setForm((p) => ({ ...p, hasVideo: !p.hasVideo }))
                }
                className={`relative w-[38px] h-[22px] rounded-full transition-colors ${
                  form.hasVideo ? "bg-gold" : "bg-tx-mute"
                }`}
              >
                <span
                  className="absolute top-[3px] w-4 h-4 rounded-full bg-white transition-all"
                  style={{ left: form.hasVideo ? 19 : 3 }}
                />
              </button>
              <span className="text-tx-dim">Has Video</span>
            </label>
          </div>

          {/* Display Order */}
          <div className="max-w-[120px]">
            <label className="text-[10px] tracking-[2px] uppercase text-tx-ghost block mb-1.5">
              Display Order
            </label>
            <input
              type="number"
              value={form.order}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  order: parseInt(e.target.value) || 0,
                }))
              }
              className="w-full bg-[#0e0e0e] border border-tx-mute rounded-lg px-3.5 py-2.5 text-sm text-tx outline-none focus:border-gold transition-colors text-center"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2 pb-8">
            <button
              type="submit"
              disabled={saving || videoUploading}
              className="px-7 py-3 bg-gold text-bg text-[11px] font-semibold tracking-[1.5px] uppercase rounded-lg hover:bg-gold/85 transition-colors disabled:opacity-50"
            >
              {videoUploading
                ? "Uploading video…"
                : saving
                ? "Saving…"
                : editId
                ? "Save Changes"
                : "Add Project"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/projects")}
              className="px-7 py-3 border border-tx-mute text-tx-dim text-[11px] font-medium tracking-[1.5px] uppercase rounded-lg hover:border-tx-ghost hover:text-tx transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* ═══ RIGHT: LIVE PREVIEW PANEL ═══ */}
      <div className="w-1/2 overflow-auto bg-[#080808] flex flex-col">
        {/* Preview Header */}
        <div className="sticky top-0 z-10 px-6 py-3 border-b border-tx-mute bg-[#0a0a0a]/90 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EyeIcon />
            <span className="text-[11px] tracking-[2px] uppercase text-tx-ghost">
              Live Preview
            </span>
          </div>
          <div className="flex gap-0.5 bg-bg-card rounded-md p-0.5">
            {(["card", "detail"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setPreviewMode(m)}
                className={`px-3.5 py-1.5 text-[11px] rounded-[5px] transition-all ${
                  previewMode === m
                    ? "bg-bg-elevated text-tx"
                    : "text-tx-ghost hover:text-tx-dim"
                }`}
              >
                {m === "card" ? "Grid Card" : "Film Entry"}
              </button>
            ))}
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 flex items-center justify-center p-10">
          {previewMode === "card" ? (
            /* ─── Card Preview (Work grid) ─── */
            <div className="w-full max-w-[360px]">
              <p className="text-[10px] tracking-[2px] uppercase text-tx-ghost mb-3 text-center">
                As seen on /work
              </p>
              <div
                className="relative rounded-xl overflow-hidden border border-tx-mute"
                style={{
                  aspectRatio: "16/10",
                  background:
                    previewBg ||
                    "linear-gradient(135deg, #1b1f35, #0f1428, #1e2444)",
                }}
              >
                {/* Overlay */}
                <div
                  className="absolute inset-0 flex flex-col justify-end p-5"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
                  }}
                >
                  <p className="text-[9px] tracking-[2px] uppercase text-gold mb-1.5">
                    {form.categoryLabel || "Music Video"}
                  </p>
                  <p
                    className="font-serif text-xl font-medium text-white leading-tight mb-1"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    {form.title || "Project Title"}
                  </p>
                  {form.subtitle && (
                    <p className="text-xs text-white/60">{form.subtitle}</p>
                  )}
                </div>

                {/* Play button */}
                {form.hasVideo && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <PlayIcon />
                  </div>
                )}

                {/* Featured star */}
                {form.featured && (
                  <div className="absolute top-3 right-3 text-gold">
                    <StarIcon />
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ─── Film Entry Preview ─── */
            <div className="w-full max-w-[520px]">
              <p className="text-[10px] tracking-[2px] uppercase text-tx-ghost mb-4 text-center">
                As seen on /films
              </p>
              <div className="flex gap-6 items-start">
                {/* Thumbnail */}
                <div
                  className="w-[200px] shrink-0 rounded-lg border border-tx-mute flex items-center justify-center"
                  style={{
                    aspectRatio: "16/10",
                    background:
                      previewBg ||
                      "linear-gradient(135deg, #1b1f35, #0f1428, #1e2444)",
                  }}
                >
                  {form.hasVideo && (
                    <div className="w-9 h-9 rounded-full bg-white/12 backdrop-blur-sm border border-white/15 flex items-center justify-center">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <polygon points="8 5 19 12 8 19" />
                      </svg>
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 pt-1">
                  <p
                    className="font-serif text-[22px] font-medium mb-1 leading-tight"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    {form.title || "Project Title"}
                  </p>
                  {form.role && (
                    <p className="text-xs text-gold mb-2.5 tracking-wide">
                      {form.role}
                    </p>
                  )}
                  {form.description ? (
                    <p className="text-[13px] text-tx-dim leading-relaxed">
                      {form.description}
                    </p>
                  ) : (
                    <p className="text-[13px] text-tx-ghost italic">
                      No description — add one in the form
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview footer */}
        <div className="px-6 py-3 border-t border-tx-mute text-[11px] text-tx-ghost text-center">
          Preview updates live as you type · Toggle views above
        </div>
      </div>
    </div>
  );
}