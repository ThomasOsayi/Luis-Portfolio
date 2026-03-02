import { PhotoItem } from "@/components/PhotoItem";

const photos = [
  { id: "r1", label: "Residente · Live", gradient: "bg-gradient-to-br from-[#162030] via-[#0a1220] to-[#1c2a3c]", tall: true },
  { id: "r2", label: "Residente · Live", gradient: "bg-gradient-to-br from-[#20161a] via-[#130e10] to-[#2a1c22]" },
  { id: "r3", label: "Residente · Live", gradient: "bg-gradient-to-br from-[#1b1f35] via-[#0f1428] to-[#1e2444]" },
  { id: "j1", label: "Jacquees · Concert", gradient: "bg-gradient-to-br from-[#2a1525] via-[#140a18] to-[#351a2b]" },
  { id: "j2", label: "Jacquees · Concert", gradient: "bg-gradient-to-br from-[#1a1a2e] via-[#0d1118] to-[#1a1520]" },
  { id: "j3", label: "Jacquees · Concert", gradient: "bg-gradient-to-br from-[#2b1a0e] via-[#1a100a] to-[#3a2112]", wide: true },
  { id: "b1", label: "Behind the Scenes", gradient: "bg-gradient-to-br from-[#0f2018] via-[#081510] to-[#162a1f]" },
  { id: "d1", label: "Dominican Republic", gradient: "bg-gradient-to-br from-[#1c1410] via-[#0d0a08] to-[#241a12]" },
  { id: "d2", label: "Dominican Republic", gradient: "bg-gradient-to-br from-[#2b1a0e] via-[#1a100a] to-[#3a2112]", tall: true },
  { id: "s1", label: "Street Photography", gradient: "bg-gradient-to-br from-[#1b1f35] via-[#0f1428] to-[#1e2444]" },
  { id: "p1", label: "Puerto Rico", gradient: "bg-gradient-to-br from-[#20161a] via-[#130e10] to-[#2a1c22]" },
];

export default function PhotographyPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-[5px] px-6 md:px-11">
        {photos.map((photo) => (
          <PhotoItem
            key={photo.id}
            label={photo.label}
            gradient={photo.gradient}
            tall={photo.tall}
            wide={photo.wide}
          />
        ))}
      </div>
    </div>
  );
}