"use client";

import { useEditableContent } from "@/hooks/useEditableContent";
import { EditableSection } from "@/components/admin/EditableSection";

interface ProjectInfoProps {
  project: any;
}

export function ProjectInfo({ project }: ProjectInfoProps) {
  const data = useEditableContent(`project.${project.slug}`, project);

  return (
    <EditableSection sectionKey={`project.${project.slug}`} label="Proje Açıklaması">
      <section className="px-4 md:px-8 py-20 md:py-32 bg-site-surface">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-site-accent mb-6">
            Proje Hakkında
          </h2>
          <p className="text-2xl md:text-3xl lg:text-4xl text-site-text leading-relaxed font-light">
            {data.description}
          </p>
        </div>
      </section>
    </EditableSection>
  );
}

