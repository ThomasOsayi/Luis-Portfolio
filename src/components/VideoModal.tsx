"use client";

import { useState, useEffect } from "react";

export function VideoModal() {
  const [open, setOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    function handleOpen(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setVideoUrl(detail);
        setOpen(true);
      }
    }
    window.addEventListener("open-video", handleOpen);
    return () => window.removeEventListener("open-video", handleOpen);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  if (!open || !videoUrl) return null;

  // Detect video type
  const embedUrl = getEmbedUrl(videoUrl);
  const isDirect = isDirectVideo(videoUrl);

  return (
    <div
      onClick={() => setOpen(false)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 6000,
        background: "rgba(10,10,10,0.95)",
        backdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "vm-fade-in 0.3s ease",
      }}
    >
      <style>{`
        @keyframes vm-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes vm-scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      {/* Close button */}
      <button
        onClick={() => setOpen(false)}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid rgba(245,240,235,0.15)",
          background: "rgba(0,0,0,0.4)",
          color: "rgba(245,240,235,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: 18,
          zIndex: 10,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#F5F0EB";
          e.currentTarget.style.borderColor = "rgba(245,240,235,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(245,240,235,0.6)";
          e.currentTarget.style.borderColor = "rgba(245,240,235,0.15)";
        }}
      >
        ✕
      </button>

      {/* Video container */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90vw",
          maxWidth: 1100,
          aspectRatio: "16/9",
          borderRadius: 12,
          overflow: "hidden",
          animation: "vm-scale-in 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {isDirect ? (
          /* Direct video file (Firebase Storage, mp4, etc.) */
          <video
            src={videoUrl}
            controls
            autoPlay
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              background: "#000",
              borderRadius: 12,
            }}
          />
        ) : embedUrl ? (
          /* YouTube / Vimeo embed */
          <iframe
            src={embedUrl}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              borderRadius: 12,
            }}
          />
        ) : (
          /* Fallback — try as direct video */
          <video
            src={videoUrl}
            controls
            autoPlay
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              background: "#000",
              borderRadius: 12,
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ── helpers ── */
function getEmbedUrl(url: string): string | null {
  // YouTube
  const ytPatterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of ytPatterns) {
    const m = url.match(p);
    if (m) return `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  return null;
}

function isDirectVideo(url: string): boolean {
  if (!url) return false;
  // Firebase Storage URLs
  if (url.includes("firebasestorage.googleapis.com")) return true;
  // Direct file extensions
  if (/\.(mp4|mov|webm|avi|mkv|m4v)(\?|$)/i.test(url)) return true;
  return false;
}