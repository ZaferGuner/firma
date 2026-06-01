"use client";

import { useState } from "react";
import { projects as defaultStaticProjects } from "../../../data/projects";
import { ProjectsHero } from "./ProjectsHero";
import { ProjectFilters } from "./ProjectFilters";
import { ProjectGrid } from "./ProjectGrid";
import { ProjectsCTA } from "./ProjectsCTA";
import { ProjectDetailDrawer } from "./ProjectDetailDrawer";
import { useAdminEdit } from "@/context/AdminEditContext";
import { motion } from "motion/react";

interface ProjectsClientProps {
  initialProjects?: any[];
  initialData?: {
    hero?: any;
    cta?: any;
  };
}

export function ProjectsClient({ initialProjects, initialData }: ProjectsClientProps) {
  const [activeFilter, setActiveFilter] = useState("Tümü");
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const adminContext = useAdminEdit();
  const isAdmin = !!adminContext && !adminContext.isPreviewMode;

  // In active admin edit mode, read projects dynamically from the context state (which updates on edits).
  // Otherwise, read from published initialProjects prop (Server Component) or static fallback.
  const projectsList = adminContext 
    ? adminContext.draftProjects 
    : (initialProjects || defaultStaticProjects);

  // Normalize static / db categories and status strings
  const filteredProjects = projectsList.filter((project) => {
    if (activeFilter === "Tümü") return true;

    if (activeFilter === "Villa Projeleri") {
      return (
        project.category === "Villa Projesi" ||
        project.category === "Villa Projeleri" ||
        project.type === "villa"
      );
    }

    if (activeFilter === "Konut Projeleri") {
      return (
        project.category === "Konut Projesi" ||
        project.category === "Konut Projeleri" ||
        project.type === "konut"
      );
    }

    if (activeFilter === "Devam Eden") {
      // Treat Devam Eden as default if status is not explicitly set in dynamic models
      return project.status === "Devam Eden" || !project.status;
    }

    if (activeFilter === "Tamamlanan") {
      return project.status === "Tamamlanan";
    }

    return true;
  });

  const handleSelectProject = (project: any) => {
    if (isAdmin) {
      adminContext?.openSectionEditor(`project.${project.slug}`);
      return;
    }

    setSelectedProject(project);
    setIsDrawerOpen(true);
  };

  return (
    <div className="flex flex-col bg-[#f4f2ed] min-h-screen relative overflow-hidden">
      {/* Shiftable Main Page Content using Framer Motion with CSS variables for perfect 1:1 synchrony with drawer */}
      <motion.div
        animate={{ x: isDrawerOpen ? "var(--drawer-shift)" : "0px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ willChange: "transform" }}
        className="flex flex-col flex-1 bg-[#f4f2ed] shadow-lg [--drawer-shift:-100%] sm:[--drawer-shift:-540px] md:[--drawer-shift:-600px]"
      >
        <ProjectsHero initialData={initialData?.hero} />

        {/* Admin Insertion Area */}
        {isAdmin && (
          <div className="flex justify-center pt-8 bg-[#f4f2ed]">
            <button
              onClick={() => adminContext?.openSectionEditor("new-project")}
              type="button"
              className="admin-blue-button flex items-center gap-2 bg-dark-bg px-8 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-dark-text transition-colors hover:bg-[var(--color-primary)] cursor-pointer shadow-lg"
            >
              + Yeni Proje Ekle
            </button>
          </div>
        )}

        {/* Filter Pills */}
        <ProjectFilters 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
        />

        {/* Editorial Grid System */}
        <ProjectGrid
          projects={filteredProjects}
          onSelectProject={handleSelectProject}
        />
        
        {/* Call To Action Rail */}
        <ProjectsCTA initialData={initialData?.cta} />
      </motion.div>

      {/* Side Slide-in Details Drawer */}
      <ProjectDetailDrawer
        project={selectedProject}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
