export interface Project {
    id: string;
    title: string;
    category: string;
    categoryLabel: string;
    subtitle?: string;
    description?: string;
    role?: string;
    gradient: string;
    isVideo?: boolean;
    isFeatured?: boolean;
    videoUrl?: string;
    // Later: imageUrl, thumbnailUrl from Firebase Storage
  }
  
  export const projects: Project[] = [
    {
      id: "revolucionario",
      title: "Luquis — Revolucionario",
      category: "music-video",
      categoryLabel: "Music Video",
      subtitle: "Official Video · Director",
      gradient: "bg-gradient-to-br from-[#1b1f35] via-[#0f1428] to-[#1e2444]",
      isVideo: true,
      isFeatured: true,
      videoUrl: "https://youtube.com/watch?v=...",
    },
    {
      id: "jacquees",
      title: "Jacquees",
      category: "photography",
      categoryLabel: "Concert Photography",
      subtitle: "Live Performance Series",
      gradient: "bg-gradient-to-br from-[#2a1525] via-[#140a18] to-[#351a2b]",
    },
    {
      id: "residente",
      title: "Residente — Live",
      category: "photography",
      categoryLabel: "Concert Photography",
      subtitle: "Concert documentation · Multiple venues",
      gradient: "bg-gradient-to-br from-[#162030] via-[#0a1220] to-[#1c2a3c]",
      isVideo: true,
      isFeatured: true,
    },
    {
      id: "smalls",
      title: "SMALLS",
      category: "documentary",
      categoryLabel: "Short Documentary",
      subtitle: "A brother's MLS dream",
      description: "After seeing his brother achieve his dreams of becoming a professional MLS player, Mydas Smalls works hard to follow in his brother's footsteps.",
      role: "Director",
      gradient: "bg-gradient-to-br from-[#2b1a0e] via-[#1a100a] to-[#3a2112]",
      isVideo: true,
    },
    {
      id: "lost-and-found",
      title: "Lost & Found",
      category: "film",
      categoryLabel: "Short Film",
      subtitle: "No-dialogue · Director",
      description: "A no-dialogue sophomore short film about a girl searching for what she has lost.",
      role: "Director",
      gradient: "bg-gradient-to-br from-[#0f2018] via-[#081510] to-[#162a1f]",
      isVideo: true,
    },
    {
      id: "fiesta-island",
      title: "Fiesta.Island787",
      category: "film",
      categoryLabel: "Short Film",
      subtitle: "Avant-garde · Puerto Rico",
      description: "Traditional avant-garde short highlighting the modern struggles of Puerto Rico.",
      role: "Director",
      gradient: "bg-gradient-to-br from-[#20161a] via-[#130e10] to-[#2a1c22]",
      isVideo: true,
    },
    {
      id: "endurance",
      title: "Endurance",
      category: "documentary",
      categoryLabel: "Documentary",
      subtitle: "Race car driver · Family",
      description: "Short documentary on 20-year-old race car driver Valentino Catalano and his journey into becoming one of the top endurance racers in the world.",
      role: "Director",
      gradient: "bg-gradient-to-br from-[#1a1a2e] via-[#0d1118] to-[#1a1520]",
      isVideo: true,
    },
    {
      id: "notas",
      title: "Notas a Flor de Madera",
      category: "documentary",
      categoryLabel: "Documentary",
      subtitle: "Flamenco Cajón player",
      description: "Short documentary on a Flamenco Cajón player, directed by Priscila Baloyan.",
      role: "Assistant Camera",
      gradient: "bg-gradient-to-br from-[#1c1410] via-[#0d0a08] to-[#241a12]",
      isVideo: true,
    },
    {
      id: "music-reel",
      title: "Music Videoz Reel",
      category: "music-video",
      categoryLabel: "Music Video",
      subtitle: "2024 compilation · Various artists",
      gradient: "bg-gradient-to-br from-[#1b1f35] via-[#0f1428] to-[#1e2444] hue-rotate-[40deg] brightness-[0.7]",
      isVideo: true,
    },
  ];
  
  export const clients = [
    { name: "Jacquees", style: "serif" as const },
    { name: "Residente", style: "serif" as const },
    { name: "LMU", style: "sans" as const },
    { name: "Luquis", style: "serif" as const },
    { name: "YouTube Theater", style: "serif" as const },
    { name: "Atlantic", style: "serif" as const },
  ];