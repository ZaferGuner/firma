"use client";

import Image from "next/image";
import { Reveal } from "@/components/animation/Reveal";
import { Container } from "@/components/ui/Container";
import { IframeTransitionLink } from "@/components/animation/IframeTransitionLink";
import { ArrowUpRight } from "lucide-react";
import { useEditableContent } from "@/hooks/useEditableContent";
import { EditableSection } from "@/components/admin/EditableSection";

export function HomeCTA({ initialData }: { initialData?: any }) {
  const defaultCtaData = {
    eyebrow: "İLETİŞİME GEÇİN",
    title: "Yeni yaşam alanınızı<br className=\"hidden sm:inline\" /> birlikte planlayalım.",
    description: "Villa, konut veya yatırım projeniz hakkında detaylı bilgi almak, güncel fiyat listelerimizi öğrenmek ya da satış ofisimizden randevu almak için bizimle iletişime geçebilirsiniz.",
    buttonText: "Bilgi Al",
    buttonLink: "/contact",
    secondaryButtonText: "Projelerimizi İncele",
    secondaryButtonLink: "/projects"
  };

  const data = useEditableContent("home.finalCta", initialData || defaultCtaData);


  const handleContactClick = () => {
    window.dispatchEvent(new CustomEvent("tt:contact-open"));
  };

  return (
    <EditableSection sectionKey="home.finalCta" label="Final CTA İletişim">
      <section
        data-header-theme="dark"
        className="relative overflow-hidden bg-site-dark py-16 text-site-dark-text sm:py-20 lg:py-24"
        id="contact-cta"
      >
        {/* Background image with high-contrast darkening overlay */}
        <div className="absolute inset-0 opacity-[0.25]">
          <Image
            alt="Lüks konut mimari detay"
            aria-hidden="true"
            className="object-cover select-none"
            fill
            sizes="100vw"
            src="/images/projects/hero-house.jpg"
            style={{ filter: "grayscale(1) brightness(0.35) contrast(1.15)" }}
          />
        </div>
        
        {/* Solid dark overlay (no transparent glass) */}
        <div className="absolute inset-0 bg-site-dark/85" />

        <Container className="relative z-10">
          <Reveal className="mx-auto max-w-5xl text-center">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-[#C5162E]">
              {data.eyebrow}
            </p>
            
            <h2 
              className="mt-6 text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl md:text-6xl lg:text-7xl text-site-dark-text"
              dangerouslySetInnerHTML={{ __html: data.title }}
            />
            
            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-site-dark-body sm:text-lg">
              {data.description}
            </p>

            {/* Action Buttons */}
            <div className="mt-12 flex flex-col justify-center items-center gap-4 sm:flex-row">
              <button
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center bg-site-primary px-8 text-[11px] font-bold uppercase tracking-[0.24em] text-white transition-colors hover:bg-site-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                onClick={handleContactClick}
                type="button"
              >
                {data.buttonText}
                <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
              </button>
              
              <IframeTransitionLink
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center border border-[rgba(245,242,234,0.20)] bg-transparent px-8 text-[11px] font-bold uppercase tracking-[0.24em] text-site-dark-text transition-all hover:bg-site-primary-soft hover:text-site-text hover:border-site-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                href={data.secondaryButtonLink === "#projects" ? "/projects" : data.secondaryButtonLink}
              >
                {data.secondaryButtonText}
              </IframeTransitionLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </EditableSection>
  );
}
