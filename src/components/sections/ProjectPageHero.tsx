"use client";

import { motion } from "motion/react";
import { IframeTransitionLink } from "@/components/animation/IframeTransitionLink";
import { Container } from "@/components/ui/Container";
import { useShouldPlayHeroIntro } from "@/hooks/useShouldPlayHeroIntro";

export function ProjectPageHero() {
  const shouldPlay = useShouldPlayHeroIntro();

  return (
    <section data-header-theme="dark" className="relative min-h-[70svh] w-full overflow-hidden bg-[#070A09] flex flex-col justify-center pt-32 pb-24 border-b border-white/5">
      {/* Background Abstract Grid/Noise */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] pointer-events-none" />

      <Container className="relative z-10 flex flex-col items-start w-full">
        <motion.div
          data-motion-reveal
          data-page-intro
          data-hero-intro
          initial={shouldPlay ? { opacity: 0, y: 30 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <span className="mb-4 inline-block text-[11px] font-semibold uppercase tracking-[0.24em] text-primary" data-hero-text data-page-intro data-hero-intro>
            PROJELER
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] text-dark-text mb-6" data-hero-text data-page-intro data-hero-intro>
            Geliştirilen yaşam projelerini keşfedin
          </h1>
          <motion.div
            data-motion-reveal
            data-page-intro
            data-hero-intro
            className="flex flex-col items-start relative z-20"
            initial={shouldPlay ? { opacity: 0, y: 30 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-base lg:text-lg text-dark-text/80 leading-relaxed mb-10 max-w-2xl font-light" data-hero-text data-page-intro data-hero-intro>
              Taner Tümer İnşaat projeleri; konum, mimari planlama, yaşam kurgusu ve teknik yaklaşım birlikte düşünülerek ele alınır.
            </p>
  
            <IframeTransitionLink 
              href="#projects" 
              className="inline-flex h-[52px] items-center justify-center bg-primary px-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-dark-text transition-colors hover:bg-surface hover:text-primary"
            >
              Tümerhan Towers&apos;ı İncele
            </IframeTransitionLink>
          </motion.div>
        </motion.div>

        <motion.div
          data-motion-reveal
          data-page-intro
          data-hero-intro
          initial={shouldPlay ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 w-full grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-dark-text/10"
        >
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-medium uppercase tracking-widest text-dark-text/50">
              Durum
            </span>
            <span className="font-mono text-sm tracking-wider text-dark-text">
              Aktif Proje
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-medium uppercase tracking-widest text-dark-text/50">
              Tür
            </span>
            <span className="font-mono text-sm tracking-wider text-dark-text">
              Konut
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
        </motion.div>

      </Container>
    </section>
  );
}

