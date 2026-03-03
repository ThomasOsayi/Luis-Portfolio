"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProjectCard } from "@/components/ProjectCard";

interface Project {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  subtitle?: string;
  gradient?: string;
  imageUrl?: string;
  videoUrl?: string;
  hasVideo?: boolean;
  isVideo?: boolean;
  featured?: boolean;
  isFeatured?: boolean;
  order: number;
}

export default function WorkPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const q = query(collection(db, "projects"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        setProjects(
          snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project))
        );
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 pb-20 flex items-center justify-center min-h-[60vh]">
        <p className="text-tx-dim text-sm tracking-widest uppercase">
          Loading…
        </p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[5px] px-11">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            category={project.categoryLabel}
            subtitle={project.subtitle}
            gradient={project.gradient}
            imageUrl={project.imageUrl}
            videoUrl={project.videoUrl}
            isVideo={project.hasVideo ?? project.isVideo}
            isFull={project.featured ?? project.isFeatured}
          />
        ))}
      </div>
    </div>
  );
}