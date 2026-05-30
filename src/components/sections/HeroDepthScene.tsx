"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { useSkipIntro } from "@/hooks/useSkipIntro";
import { useEffect, useRef, useState } from "react";
import { IframeTransitionLink } from "@/components/animation/IframeTransitionLink";

import { Container } from "@/components/ui/Container";

type HeroDepthSceneProps = {
  intro?: boolean;
};

export function HeroDepthScene({ intro = true }: HeroDepthSceneProps) {
  const skipIntro = useSkipIntro();
  const [imgError, setImgError] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  
  const shouldReduceMotion = useReducedMotion();

  // Scroll Parallax (Ties animation to user scroll progress within the section)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Base Photo scales down and moves down slower than the scroll, creating depth
  const imageY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0svh", "0svh"] : ["-4svh", "8svh"]);
  
  // Architectural lines overlay moves up slightly
  const overlayY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0svh", "0svh"] : ["0svh", "4svh"]);
  
  // Glass reflection moves down slightly (opposite to overlay)
  const glassYScroll = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0svh", "0svh"] : ["2svh", "-2svh"]);
  
  // Text content floats up gently
  const textY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0svh", "0svh"] : ["0svh", "-5svh"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0.72]);

  // Minimal Mouse Parallax (only for X axis to not conflict with scroll Y)
  const mouseX = useMotionValue(0.5);
  const springConfig = { damping: 30, stiffness: 100, mass: 1 };
  const smoothMouseX = useSpring(mouseX, springConfig);

  const glassX = useTransform(smoothMouseX, [0, 1], shouldReduceMotion ? [0, 0] : [10, -10]);
  const redLinesX = useTransform(smoothMouseX, [0, 1], shouldReduceMotion ? [0, 0] : [-6, 6]);

  useEffect(() => {
    if (shouldReduceMotion || typeof window === "undefined") return;

    let rafId: number;
    let isVisible = true;

    // Intersection Observer to stop tracking when out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    // Native mousemove with requestAnimationFrame throttling
    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible || window.innerWidth < 768) return; // Disable on mobile and when out of view
      
      const { clientX } = e;
      const { innerWidth } = window;
      
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        mouseX.set(clientX / innerWidth);
      });
    };

    const handleMouseLeave = () => {
      cancelAnimationFrame(rafId);
      mouseX.set(0.5);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [shouldReduceMotion, mouseX]);

  return (
    <section data-header-theme="dark" 
      id="hero"
      ref={sectionRef}
      className="relative min-h-[145svh] w-full overflow-hidden isolate bg-background md:min-h-[160svh]"
    >
      {/* Sticky Viewport Scene */}
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        
        {/* 1. Base photo layer (Taller than viewport to allow safe translateY) & CSS Gradient Fallback */}
        <motion.div 
          className="absolute inset-x-0 -top-[14svh] z-0 h-[128svh] bg-gradient-to-br from-[#121815] to-[#070A09] will-change-transform"
          style={{ y: imageY }}
        >
          {/* 
            Color grade alternatives:
            1. premium-neutral: filter: "brightness(0.74) contrast(1.08) saturate(0.82) sepia(0.04)"
            2. soft-luxury: filter: "brightness(0.80) contrast(1.02) saturate(0.72) sepia(0.08)"
            3. dark-architectural: filter: "brightness(0.64) contrast(1.16) saturate(0.70) sepia(0.02)"
          */}
          {!imgError && (
            <Image
              alt="Taner Tümer İnşaat mimari proje görseli"
              className="object-cover transition-opacity duration-700"
              fill
              onError={() => setImgError(true)}
              priority
              sizes="100vw"
              src="/images/projects/hero-house.jpg"
              style={{ 
                filter: "brightness(0.74) contrast(1.08) saturate(0.82) sepia(0.04)",
              }}
            />
          )}
        </motion.div>

        {/* 2. Main cinematic gradient */}
        <div 
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.34) 38%, rgba(0,0,0,0.62) 100%)"
          }}
        />

        {/* 3. Left/right vignette, Top haze & Bottom depth shadow */}
        <div 
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background: `
              radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 45%, rgba(0,0,0,0.42) 100%),
              linear-gradient(to bottom, rgba(244,241,234,0.10), rgba(244,241,234,0.00) 28%),
              linear-gradient(to top, rgba(0,0,0,0.70), rgba(0,0,0,0.00) 42%)
            `
          }}
        />

        {/* 4. Noise texture */}
        <div 
          className="pointer-events-none absolute inset-0 z-30 opacity-[0.045] mix-blend-overlay"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat"
          }}
        />

        {/* 5. Architectural line overlay (Blueprint) & Red lines */}
        <motion.div 
          className="pointer-events-none absolute inset-0 z-40 opacity-[0.12] will-change-transform"
          style={{ x: redLinesX, y: overlayY }}
        >
          <div className="absolute inset-0 opacity-80" style={{ 
            backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
            backgroundSize: "64px 64px"
          }} />
          <div className="absolute left-[15%] top-0 h-full w-[1px] bg-primary" />
          <div className="absolute right-[25%] top-[10%] h-full w-[1px] bg-primary/60" />
        </motion.div>

        {/* 6. Glass reflection overlay */}
        <motion.div 
          className="pointer-events-none absolute inset-0 z-50 opacity-[0.12] mix-blend-overlay will-change-transform"
          style={{ 
            background: "linear-gradient(115deg, rgba(255,255,255,0.00) 0%, rgba(255,255,255,0.08) 42%, rgba(255,255,255,0.00) 58%)",
            x: glassX, 
            y: glassYScroll
          }}
        />

        {/* Hero Content */}
        <motion.div 
          className="relative z-[70] flex h-full w-full flex-col pb-40 pt-[26vh] md:pt-[30vh] will-change-transform"
          style={{ y: textY, opacity: textOpacity }}
        >
          <Container className="flex w-full flex-col">
            {/* Center Big Title */}
            <motion.div
              data-motion-reveal
              animate={intro ? { opacity: 1, y: 0 } : undefined}
              className="mx-auto w-full max-w-5xl text-center"
              initial={skipIntro ? false : (intro ? { opacity: 0, y: 30 } : false)}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="mb-4 inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                TANER TÜMER İNŞAAT
              </span>
              <h1 
                className="font-medium leading-[0.98] tracking-[-0.04em] text-dark-text text-[clamp(42px,7vw,84px)]"
                style={{ textShadow: "0 12px 40px rgba(0,0,0,0.38)" }}
              >
                Mimari planlama ve güven odaklı yapı yaklaşımı
              </h1>
            </motion.div>

            {/* Info Row */}
            <motion.div
              data-motion-reveal
              animate={intro ? { opacity: 1, y: 0 } : undefined}
            >
              <p className="mt-8 mx-auto max-w-xl text-base leading-[1.6] text-dark-text/80 md:text-lg font-light drop-shadow-lg">
                Adana’da modern yaşam alanları geliştiren Taner Tümer İnşaat, projelerini konum, kullanım değeri ve teknik disiplin birlikte düşünülerek ele alır.
              </p>
            </motion.div>

            {/* Content Bottom Row: CTA & Mini Stats */}
            <motion.div 
              data-motion-reveal
              className="mt-16 mx-auto w-full max-w-5xl flex flex-col items-center gap-12 lg:flex-row lg:items-end lg:justify-between"
              initial={skipIntro ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 relative z-20">
                <IframeTransitionLink 
                  href="/#company" 
                  className="flex h-[52px] items-center justify-center bg-primary px-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-dark-text transition-colors hover:bg-surface hover:text-primary"
                >
                  Yaklaşımımızı Keşfet
                </IframeTransitionLink>
                <IframeTransitionLink 
                  href="/projeler" 
                  className="flex h-[52px] items-center justify-center border border-dark-text/20 bg-dark-bg/20 px-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-dark-text backdrop-blur-sm transition-colors hover:bg-surface/10"
                >
                  Projeleri Gör
                </IframeTransitionLink>
              </div>

              {/* Data / Stats Panel */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-8 md:flex md:gap-16 relative z-20">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-widest text-dark-text/50">
                    Odak
                  </span>
                  <span className="font-mono text-sm tracking-wider text-dark-text">
                    Modern Konut
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-widest text-dark-text/50">
                    Yaklaşım
                  </span>
                  <span className="font-mono text-sm tracking-wider text-dark-text">
                    Planlama + Uygulama
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-widest text-dark-text/50">
                    Bölge
                  </span>
                  <span className="font-mono text-sm tracking-wider text-dark-text">
                    Adana
                  </span>
                </div>
              </div>
            </motion.div>
          </Container>
        </motion.div>

      </div>
    </section>
  );
}

