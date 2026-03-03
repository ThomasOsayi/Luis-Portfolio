"use client";

/* ───────── Base shimmer block ───────── */
export function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`skeleton-shimmer rounded-lg ${className}`}
      style={{
        background: "linear-gradient(90deg, #161616 25%, #1e1e1e 50%, #161616 75%)",
        backgroundSize: "400% 100%",
        ...style,
      }}
    />
  );
}

/* ───────── Work page: grid of cards ───────── */
export function WorkSkeleton() {
  return (
    <div className="pt-24 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[5px] px-6 md:px-11">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="relative rounded-xl overflow-hidden border border-tx-mute" style={{ aspectRatio: "16/10" }}>
            <Skeleton className="w-full h-full rounded-xl" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <Skeleton className="w-16 h-2.5 mb-3 rounded" />
              <Skeleton className="w-40 h-5 mb-2 rounded" />
              <Skeleton className="w-28 h-3 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── Films page: alternating entries ───────── */
export function FilmsSkeleton() {
  return (
    <div className="pt-24 pb-20 px-6 md:px-11 max-w-5xl mx-auto">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className={`flex gap-8 mb-16 items-start ${i % 2 !== 0 ? "flex-row-reverse" : ""}`}
        >
          <Skeleton className="w-[45%] shrink-0 rounded-lg" style={{ aspectRatio: "16/10" }} />
          <div className="flex-1 pt-2">
            <Skeleton className="w-48 h-6 mb-3 rounded" />
            <Skeleton className="w-20 h-3 mb-4 rounded" />
            <Skeleton className="w-full h-3 mb-2 rounded" />
            <Skeleton className="w-4/5 h-3 mb-2 rounded" />
            <Skeleton className="w-3/5 h-3 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ───────── Photography page: masonry grid ───────── */
export function PhotoSkeleton() {
  const layouts = ["normal", "tall", "normal", "wide", "normal", "normal", "tall", "normal", "normal"];
  return (
    <div className="pt-24 pb-20">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-[5px] px-6 md:px-11" style={{ gridAutoRows: "160px" }}>
        {layouts.map((layout, i) => (
          <Skeleton
            key={i}
            className="rounded-sm"
            style={{
              gridRow: layout === "tall" ? "span 2" : "span 1",
              gridColumn: layout === "wide" ? "span 2" : "span 1",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ───────── Clients page: name grid ───────── */
export function ClientsSkeleton() {
  return (
    <div className="pt-24 pb-20 px-6 md:px-11">
      <div className="text-center mb-16">
        <Skeleton className="w-64 h-4 mx-auto mb-4 rounded" />
        <Skeleton className="w-80 h-8 mx-auto rounded" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-6 rounded" />
        ))}
      </div>
    </div>
  );
}

/* ───────── About page: two-column layout ───────── */
export function AboutSkeleton() {
  return (
    <div className="pt-24 pb-20 px-6 md:px-11 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image side */}
        <Skeleton className="w-full rounded-xl" style={{ aspectRatio: "3/4" }} />
        {/* Text side */}
        <div className="pt-4">
          <Skeleton className="w-48 h-8 mb-6 rounded" />
          <Skeleton className="w-full h-3 mb-3 rounded" />
          <Skeleton className="w-full h-3 mb-3 rounded" />
          <Skeleton className="w-4/5 h-3 mb-8 rounded" />
          <Skeleton className="w-full h-3 mb-3 rounded" />
          <Skeleton className="w-3/5 h-3 mb-10 rounded" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="w-20 h-2.5 mb-2 rounded" />
                <Skeleton className="w-28 h-4 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}