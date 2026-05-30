"use client";

import { useState } from "react";
import { engineeringItems } from "@/data/engineeringTrust";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "motion/react";
import { useIsIframePreview } from "@/hooks/useIsIframePreview";

export function EngineeringTrust() {
  const [activeItemId, setActiveItemId] = useState<string>(engineeringItems[0].id);
  const isIframePreview = useIsIframePreview();
  const reduceMotion = useReducedMotion() || isIframePreview;

  const activeItem = engineeringItems.find((i) => i.id === activeItemId) || engineeringItems[0];

  return (
    <section data-header-theme="dark" id="engineering" className="relative bg-background text-text py-24 lg:py-32 border-t border-white/5 pb-24">
      <div className="container mx-auto px-6 lg:px-12 xl:px-20">
        
        {/* HEADER */}
        <div className="max-w-2xl mb-12 lg:mb-20">
          <span className="mb-4 inline-block text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
            MÜHENDİSLİK & GÜVEN
          </span>
          <h2 className="mb-6 text-3xl font-medium tracking-tight text-text sm:text-4xl">
            Güven, görünmeyen detaylarda başlar
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground lg:text-lg">
            Mimari estetiğin ardında; planlı mühendislik hesapları, güncel yönetmeliklere uygunluk ve teknik disiplin barındıran taşıyıcı sistem yatıyor.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center lg:items-stretch">
          
          {/* LEFT: VISUAL FRAME (TECHNICAL SECTION) */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square max-w-lg overflow-hidden rounded-md border border-dark-text/10 bg-[#070A09] shadow-2xl">
              
              {/* Blueprint Grid */}
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

              {/* ABSTRACT BUILDING SECTION */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-8">
                <div className="relative w-full h-full max-w-xs border-x border-b border-dark-text/10 bg-gradient-to-t from-white/[0.02] to-transparent">
                  {/* Foundation */}
                  <div className="absolute bottom-0 left-[-10%] w-[120%] h-8 bg-surface/5 border border-dark-text/10" />
                  
                  {/* Floor Slabs */}
                  {[...Array(6)].map((_, i) => (
                    <div key={`floor-${i}`} className="absolute left-0 w-full h-1 bg-surface/[0.08]" style={{ bottom: `${15 + i * 15}%` }} />
                  ))}

                  {/* Core / Columns */}
                  <div className="absolute top-[10%] bottom-8 left-[30%] w-2 bg-surface/[0.05] border-x border-white/[0.02]" />
                  <div className="absolute top-[10%] bottom-8 right-[30%] w-2 bg-surface/[0.05] border-x border-white/[0.02]" />

                  {/* Facade Outlines */}
                  <div className="absolute top-[10%] bottom-8 left-[-2%] w-1 bg-surface/[0.15]" />
                  <div className="absolute top-[10%] bottom-8 right-[-2%] w-1 bg-surface/[0.15]" />
                </div>
              </div>

              {/* CONNECTION POINTS */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                {engineeringItems.map((item) => {
                  const isActive = item.id === activeItemId;
                  return (
                    <g key={`point-${item.id}`}>
                      {/* Active Connection Line (Abstract) */}
                      {isActive && (
                        <path 
                          d={`M ${item.x} ${item.y} L ${item.x > 50 ? 90 : 10} ${item.y}`} 
                          stroke="rgba(220,38,38,0.4)" 
                          strokeWidth="0.3" 
                          strokeDasharray="1 1"
                          fill="none" 
                        />
                      )}

                      {/* Dot */}
                      <circle 
                        cx={item.x} 
                        cy={item.y} 
                        r={isActive ? "2" : "1"} 
                        fill={isActive ? "rgb(220,38,38)" : "rgba(255,255,255,0.2)"} 
                        className="transition-all duration-300"
                      />
                      
                      {/* Ping Effect */}
                      {isActive && (
                        <circle 
                          cx={item.x} 
                          cy={item.y} 
                          r="4" 
                          fill="none"
                          stroke="rgba(220,38,38,0.5)"
                          strokeWidth="0.2"
                          className="animate-pulse"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

            </div>
          </div>

          {/* RIGHT: INFO PANEL & LIST */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            
            {/* ACTIVE ITEM CARD */}
            <div className="relative min-h-[220px] p-8 rounded-md bg-surface/[0.02] border border-dark-text/10 mb-8 backdrop-blur-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItemId}
                  data-motion-reveal
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col h-full justify-center"
                >
                  <span className="mb-4 inline-block text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
                    {activeItem.eyebrow}
                  </span>
                  <h3 className="text-2xl font-medium text-text mb-4">
                    {activeItem.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                    {activeItem.description}
                  </p>
                  
                  <div className="flex flex-col gap-1 mt-auto">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">{activeItem.metricLabel}</span>
                    <span className="text-sm font-semibold text-text/90">{activeItem.metricValue}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ITEM SELECTION LIST */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {engineeringItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveItemId(item.id)}
                  onMouseEnter={() => {
                    // Only hover active on desktop to avoid weird mobile behavior
                    if (window.innerWidth >= 1024) {
                      setActiveItemId(item.id);
                    }
                  }}
                  className={cn(
                    "px-4 py-3 text-[10px] font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm border text-left",
                    activeItemId === item.id
                      ? "border-primary/40 bg-primary/10 text-dark-text"
                      : "border-white/5 bg-transparent text-muted-foreground hover:bg-surface/[0.04] hover:text-dark-text"
                  )}
                >
                  {item.eyebrow.split(" / ")[1]}
                </button>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
