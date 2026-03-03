"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

/* ───────── icons ───────── */
function GripIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="9" cy="6" r="1" />
      <circle cx="15" cy="6" r="1" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="9" cy="18" r="1" />
      <circle cx="15" cy="18" r="1" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
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
function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  );
}
function ImageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const layoutIcons: Record<string, React.ReactNode> = {
  normal: (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="14" height="14" rx="2" />
    </svg>
  ),
  tall: (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="1" width="10" height="18" rx="2" />
    </svg>
  ),
  wide: (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="5" width="18" height="10" rx="2" />
    </svg>
  ),
};

const layoutColors: Record<string, string> = {
  normal: "text-tx-dim border-tx-mute",
  tall: "text-gold border-gold/30",
  wide: "text-pink-400 border-pink-400/30",
};

/* ───────── types ───────── */
interface Photo {
  id: string;
  label: string;
  album: string;
  layout: string;
  imageUrl: string;
  order: number;
}

/* ═══════════════════════════════════════
   PHOTOGRAPHY ADMIN
   ═══════════════════════════════════════ */
export default function PhotographyAdmin() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [filterAlbum, setFilterAlbum] = useState("all");
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  // Add modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newAlbum, setNewAlbum] = useState("");
  const [newLayout, setNewLayout] = useState("normal");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newPreview, setNewPreview] = useState("");
  const [adding, setAdding] = useState(false);

  // Load photos
  useEffect(() => {
    fetchPhotos();
  }, []);

  async function fetchPhotos() {
    try {
      const q = query(collection(db, "photos"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      setPhotos(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Photo)));
    } catch (err) {
      console.error("Failed to fetch photos:", err);
    } finally {
      setLoading(false);
    }
  }

  // Album tabs
  const albums = ["all", ...Array.from(new Set(photos.map((p) => p.album)))];
  const albumCounts: Record<string, number> = { all: photos.length };
  albums.forEach((a) => {
    if (a !== "all")
      albumCounts[a] = photos.filter((p) => p.album === a).length;
  });
  const filtered =
    filterAlbum === "all"
      ? photos
      : photos.filter((p) => p.album === filterAlbum);

  // File select
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewFile(file);
    setNewPreview(URL.createObjectURL(file));
  }

  // Add photo
  async function handleAdd() {
    if (!newLabel.trim()) return;
    setAdding(true);

    try {
      let imageUrl = "";

      if (newFile) {
        const fileName = `photo-${Date.now()}.${newFile.name.split(".").pop()}`;
        const storageRef = ref(storage, `photos/${fileName}`);
        await uploadBytes(storageRef, newFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "photos"), {
        label: newLabel.trim(),
        album: newAlbum.trim() || "Uncategorized",
        layout: newLayout,
        imageUrl,
        order: photos.length,
        createdAt: serverTimestamp(),
      });

      // Reset & refresh
      setNewLabel("");
      setNewAlbum("");
      setNewLayout("normal");
      setNewFile(null);
      setNewPreview("");
      setShowAddModal(false);
      fetchPhotos();
    } catch (err) {
      console.error("Failed to add photo:", err);
      alert("Error adding photo");
    } finally {
      setAdding(false);
    }
  }

  // Delete photo
  async function handleDelete(id: string) {
    if (!confirm("Delete this photo?")) return;
    try {
      await deleteDoc(doc(db, "photos", id));
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete photo:", err);
    }
  }

  // Cycle layout
  async function cycleLayout(id: string) {
    const order = ["normal", "tall", "wide"];
    const photo = photos.find((p) => p.id === id);
    if (!photo) return;
    const idx = order.indexOf(photo.layout);
    const next = order[(idx + 1) % 3];

    try {
      await updateDoc(doc(db, "photos", id), { layout: next });
      setPhotos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, layout: next } : p))
      );
    } catch (err) {
      console.error("Failed to update layout:", err);
    }
  }

  // Drag-and-drop reorder
  async function handleReorder(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;
    const reordered = [...photos];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    const updated = reordered.map((p, i) => ({ ...p, order: i }));
    setPhotos(updated);

    try {
      const batch = writeBatch(db);
      updated.forEach((p) => {
        batch.update(doc(db, "photos", p.id), { order: p.order });
      });
      await batch.commit();
    } catch (err) {
      console.error("Failed to reorder:", err);
      fetchPhotos();
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-tx-dim text-sm tracking-widest uppercase">
          Loading…
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-130px)] overflow-hidden -m-8 animate-fade-in-up">
      {/* ═══ LEFT: PHOTO LIST ═══ */}
      <div
        className={`overflow-auto ${
          showPreview ? "w-[55%]" : "w-full"
        } border-r border-tx-mute`}
      >
        <div className="p-8" style={{ maxWidth: showPreview ? "100%" : 900 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-7">
            <div>
              <h1 className="font-serif text-[28px] font-normal tracking-wide mb-1">
                Photography
              </h1>
              <p className="text-tx-dim text-sm">
                {photos.length} photo{photos.length !== 1 ? "s" : ""} across{" "}
                {albums.length - 1} album{albums.length - 1 !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex gap-2">
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
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-5 py-2 bg-gold text-bg text-[11px] font-semibold tracking-[1.5px] uppercase rounded-lg hover:bg-gold/85 transition-colors"
              >
                <PlusIcon /> Add Photo
              </button>
            </div>
          </div>

          {/* Album Filter Tabs */}
          <div className="flex gap-1 mb-5 border-b border-tx-mute flex-wrap">
            {albums.map((a) => (
              <button
                key={a}
                onClick={() => setFilterAlbum(a)}
                className={`px-3.5 py-2 text-xs border-b-2 -mb-px transition-colors ${
                  filterAlbum === a
                    ? "border-gold text-gold"
                    : "border-transparent text-tx-ghost hover:text-tx-dim"
                }`}
              >
                {a === "all" ? "All" : a}
                <span className="text-tx-mute ml-1.5 text-[11px]">
                  {albumCounts[a]}
                </span>
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="border border-tx-mute rounded-xl overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-[28px_52px_1fr_100px_60px_70px] px-4 py-2.5 border-b border-tx-mute text-[9px] tracking-[2px] uppercase text-tx-ghost items-center bg-bg-card/50">
              <span />
              <span>Thumb</span>
              <span>Label / Album</span>
              <span>Layout</span>
              <span className="text-center">Order</span>
              <span />
            </div>

            {filtered.map((photo, i) => (
              <div
                key={photo.id}
                draggable={filterAlbum === "all"}
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverIndex(i);
                }}
                onDragEnd={() => {
                  if (
                    filterAlbum === "all" &&
                    dragIndex !== null &&
                    overIndex !== null
                  )
                    handleReorder(dragIndex, overIndex);
                  setDragIndex(null);
                  setOverIndex(null);
                }}
                onMouseEnter={() => setHoveredRow(photo.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`grid grid-cols-[28px_52px_1fr_100px_60px_70px] px-4 py-2.5 items-center transition-colors ${
                  i < filtered.length - 1 ? "border-b border-tx-mute" : ""
                } ${
                  overIndex === i && dragIndex !== null
                    ? "border-t-2 border-t-gold"
                    : ""
                } ${dragIndex === i ? "opacity-40" : ""} ${
                  hoveredRow === photo.id ? "bg-bg-card" : ""
                }`}
              >
                {/* Grip */}
                <span className="text-tx-mute cursor-grab active:cursor-grabbing">
                  <GripIcon />
                </span>

                {/* Thumbnail */}
                <div className="w-11 h-8 rounded-[5px] border border-tx-mute overflow-hidden flex items-center justify-center bg-bg-elevated">
                  {photo.imageUrl ? (
                    <img
                      src={photo.imageUrl}
                      alt={photo.label}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white/20">
                      <ImageIcon />
                    </span>
                  )}
                </div>

                {/* Label + Album */}
                <div className="min-w-0 pl-2">
                  <div className="text-[13px] font-medium truncate">
                    {photo.label}
                  </div>
                  <div className="text-[11px] text-tx-dim">{photo.album}</div>
                </div>

                {/* Layout toggle */}
                <div>
                  <button
                    onClick={() => cycleLayout(photo.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] tracking-[0.5px] transition-all ${
                      layoutColors[photo.layout] || layoutColors.normal
                    }`}
                  >
                    {layoutIcons[photo.layout]} {photo.layout}
                  </button>
                </div>

                {/* Order */}
                <div className="text-xs text-tx-dim text-center">
                  {photo.order}
                </div>

                {/* Actions */}
                <div
                  className={`flex gap-1 justify-end transition-opacity ${
                    hoveredRow === photo.id ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="w-[30px] h-[30px] rounded-md border border-tx-mute bg-bg-card text-tx-dim flex items-center justify-center hover:border-red-400 hover:text-red-400 transition-colors"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-tx-ghost text-sm">No photos in this album</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ RIGHT: GRID PREVIEW ═══ */}
      {showPreview && (
        <div className="w-[45%] overflow-auto bg-[#080808] flex flex-col">
          {/* Header */}
          <div className="sticky top-0 z-10 px-6 py-3 border-b border-tx-mute bg-[#0a0a0a]/90 backdrop-blur-xl flex items-center gap-2">
            <EyeIcon />
            <span className="text-[11px] tracking-[2px] uppercase text-tx-ghost">
              Live Preview — /photography
            </span>
          </div>

          {/* Grid */}
          <div className="flex-1 p-5">
            <div
              className="grid gap-[3px]"
              style={{
                gridTemplateColumns: "1fr 1fr 1fr",
                gridAutoRows: "120px",
              }}
            >
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative overflow-hidden rounded-sm"
                  style={{
                    gridRow:
                      photo.layout === "tall" ? "span 2" : "span 1",
                    gridColumn:
                      photo.layout === "wide" ? "span 2" : "span 1",
                  }}
                >
                  {photo.imageUrl ? (
                    <img
                      src={photo.imageUrl}
                      alt={photo.label}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1b1f35] via-[#0f1428] to-[#1e2444]" />
                  )}
                  <div className="absolute bottom-1.5 left-2 text-[8px] tracking-[1.5px] uppercase text-white/50">
                    {photo.label}
                  </div>
                  {photo.layout !== "normal" && (
                    <div
                      className={`absolute top-1 right-1 text-[7px] tracking-[1px] uppercase px-1.5 py-0.5 rounded ${
                        photo.layout === "tall"
                          ? "bg-gold/30 text-gold"
                          : "bg-pink-400/30 text-pink-400"
                      }`}
                    >
                      {photo.layout}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-tx-mute text-[11px] text-tx-ghost text-center">
            Grid preview · Click layout buttons to toggle tall/wide
          </div>
        </div>
      )}

      {/* ═══ ADD PHOTO MODAL ═══ */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setShowAddModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-bg-card border border-tx-mute rounded-2xl p-8 w-[460px] max-w-[90vw] animate-fade-in-up"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-serif text-[22px] font-normal">
                Add Photo
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-tx-ghost hover:text-tx transition-colors"
              >
                <XIcon />
              </button>
            </div>
            <p className="text-xs text-tx-dim mb-6">
              Upload a photo to the gallery
            </p>

            {/* Upload area */}
            <label className="block mb-5 cursor-pointer">
              <div className="border border-dashed border-tx-mute rounded-xl p-7 hover:border-tx-ghost transition-colors">
                {newPreview ? (
                  <div className="relative">
                    <img
                      src={newPreview}
                      alt="Preview"
                      className="max-h-40 mx-auto object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setNewFile(null);
                        setNewPreview("");
                      }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white/70 hover:text-white flex items-center justify-center text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-tx-dim">
                      <UploadIcon />
                    </span>
                    <span className="text-sm text-tx-dim">
                      Click to upload image
                    </span>
                    <span className="text-xs text-tx-ghost">
                      JPG, PNG up to 5MB
                    </span>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>

            {/* Label */}
            <div className="mb-4">
              <label className="text-[10px] tracking-[2px] uppercase text-tx-ghost block mb-1.5">
                Label
              </label>
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Residente · Live"
                className="w-full bg-[#0e0e0e] border border-tx-mute rounded-lg px-3.5 py-2.5 text-sm text-tx outline-none focus:border-gold transition-colors"
              />
            </div>

            {/* Album */}
            <div className="mb-4">
              <label className="text-[10px] tracking-[2px] uppercase text-tx-ghost block mb-1.5">
                Album
              </label>
              <input
                value={newAlbum}
                onChange={(e) => setNewAlbum(e.target.value)}
                placeholder="e.g. Residente, Dominican Republic"
                className="w-full bg-[#0e0e0e] border border-tx-mute rounded-lg px-3.5 py-2.5 text-sm text-tx outline-none focus:border-gold transition-colors"
              />
              <p className="text-[11px] text-tx-ghost mt-1">
                Photos are grouped by album in the filter tabs
              </p>
            </div>

            {/* Layout */}
            <div className="mb-6">
              <label className="text-[10px] tracking-[2px] uppercase text-tx-ghost block mb-2">
                Grid Layout
              </label>
              <div className="flex gap-2">
                {(["normal", "tall", "wide"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setNewLayout(l)}
                    className={`flex-1 py-2.5 rounded-lg border flex flex-col items-center gap-1.5 text-[11px] transition-all ${
                      newLayout === l
                        ? "border-gold/40 bg-gold/[0.06] text-gold"
                        : "border-tx-mute text-tx-dim hover:text-tx-ghost"
                    }`}
                  >
                    {layoutIcons[l]}
                    {l.charAt(0).toUpperCase() + l.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                disabled={adding || !newLabel.trim()}
                className="flex-1 py-3 bg-gold text-bg text-[11px] font-semibold tracking-[1.5px] uppercase rounded-lg hover:bg-gold/85 transition-colors disabled:opacity-50"
              >
                {adding ? "Uploading…" : "Add Photo"}
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-5 py-3 border border-tx-mute text-tx-dim text-[11px] tracking-[1.5px] uppercase rounded-lg hover:text-tx hover:border-tx-ghost transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}