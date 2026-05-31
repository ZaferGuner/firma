import { notFound } from "next/navigation";
import { db } from "@/lib/data";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { IframeTransitionLink } from "@/components/animation/IframeTransitionLink";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await db.seedDatabase();
  const project = await db.getProjectBySlug(slug);

  if (!project || !project.published || !project.specialPreviewEnabled) {
    return { title: "Proje Bulunamadı | Taner Tümer İnşaat" };
  }

  return {
    title: `${project.title} Ön Gösterim | Taner Tümer İnşaat`,
    description: project.specialPreviewIntro || project.description,
    robots: {
      index: !project.specialPreviewNoIndex,
      follow: !project.specialPreviewNoIndex,
    },
  };
}

export default async function SpecialPreviewPage({ params }: Props) {
  const { slug } = await params;
  await db.seedDatabase();
  const project = await db.getProjectBySlug(slug);

  // KURAL: Sadece published, sadece enabled ise göster. Draft okuma.
  if (!project || !project.published || !project.specialPreviewEnabled) {
    notFound();
  }

  const sections = project.specialPreviewSections || {};
  const highlights = project.specialPreviewHighlights || [];
  const blueprintNotes = project.specialPreviewBlueprintNotes || [];
  const textureNotes = project.specialPreviewTextureNotes || [];

  return (
    <main className="min-h-screen bg-[#F7F4EF] text-[#2E2E2B] font-sans overflow-hidden">
      {/* SECTION A: Cinematic Hero */}
      <section className="relative w-full min-h-[90vh] bg-[#2E302B] text-[#F5F2EA] flex flex-col justify-between overflow-hidden pt-32 pb-16 px-6 sm:px-12 md:px-24">
        {/* Decorative Hero Blueprint Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(245, 242, 234, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(245, 242, 234, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '4vw 4vw'
        }} />
        <div className="absolute inset-0 pointer-events-none border-l border-r border-[#F5F2EA]/10 w-full max-w-[1400px] mx-auto" />
        
        {project.coverImage && (
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover grayscale" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2E302B] to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-[1400px] w-full mx-auto flex justify-between items-start">
          <IframeTransitionLink href={`/projeler/${slug}`} className="text-[10px] font-mono tracking-widest uppercase flex items-center gap-2 hover:text-[#B6A18D] transition-colors">
            <ArrowLeft size={14} /> Normal Sayfaya Dön
          </IframeTransitionLink>
          {project.specialPreviewStatus && (
            <span className="text-[10px] font-mono tracking-widest uppercase border border-[#F5F2EA]/20 px-3 py-1 bg-[#F5F2EA]/5">
              {project.specialPreviewStatus}
            </span>
          )}
        </div>

        <div className="relative z-10 max-w-[1400px] w-full mx-auto">
          {project.specialPreviewSubtitle && (
            <div className="text-[10px] sm:text-[12px] font-mono tracking-[0.25em] text-[#C8C2B6] uppercase mb-6">
              {project.specialPreviewSubtitle}
            </div>
          )}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight leading-[0.9] mb-8">
            {project.specialPreviewTitle || project.title}
          </h1>
          {project.specialPreviewIntro && (
            <p className="text-lg sm:text-xl md:text-2xl text-[#C8C2B6] max-w-2xl font-light leading-relaxed">
              {project.specialPreviewIntro}
            </p>
          )}
        </div>

        {/* Lower Decorative Data */}
        <div className="relative z-10 max-w-[1400px] w-full mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mt-24">
          <div className="font-mono text-[10px] text-[#C8C2B6] uppercase tracking-widest space-y-1">
            <div>PROJE ID: {project.slug.substring(0, 8).toUpperCase()}</div>
            <div>KOORD: 37.000° N, 35.321° E</div>
          </div>
          {project.specialPreviewAccessLabel && (
            <div className="font-mono text-[10px] text-[#B6A18D] uppercase tracking-widest">
              {project.specialPreviewAccessLabel}
            </div>
          )}
        </div>
      </section>

      {/* SECTION B: Project Identity Strip */}
      <div className="w-full border-b border-[#E1DDD4] bg-[#FFFEFA]">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 md:px-24 py-6 flex flex-wrap gap-x-12 gap-y-4 font-mono text-[11px] uppercase tracking-wider text-[#76736C]">
          <div className="flex flex-col gap-1">
            <span className="text-[#2E2E2B] font-medium">Proje</span>
            <span>{project.title}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[#2E2E2B] font-medium">Kategori</span>
            <span>{project.category}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[#2E2E2B] font-medium">Lokasyon</span>
            <span>{project.location}</span>
          </div>
        </div>
      </div>

      {/* SECTION C: Concept Section */}
      {(sections.conceptTitle || sections.conceptText) && (
        <section className="relative py-24 sm:py-32 px-6 sm:px-12 md:px-24 border-b border-[#E1DDD4]">
          <div className="absolute left-[10%] top-0 bottom-0 w-[1px] bg-[#E1DDD4]" />
          <div className="absolute left-[50%] top-0 bottom-0 w-[1px] bg-[#E1DDD4] hidden md:block" />
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
            <div>
              <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-[#2E2E2B]">
                {sections.conceptTitle}
              </h2>
            </div>
            <div>
              <p className="text-lg sm:text-xl leading-relaxed text-[#76736C] font-light">
                {sections.conceptText}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* SECTION D: Blueprint / Plan Language Section */}
      {(sections.architectureTitle || blueprintNotes.length > 0) && (
        <section className="relative py-24 sm:py-32 px-6 sm:px-12 md:px-24 bg-[#FFFEFA] border-b border-[#E1DDD4] overflow-hidden">
          {/* SVG Blueprint Grid Background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none flex justify-center items-center">
             <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <rect width="40" height="40" fill="none" stroke="#2E2E2B" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <circle cx="50%" cy="50%" r="200" fill="none" stroke="#2E2E2B" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#2E2E2B" strokeWidth="0.5" />
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#2E2E2B" strokeWidth="0.5" />
             </svg>
          </div>
          
          <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col md:flex-row gap-16">
            <div className="w-full md:w-1/3">
              <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-[#2E2E2B] mb-6">
                {sections.architectureTitle}
              </h2>
              <p className="text-lg text-[#76736C] font-light leading-relaxed mb-8">
                {sections.architectureText}
              </p>
            </div>
            
            <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {blueprintNotes.map((note: any, i: number) => (
                <div key={i} className="border border-[#E1DDD4] bg-[#FFFEFA]/80 backdrop-blur-sm p-6 relative">
                  <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#2E2E2B]" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-[#2E2E2B]" />
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-[#2E2E2B]" />
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-[#2E2E2B]" />
                  
                  <div className="font-mono text-[9px] uppercase tracking-widest text-[#B6A18D] mb-2">{note.label}</div>
                  <div className="text-[#2E2E2B] font-light text-lg">{note.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION E: 3D Texture / Material Mood Section */}
      {(sections.materialsTitle || textureNotes.length > 0) && (
        <section className="relative py-24 sm:py-32 px-6 sm:px-12 md:px-24 bg-[#2E302B] text-[#F5F2EA] border-b border-[#2E2E2B]">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-16">
              <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-[#F5F2EA] mb-6">
                {sections.materialsTitle}
              </h2>
              <p className="text-lg text-[#C8C2B6] max-w-2xl font-light leading-relaxed">
                {sections.materialsText}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {textureNotes.map((note: any, i: number) => (
                <div key={i} className="group relative h-64 overflow-hidden bg-[#393B35] flex flex-col justify-end p-6 border border-white/5 transition-colors hover:border-[#B6A18D]/50">
                  {/* Subtle Texture Gradient Layer */}
                  <div className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-40" style={{
                    background: `radial-gradient(circle at top right, #EEEAE2 0%, transparent 60%), linear-gradient(to bottom right, transparent 0%, #2E2E2B 100%)`
                  }} />
                  <div className="relative z-10">
                    <h4 className="text-xl font-light mb-2">{note.title}</h4>
                    <p className="text-sm text-[#C8C2B6] font-light line-clamp-3">{note.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION F: Experience / Lifestyle Section */}
      {(sections.lifestyleTitle || highlights.length > 0) && (
        <section className="relative py-24 sm:py-32 px-6 sm:px-12 md:px-24 bg-[#FFFEFA]">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-[#2E2E2B] mb-6">
                {sections.lifestyleTitle}
              </h2>
              <p className="text-lg text-[#76736C] font-light leading-relaxed mb-8">
                {sections.lifestyleText}
              </p>
              
              {highlights.length > 0 && (
                <ul className="space-y-4 border-t border-[#E1DDD4] pt-8">
                  {highlights.map((hl: string, i: number) => (
                    <li key={i} className="flex gap-4 items-start font-light text-[#2E2E2B]">
                      <span className="font-mono text-[10px] text-[#B6A18D] mt-1.5">0{i + 1}</span>
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="lg:col-span-7 flex items-center justify-center bg-[#F7F4EF] border border-[#E1DDD4] min-h-[400px] relative p-12">
              <div className="absolute top-4 left-4 font-mono text-[9px] text-[#76736C] uppercase">Fig. 01 — Yaşam Alanı Perspektifi</div>
              <div className="absolute bottom-4 right-4 font-mono text-[9px] text-[#76736C] uppercase">Ölçek: Serbest</div>
              {/* Abstract Typographic Graphic */}
              <div className="text-[12rem] font-light tracking-tighter text-[#2E2E2B]/5 select-none leading-none">
                YSM
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION G: Technical Confidence Section */}
      {(sections.technicalTitle || sections.technicalText) && (
        <section className="relative py-24 sm:py-32 px-6 sm:px-12 md:px-24 bg-[#EEEAE2] border-t border-b border-[#E1DDD4]">
          <div className="max-w-3xl mx-auto text-center">
            <div className="font-mono text-[10px] text-[#74746A] tracking-[0.2em] mb-6 uppercase">
              Mühendislik & Güven
            </div>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-[#2E2E2B] mb-8">
              {sections.technicalTitle}
            </h2>
            <p className="text-lg text-[#76736C] font-light leading-relaxed">
              {sections.technicalText}
            </p>
          </div>
        </section>
      )}

      {/* SECTION H: Immersive Closing CTA */}
      <section className="relative py-32 sm:py-48 px-6 sm:px-12 md:px-24 bg-[#2E302B] text-center border-t border-[#44463F]">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center">
          <div className="w-[1px] h-24 bg-[#F5F2EA]/20 mb-12" />
          <h2 className="text-4xl sm:text-6xl font-light tracking-tight text-[#F5F2EA] mb-6">
            {project.specialPreviewCtaTitle || "Projeyi yakından incelemek ister misiniz?"}
          </h2>
          <p className="text-xl text-[#C8C2B6] font-light mb-12 max-w-2xl">
            {project.specialPreviewCtaText || "Özel sunum detayları ve yerinde inceleme randevusu için satış ofisimizle iletişime geçin."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <a 
              href={project.ctaBtnLink || "/iletisim"} 
              className="inline-flex items-center gap-2 bg-[#F5F2EA] text-[#2E302B] px-8 py-4 text-xs font-mono font-bold uppercase tracking-[0.2em] transition-colors hover:bg-white"
            >
              {project.specialPreviewCtaButtonLabel || project.ctaBtnText || "Bilgi Al"} <ArrowUpRight size={14} />
            </a>
            <IframeTransitionLink 
              href={`/projeler/${slug}`}
              className="inline-flex items-center gap-2 border border-[#F5F2EA]/20 text-[#F5F2EA] px-8 py-4 text-xs font-mono font-bold uppercase tracking-[0.2em] transition-colors hover:bg-[#F5F2EA]/10"
            >
              Normal Proje Sayfasına Dön
            </IframeTransitionLink>
          </div>
        </div>
      </section>
    </main>
  );
}
