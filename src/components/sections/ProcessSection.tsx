"use client";

import { Reveal } from "@/components/animation/Reveal";
import { Container } from "@/components/ui/Container";
import { processSteps } from "@/data/home";
import { useAdminEdit } from "@/context/AdminEditContext";
import { AdminEditButton } from "@/components/admin/AdminEditButton";

interface ProcessSectionProps {
  initialData?: any;
}

import { useEditableContent } from "@/hooks/useEditableContent";

export function ProcessSection({ initialData }: ProcessSectionProps) {
  const adminContext = useAdminEdit();

  const content = useEditableContent("home.process", initialData || {
    supertitle: "UYGULAMA SÜRECİ",
    title: "Her proje doğru bir süreçle başlar.",
    description: "Planlamadan anahtar teslimine kadar tüm süreçlerimizi; yüksek teknik doğruluk, planlı saha disiplini ve sürekli kalite denetimiyle yürütüyoruz.",
    steps: processSteps,
  });

  const displaySteps = content.steps || processSteps;

  return (
    <section
      data-header-theme="light"
      id="process"
      className="bg-site-bg py-28 text-site-text sm:py-36 lg:py-44 relative group"
    >
      {adminContext && !adminContext.isPreviewMode && (
        <AdminEditButton onClick={() => adminContext.openSectionEditor("home.process")} label="Süreçleri Düzenle" position="top-right" />
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

        {/* Timeline Container */}
        <div className="relative mt-20 lg:mt-28">
          
          {/* Continuous Line for Desktop Timeline */}
          <div className="absolute top-[5px] left-0 right-0 hidden h-[1px] bg-site-border md:block" />

          {/* Grid Layout: Horizontal on Desktop, Vertical on Mobile */}
          <div className="relative z-10 grid gap-12 md:grid-cols-4 md:gap-0">
            {displaySteps.map((step: any, index: number) => (
              <Reveal delay={index * 0.08} key={index}>
                <article className="group relative flex flex-col pl-8 md:pl-0 md:pr-8 md:pt-10">
                  
                  {/* Timeline Dot (Horizontal on Desktop, Vertical on Mobile) */}
                  <span className="absolute left-0 top-[6px] h-2.5 w-2.5 rounded-none bg-site-border transition-all duration-300 group-hover:bg-site-accent md:left-0 md:top-0" />
                  
                  {/* Vertical Connection Line on Mobile */}
                  {index < displaySteps.length - 1 && (
                    <div className="absolute left-[4px] top-[16px] bottom-[-48px] w-[1px] bg-site-border md:hidden" />
                  )}

                  {/* Step Metadata */}
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-site-label transition-colors duration-300 group-hover:text-site-accent">
                    {step.number} / AŞAMA
                  </span>

                  {/* Step Title */}
                  <h3 className="mt-6 text-2xl font-bold tracking-tight text-site-text transition-colors duration-300">
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="mt-4 text-sm leading-relaxed text-site-body">
                    {step.description}
                  </p>

                  {/* Inner Step Border Detail (Desktop only) */}
                  <div className="mt-8 hidden border-t border-site-border pt-5 md:block transition-colors duration-300" />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
