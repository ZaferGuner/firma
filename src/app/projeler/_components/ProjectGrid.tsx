"use client";

import { ProjectCard } from "./ProjectCard";

interface ProjectGridProps {
  projects: any[];
  onSelectProject: (project: any) => void;
}

export function ProjectGrid({ projects, onSelectProject }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <section className="px-6 md:px-12 py-16 bg-[#f4f2ed]">
        <div className="max-w-7xl mx-auto border border-[rgba(0,0,0,0.12)] bg-[#f8f7f3] p-12 text-center text-[rgba(0,0,0,0.5)] font-mono text-xs uppercase tracking-widest">
          Bu kategoriye ait proje bulunamadı.
        </div>
      </section>
    );
  }

  // Helper to determine exact editorial grid classes based on project slug or index
  const getGridSpan = (slug: string, index: number) => {
    // Specific layout requested:
    // Villa The Same: lg:col-span-7
    // Tümerhan Twins: lg:col-span-5
    // Tümerhan Towers: lg:col-span-4
    if (slug === "villa-the-same") return "lg:col-span-7 col-span-12";
    if (slug === "tumerhan-twins") return "lg:col-span-5 col-span-12";
    if (slug === "tumerhan-towers") return "lg:col-span-4 col-span-12";

    // Fallback dynamic sequence for other/admin projects
    const pos = index % 3;
    if (pos === 0) return "lg:col-span-7 col-span-12";
    if (pos === 1) return "lg:col-span-5 col-span-12";
    return "lg:col-span-4 col-span-12";
  };

  return (
    <section className="px-6 md:px-12 py-12 md:py-20 bg-[#f4f2ed]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-8 md:gap-12">
          {projects.map((project, index) => {
            const gridClasses = getGridSpan(project.slug, index);
            return (
              <div key={project.id || project.slug || index} className={gridClasses}>
                <ProjectCard
                  project={project}
                  onSelect={onSelectProject}
                  className="h-full"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
