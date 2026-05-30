"use client";

import { useState } from "react";
import { X, MapPin, CheckCircle, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/animation/Reveal";
import { Container } from "@/components/ui/Container";
import { motion, AnimatePresence } from "motion/react";

import { AdanaMapSvg } from "../map/AdanaMapSvg";
import { useEditableContent } from "@/hooks/useEditableContent";
import { useAdminEdit } from "@/context/AdminEditContext";
import { EditableSection } from "../admin/EditableSection";

export function ServiceAreasSection({ initialData }: { initialData?: any }) {
  const data = useEditableContent("home.regions", initialData || { sectionTitle: "Faaliyet Bölgelerimiz", sectionDescription: "", districts: [] });
  const adminContext = useAdminEdit();
  
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>("Seyhan");

  // Create dictionary from array
  const districtInfoData = (data.districts || []).reduce((acc: any, district: any) => {
    acc[district.district] = district;
    return acc;
  }, {});

  const info = selectedDistrict ? districtInfoData[selectedDistrict] : null;

  const handleDistrictSelect = (district: string | null) => {
    setSelectedDistrict(district);
    if (adminContext && !adminContext.isPreviewMode && district) {
      // Instead of opening a region-specific editor, we open the home.regions editor
      adminContext.openSectionEditor("home.regions");
    }
  };

  return (
    <section
      data-header-theme="light"
      className="bg-site-bg py-28 text-site-text sm:py-36 lg:py-44"
      id="service-areas"
    >
      <Container>
        <EditableSection sectionKey="home.regions" label="Bölüm Başlığı">
          <div className="grid gap-8 border-b border-site-border pb-12 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-site-accent">
                FAALİYET COĞRAFYAMIZ
              </p>
              <h2 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl md:text-6xl text-site-text">
                {data.sectionTitle}
              </h2>
            </Reveal>

            <div className="flex flex-col justify-end lg:pb-1">
              <Reveal delay={0.08}>
                <p className="max-w-2xl text-lg leading-relaxed text-site-body sm:text-xl">
                  {data.sectionDescription}
                </p>
              </Reveal>
            </div>
          </div>
        </EditableSection>

        {/* Interactive Layout Grid */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch lg:gap-16 lg:mt-24">
          
          {/* Left Side: District Details Panel (Solid Surface - No Glass) */}
          <div className="flex flex-col justify-between lg:h-[640px]">
            <Reveal className="h-full flex flex-col justify-start">
              <div className="mb-6 flex items-center gap-2">
                <span className="flex h-2 w-2 items-center justify-center rounded-none bg-site-accent">
                  <span className="absolute h-4 w-4 animate-ping bg-site-accent opacity-30" />
                </span>
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-site-accent">
                  HİZMET VE ETÜT ALANIMIZ
                </span>
              </div>

              <AnimatePresence mode="wait">
                {info ? (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                    className="flex flex-col h-full justify-between rounded-none border border-[rgba(245,242,234,0.12)] bg-site-dark-surface p-8 text-site-dark-text"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-3xl font-bold tracking-tight text-site-dark-text flex items-center gap-2">
                          <MapPin size={22} className="text-site-accent" />
                          {info.title}
                        </h3>
                        <span className="shrink-0 rounded-none border border-[rgba(245,242,234,0.16)] bg-[rgba(245,242,234,0.10)] px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-site-dark-text">
                          {info.status}
                        </span>
                      </div>

                      <p className="mt-6 text-sm leading-relaxed text-site-dark-body">
                        {info.description}
                      </p>

                      <div className="mt-8 grid gap-6 sm:grid-cols-2 border-t border-[rgba(245,242,234,0.12)] pt-6">
                        {/* Services List */}
                        <div>
                          <p className="mb-3 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-site-dark-label">
                            HİZMET DETAYLARI
                          </p>
                          <ul className="space-y-2">
                            {info.services?.map((service: string) => (
                              <li key={service} className="flex items-center gap-2 text-xs text-site-dark-body">
                                <span className="h-1.5 w-1.5 bg-site-accent" />
                                {service}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Project Types List */}
                        <div>
                          <p className="mb-3 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-site-dark-label">
                            PROJE YATIRIMLARI
                          </p>
                          <ul className="space-y-2">
                            {info.projectTypes?.map((type: string) => (
                              <li key={type} className="flex items-center gap-2 text-xs text-site-dark-body">
                                <CheckCircle size={12} className="text-site-accent" />
                                {type}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 border-t border-[rgba(245,242,234,0.12)] pt-6 flex flex-col gap-4">
                      <div className="bg-site-dark/35 p-4 rounded-none border border-[rgba(245,242,234,0.12)]">
                        <p className="text-xs text-site-dark-muted leading-relaxed">
                          <span className="font-bold text-site-accent mr-1.5">BÖLGESEL NOT:</span>
                          {info.note}
                        </p>
                      </div>
                      
                      <button
                        className="inline-flex h-11 items-center justify-between bg-site-primary px-5 text-[11px] font-bold uppercase tracking-[0.22em] text-white transition-colors hover:bg-site-primary-hover"
                        onClick={() => window.dispatchEvent(new CustomEvent("tt:contact-open"))}
                        type="button"
                      >
                        Bölge İçin Keşif Talebi Gönder
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center rounded-none border border-[rgba(245,242,234,0.12)] bg-site-dark-surface p-12 h-full min-h-[360px] text-site-dark-text"
                  >
                    <MapPin size={36} className="text-site-dark-muted mb-4 animate-pulse" />
                    <p className="text-sm text-site-dark-muted tracking-wide uppercase">
                      Bölgeler hakkında detaylı bilgi için haritada aktif bir ilçeye tıklayın veya dokunun.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reveal>
          </div>

          {/* Right Side: Map Container (Legible & Sharp) */}
          <div className="relative flex flex-col justify-center rounded-none border border-[rgba(245,242,234,0.12)] bg-site-dark-surface lg:h-[640px] min-h-[420px] md:min-h-[500px]">
            <AdanaMapSvg
              onDistrictSelect={handleDistrictSelect}
              selectedDistrict={selectedDistrict}
              districtInfoData={districtInfoData}
            />

            {/* Selected District Indicator Badge on Map overlay */}
            <div className="absolute top-4 right-4 bg-site-dark border border-[rgba(245,242,234,0.12)] px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-widest text-site-dark-label">
              AKTİF HİZMET AĞI: 8 İLÇE
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
