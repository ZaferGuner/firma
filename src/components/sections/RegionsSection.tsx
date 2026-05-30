"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Reveal } from "@/components/animation/Reveal";
import { Container } from "@/components/ui/Container";
import { motion, AnimatePresence } from "motion/react";

import { AdanaMapSvg } from "../map/AdanaMapSvg";
import { districtInfoData } from "../map/mapData";

export function RegionsSection() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const info = selectedDistrict ? districtInfoData[selectedDistrict] : null;

  return (
    <section data-header-theme="dark" className="bg-background py-24 text-text sm:py-32 lg:py-40">
      <Container>
        <Reveal className="mb-12 text-center lg:mb-16">
          <h2 className="text-[clamp(34px,5vw,56px)] font-medium leading-[1.05] tracking-[-0.03em]">
            Faaliyet Bölgelerimiz
          </h2>
        </Reveal>

        <Reveal className="relative mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-[24px] border border-dark-text/10 bg-[#050A0A] shadow-[0_32px_64px_rgba(0,0,0,0.5)] min-h-[400px] lg:min-h-[600px]">
          <AdanaMapSvg 
            onDistrictSelect={setSelectedDistrict} 
            selectedDistrict={selectedDistrict} 
          />
          
          {/* Mobile Bottom Info Card */}
          <AnimatePresence>
            {info && (
              <motion.div 
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute bottom-0 left-0 right-0 z-40 rounded-t-[24px] border-t border-dark-text/10 bg-[#071010]/95 p-6 shadow-[0_-16px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl md:hidden"
              >
                <button 
                  onClick={() => setSelectedDistrict(null)}
                  className="absolute right-4 top-4 rounded-full bg-surface/5 p-2 text-[#F3EFE7]/60 transition-colors hover:bg-[#C5162E]/20 hover:text-[#C5162E]"
                  aria-label="Kapat"
                >
                  <X className="h-4 w-4" />
                </button>
                
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-2 w-2 items-center justify-center rounded-full bg-[#C5162E]">
                    <span className="absolute h-4 w-4 animate-ping rounded-full bg-[#C5162E] opacity-30" />
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C5162E]">
                    Seçili Bölge
                  </span>
                </div>

                <div className="flex items-center gap-3 pr-8">
                  <h3 className="text-xl font-semibold text-[#F3EFE7]">{info.title}</h3>
                  <span className="shrink-0 rounded-full border border-[#C5162E]/30 bg-[#C5162E]/15 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-[#F3EFE7]">
                    {info.status}
                  </span>
                </div>
                
                <p className="mt-3 text-sm leading-relaxed text-[#F3EFE7]/70">
                  {info.description}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-dark-text/10 pt-5">
                  <div>
                    <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F3EFE7]/40">
                      Hizmetler
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {info.services.map((service) => (
                        <span key={service} className="rounded-md border border-white/5 bg-surface/[0.03] px-2 py-1 text-[11px] font-medium text-[#F3EFE7]/80">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F3EFE7]/40">
                      Proje Tipleri
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {info.projectTypes.map((type) => (
                        <span key={type} className="rounded-md border border-[#C5162E]/20 bg-[#C5162E]/10 px-2 py-1 text-[11px] font-medium text-[#F3EFE7]">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 rounded-xl bg-dark-bg/40 p-3">
                  <p className="text-xs text-[#F3EFE7]/60">
                    <span className="font-semibold text-[#C5162E] mr-1">Not:</span>
                    {info.note}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </Container>
    </section>
  );
}
