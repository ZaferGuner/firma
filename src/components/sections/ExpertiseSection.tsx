"use client";

import { Reveal } from "@/components/animation/Reveal";
import { Container } from "@/components/ui/Container";
import { expertiseAreas } from "@/data/home";

import { useAdminEdit } from "@/context/AdminEditContext";
import { AdminEditButton } from "@/components/admin/AdminEditButton";

interface ExpertiseSectionProps {
  initialData?: any;
}

import { useEditableContent } from "@/hooks/useEditableContent";

export function ExpertiseSection({ initialData }: ExpertiseSectionProps) {
  const adminContext = useAdminEdit();

  const content = useEditableContent("home.expertise", initialData || {
    supertitle: "UZMANLIK ALANLARIMIZ",
    title: "Uzmanlık Alanlarımız",
    description: "Yaşam projelerinde mimari tasarım, inşaat kalitesi ve uygulama detaylarını bütüncül bir yaklaşımla ele alıyoruz.",
    items: expertiseAreas
  });

  const displayItems = content.items || expertiseAreas;

  return (
    <section
      data-header-theme="light"
      className="bg-site-soft py-28 text-site-text sm:py-36 lg:py-44 relative group"
      id="expertise"
    >
      {adminContext && !adminContext.isPreviewMode && (
        <AdminEditButton onClick={() => adminContext.openSectionEditor("home.expertise")} label="Uzmanlık Alanlarını Düzenle" position="top-right" />
      )}
      <Container>
        {/* Section Header */}
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr]">
          <Reveal>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-site-accent">
              {content.supertitle}
            </p>
            <h2 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl md:text-6xl text-site-text">
              {content.title}
            </h2>
          </Reveal>
          
          <div className="flex flex-col justify-end lg:pb-1">
            <Reveal delay={0.08}>
              <p className="max-w-2xl text-lg leading-relaxed text-site-body sm:text-xl">
                {content.description}
              </p>
            </Reveal>
          </div>
        </div>

        {/* Expertise Cards Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:mt-24">
          {displayItems.map((area: any, index: number) => (
            <Reveal delay={index * 0.08} key={index} className="h-full">
              <article className="group flex flex-col h-full min-h-[320px] border border-site-border bg-site-surface p-8 transition-all duration-300 hover:border-[#CFC7BA] hover:shadow-[0_12px_32px_rgba(46,48,43,0.05)]">
                <div className="h-[120px] flex flex-col justify-start">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-site-accent">
                    {area.number}
                  </span>
                  
                  <h3 className="mt-8 text-2xl font-bold tracking-tight text-site-text transition-colors duration-300">
                    {area.title}
                  </h3>
                </div>

                <div className="pt-6 border-t border-site-border flex-1">
                  <p className="text-sm leading-relaxed text-site-body transition-colors duration-300 group-hover:text-site-text">
                    {area.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
