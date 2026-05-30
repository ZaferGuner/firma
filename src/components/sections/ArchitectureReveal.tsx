"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "motion/react";
import { useIsIframePreview } from "@/hooks/useIsIframePreview";
import { architectureStages } from "@/data/architectureStages";
import { cn } from "@/lib/utils";

export function ArchitectureReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  // Layers
  const groundRef = useRef<HTMLDivElement>(null);
  const foundationRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const floorsRef = useRef<HTMLDivElement>(null);
  const facadeRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const isIframePreview = useIsIframePreview();
  const reduceMotion = useReducedMotion() || isIframePreview;

  useEffect(() => {
    if (reduceMotion) return;
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            const totalStages = architectureStages.length;
            // Map 0-1 progress to 0-(totalStages-1)
            // Using a slight offset to keep the last stage active at 1.0
            const index = Math.min(
              totalStages - 1,
              Math.floor(self.progress * totalStages)
            );
            setActiveStageIndex(index);
          },
        },
      });

      // Ground reveals very early
      tl.fromTo(groundRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0)
        
        // Foundation rises
        .fromTo(
          foundationRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1 },
          0.5
        )
        
        // Columns stretch up
        .fromTo(
          columnsRef.current,
          { opacity: 0, scaleY: 0.1, transformOrigin: "bottom center" },
          { opacity: 1, scaleY: 1, duration: 1.5, ease: "power1.inOut" },
          1.0
        )
        
        // Floors slide in
        .fromTo(
          floorsRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.5 },
          1.5
        )
        
        // Facade forms around it
        .fromTo(
          facadeRef.current,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 2 },
          2.5
        )
        
        // Glass overlay adds reflections
        .fromTo(
          glassRef.current,
          { opacity: 0 },
          { opacity: 0.45, duration: 1.5 },
          4.0
        )
        
        // Living lights turn on
        .fromTo(
          lightRef.current,
          { opacity: 0, filter: "blur(8px)" },
          { opacity: 1, filter: "blur(0px)", duration: 1.5 },
          5.0
        );

    }, sectionRef);

    return () => ctx.revert();
  }, [reduceMotion]);

  const activeStage =
    architectureStages[reduceMotion ? architectureStages.length - 1 : activeStageIndex];

  return (
    <section data-header-theme="dark"
      ref={sectionRef}
      className="relative min-h-[360vh] bg-background text-text"
      id="architecture"
    >
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden lg:flex-row">
        {/* TEXT PANEL */}
        <div className="relative z-20 flex h-[40vh] w-full flex-col justify-center px-6 pt-16 lg:h-screen lg:w-1/3 lg:px-12 xl:px-20 lg:pt-0 bg-background/80 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none">
          <div className="max-w-sm">
            <span className="mb-4 inline-block text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
              {activeStage.eyebrow}
            </span>
            <h2 className="mb-4 text-3xl font-medium tracking-tight text-text sm:text-4xl">
              {activeStage.title}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {activeStage.description}
            </p>

            {/* PROGRESS INDICATOR */}
            <div className="mt-12 hidden lg:flex items-center gap-3">
              <div className="h-px w-full max-w-[120px] bg-surface/10">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{
                    width: `${((activeStageIndex + 1) / architectureStages.length) * 100}%`,
                  }}
                />
              </div>
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                {activeStageIndex + 1} / {architectureStages.length}
              </span>
            </div>
          </div>
        </div>

        {/* VISUAL SCENE */}
        <div
          ref={visualRef}
          className="relative z-10 flex h-[60vh] w-full items-center justify-center lg:h-screen lg:w-2/3"
        >
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_60%)]" />

          {/* Container for the abstract tower */}
          <div className="relative h-[80%] w-[80%] max-w-lg lg:h-[70%]">
            
            {/* GROUND LAYER */}
            <div
              ref={groundRef}
              className={cn(
                "absolute bottom-0 left-1/2 w-[140%] -translate-x-1/2 border-t border-[var(--blueprint-line)]",
                reduceMotion ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="h-8 w-full bg-gradient-to-b from-white/5 to-transparent" />
            </div>

            {/* FOUNDATION LAYER */}
            <div
              ref={foundationRef}
              className={cn(
                "absolute bottom-0 left-1/2 h-8 w-[90%] -translate-x-1/2 bg-surface-strong border border-[var(--blueprint-line)]",
                reduceMotion ? "opacity-100" : "opacity-0"
              )}
            />

            {/* COLUMNS LAYER */}
            <div
              ref={columnsRef}
              className={cn(
                "absolute bottom-8 left-1/2 flex h-[calc(100%-2rem)] w-[84%] -translate-x-1/2 justify-between px-4",
                reduceMotion ? "opacity-100 scale-y-100" : "opacity-0"
              )}
            >
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-full w-1 bg-surface/10" />
              ))}
            </div>

            {/* FLOORS LAYER */}
            <div
              ref={floorsRef}
              className={cn(
                "absolute bottom-8 left-1/2 flex h-[calc(100%-2rem)] w-[88%] -translate-x-1/2 flex-col justify-between py-8",
                reduceMotion ? "opacity-100" : "opacity-0"
              )}
            >
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-1.5 w-full bg-surface/20 shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
              ))}
            </div>

            {/* FACADE LAYER */}
            <div
              ref={facadeRef}
              className={cn(
                "absolute bottom-8 left-1/2 h-[calc(100%-2rem)] w-[90%] -translate-x-1/2 border border-dark-text/20 bg-surface-strong/40 backdrop-blur-[2px]",
                reduceMotion ? "opacity-100 scale-100" : "opacity-0"
              )}
            >
              {/* Some geometric facade lines */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,rgba(255,255,255,0.05)_50%,transparent_51%)] bg-[length:100px_100%]" />
            </div>

            {/* GLASS OVERLAY */}
            <div
              ref={glassRef}
              className={cn(
                "absolute bottom-8 left-1/2 h-[calc(100%-2rem)] w-[90%] -translate-x-1/2 bg-[linear-gradient(135deg,rgba(255,255,255,0.2)_0%,transparent_40%,rgba(255,255,255,0.05)_100%)]",
                reduceMotion ? "opacity-45" : "opacity-0"
              )}
            />

            {/* LIVING LIGHTS LAYER */}
            <div
              ref={lightRef}
              className={cn(
                "absolute bottom-8 left-1/2 h-[calc(100%-2rem)] w-[88%] -translate-x-1/2",
                reduceMotion ? "opacity-100 blur-none" : "opacity-0"
              )}
            >
              {/* Random warm light accents */}
              <div className="absolute bottom-[20%] left-[10%] h-12 w-20 bg-[#F4E3C5]/30 blur-md" />
              <div className="absolute right-[15%] top-[30%] h-16 w-16 bg-[#F4E3C5]/25 blur-md" />
              <div className="absolute bottom-[50%] left-[40%] h-10 w-24 bg-[#F4E3C5]/35 blur-md" />
              
              {/* Some crisp accent dots indicating life/activity */}
              <div className="absolute bottom-[22%] left-[15%] h-1 w-1 rounded-full bg-amber-200" />
              <div className="absolute right-[20%] top-[35%] h-1.5 w-1.5 rounded-full bg-amber-300" />
              <div className="absolute bottom-[52%] left-[50%] h-1 w-1 rounded-full bg-amber-200" />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
