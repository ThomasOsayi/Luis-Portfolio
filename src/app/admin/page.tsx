"use client";

import { useState, useEffect } from "react";
import { collection, getCountFromServer, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

/* ───────── icons ───────── */
function FilmIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" /><line x1="17" y1="17" x2="22" y2="17" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}
function ImageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}
function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/* ───────── quick actions config ───────── */
const quickActions = [
  { label: "New Film Project", icon: FilmIcon, category: "Short Film", href: "/admin/projects/new?cat=film" },
  { label: "New Music Video", icon: PlayIcon, category: "Music Video", href: "/admin/projects/new?cat=music-video" },
  { label: "Add Photos", icon: CameraIcon, category: "Photography", href: "/admin/photography" },
  { label: "New Documentary", icon: ImageIcon, category: "Documentary", href: "/admin/projects/new?cat=documentary" },
];

const portfolioSections = [
  { title: "Short Films", category: "film", description: "Narrative & experimental films", accent: "from-[#1a1510]", href: "/admin/projects" },
  { title: "Music Videos", category: "music-video", description: "Artist collaborations & visuals", accent: "from-[#10151a]", href: "/admin/projects" },
  { title: "Photography", category: "photography", description: "Portraits, sets & behind the scenes", accent: "from-[#151017]", href: "/admin/photography" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    musicVideos: 0,
    films: 0,
    photos: 0,
    clients: 0,
    featured: 0,
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Total projects (excluding photography — those are in photos collection)
        const projSnap = await getCountFromServer(
          query(collection(db, "projects"), where("category", "!=", "photography"))
        );
        const total = projSnap.data().count;

        // Music videos
        const mvSnap = await getCountFromServer(
          query(collection(db, "projects"), where("category", "==", "music-video"))
        );
        const musicVideos = mvSnap.data().count;

        // Films
        const filmSnap = await getCountFromServer(
          query(collection(db, "projects"), where("category", "in", ["film", "documentary"]))
        );
        const films = filmSnap.data().count;

        // Photos (separate collection)
        const photoSnap = await getCountFromServer(collection(db, "photos"));
        const photos = photoSnap.data().count;

        // Featured
        const featSnap = await getCountFromServer(
          query(collection(db, "projects"), where("featured", "==", true))
        );
        const featured = featSnap.data().count;

        // Clients
        const clientSnap = await getCountFromServer(collection(db, "clients"));
        const clients = clientSnap.data().count;

        setStats({ total, musicVideos, films, photos, clients, featured });

        // Recent projects (last 4, excluding photography)
        const recentQ = query(
          collection(db, "projects"),
          orderBy("order", "asc"),
          limit(6)
        );
        const recentDocs = await getDocs(recentQ);
        const filtered = recentDocs.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((p: any) => p.category !== "photography")
          .slice(0, 4);
        setRecentProjects(filtered);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoaded(true);
      }
    }
    fetchStats();
  }, []);

  const categoryCount = (cat: string) => {
    if (cat === "film") return stats.films;
    if (cat === "music-video") return stats.musicVideos;
    if (cat === "photography") return stats.photos;
    return 0;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome */}
      <div className="mb-10 animate-fade-in-up">
        <h2 className="font-serif text-3xl font-light leading-tight">
          Welcome back,{" "}
          <span className="text-gold font-medium">Luis</span>
        </h2>
        <p className="text-tx-dim text-sm mt-2">
          Here&apos;s an overview of your portfolio
        </p>
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10"
        style={{ animationDelay: "0.05s" }}
      >
        {[
          { label: "Projects", value: stats.total, sub: `${stats.featured} featured` },
          { label: "Music Videos", value: stats.musicVideos, sub: "Video projects" },
          { label: "Films", value: stats.films, sub: "Films & docs" },
          { label: "Photos", value: stats.photos, sub: "Gallery images" },
          { label: "Clients", value: stats.clients, sub: "Collaborators" },
        ].map((s, i) => (
          <div
            key={i}
            className="admin-card group bg-bg-card border border-tx-mute rounded-xl p-5 transition-all duration-300 hover:border-tx-ghost hover:bg-bg-elevated"
          >
            <div className="text-[10px] tracking-[1.5px] uppercase text-tx-ghost mb-3">
              {s.label}
            </div>
            <div className="font-serif text-4xl font-light text-tx leading-none mb-2">
              {loaded ? s.value : "–"}
            </div>
            <div className="text-xs text-tx-dim">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Two-column: Quick Actions + Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Quick Actions */}
        <div>
          <h3 className="text-[10px] tracking-[2px] uppercase text-tx-ghost font-medium mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-col gap-2">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <Link
                  key={i}
                  href={action.href}
                  className="admin-card group flex items-center gap-4 bg-bg-card border border-tx-mute rounded-xl p-4 transition-all duration-300 hover:border-tx-ghost hover:bg-bg-elevated"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/[0.06] border border-gold/10 flex items-center justify-center text-tx-dim group-hover:text-gold group-hover:scale-105 transition-all duration-300 shrink-0">
                    <Icon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-tx">
                      {action.label}
                    </div>
                    <div className="text-xs text-tx-ghost">{action.category}</div>
                  </div>
                  <div className="text-gold opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRightIcon />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] tracking-[2px] uppercase text-tx-ghost font-medium">
              Recent Projects
            </h3>
            <Link
              href="/admin/projects"
              className="text-gold text-xs hover:text-gold/70 transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="bg-bg-card border border-tx-mute rounded-xl overflow-hidden">
            {!loaded ? (
              <div className="p-6 text-center text-tx-ghost text-sm">
                Loading…
              </div>
            ) : recentProjects.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-tx-ghost text-sm mb-2">No projects yet</p>
                <Link
                  href="/admin/projects/new"
                  className="text-gold text-sm hover:underline"
                >
                  Add your first project
                </Link>
              </div>
            ) : (
              recentProjects.map((proj, i) => (
                <Link
                  key={proj.id}
                  href={`/admin/projects/new?edit=${proj.id}`}
                  className={`flex items-center gap-3 px-5 py-4 transition-colors hover:bg-bg-elevated ${
                    i < recentProjects.length - 1 ? "border-b border-tx-mute" : ""
                  }`}
                >
                  {/* Color dot by category */}
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                      background:
                        proj.category === "music-video"
                          ? "#C9A96E"
                          : proj.category === "film"
                          ? "#4ADE80"
                          : proj.category === "documentary"
                          ? "#818CF8"
                          : "#F472B6",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-tx truncate">
                      {proj.title}
                    </div>
                    <div className="text-xs text-tx-dim capitalize">
                      {proj.category?.replace("-", " ")}
                      {proj.role ? ` · ${proj.role}` : ""}
                    </div>
                  </div>
                  {proj.featured && (
                    <span className="text-[9px] tracking-[1.5px] uppercase text-gold bg-gold/10 px-2 py-0.5 rounded-full shrink-0">
                      Featured
                    </span>
                  )}
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Portfolio Sections */}
      <div>
        <h3 className="text-[10px] tracking-[2px] uppercase text-tx-ghost font-medium mb-4">
          Portfolio Sections
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {portfolioSections.map((section, i) => (
            <Link
              key={i}
              href={section.href}
              className={`admin-card group relative overflow-hidden bg-gradient-to-br ${section.accent} to-bg-card border border-tx-mute rounded-xl p-7 transition-all duration-300 hover:border-tx-ghost`}
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-[radial-gradient(circle_at_top_right,rgba(201,169,110,0.04),transparent)]" />
              <div className="font-serif text-xl font-normal mb-1">
                {section.title}
              </div>
              <div className="text-xs text-tx-dim mb-5">
                {section.description}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gold font-medium">
                  {loaded ? categoryCount(section.category) : "–"}{" "}
                  {section.category === "photography" ? "photos" : "projects"}
                </span>
                <span className="text-tx-ghost group-hover:text-gold group-hover:translate-x-1 transition-all duration-300">
                  <ArrowRightIcon />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}