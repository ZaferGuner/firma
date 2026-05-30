"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion, motion, AnimatePresence } from "motion/react";
import { useIsIframePreview } from "@/hooks/useIsIframePreview";
import { cn } from "@/lib/utils";
import { projectExperienceSteps } from "@/data/projectExperience";

export function ProjectExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const isIframePreview = useIsIframePreview();
  const reduceMotion = useReducedMotion() || isIframePreview;

  // On mobile or reduced motion, we might prefer a standard flow.
  // For simplicity, we'll use a responsive approach: 
  // - lg: uses the 420vh sticky ScrollTrigger
  // - <lg or reduceMotion: uses normal document flow

  useEffect(() => {
    // If reduce motion is enabled, or window is too narrow, we don't apply scroll trigger
    // However, since we can't cleanly detect window width in first render without hydration issues,
    // we will apply ScrollTrigger to the wrapper only if reduceMotion is false.
    // CSS will handle turning off sticky on mobile. We must ensure the math works.
    if (reduceMotion) return;
    if (!sectionRef.current) return;

    // Use a matchMedia in GSAP to only run on lg screens and up
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            const nextIndex = Math.min(
              projectExperienceSteps.length - 1,
              Math.floor(self.progress * projectExperienceSteps.length)
            );
            setActiveStep(nextIndex);
          },
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [reduceMotion]);

  const step = projectExperienceSteps[activeStep];

  return (
    <section data-header-theme="dark"
      ref={sectionRef}
      id="projects"
      className={cn(
        "relative bg-background text-text border-t border-white/5",
        !reduceMotion && "lg:min-h-[420vh]"
      )}
    >
      {/* DESKTOP STICKY VIEWPORT */}
      <div
        className={cn(
          "w-full flex-col lg:flex-row",
          !reduceMotion ? "lg:sticky lg:top-0 lg:flex lg:h-screen lg:overflow-hidden" : "flex"
        )}
      >
        {/* LEFT: VISUAL FRAME */}
        <div className="relative w-full lg:w-1/2 lg:h-full p-6 lg:p-12 xl:p-16 flex items-center justify-center">
          <div className="relative aspect-[4/5] lg:aspect-square w-full max-w-xl overflow-hidden rounded-md border border-dark-text/10 bg-[#070A09] shadow-2xl">
            
            {/* Visual Header / Label */}
            <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-dark-text/70">
                {reduceMotion ? "PROJE SUNUMU" : step.visualLabel}
              </span>
            </div>

            {/* ABSTRACT ARCHITECTURAL PLACEHOLDER */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              {/* Grid Background */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
              
              {/* Abstract Building Outline */}
              <div className="relative w-[60%] h-[70%] border border-dark-text/10 bg-gradient-to-t from-white/[0.03] to-transparent">
                {/* Horizontal slabs */}
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="absolute w-full h-px bg-surface/10" style={{ top: `${(i + 1) * 20}%` }} />
                ))}
                
                {/* Vertical columns */}
                <div className="absolute top-0 bottom-0 left-[20%] w-px bg-surface/5" />
                <div className="absolute top-0 bottom-0 right-[20%] w-px bg-surface/5" />
              </div>

              {/* DYNAMIC HIGHLIGHTS BASED ON ACTIVE STEP */}
              {!reduceMotion && (
                <div className="absolute inset-0 pointer-events-none transition-all duration-700 ease-in-out">
                  {/* Highlight for Location (Rings) */}
                  <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-primary/20 rounded-full transition-opacity duration-500", activeStep === 1 ? "opacity-100 scale-100" : "opacity-0 scale-90")} />
                  <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-primary/10 rounded-full transition-opacity duration-500 delay-100", activeStep === 1 ? "opacity-100 scale-100" : "opacity-0 scale-90")} />
                  
                  {/* Highlight for Apartments (Floor outline) */}
                  <div className={cn("absolute top-[40%] left-[20%] w-[60%] h-[20%] border border-primary/50 bg-primary/5 transition-opacity duration-500", activeStep === 2 ? "opacity-100" : "opacity-0")} />
                  
                  {/* Highlight for Social (Bottom area glow) */}
                  <div className={cn("absolute bottom-[15%] left-[10%] w-[80%] h-12 bg-primary/10 blur-xl transition-opacity duration-500", activeStep === 3 ? "opacity-100" : "opacity-0")} />
                  
                  {/* Highlight for Engineering (Structural columns) */}
                  <div className={cn("absolute top-[15%] bottom-[15%] left-[40%] w-[20%] border-x border-primary/40 bg-primary/5 transition-opacity duration-500", activeStep === 4 ? "opacity-100" : "opacity-0")} />

                  {/* Highlight for Contact (Center target) */}
                  <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500", activeStep === 5 ? "opacity-100 scale-100" : "opacity-0 scale-50")}>
                    <div className="w-8 h-8 border border-primary flex items-center justify-center rounded-full bg-primary/10">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="absolute inset-0 z-30 pointer-events-none border border-white/5 rounded-md" />
          </div>
        </div>

        {/* RIGHT: TEXT PANEL (Desktop sticky flow) */}
        <div className="hidden lg:flex w-full lg:w-1/2 lg:h-full items-center justify-center px-12 xl:px-24">
          <div className="w-full max-w-md relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                data-motion-reveal
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col"
              >
                <span className="mb-4 inline-block text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
                  {step.eyebrow}
                </span>
                <h2 className="mb-6 text-3xl font-medium tracking-tight text-text sm:text-4xl">
                  {step.title}
                </h2>
                <p className="mb-10 text-base leading-relaxed text-muted-foreground">
                  {step.description}
                </p>

                {/* STATS */}
                <div className="grid grid-cols-2 gap-4 mb-12">
                  {step.stats.map((stat, idx) => (
                    <div key={idx} className="flex flex-col gap-1 p-4 rounded-sm bg-surface/[0.02] border border-white/5">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                      <span className="text-sm font-medium text-text">{stat.value}</span>
                    </div>
                  ))}
                </div>

                {/* CTA ONLY ON CONTACT */}
                {activeStep === projectExperienceSteps.length - 1 && (
                  <button className="self-start px-6 py-3 bg-primary text-dark-text text-xs font-semibold uppercase tracking-widest hover:bg-primary/90 transition-colors rounded-sm">
                    Bilgi Al
                  </button>
                )}
              </motion.div>
            </AnimatePresence>

            {/* PROGRESS INDICATOR */}
            <div className="absolute -bottom-24 left-0 right-0 flex items-center gap-4">
              <span className="text-[10px] font-medium tracking-widest text-muted-foreground">
                0{activeStep + 1}
              </span>
              <div className="h-px flex-1 bg-surface/10 relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 bottom-0 bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${((activeStep + 1) / projectExperienceSteps.length) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-medium tracking-widest text-muted-foreground">
                0{projectExperienceSteps.length}
              </span>
            </div>
          </div>
        </div>

        {/* MOBILE TEXT PANEL (Normal flow) */}
        <div className="flex flex-col lg:hidden px-6 pb-24 pt-12 gap-16">
          {projectExperienceSteps.map((mobileStep, idx) => (
            <div key={mobileStep.id} className="flex flex-col">
              <span className="mb-3 inline-block text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
                {mobileStep.eyebrow}
              </span>
              <h3 className="mb-4 text-2xl font-medium tracking-tight text-text">
                {mobileStep.title}
              </h3>
              <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
                {mobileStep.description}
              </p>
              
              <div className="grid grid-cols-2 gap-3 mb-8">
                {mobileStep.stats.map((stat, sIdx) => (
                  <div key={sIdx} className="flex flex-col gap-1 p-3 rounded-sm bg-surface/[0.02] border border-white/5">
                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                    <span className="text-xs font-medium text-text">{stat.value}</span>
                  </div>
                ))}
              </div>

              {idx === projectExperienceSteps.length - 1 && (
                <button className="self-start px-6 py-3 bg-primary text-dark-text text-xs font-semibold uppercase tracking-widest hover:bg-primary/90 transition-colors rounded-sm mt-2">
                  Bilgi Al
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
