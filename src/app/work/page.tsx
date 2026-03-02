import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";

export default function WorkPage() {
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
            isVideo={project.isVideo}
            isFull={project.isFeatured}
          />
        ))}
      </div>
    </div>
  );
}