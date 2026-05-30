"use client";

import { useEditableContent } from "@/hooks/useEditableContent";
import { EditableSection } from "@/components/admin/EditableSection";

interface ProjectFeaturesProps {
  project: any;
}

export function ProjectFeatures({ project }: ProjectFeaturesProps) {
  const data = useEditableContent(`project.${project.slug}`, project);

  if (!data.features || data.features.length === 0) {
    return null;
  }

  return (
    <EditableSection sectionKey={`project.${project.slug}`} label="Proje Özellikleri">
      <section className="px-4 md:px-8 py-20 bg-site-soft border-t border-b border-site-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-site-text mb-4">
              Proje Özellikleri
            </h2>
            <p className="text-lg text-site-body max-w-2xl">
              Projede öne çıkan teknik, sosyal ve yaşam konforu detayları.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-0">
            {data.features.map((feature: string, index: number) => (
              <div key={index} className="flex items-start gap-4 group border-b border-site-border py-6">
                <div className="mt-2 w-1.5 h-1.5 bg-site-accent group-hover:bg-site-primary transition-colors shrink-0" />
                <p className="text-lg text-site-label group-hover:text-site-text transition-colors font-medium">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </EditableSection>
  );
}

