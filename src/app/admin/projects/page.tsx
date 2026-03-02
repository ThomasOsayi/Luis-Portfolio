"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  order: number;
  isFeatured: boolean;
}

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchProjects() {
    const q = query(collection(db, "projects"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    setProjects(
      snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project))
    );
    setLoading(false);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deleteDoc(doc(db, "projects", id));
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) {
    return <p className="text-tx-dim text-sm">Loading projects...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold mb-1">Projects</h1>
          <p className="text-tx-dim text-sm">{projects.length} projects</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="bg-gold text-bg text-[10px] font-bold tracking-[3px] uppercase px-6 py-3 hover:bg-gold/80 transition-colors"
        >
          + Add Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="border border-tx-mute p-12 text-center">
          <p className="text-tx-ghost mb-4">No projects yet</p>
          <Link href="/admin/projects/new" className="text-gold text-sm underline">
            Add your first project
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between border border-tx-mute p-4 hover:border-tx-ghost transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-tx-ghost text-xs w-6">{project.order}</span>
                <div>
                  <p className="font-semibold text-sm">{project.title}</p>
                  <p className="text-tx-ghost text-xs">
                    {project.categoryLabel}
                    {project.isFeatured && (
                      <span className="text-gold ml-2">★ Featured</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/admin/projects/new?edit=${project.id}`}
                  className="text-[10px] tracking-[2px] uppercase text-tx-ghost hover:text-tx"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(project.id, project.title)}
                  className="text-[10px] tracking-[2px] uppercase text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}