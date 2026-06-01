"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Camera } from "lucide-react";
import { IframeTransitionLink } from "@/components/animation/IframeTransitionLink";
import { Reveal } from "@/components/animation/Reveal";
import { projects } from "@/data/projects";

import { useAdminEdit } from "@/context/AdminEditContext";
import { AdminEditButton } from "@/components/admin/AdminEditButton";
import { useEditableContent } from "@/hooks/useEditableContent";

// Clean project-specific descriptions requested by the user
const projectDescriptions: Record<string, string> = {
  "villa-the-same": "Akıllı ev altyapısı, özel araç girişi ve modern villa yaşamı için tasarlanan seçkin proje.",
  "tumerhan-twins": "Bağımsız bahçe, sosyal alanlar, havuz ve yüksek konfor standartlarıyla planlanan özel yaşam alanı.",
  "tumerhan-towers": "Geniş kapalı mutfak, kaliteli iç mekan malzemeleri ve modern detaylarla tasarlanmış konut projesi.",
};

interface FeaturedProjectsProps {
  initialData?: any;
  initialProjects?: any[];
}

export function FeaturedProjects({ initialData, initialProjects }: FeaturedProjectsProps) {
  const adminContext = useAdminEdit();
  
  const content = useEditableContent("home.featuredIntro", initialData || {
    supertitle: "MİMARİ YATIRIMLARIMIZ",
    title: "Öne Çıkan Projeler",
    description: "Modern yaşam standartlarını, mimari detayları ve konfor odaklı planlamayı bir araya getiren projelerimizi inceleyin."
  });

  // Safe mapping of hero and secondary projects
  const projectSource = initialProjects && initialProjects.length > 0 ? initialProjects : projects;
  const heroProject = projectSource.find((p) => p.slug === "villa-the-same") || projectSource[0];
  const secondaryProjects = projectSource.filter((p) => p.slug !== heroProject.slug).slice(0, 2);

  const [heroImageError, setHeroImageError] = useState(false);
  const [secondaryImageErrors, setSecondaryImageErrors] = useState<Record<string, boolean>>({});

  const handleSecondaryImageError = (slug: string) => {
    setSecondaryImageErrors((prev) => ({ ...prev, [slug]: true }));
  };

  // Helper to determine if a cover image is physically real & available
  const isRealImage = (src?: string) => {
    if (!src) return false;
    // Known missing folder path. If it starts with /projects/, it's a placeholder path because there is no public/projects folder.
    if (src.startsWith("/projects/")) return false;
    return true;
  };

  const hasHeroImage = heroProject && isRealImage(heroProject.coverImage) && !heroImageError;

  return (
    <section
      data-header-theme="light"
      id="featured-projects-section"
      aria-labelledby="featured-projects-title"
      className="relative group"
    >
      <style>{`
        #featured-projects-section {
          --fp-bg: #F7F4EF;
          --fp-surface: #FFFEFA;
          --fp-soft: #EEEAE2;
          --fp-text: #2E2E2B;
          --fp-body: #3F3F39;
          --fp-muted: #6E6A63;
          --fp-border: #E1DDD4;
          --fp-primary: #74746A;
          --fp-primary-hover: #68685F;
          --fp-accent: #B6A18D;
          --fp-dark: #202224;
          --fp-dark-text: #F5F2EA;

          background-color: var(--fp-bg);
          color: var(--fp-text);
          padding-top: 88px;
          padding-bottom: 96px;
          border-bottom: 1px solid var(--fp-border);
        }

        #fp-wrapper {
          max-width: 1360px;
          margin: 0 auto;
          padding-left: 20px;
          padding-right: 20px;
        }

        #featured-projects-section .fp-header {
          margin-bottom: 48px;
        }

        #featured-projects-section .fp-eyebrow {
          font-size: clamp(0.6875rem, 0.64rem + 0.2vw, 0.8125rem);
          font-weight: 600;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--fp-accent);
          margin-bottom: 14px;
          display: inline-block;
        }

        #featured-projects-section .fp-title {
          font-size: clamp(2.5rem, 1.7rem + 2.65vw, 4.75rem);
          line-height: 0.96;
          font-weight: 600;
          color: var(--fp-text);
          max-width: 11ch;
          margin-bottom: 16px;
          letter-spacing: -0.04em;
        }

        #featured-projects-section .fp-description {
          font-size: clamp(1rem, 0.96rem + 0.18vw, 1.125rem);
          line-height: 1.7;
          color: var(--fp-body);
          max-width: 42ch;
        }

        #featured-projects-section .fp-note {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--fp-muted);
          font-weight: 700;
        }

        #featured-projects-section .fp-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }

        #featured-projects-section .fp-card {
          background: #FFFEFA;
          border: 1px solid #E1DDD4;
          border-radius: 0px;
          box-shadow: none;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: border-color 300ms cubic-bezier(.22, 1, .36, 1), background-color 300ms cubic-bezier(.22, 1, .36, 1);
        }

        #featured-projects-section .fp-card:hover {
          border-color: #CFC7BA;
          background-color: #FCFAF5;
        }

        #featured-projects-section .fp-card-link {
          outline: none;
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          text-decoration: none;
        }

        #featured-projects-section .fp-card-link:focus-visible {
          outline: none;
        }

        #featured-projects-section .fp-card:has(.fp-card-link:focus-visible) {
          border-color: var(--fp-primary);
        }
        
        #featured-projects-section .fp-featured-figure {
          position: relative;
          overflow: hidden;
          background: var(--fp-soft);
          width: 100%;
          aspect-ratio: 16 / 10;
        }

        #featured-projects-section .fp-secondary-figure {
          position: relative;
          overflow: hidden;
          background: var(--fp-soft);
          width: 100%;
          aspect-ratio: 16 / 10;
        }

        #featured-projects-section .fp-card-image {
          object-fit: cover;
          transition: transform 320ms cubic-bezier(.22, 1, .36, 1);
        }

        #featured-projects-section .fp-card:hover .fp-card-image,
        #featured-projects-section .fp-card:has(.fp-card-link:focus-visible) .fp-card-image {
          transform: scale(1.03);
        }

        #featured-projects-section .fp-featured-content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          flex-grow: 1;
          justify-content: space-between;
        }

        #featured-projects-section .fp-secondary-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          flex-grow: 1;
          justify-content: space-between;
        }

        #featured-projects-section .fp-meta {
          font-family: var(--font-geist-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--fp-muted);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        #featured-projects-section .fp-featured-title {
          font-size: clamp(1.75rem, 1.4rem + 1.1vw, 2.625rem);
          line-height: 0.98;
          font-weight: 600;
          color: var(--fp-text);
          letter-spacing: -0.035em;
        }

        #featured-projects-section .fp-secondary-title {
          font-size: clamp(1.375rem, 1.15rem + 0.75vw, 1.875rem);
          line-height: 1.04;
          font-weight: 600;
          color: var(--fp-text);
          letter-spacing: -0.025em;
        }

        #featured-projects-section .fp-summary {
          font-size: 15px;
          line-height: 1.75;
          color: var(--fp-body);
        }

        #featured-projects-section .fp-featured-summary {
          max-width: 48ch;
        }

        #featured-projects-section .fp-secondary-summary {
          max-width: 34ch;
        }

        #featured-projects-section .fp-cta-divider {
          border-top: 1px solid var(--fp-border);
          margin: 0;
          width: 100%;
        }

        #featured-projects-section .fp-cta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding-top: 12px;
        }

        #featured-projects-section .fp-cta-label {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 600;
          color: var(--fp-primary);
          transition: color 240ms cubic-bezier(.22, 1, .36, 1);
        }

        #featured-projects-section .fp-card:hover .fp-cta-label,
        #featured-projects-section .fp-card:has(.fp-card-link:focus-visible) .fp-cta-label {
          color: var(--fp-primary-hover);
        }

        #featured-projects-section .fp-cta-icon {
          color: var(--fp-primary);
          transition: transform 300ms cubic-bezier(.22, 1, .36, 1), color 240ms cubic-bezier(.22, 1, .36, 1);
        }

        #featured-projects-section .fp-card:hover .fp-cta-icon,
        #featured-projects-section .fp-card:has(.fp-card-link:focus-visible) .fp-cta-icon {
          transform: translateX(4px);
          color: var(--fp-primary-hover);
        }

        @media (max-width: 767px) {
          #featured-projects-section .fp-card {
            position: relative;
            background: var(--fp-dark);
            border-color: rgba(245, 242, 234, 0.14);
          }

          #featured-projects-section .fp-card-featured {
            min-height: 430px;
          }

          #featured-projects-section .fp-card-secondary {
            min-height: 340px;
          }

          #featured-projects-section .fp-card-link {
            position: relative;
            min-height: inherit;
            justify-content: flex-end;
            overflow: hidden;
          }

          #featured-projects-section .fp-featured-figure,
          #featured-projects-section .fp-secondary-figure {
            position: absolute;
            inset: 0;
            height: 100%;
            aspect-ratio: auto;
          }

          #featured-projects-section .fp-featured-figure::after,
          #featured-projects-section .fp-secondary-figure::after {
            content: "";
            position: absolute;
            inset: 0;
            background:
              linear-gradient(180deg, rgba(32, 34, 36, 0.04) 0%, rgba(32, 34, 36, 0.35) 46%, rgba(32, 34, 36, 0.86) 100%),
              linear-gradient(90deg, rgba(32, 34, 36, 0.54), transparent 48%);
          }

          #featured-projects-section .fp-featured-content,
          #featured-projects-section .fp-secondary-content {
            position: relative;
            z-index: 1;
            padding: 22px;
          }

          #featured-projects-section .fp-featured-title,
          #featured-projects-section .fp-secondary-title {
            color: var(--fp-dark-text);
          }

          #featured-projects-section .fp-summary {
            color: rgba(245, 242, 234, 0.82);
          }

          #featured-projects-section .fp-meta {
            color: rgba(245, 242, 234, 0.68);
          }

          #featured-projects-section .fp-cta-divider {
            border-color: rgba(245, 242, 234, 0.18);
          }

          #featured-projects-section .fp-cta-label,
          #featured-projects-section .fp-cta-icon {
            color: var(--fp-dark-text);
          }
        }

        @media (min-width: 640px) {
          #fp-wrapper {
            padding-left: 24px;
            padding-right: 24px;
          }
        }

        @media (min-width: 768px) {
          #featured-projects-section {
            padding-top: 104px;
            padding-bottom: 112px;
          }
          #featured-projects-section .fp-grid {
            gap: 32px;
          }
          #featured-projects-section .fp-header {
            margin-bottom: 56px;
          }
          #featured-projects-section .fp-featured-content {
            padding: 28px;
          }
          #featured-projects-section .fp-secondary-content {
            padding: 24px;
          }
          #featured-projects-section .fp-summary {
            font-size: 16px;
          }
        }

        @media (min-width: 1024px) {
          #featured-projects-section {
            padding-top: 120px;
            padding-bottom: 128px;
          }
          #fp-wrapper {
            padding-left: 40px;
            padding-right: 40px;
          }
          #featured-projects-section .fp-grid {
            display: grid;
            grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
            gap: 32px;
            align-items: stretch;
          }
          #featured-projects-section .fp-col-featured {
            grid-column: auto;
          }
          #featured-projects-section .fp-col-secondary {
            grid-column: auto;
          }
          #featured-projects-section .fp-card-featured {
            min-height: 580px;
          }
          #featured-projects-section .fp-header {
            margin-bottom: 64px;
          }
          #featured-projects-section .fp-featured-figure {
            aspect-ratio: 16 / 9.5;
          }
          #featured-projects-section .fp-secondary-figure {
            aspect-ratio: 16 / 10;
          }
        }

        @media (min-width: 1280px) {
          #fp-wrapper {
            padding-left: 48px;
            padding-right: 48px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          #featured-projects-section *,
          #featured-projects-section .fp-card,
          #featured-projects-section .fp-card-image,
          #featured-projects-section .fp-cta-icon {
            transition: none !important;
            transform: none !important;
            animation: none !important;
            scale: none !important;
          }
          #featured-projects-section .fp-card:hover,
          #featured-projects-section .fp-card:has(.fp-card-link:focus-visible) {
            transform: none !important;
          }
        }
      `}</style>

      {adminContext && !adminContext.isPreviewMode && (
        <AdminEditButton onClick={() => adminContext.openSectionEditor("home.featuredIntro")} label="Başlığı Düzenle" position="top-right" />
      )}
      <div id="fp-wrapper">
        {/* Section Header - Asymmetric Editorial Layout */}
        <header className="fp-header grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end">
          <div className="lg:col-span-7 flex flex-col items-start">
            <Reveal>
              <span className="fp-eyebrow">
                {content.supertitle}
              </span>
              <h2 id="featured-projects-title" className="fp-title">
                {content.title}
              </h2>
            </Reveal>
          </div>
          
          <div className="lg:col-span-5 flex flex-col items-start lg:pb-1">
            <Reveal delay={0.08}>
              <p className="fp-description">
                {content.description}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-[color:var(--fp-accent)] rounded-full animate-pulse" />
                <span className="fp-note">
                  SEÇKİN YAŞAM PORTFÖYÜ
                </span>
              </div>
            </Reveal>
          </div>
        </header>

        {/* Curator Showcase Grid */}
        <div className="fp-grid">
          
          {/* Sol: Featured Dominant Card Column */}
          {heroProject && (
            <div className="fp-col-featured">
              <Reveal delay={0.05} className="h-full">
                <ol className="list-none p-0 m-0" aria-label="Öne çıkan ana proje">
                  <li>
                    <article className="fp-card fp-card-featured h-full">
                      <IframeTransitionLink
                        href={`/projects/${heroProject.slug}`}
                        className="fp-card-link group/card"
                        aria-labelledby={`fp-title-${heroProject.slug}`}
                        aria-describedby={`fp-desc-${heroProject.slug}`}
                      >
                        {hasHeroImage ? (
                          <>
                            {/* Editorial Image Layout */}
                            <figure className="fp-featured-figure">
                              <Image
                                src={heroProject.coverImage}
                                alt={`${heroProject.title} projesinin dış cephe ve mimari detay görseli`}
                                fill
                                sizes="(min-width: 1280px) 770px, (min-width: 1024px) 58vw, 100vw"
                                className="fp-card-image"
                                onError={() => setHeroImageError(true)}
                                priority
                              />
                            </figure>

                            <div className="fp-featured-content">
                              <div>
                                {/* Meta Row */}
                                <div className="fp-meta mb-3">
                                  <span>01</span>
                                  <span>—</span>
                                  <span>Featured Project</span>
                                  <span>/</span>
                                  <span>{heroProject.location}</span>
                                </div>

                                <h3 id={`fp-title-${heroProject.slug}`} className="fp-featured-title">
                                  {heroProject.title}
                                </h3>
                                
                                <p id={`fp-desc-${heroProject.slug}`} className="fp-summary fp-featured-summary mt-5 line-clamp-4">
                                  {projectDescriptions[heroProject.slug] || heroProject.shortDescription}
                                </p>
                              </div>

                              <div className="flex flex-col w-full mt-6">
                                <hr className="fp-cta-divider" />
                                <div className="fp-cta-row">
                                  <span className="fp-cta-label">PROJEYİ İNCELE</span>
                                  <ArrowRight className="fp-cta-icon h-4.5 w-4.5" aria-hidden="true" />
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          /* Architectural Dossier Layout (No Image Placeholder) */
                          <div className="fp-dossier-card min-h-[420px] p-8 lg:p-9 flex flex-col justify-between relative overflow-hidden bg-[#FFFEFA] h-full flex-grow transition-all duration-300">
                            {/* Fine grid overlay */}
                            <div className="absolute inset-0 pointer-events-none border-b border-[#E1DDD4]/40 bg-[linear-gradient(90deg,rgba(225,221,212,0.15)_1px,transparent_1px)] bg-[size:40px_100%]" />
                            
                            {/* Big decorative index background watermark */}
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 select-none pointer-events-none font-bold text-[clamp(100px,12vw,180px)] leading-none text-[#2E2E2B] opacity-[0.035] tracking-tighter uppercase">
                              VILLA
                            </div>

                            <div className="w-full">
                              {/* Top Row */}
                              <div className="relative z-10 flex items-center justify-between border-b border-[#E1DDD4] pb-4 mb-6">
                                <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#76736C]">TANER TÜMER İNŞAAT</span>
                                <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#76736C]">01 / FEATURED</span>
                              </div>

                              {/* Mid Content Area */}
                              <div className="relative z-10 flex flex-col gap-4 py-2 text-left">
                                <div className="flex flex-col gap-2">
                                  <span className="font-mono text-[10px] font-bold tracking-[0.18em] text-[#76736C] uppercase">
                                    VİLLA PROJESİ / {heroProject.location.toUpperCase()}
                                  </span>
                                  <h3 id={`fp-title-${heroProject.slug}`} className="font-semibold text-[#2E2E2B] text-[clamp(32px,3vw,54px)] leading-[0.95] tracking-[-0.04em]">
                                    {heroProject.title}
                                  </h3>
                                </div>
                                
                                <p id={`fp-desc-${heroProject.slug}`} className="text-[#3F3F39] text-[14px] sm:text-[15px] leading-relaxed max-w-[42ch] line-clamp-4">
                                  {projectDescriptions[heroProject.slug] || heroProject.shortDescription}
                                </p>

                                {/* Feature Pills (max 2) */}
                                {heroProject.features && heroProject.features.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {heroProject.features.slice(0, 2).map((feat: string, fIdx: number) => (
                                      <span key={fIdx} className="px-2.5 py-1 bg-[#EEEAE2] text-[#55564F] border border-[#E1DDD4] text-[10px] tracking-[0.12em] uppercase font-mono font-medium">
                                        {feat}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Bottom Row */}
                            <div className="relative z-10 pt-6 mt-6 border-t border-[#E1DDD4]">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold tracking-[0.2em] text-[#74746A] uppercase">
                                  PROJEYİ İNCELE
                                </span>
                                <ArrowRight className="fp-cta-icon h-[18px] w-[18px] text-[#74746A] transition-transform duration-300" />
                              </div>
                            </div>
                          </div>
                        )}
                      </IframeTransitionLink>
                    </article>
                  </li>
                </ol>
              </Reveal>
            </div>
          )}

          {/* Sağ: Secondary Cards Stack Column */}
          <div className="fp-col-secondary lg:h-full">
            <ol className="list-none p-0 m-0 flex flex-col lg:grid lg:grid-cols-1 lg:grid-rows-2 gap-6 lg:gap-6 lg:h-full" aria-label="Destekleyici projeler">
              {secondaryProjects.map((project, idx) => {
                const displayIndex = idx === 0 ? "02" : "03";
                const displayMeta = displayIndex === "02" ? "Twins" : "Towers";
                const hasImg = isRealImage(project.coverImage) && !secondaryImageErrors[project.slug];
                return (
                  <li key={project.slug} className="h-full">
                    <Reveal delay={0.12 + idx * 0.08} className="h-full">
                      <article className="fp-card fp-card-secondary h-full">
                        <IframeTransitionLink
                          href={`/projects/${project.slug}`}
                          className="fp-card-link group/card"
                          aria-labelledby={`fp-title-${project.slug}`}
                          aria-describedby={`fp-desc-${project.slug}`}
                        >
                          {hasImg ? (
                            <>
                              {/* Editorial Image Layout */}
                              <figure className="fp-secondary-figure">
                                <Image
                                  src={project.coverImage}
                                  alt={`${project.title} projesinin dış cephe ve mimari tasarım görseli`}
                                  fill
                                  sizes="(min-width: 1280px) 520px, (min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
                                  className="fp-card-image"
                                  onError={() => handleSecondaryImageError(project.slug)}
                                />
                              </figure>
                              
                              <div className="fp-secondary-content">
                                <div>
                                  {/* Upper Row: Type & Index */}
                                  <div className="fp-meta mb-2.5">
                                    <span>{displayMeta}</span>
                                    <span>—</span>
                                    <span>{displayIndex}</span>
                                  </div>

                                  <h3 id={`fp-title-${project.slug}`} className="fp-secondary-title">
                                    {project.title}
                                  </h3>
                                  
                                  <p id={`fp-desc-${project.slug}`} className="fp-summary fp-secondary-summary mt-3 line-clamp-3">
                                    {projectDescriptions[project.slug] || project.shortDescription}
                                  </p>
                                </div>

                                <div className="flex flex-col w-full mt-4">
                                  <hr className="fp-cta-divider" />
                                  <div className="fp-cta-row">
                                    <span className="fp-cta-label">PROJEYİ İNCELE</span>
                                    <ArrowRight className="fp-cta-icon h-4 w-4" aria-hidden="true" />
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            /* Architectural Dossier Layout (No Image Placeholder) */
                            <div className="fp-dossier-card min-h-[230px] p-6 lg:p-7 flex flex-col justify-between relative overflow-hidden bg-[#FFFEFA] h-full flex-grow transition-all duration-300">
                              {/* Fine grid overlay */}
                              <div className="absolute inset-0 pointer-events-none border-b border-[#E1DDD4]/40 bg-[linear-gradient(90deg,rgba(225,221,212,0.12)_1px,transparent_1px)] bg-[size:30px_100%]" />
                              
                              {/* Decorative index background watermark */}
                              <div className="absolute right-6 top-1/2 -translate-y-1/2 select-none pointer-events-none font-bold text-[clamp(80px,10vw,130px)] leading-none text-[#2E2E2B] opacity-[0.025] tracking-tighter">
                                {displayIndex}
                              </div>

                              <div className="w-full">
                                {/* Top Row */}
                                <div className="relative z-10 flex items-center justify-between border-b border-[#E1DDD4] pb-3 mb-4">
                                  <span className="font-mono text-[10px] font-bold tracking-[0.18em] text-[#76736C] uppercase">
                                    {project.category.toUpperCase()} / {project.location.toUpperCase()}
                                  </span>
                                  <span className="font-mono text-[10px] font-bold tracking-[0.18em] text-[#76736C]">
                                    {displayIndex}
                                  </span>
                                </div>

                                {/* Mid Content Area */}
                                <div className="relative z-10 flex flex-col gap-3 py-1.5 text-left">
                                  <h3 id={`fp-title-${project.slug}`} className="font-semibold text-[#2E2E2B] text-[clamp(24px,1.8vw,32px)] leading-none tracking-[-0.03em]">
                                    {project.title}
                                  </h3>
                                  
                                  <p id={`fp-desc-${project.slug}`} className="text-[#3F3F39] text-[13px] sm:text-[14px] leading-relaxed max-w-[40ch] line-clamp-3">
                                    {projectDescriptions[project.slug] || project.shortDescription}
                                  </p>

                                  {/* Feature Pills (max 2) */}
                                  {project.features && project.features.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                      {project.features.slice(0, 2).map((feat: string, fIdx: number) => (
                                        <span key={fIdx} className="px-2 py-0.5 bg-[#EEEAE2] text-[#55564F] border border-[#E1DDD4] text-[10px] tracking-[0.12em] uppercase font-mono font-medium">
                                          {feat}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Bottom Row */}
                              <div className="relative z-10 pt-4 mt-4 border-t border-[#E1DDD4]">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-bold tracking-[0.2em] text-[#74746A] uppercase">
                                    PROJEYİ İNCELE
                                  </span>
                                  <ArrowRight className="fp-cta-icon h-4 w-4 text-[#74746A] transition-transform duration-300" />
                                </div>
                              </div>
                            </div>
                          )}
                        </IframeTransitionLink>
                      </article>
                    </Reveal>
                  </li>
                );
              })}
            </ol>
          </div>

        </div>

        {/* Architectural Footer CTA */}
        <Reveal className="w-full mt-16 lg:mt-20" delay={0.15}>
          <footer className="w-full border-t border-[#E1DDD4] pt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <p className="text-[12px] tracking-[0.14em] uppercase text-[#76736C] font-mono leading-relaxed max-w-md">
                Diğer villa ve konut projelerimizi portföy sayfasında inceleyin.
              </p>
              <IframeTransitionLink
                className="inline-flex h-[48px] w-[calc(100vw-80px)] max-w-[340px] shrink-0 cursor-pointer items-center justify-center bg-[#74746A] px-7 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFFFFF] transition-colors duration-200 hover:bg-[#68685F] md:w-auto md:max-w-none"
                href="/projects"
              >
                Tüm Projeleri İncele
              </IframeTransitionLink>
            </div>
          </footer>
        </Reveal>
      </div>
    </section>

  );
}
