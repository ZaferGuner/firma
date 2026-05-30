"use client";

import { useState } from "react";
import { locationPoints } from "@/data/locationPoints";
import { LocationMapSvg } from "@/components/map/LocationMapSvg";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "motion/react";

export function LocationMap() {
  // Exclude the project itself from the selectable list
  const selectablePoints = locationPoints.filter((p) => p.id !== "project");
  
  // Default to the first selectable point
  const [activePointId, setActivePointId] = useState<string>(selectablePoints[0].id);
  
  const reduceMotion = useReducedMotion();
  const activePoint = locationPoints.find((p) => p.id === activePointId) || selectablePoints[0];

  return (
    <section data-header-theme="dark" id="location" className="relative bg-background text-text py-24 lg:py-32 border-t border-white/5 pb-32">
      <div className="container mx-auto px-6 lg:px-12 xl:px-20">
        
        {/* HEADER (Mobile visible, Desktop hides this if integrated in left panel) */}
        <div className="max-w-2xl mb-12 lg:hidden">
          <span className="mb-4 inline-block text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
            LOKASYON
          </span>
          <h2 className="mb-6 text-3xl font-medium tracking-tight text-text sm:text-4xl">
            Şehrin ritmine bağlı bir yaşam noktası
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Konum anlatımı, yalnızca bir adres göstermekten fazlasıdır. Projenin çevresi; ulaşım, sosyal yaşam ve günlük ihtiyaçlarla birlikte okunur.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center lg:items-stretch">
          
          {/* LEFT: TEXT PANEL (Desktop) */}
          <div className="hidden lg:flex w-full lg:w-2/5 flex-col justify-center">
            <span className="mb-4 inline-block text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
              LOKASYON
            </span>
            <h2 className="mb-6 text-3xl font-medium tracking-tight text-text sm:text-4xl lg:text-5xl lg:leading-[1.1]">
              Şehrin ritmine bağlı bir yaşam noktası
            </h2>
            <p className="mb-12 text-base leading-relaxed text-muted-foreground lg:text-lg">
              Konum anlatımı, yalnızca bir adres göstermekten fazlasıdır. Projenin çevresi; ulaşım, sosyal yaşam ve günlük ihtiyaçlarla birlikte okunur.
            </p>

            {/* ACTIVE POINT CARD */}
            <div className="w-full relative min-h-[160px] p-6 rounded-md bg-surface/[0.02] border border-dark-text/10 mb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePointId}
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground bg-surface/5 px-2 py-1 rounded-sm">
                      {activePoint.category}
                    </span>
                    <span className="text-xs font-mono text-primary">
                      {activePoint.time}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium text-text mb-2">
                    {activePoint.label}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {activePoint.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <p className="text-[10px] text-muted-foreground/60 leading-relaxed max-w-sm">
              Harita ve süreler temsili olarak hazırlanmıştır. Gerçek konum bilgileri proje verileriyle güncellenecektir.
            </p>
          </div>

          {/* RIGHT: MAP FRAME */}
          <div className="w-full lg:w-3/5 flex flex-col gap-6">
            <LocationMapSvg 
              points={locationPoints}
              activePointId={activePointId}
              onPointChange={setActivePointId}
            />

            {/* MOBILE: ACTIVE POINT CARD */}
            <div className="lg:hidden w-full relative min-h-[140px] p-5 rounded-md bg-surface/[0.02] border border-dark-text/10 mt-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePointId}
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground bg-surface/5 px-2 py-1 rounded-sm">
                      {activePoint.category}
                    </span>
                    <span className="text-xs font-mono text-primary">
                      {activePoint.time}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-text mb-2">
                    {activePoint.label}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {activePoint.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* POINT LIST BUTTONS (Scrollable/Grid) */}
            <div className="flex flex-wrap lg:grid lg:grid-cols-3 gap-2 mt-4">
              {selectablePoints.map((point) => (
                <button
                  key={point.id}
                  onClick={() => setActivePointId(point.id)}
                  className={cn(
                    "px-4 py-2.5 text-[10px] font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm border text-left",
                    activePointId === point.id
                      ? "border-primary/50 bg-primary/10 text-dark-text"
                      : "border-white/5 bg-transparent text-muted-foreground hover:bg-surface/[0.04] hover:text-dark-text"
                  )}
                >
                  {point.category}
                </button>
              ))}
            </div>

            {/* Mobile Disclaimer */}
            <p className="lg:hidden text-[9px] text-muted-foreground/60 leading-relaxed mt-4 text-center">
              Harita ve süreler temsili olarak hazırlanmıştır.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
