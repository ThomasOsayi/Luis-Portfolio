"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

/* ───────── types ───────── */
interface Project {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  subtitle?: string;
  role?: string;
  order: number;
  featured: boolean;
  hasVideo: boolean;
  gradient?: string;
  imageUrl?: string;
}

/* ───────── constants ───────── */
const categoryOptions = [
  { value: "music-video", label: "Music Video" },
  { value: "film", label: "Short Film" },
  { value: "documentary", label: "Documentary" },
];

function catColor(c: string) {
  return c === "music-video"
    ? "text-gold bg-gold/8"
    : c === "film"
    ? "text-green-400 bg-green-400/8"
    : "text-indigo-400 bg-indigo-400/8";
}
function catDot(c: string) {
  return c === "music-video"
    ? "bg-gold"
    : c === "film"
    ? "bg-green-400"
    : "bg-indigo-400";
}

/* ───────── icons ───────── */
function GripIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="9" cy="6" r="1" /><circle cx="15" cy="6" r="1" />
      <circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" />
      <circle cx="9" cy="18" r="1" /><circle cx="15" cy="18" r="1" />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

/* ═══════════════════════════════════════
   PROJECTS LIST
   ═══════════════════════════════════════ */
export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  async function fetchProjects() {
    const q = query(collection(db, "projects"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    // Exclude photography — managed separately in /admin/photography
    const all = snap.docs
      .map((d) => ({ id: d.id, ...d.data() } as Project))
      .filter((p) => p.category !== "photography");
    setProjects(all);
    setLoading(false);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function handleDelete(e: React.MouseEvent, id: string, title: string) {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deleteDoc(doc(db, "projects", id));
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  // Filter + counts
  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.category === filter);
  const counts: Record<string, number> = { all: projects.length };
  categoryOptions.forEach((c) => {
    counts[c.value] = projects.filter((p) => p.category === c.value).length;
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <p className="text-tx-dim text-sm tracking-widest uppercase">
          Loading projects…
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif text-[28px] font-normal tracking-wide mb-1">
            Projects
          </h1>
          <p className="text-tx-dim text-sm">{projects.length} projects</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="admin-btn-primary flex items-center gap-2 px-5 py-2.5 bg-gold text-bg text-[11px] font-semibold tracking-[1.5px] uppercase rounded-lg hover:bg-gold/85 transition-colors"
        >
          <PlusIcon /> Add Project
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-6 border-b border-tx-mute">
        {[{ value: "all", label: "All" }, ...categoryOptions].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-4 py-2.5 text-xs tracking-wide transition-all -mb-px border-b-2 ${
              filter === opt.value
                ? "text-gold border-gold font-medium"
                : "text-tx-ghost border-transparent hover:text-tx-dim"
            }`}
          >
            {opt.label}
            <span className="text-tx-mute ml-1.5 text-[11px]">
              {counts[opt.value]}
            </span>
          </button>
        ))}
      </div>

      {/* Empty state */}
      {projects.length === 0 ? (
        <div className="border border-tx-mute rounded-xl p-12 text-center">
          <p className="text-tx-ghost mb-3">No projects yet</p>
          <Link
            href="/admin/projects/new"
            className="text-gold text-sm hover:underline"
          >
            Add your first project
          </Link>
        </div>
      ) : (
        /* Table */
        <div className="border border-tx-mute rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[36px_1fr_140px_100px_70px_90px] px-5 py-2.5 border-b border-tx-mute text-[9px] tracking-[2px] uppercase text-tx-ghost items-center bg-bg-card/50">
            <span>#</span>
            <span>Project</span>
            <span>Category</span>
            <span>Status</span>
            <span>Order</span>
            <span />
          </div>

          {/* Rows */}
          {filtered.map((project, i) => (
            <Link
              key={project.id}
              href={`/admin/projects/new?edit=${project.id}`}
              className={`grid grid-cols-[36px_1fr_140px_100px_70px_90px] px-5 py-3.5 items-center transition-colors group ${
                i < filtered.length - 1 ? "border-b border-tx-mute" : ""
              } ${
                hoveredRow === project.id
                  ? "bg-bg-card"
                  : "bg-transparent hover:bg-bg-card/50"
              }`}
              onMouseEnter={() => setHoveredRow(project.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {/* Grip */}
              <span className="text-tx-mute">
                <GripIcon />
              </span>

              {/* Title + Subtitle + Thumbnail */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-7 rounded-[5px] shrink-0 border border-tx-mute flex items-center justify-center"
                  style={{
                    background: project.gradient || project.imageUrl
                      ? project.gradient
                        ? undefined
                        : `url(${project.imageUrl}) center/cover`
                      : "linear-gradient(135deg, #1b1f35, #0f1428)",
                  }}
                >
                  {project.hasVideo && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="rgba(255,255,255,0.5)"
                      stroke="none"
                    >
                      <polygon points="8 5 19 12 8 19 8 5" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-medium truncate">
                    {project.title}
                  </div>
                  {project.subtitle && (
                    <div className="text-[11px] text-tx-dim truncate">
                      {project.subtitle}
                    </div>
                  )}
                </div>
              </div>

              {/* Category pill */}
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 text-[10px] tracking-wide px-2.5 py-0.5 rounded-full ${catColor(
                    project.category
                  )}`}
                >
                  <span
                    className={`w-[5px] h-[5px] rounded-full ${catDot(
                      project.category
                    )}`}
                  />
                  {project.categoryLabel}
                </span>
              </div>

              {/* Featured */}
              <div>
                {project.featured && (
                  <span className="text-[9px] tracking-[1.5px] uppercase text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {/* Order */}
              <div className="text-xs text-tx-dim tabular-nums">
                {project.order}
              </div>

              {/* Actions */}
              <div className="flex gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <span
                  className="w-[30px] h-[30px] rounded-md border border-tx-mute bg-bg-card flex items-center justify-center text-tx-dim hover:border-gold hover:text-gold transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <EditIcon />
                </span>
                <button
                  className="w-[30px] h-[30px] rounded-md border border-tx-mute bg-bg-card flex items-center justify-center text-tx-dim hover:border-red-400 hover:text-red-400 transition-colors"
                  onClick={(e) =>
                    handleDelete(e, project.id, project.title)
                  }
                >
                  <TrashIcon />
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}