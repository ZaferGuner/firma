"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useEditableContent } from "@/hooks/useEditableContent";
import { EditableSection } from "@/components/admin/EditableSection";
import { useShouldPlayHeroIntro } from "@/hooks/useShouldPlayHeroIntro";
import { IframeTransitionLink } from "@/components/animation/IframeTransitionLink";

interface ProjectDetailHeroProps {
  project: any;
}

export function ProjectDetailHero({ project }: ProjectDetailHeroProps) {
  const shouldPlay = useShouldPlayHeroIntro();
  const [imageError, setImageError] = useState(false);
  const data = useEditableContent(`project.${project.slug}`, project);

  return (
    <EditableSection sectionKey={`project.${project.slug}`} label={`Proje Detay: ${data.title}`}>
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-end">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 bg-neutral-900">
          {!imageError ? (
            <Image
              src={data.coverImage}
              alt={data.title}
              fill
              className="object-cover opacity-70"
              onError={() => setImageError(true)}
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-800 to-neutral-900 flex items-center justify-center text-neutral-600">
              <span className="font-medium text-lg uppercase tracking-widest">Görsel Hazırlanıyor</span>
            </div>
          )}
        </div>

        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Content */}
        <div className="relative z-20 w-full px-4 md:px-8 pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={shouldPlay ? { opacity: 0, y: 30 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
              data-page-intro
              data-hero-intro
            >
              <IframeTransitionLink 
                href="/projects" 
                className="inline-flex items-center gap-2 text-site-dark-text hover:text-white transition-colors text-sm font-medium uppercase tracking-widest mb-8 group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Tüm Projelere Dön</span>
              </IframeTransitionLink>

              <div className="inline-flex items-center gap-3 mb-6">
                <span className="bg-[rgba(245,242,234,0.10)] border border-[rgba(245,242,234,0.16)] text-site-dark-text px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
                  {data.category}
                </span>
                <span className="text-site-dark-muted text-sm font-medium uppercase tracking-wider">
                  {data.location}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#F7F4EF] mb-6 leading-tight" data-hero-text data-page-intro data-hero-intro>
                {data.title}
              </h1>
              
              <p className="text-xl md:text-2xl text-[rgba(247,244,239,0.84)] font-light leading-relaxed" data-hero-text data-page-intro data-hero-intro>
                {data.shortDescription}
              </p>

              {data.specialPreviewEnabled && data.specialPreviewAccessMode === "public" && (
                <div className="mt-10" data-hero-text data-page-intro data-hero-intro>
                  <IframeTransitionLink
                    href={`/projeler/${project.slug}/on-gosterim`}
                    className="inline-flex items-center gap-2 bg-[#F5F2EA] text-[#2E302B] px-6 py-3 text-[11px] font-mono font-bold uppercase tracking-widest transition-colors hover:bg-white border border-transparent hover:border-[#2E302B]/20"
                  >
                    Özel Ön Gösterimi Aç
                  </IframeTransitionLink>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </EditableSection>
  );
}

