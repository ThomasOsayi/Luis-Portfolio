"use client";

import { useEffect, useCallback, useState, useRef } from "react";

interface LightboxProps {
  images: { imageUrl: string; label: string }[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ images, currentIndex, onClose, onNavigate }: LightboxProps) {
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const touchStartX = useRef(0);
  const current = images[currentIndex];

  const goNext = useCallback(() => {
    if (currentIndex < images.length - 1 && !animating) {
      setDirection("left");
      setAnimating(true);
      setTimeout(() => {
        onNavigate(currentIndex + 1);
        setDirection("right");
        setTimeout(() => {
          setAnimating(false);
          setDirection(null);
        }, 20);
      }, 150);
    }
  }, [currentIndex, images.length, animating, onNavigate]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0 && !animating) {
      setDirection("right");
      setAnimating(true);
      setTimeout(() => {
        onNavigate(currentIndex - 1);
        setDirection("left");
        setTimeout(() => {
          setAnimating(false);
          setDirection(null);
        }, 20);
      }, 150);
    }
  }, [currentIndex, animating, onNavigate]);

  // Keyboard
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, goNext, goPrev]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Touch
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) goNext();
      else goPrev();
    }
  }

  if (!current) return null;

  const imgStyle: React.CSSProperties = {
    transition: animating ? "opacity 0.15s ease, transform 0.15s ease" : "none",
    opacity: animating ? 0 : 1,
    transform: animating
      ? direction === "left"
        ? "translateX(-24px)"
        : "translateX(24px)"
      : "translateX(0)",
  };

  return (
    <div
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 6000,
        background: "rgba(5,5,5,0.96)",
        backdropFilter: "blur(24px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "lb-fade-in 0.25s ease",
        cursor: "zoom-out",
      }}
    >
      <style>{`
        @keyframes lb-fade-in { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 42,
          height: 42,
          borderRadius: "50%",
          border: "1px solid rgba(245,240,235,0.12)",
          background: "rgba(0,0,0,0.3)",
          color: "rgba(245,240,235,0.5)",
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
          e.currentTarget.style.borderColor = "rgba(245,240,235,0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(245,240,235,0.5)";
          e.currentTarget.style.borderColor = "rgba(245,240,235,0.12)";
        }}
      >
        ✕
      </button>

      {/* Prev arrow */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          style={{
            position: "absolute",
            left: 20,
            top: "50%",
            transform: "translateY(-50%)",
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "1px solid rgba(245,240,235,0.1)",
            background: "rgba(0,0,0,0.25)",
            color: "rgba(245,240,235,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#C9A96E";
            e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(245,240,235,0.5)";
            e.currentTarget.style.borderColor = "rgba(245,240,235,0.1)";
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Next arrow */}
      {currentIndex < images.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          style={{
            position: "absolute",
            right: 20,
            top: "50%",
            transform: "translateY(-50%)",
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "1px solid rgba(245,240,235,0.1)",
            background: "rgba(0,0,0,0.25)",
            color: "rgba(245,240,235,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#C9A96E";
            e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(245,240,235,0.5)";
            e.currentTarget.style.borderColor = "rgba(245,240,235,0.1)";
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Image */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "90vw",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "default",
        }}
      >
        <img
          src={current.imageUrl}
          alt={current.label}
          style={{
            maxWidth: "90vw",
            maxHeight: "80vh",
            objectFit: "contain",
            borderRadius: 6,
            ...imgStyle,
          }}
        />
        {/* Caption */}
        <div
          style={{
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: animating ? 0 : 1,
            transition: "opacity 0.15s ease",
          }}
        >
          <span
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 16,
              color: "rgba(245,240,235,0.7)",
              letterSpacing: "0.5px",
            }}
          >
            {current.label}
          </span>
          <span
            style={{
              fontSize: 11,
              color: "rgba(245,240,235,0.25)",
              letterSpacing: "1.5px",
            }}
          >
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>
    </div>
  );
}