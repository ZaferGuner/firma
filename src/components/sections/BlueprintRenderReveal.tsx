"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "motion/react";
import { useIsIframePreview } from "@/hooks/useIsIframePreview";
import { cn } from "@/lib/utils";

export function BlueprintRenderReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  
  // Layers
  const renderLayerRef = useRef<HTMLDivElement>(null);
  const blueprintLayerRef = useRef<SVGSVGElement>(null);
  const accentLayerRef = useRef<HTMLDivElement>(null);
  const reflectionRef = useRef<HTMLDivElement>(null);

  const isIframePreview = useIsIframePreview();
  const reduceMotion = useReducedMotion() || isIframePreview;

  useEffect(() => {
    if (reduceMotion) return;
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // We use a timeline to control multiple layer animations together
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      // Initially prepare the render layer mask (using a CSS variable approach or direct clipPath)
      // We'll animate clipPath from inset(0 100% 0 0) to inset(0 0% 0 0) for a smooth left-to-right reveal
      gsap.set(renderLayerRef.current, {
        clipPath: "inset(0 100% 0 0)",
        opacity: 0.18,
        scale: 1.04,
      });

      tl.to(
        renderLayerRef.current,
        {
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          scale: 1,
          duration: 2,
          ease: "power2.inOut",
        },
        0
      )
      .to(
        blueprintLayerRef.current,
        {
          opacity: 0.22,
          y: -12,
          duration: 2,
          ease: "power2.inOut",
        },
        0
      )
      .to(
        accentLayerRef.current,
        {
          opacity: 1,
          duration: 0.5,
          ease: "power1.inOut",
        },
        0.5
      )
      .to(
        accentLayerRef.current,
        {
          opacity: 0,
          duration: 0.5,
          ease: "power1.inOut",
        },
        1.5
      )
      .to(
        reflectionRef.current,
        {
          opacity: 0.45,
          duration: 1,
          ease: "power1.inOut",
        },
        1.0
      );

    }, sectionRef);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section data-header-theme="dark"
      ref={sectionRef}
      id="blueprint"
      className="relative min-h-[260vh] bg-background text-text"
    >
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden lg:flex-row">
        
        {/* TEXT PANEL */}
        <div className="relative z-20 flex h-auto w-full flex-col justify-center px-6 pt-24 pb-8 lg:h-screen lg:w-[40%] lg:px-16 lg:py-0 bg-background/90 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none">
          <div className="max-w-md">
            <span className="mb-4 inline-block text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
              MİMARİ PLANLAMA
            </span>
            <h2 className="mb-6 text-3xl font-medium tracking-tight text-text sm:text-4xl lg:text-5xl lg:leading-[1.1]">
              Teknik çizgiden yaşam alanına
            </h2>
            <p className="mb-10 text-base leading-relaxed text-muted-foreground lg:text-lg">
              Bir yapı fikri; plan, malzeme, cephe ve kullanım kararları birlikte değerlendirildiğinde gerçek bir yaşam alanına dönüşür.
            </p>

            <ul className="grid grid-cols-2 gap-y-4 gap-x-8 text-[11px] font-semibold uppercase tracking-widest text-text/80">
              <li className="flex items-center gap-2">
                <span className="h-px w-4 bg-primary" /> Mimari çizgi
              </li>
              <li className="flex items-center gap-2">
                <span className="h-px w-4 bg-primary" /> Cephe ritmi
              </li>
              <li className="flex items-center gap-2">
                <span className="h-px w-4 bg-primary" /> Malzeme hissi
              </li>
              <li className="flex items-center gap-2">
                <span className="h-px w-4 bg-primary" /> Yaşam kurgusu
              </li>
            </ul>
          </div>
        </div>

        {/* VISUAL SCENE */}
        <div className="relative z-10 flex flex-1 items-center justify-center p-6 lg:p-12">
          <div
            ref={frameRef}
            className="relative aspect-[4/5] w-full max-w-5xl overflow-hidden rounded-sm border border-dark-text/10 bg-[#0B0F0E] shadow-[0_32px_80px_rgba(0,0,0,0.6)] sm:aspect-video"
          >
            {/* RENDER LAYER (Placeholder / Image) */}
            <div
              ref={renderLayerRef}
              className={cn(
                "absolute inset-0 z-10 origin-center bg-[#141A18]",
                reduceMotion ? "opacity-100 scale-100" : "opacity-0" // Fallback for reduced motion
              )}
              style={reduceMotion ? { clipPath: "inset(0 0% 0 0)" } : undefined}
            >
              {/* NOTE: When real asset is available, use Next/Image here:
                  <Image src="/images/projects/blueprint-render.jpg" alt="..." fill className="object-cover" /> 
              */}
              {/* Placeholder abstract building mass */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_50%)]" />
              <div className="absolute bottom-0 left-[15%] h-[80%] w-[35%] bg-gradient-to-t from-black to-[#2A3632] border-t border-r border-dark-text/10 shadow-2xl" />
              <div className="absolute bottom-0 left-[45%] h-[60%] w-[40%] bg-gradient-to-t from-black to-[#1F2926] border-t border-l border-white/5 shadow-2xl" />
              
              {/* Light accents in placeholder */}
              <div className="absolute top-[40%] left-[25%] h-full w-px bg-gradient-to-b from-transparent via-amber-200/20 to-transparent" />
              <div className="absolute bottom-[30%] left-[60%] h-20 w-4 bg-amber-500/10 blur-xl" />
              <div className="absolute bottom-[20%] right-[30%] h-2 w-2 rounded-full bg-amber-200/80 blur-[2px]" />
            </div>

            {/* BLUEPRINT LAYER */}
            <svg
              ref={blueprintLayerRef}
              className="absolute inset-0 z-20 h-full w-full pointer-events-none"
              preserveAspectRatio="none"
              viewBox="0 0 1000 600"
              style={{ opacity: reduceMotion ? 0.22 : 1 }}
            >
              {/* Grid */}
              <pattern id="blueprint-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect width="40" height="40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#blueprint-grid)" />

              {/* Main Building Outlines */}
              <path
                d="M150 600 V120 H500 V240 H850 V600"
                fill="none"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              
              {/* Horizontal Floor Lines */}
              {[...Array(10)].map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1="150"
                  y1={120 + i * 48}
                  x2={i < 3 ? "500" : "850"}
                  y2={120 + i * 48}
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1"
                />
              ))}

              {/* Vertical Facade Lines */}
              {[...Array(12)].map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={150 + i * 60}
                  y1={i < 6 ? 120 : 240}
                  x2={150 + i * 60}
                  y2="600"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                />
              ))}

              {/* Measurement Lines */}
              <line x1="120" y1="120" x2="120" y2="600" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
              <line x1="110" y1="120" x2="130" y2="120" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <line x1="110" y1="600" x2="130" y2="600" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <text x="100" y="360" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="monospace" transform="rotate(-90 100 360)" textAnchor="middle">48.00m</text>

              <line x1="150" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
              <line x1="150" y1="90" x2="150" y2="110" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <line x1="500" y1="90" x2="500" y2="110" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <text x="325" y="85" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="monospace" textAnchor="middle">35.00m</text>
            </svg>

            {/* RED ACCENT LAYER */}
            <div
              ref={accentLayerRef}
              className="absolute inset-0 z-30 pointer-events-none opacity-0"
            >
              {/* Diagonal or technical target lines */}
              <div className="absolute top-[30%] left-[25%] h-px w-32 bg-primary/60 -rotate-45" />
              <div className="absolute bottom-[40%] right-[30%] h-px w-24 bg-primary/40 rotate-12" />
              <div className="absolute top-[20%] left-[45%] h-4 w-4 border border-primary/50 rounded-full" />
              <div className="absolute top-[20%] left-[45%] h-0.5 w-0.5 bg-primary -translate-x-1/2 -translate-y-1/2 rounded-full" />
            </div>

            {/* GLASS REFLECTION LAYER */}
            <div
              ref={reflectionRef}
              className={cn(
                "absolute inset-0 z-40 pointer-events-none bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.06)_45%,rgba(255,255,255,0.15)_50%,transparent_55%)] mix-blend-overlay",
                reduceMotion ? "opacity-30" : "opacity-0"
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
