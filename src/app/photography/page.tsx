"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PhotoItem } from "@/components/PhotoItem";

interface Photo {
  id: string;
  label: string;
  album: string;
  layout: string;
  imageUrl: string;
  order: number;
}

export default function PhotographyPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const q = query(collection(db, "photos"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        setPhotos(
          snap.docs.map((d) => ({ id: d.id, ...d.data() } as Photo))
        );
      } catch (err) {
        console.error("Failed to fetch photos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 pb-20 px-6 md:px-11 flex items-center justify-center min-h-[60vh]">
        <p className="text-tx-dim text-sm tracking-widest uppercase">
          Loading…
        </p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-[5px] px-6 md:px-11">
        {photos.map((photo) => (
          <PhotoItem
            key={photo.id}
            label={photo.label}
            imageUrl={photo.imageUrl}
            tall={photo.layout === "tall"}
            wide={photo.layout === "wide"}
          />
        ))}
      </div>
    </div>
  );
}