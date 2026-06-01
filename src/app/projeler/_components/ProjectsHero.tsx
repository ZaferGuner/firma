"use client";

import { motion } from "motion/react";
import { useShouldPlayHeroIntro } from "@/hooks/useShouldPlayHeroIntro";
import { EditableSection } from "@/components/admin/EditableSection";
import { useEditableContent } from "@/hooks/useEditableContent";
import { projectsPageDefaults } from "@/data/projectsPage";

export function ProjectsHero({ initialData }: { initialData?: any }) {
  const shouldPlay = useShouldPlayHeroIntro();
  const data = useEditableContent("projects.hero", initialData || projectsPageDefaults.hero);

  return (
    <EditableSection sectionKey="projects.hero" label="Projeler Hero">
    <section 
      data-header-theme="light"
      className="relative px-6 md:px-12 pt-32 pb-16 bg-[#f4f2ed] border-b border-[rgba(0,0,0,0.12)]"
    >
      {/* Background Subtle Blueprint/Grid effect */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #111111 1px, transparent 1px),
            linear-gradient(to bottom, #111111 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px"
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-start text-left">
        <motion.div
          className="mb-4"
          initial={shouldPlay ? { opacity: 0, y: 15 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          data-hero-text
          data-page-intro
          data-hero-intro
        >
          <span className="font-mono text-[10px] font-bold tracking-[0.25em] text-[#C5162E] uppercase">
            {data.eyebrow}
          </span>
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl font-bold tracking-tight text-[#111111] mb-6 leading-[1.1]"
          initial={shouldPlay ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          data-hero-text
          data-page-intro
          data-hero-intro
        >
          {data.title}
        </motion.h1>
        
        <motion.p 
          className="text-base md:text-lg text-[rgba(0,0,0,0.65)] mb-12 max-w-2xl leading-relaxed animate-fade-in"
          initial={shouldPlay ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          data-hero-text
          data-page-intro
          data-hero-intro
        >
          {data.description}
        </motion.p>
        
      </div>
    </section>
    </EditableSection>
  );
}
