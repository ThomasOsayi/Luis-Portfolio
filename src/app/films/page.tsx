"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FilmEntry } from "@/components/FilmEntry";
import { FilmsSkeleton } from "@/components/Skeleton";

interface Project {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  subtitle?: string;
  description?: string;
  role?: string;
  gradient?: string;
  imageUrl?: string;
  videoUrl?: string;
  hasVideo?: boolean;
  isVideo?: boolean;
  featured?: boolean;
  isFeatured?: boolean;
  order: number;
}

export default function FilmsPage() {
  const [films, setFilms] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFilms() {
      try {
        const q = query(collection(db, "projects"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        const all = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() } as Project)
        );
        setFilms(
          all.filter(
            (p) => p.category === "film" || p.category === "documentary"
          )
        );
      } catch (err) {
        console.error("Failed to fetch films:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFilms();
  }, []);

  if (loading) return <FilmsSkeleton />;

  return (
    <div className="pt-24 pb-20 px-6 md:px-11">
      {films.length === 0 ? (
        <p className="text-tx-dim text-sm text-center py-20 tracking-widest uppercase">
          No films yet
        </p>
      ) : (
        films.map((film, i) => (
          <FilmEntry key={film.id} film={film} reverse={i % 2 !== 0} />
        ))
      )}
    </div>
  );
}