"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PhotoItem } from "@/components/PhotoItem";
import { PhotoSkeleton } from "@/components/Skeleton";
import { Lightbox } from "@/components/Lightbox";

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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  if (loading) return <PhotoSkeleton />;

  return (
    <div className="pt-24 pb-20">
      <div
        className="grid grid-cols-2 md:grid-cols-3 gap-[5px] px-6 md:px-11"
        style={{ gridAutoRows: "250px" }}
      >
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            onClick={() => setLightboxIndex(i)}
            className="cursor-zoom-in h-full"
            style={{
              gridRow: photo.layout === "tall" ? "span 2" : "span 1",
              gridColumn: photo.layout === "wide" ? "span 2" : "span 1",
            }}
          >
            <PhotoItem
              label={photo.label}
              imageUrl={photo.imageUrl}
            />
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={photos.map((p) => ({ imageUrl: p.imageUrl, label: p.label }))}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(i) => setLightboxIndex(i)}
        />
      )}
    </div>
  );
}