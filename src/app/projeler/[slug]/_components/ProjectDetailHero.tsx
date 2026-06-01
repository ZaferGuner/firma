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
  const heroImage =
    !imageError && data.coverImage && !data.coverImage.startsWith("/projects/")
      ? data.coverImage
      : "/images/projects/hero-house.jpg";

  return (
    <EditableSection sectionKey={`project.${project.slug}`} label={`Proje Detay: ${data.title}`}>
      <section data-header-theme="dark" className="relative flex h-[72vh] min-h-[620px] max-h-[820px] w-full items-end overflow-hidden bg-[#101010]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 bg-neutral-900">
          <Image
            src={heroImage}
            alt={data.title}
            fill
            className="object-cover opacity-75"
            onError={() => setImageError(true)}
            priority
          />
        </div>

        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.58)_42%,rgba(0,0,0,0.18)_100%)]" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />

        {/* Content */}
        <div className="relative z-20 w-full px-5 pb-14 md:px-8 md:pb-20">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={shouldPlay ? { opacity: 0, y: 30 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl"
              data-page-intro
              data-hero-intro
            >
              <IframeTransitionLink 
                href="/projects" 
                className="relative -top-5 mb-3 inline-flex items-center gap-2 text-site-dark-text hover:text-white transition-colors text-sm font-medium uppercase tracking-widest group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Tüm Projelere Dön</span>
              </IframeTransitionLink>

              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="bg-[rgba(245,242,234,0.10)] border border-[rgba(245,242,234,0.16)] text-site-dark-text px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
                  {data.category}
                </span>
                <span className="text-site-dark-muted text-sm font-medium uppercase tracking-wider">
                  {data.location}
                </span>
              </div>
              
              <h1 className="mb-6 max-w-[900px] text-5xl font-bold leading-[0.95] text-[#F7F4EF] md:text-7xl lg:text-8xl" data-hero-text data-page-intro data-hero-intro>
                {data.title}
              </h1>
              
              <p className="max-w-3xl text-lg font-light leading-relaxed text-[rgba(247,244,239,0.84)] md:text-2xl" data-hero-text data-page-intro data-hero-intro>
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
