"use client";

import Image from "next/image";
import { Reveal } from "@/components/animation/Reveal";
import { Container } from "@/components/ui/Container";
import { aboutValues } from "@/data/home";
import { useAdminEdit } from "@/context/AdminEditContext";
import { AdminEditButton } from "@/components/admin/AdminEditButton";

interface TrustSectionProps {
  initialData?: any;
}

import { useEditableContent } from "@/hooks/useEditableContent";

export function TrustSection({ initialData }: TrustSectionProps) {
  const adminContext = useAdminEdit();

  const content = useEditableContent("home.trust", initialData || {
    supertitle: "GÜVEN VE KALİTE",
    title: "Güven üzerine kurulan yapılar.",
    description1: "Her projede yalnızca bugünün ihtiyaçlarını değil, uzun yıllar değerini koruyacak yaşam standartlarını hedefliyoruz.",
    description2: "Taner Tümer İnşaat olarak, projelerimizde estetik görünüm ile mühendislik doğruluğunu kusursuz bir uyumla birleştiriyoruz. Bir yapıyı inşa etmek, bizim için sadece harç ve tuğladan ibaret değildir; o yapıda geçecek onlarca yılın huzurunu, konforunu ve güvenliğini bugünden tasarlamaktır.",
    values: aboutValues,
  });

  const displayValues = content.values || aboutValues;

  return (
    <section
      data-header-theme="light"
      id="trust"
      className="bg-site-bg py-28 text-site-text sm:py-36 lg:py-44 relative group"
    >
      {adminContext && !adminContext.isPreviewMode && (
        <AdminEditButton onClick={() => adminContext.openSectionEditor("home.trust")} label="Güven Bölümünü Düzenle" position="top-right" />
      )}
      <Container>
        {/* Main Grid: Narrative vs. Visual */}
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-20">
          
          {/* Left Column: Narrative */}
          <div className="flex flex-col">
            <Reveal>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-site-accent">
                {content.supertitle}
              </p>
              <h2 className="mt-8 text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl md:text-6xl lg:text-7xl text-site-text">
                {content.title}
              </h2>
              
              <p className="mt-10 text-lg leading-relaxed text-site-body sm:text-xl sm:leading-relaxed">
                {content.description1}
              </p>
              
              <p className="mt-6 text-sm leading-relaxed text-site-muted">
                {content.description2}
              </p>
            </Reveal>

            {/* Principles Cards Grid */}
            <div className="mt-12 grid gap-4 border-t border-site-border pt-8 sm:grid-cols-3">
              {displayValues.map((value: string, index: number) => (
                <Reveal delay={index * 0.08} key={index}>
                  <div className="border border-site-border bg-site-soft p-5">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-site-accent">
                      0{index + 1} / İLKE
                    </span>
                    <h3 className="mt-4 text-base font-bold tracking-tight text-site-text">
                      {value}
                    </h3>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Right Column: Visual */}
          <Reveal className="relative hidden overflow-hidden bg-neutral-200 md:block" delay={0.1}>
            <div className="relative aspect-[4/5] w-full">
              <Image
                alt="Mimari cephe ve dayanıklı yapı detayları"
                className="object-cover select-none"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                src="/images/projects/hero-house.jpg"
                style={{
                  filter: "brightness(0.82) contrast(1.04) saturate(0.85)",
                  objectPosition: "58% center",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            </div>
          </Reveal>

        </div>
      </Container>
    </section>
  );
}
