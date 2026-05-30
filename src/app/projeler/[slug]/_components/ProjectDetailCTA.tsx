"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEditableContent } from "@/hooks/useEditableContent";
import { EditableSection } from "@/components/admin/EditableSection";

interface ProjectDetailCTAProps {
  project: any;
}

export function ProjectDetailCTA({ project }: ProjectDetailCTAProps) {
  const data = useEditableContent(`project.${project.slug}`, project);

  const ctaText = data.ctaText || "Yeni yaşam alanınızı birlikte planlayalım.";
  const ctaBtnText = data.ctaBtnText || "Bilgi Al";
  const ctaBtnLink = data.ctaBtnLink || "/iletisim";

  return (
    <EditableSection sectionKey={`project.${project.slug}`} label="Proje CTA">
      <section className="px-4 md:px-8 py-16 md:py-20 bg-site-dark text-site-dark-text text-center border-t border-[rgba(245,242,234,0.12)]">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-site-dark-text">
            {ctaText}
          </h2>
          <p className="text-lg md:text-xl text-site-dark-body mb-8 max-w-2xl">
            Villa, konut veya yatırım projeniz için detaylı bilgi almak ve size en uygun çözümü planlamak için bizimle iletişime geçebilirsiniz.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link 
              href={ctaBtnLink}
              className="w-full sm:w-auto h-12 flex items-center justify-center gap-2 bg-site-primary text-white px-10 font-bold transition-all hover:bg-site-primary-hover uppercase tracking-[0.24em] text-[11px] cursor-pointer rounded-none"
            >
              <span>{ctaBtnText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
