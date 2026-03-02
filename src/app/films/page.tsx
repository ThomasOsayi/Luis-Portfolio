import { projects } from "@/data/projects";
import { FilmEntry } from "@/components/FilmEntry";

export default function FilmsPage() {
  const films = projects.filter(
    (p) => p.category === "film" || p.category === "documentary"
  );

  return (
    <div className="pt-24 pb-20 px-6 md:px-11">
      {films.map((film, i) => (
        <FilmEntry key={film.id} film={film} reverse={i % 2 !== 0} />
      ))}
    </div>
  );
}