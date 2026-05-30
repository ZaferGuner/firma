"use client";

import { Reveal } from "@/components/animation/Reveal";
import { Container } from "@/components/ui/Container";
import { buildingApproach } from "@/data/home";
import { useAdminEdit } from "@/context/AdminEditContext";
import { AdminEditButton } from "@/components/admin/AdminEditButton";

interface BuildingApproachSectionProps {
  initialData?: any;
}

import { useEditableContent } from "@/hooks/useEditableContent";

export function BuildingApproachSection({ initialData }: BuildingApproachSectionProps) {
  const adminContext = useAdminEdit();

  const content = useEditableContent("home.buildingApproach", initialData || {
    supertitle: "YAPI STANDARTLARIMIZ",
    title: "Güven Veren Yapı Anlayışı",
    description: "Projelerimizde estetik görünüm kadar; kullanım konforu, teknik doğruluk ve uzun ömürlü yapı kalitesi de önceliklidir.",
    items: buildingApproach,
  });

  const displayItems = content.items || buildingApproach;

  return (
    <section
      data-header-theme="light"
      className="bg-site-soft py-28 text-site-text sm:py-36 lg:py-44 relative group"
      id="approach"
    >
      {adminContext && !adminContext.isPreviewMode && (
        <AdminEditButton onClick={() => adminContext.openSectionEditor("home.buildingApproach")} label="Standartları Düzenle" position="top-right" />
      )}
      <Container>
        {/* Section Header */}
        <div className="grid gap-8 border-b border-site-border pb-12 lg:grid-cols-[0.8fr_1.2fr]">
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

        {/* 4 Cards Grid (Solid Surface - No Glass) */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:mt-24">
          {displayItems.map((item: any, index: number) => (
            <Reveal delay={index * 0.08} key={index}>
              <article className="group flex flex-col justify-between min-h-[250px] border border-site-border bg-site-surface p-6 transition-all duration-300 hover:border-[#CFC7BA] hover:shadow-[0_12px_32px_rgba(46,48,43,0.05)]">
                <div>
                  <span className="font-mono text-[10px] font-bold text-site-accent">
                    {item.number} / YAPI
                  </span>
                  
                  <h3 className="mt-6 text-2xl font-bold tracking-tight text-site-text transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>

                <div className="mt-8 pt-4 border-t border-site-border">
                  <p className="text-sm leading-relaxed text-site-body">
                    {item.description}
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
