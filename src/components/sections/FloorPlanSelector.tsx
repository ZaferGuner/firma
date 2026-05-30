"use client";

import { useState } from "react";
import { floorPlans } from "@/data/floorPlans";
import { FloorPlanSvg } from "@/components/floor-plan/FloorPlanSvg";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "motion/react";

export function FloorPlanSelector() {
  const [activePlanId, setActivePlanId] = useState<string>(floorPlans[0].id);
  const [activeArea, setActiveArea] = useState<string | null>(null);
  
  const reduceMotion = useReducedMotion();
  const activePlan = floorPlans.find((p) => p.id === activePlanId) || floorPlans[0];

  const handlePlanChange = (id: string) => {
    setActivePlanId(id);
    setActiveArea(null);
  };

  // Find the hovered area details
  const activeAreaDetails = activePlan.areas.find((a) => a.id === activeArea);

  return (
    <section data-header-theme="dark" id="floor-plans" className="relative bg-background text-text py-24 lg:py-32 border-t border-white/5">
      <div className="container mx-auto px-6 lg:px-12 xl:px-20">
        
        {/* HEADER */}
        <div className="max-w-2xl mb-16 lg:mb-24">
          <span className="mb-4 inline-block text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
            YAŞAM PLANI
          </span>
          <h2 className="mb-6 text-3xl font-medium tracking-tight text-text sm:text-4xl lg:text-5xl">
            Yaşam planını seç.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground lg:text-lg">
            İhtiyaçlarınıza en uygun daire tipini inceleyin. Verilen metrekareler örnek plan kurgusu olup bilgi amaçlıdır.
          </p>
        </div>

        {/* MAIN LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* LEFT: FILTERS & SVG */}
          <div className="w-full lg:w-3/5 flex flex-col">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-12">
              {floorPlans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => handlePlanChange(plan.id)}
                  className={cn(
                    "px-8 py-3 text-sm font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm border",
                    activePlanId === plan.id
                      ? "border-primary bg-primary/10 text-dark-text"
                      : "border-dark-text/10 bg-surface/[0.02] text-muted-foreground hover:bg-surface/[0.06] hover:text-dark-text"
                  )}
                >
                  {plan.label}
                </button>
              ))}
            </div>

            {/* SVG Frame */}
            <div className="relative w-full rounded-md border border-dark-text/10 bg-[#070A09] shadow-[0_32px_80px_rgba(0,0,0,0.4)] overflow-hidden">
              <FloorPlanSvg 
                activePlanId={activePlanId} 
                activeArea={activeArea} 
                onAreaChange={setActiveArea} 
              />
              
              {/* Active Area Tooltip / Overlay Info */}
              <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
                <div className="px-4 py-2 rounded-sm bg-dark-bg/80 backdrop-blur-md border border-dark-text/10 flex flex-col gap-1 shadow-lg">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Seçili Alan
                  </span>
                  <span className={cn("text-xs font-semibold tracking-wider", activeAreaDetails ? "text-primary" : "text-dark-text")}>
                    {activeAreaDetails ? `${activeAreaDetails.label} - ${activeAreaDetails.value}` : "Plan üzerinde alan seçin"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: TEXT PANEL */}
          <div className="w-full lg:w-2/5 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePlanId}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col"
              >
                <span className="mb-2 text-2xl font-semibold text-text tracking-tight">
                  {activePlan.title}
                </span>
                <p className="mb-10 text-sm leading-relaxed text-muted-foreground">
                  {activePlan.description}
                </p>

                {/* Key Details Grid */}
                <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-10 pb-10 border-b border-dark-text/10">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Brüt Alan</span>
                    <span className="text-sm font-medium text-text">{activePlan.size}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Oda Sayısı</span>
                    <span className="text-sm font-medium text-text">{activePlan.rooms}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Cephe</span>
                    <span className="text-sm font-medium text-text">{activePlan.orientation}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Balkon</span>
                    <span className="text-sm font-medium text-text">{activePlan.balcony}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="mb-12">
                  <span className="block mb-4 text-[10px] uppercase tracking-widest text-muted-foreground">
                    Öne Çıkan Özellikler
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activePlan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-xs text-text/80">
                        <span className="h-px w-3 bg-primary" /> {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <a 
                  href="#contact"
                  className="self-start px-8 py-4 bg-surface/5 border border-dark-text/10 hover:bg-surface/10 hover:border-dark-text/20 text-dark-text text-xs font-semibold uppercase tracking-widest transition-all rounded-sm"
                >
                  Bu plan için bilgi al
                </a>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
