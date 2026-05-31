"use client";

import { motion, useReducedMotion } from "motion/react";

import { Container } from "@/components/ui/Container";
import { aboutHero } from "@/data/about";
import { useShouldPlayHeroIntro } from "@/hooks/useShouldPlayHeroIntro";

export function AboutHero() {
  const shouldPlay = useShouldPlayHeroIntro();

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-background text-site-text flex flex-col justify-center border-b border-site-border">
      {/* Background blueprint grid / lines */}
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none" 
        style={{ 
          backgroundImage: "linear-gradient(var(--site-border) 1px, transparent 1px), linear-gradient(90deg, var(--site-border) 1px, transparent 1px)",
          backgroundSize: "64px 64px" 
        }} 
      />
      <div className="absolute left-[15%] top-0 h-full w-[1px] bg-site-primary/30 z-0 pointer-events-none" />
      <div className="absolute right-[15%] top-0 h-full w-[1px] bg-site-primary/30 z-0 pointer-events-none" />
      
      {/* Ghost text in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none z-0">
        <span className="text-[clamp(120px,18vw,320px)] font-bold text-site-accent/[0.035] tracking-tighter whitespace-nowrap">
          TANER TÜMER
        </span>
      </div>

      <Container className="relative z-10 w-full pt-32 pb-24 lg:pt-40 lg:pb-32">
        <motion.div
          data-motion-reveal
          data-page-intro
          data-hero-intro
          initial={shouldPlay ? { opacity: 0, y: 30 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <span className="mb-6 inline-block text-[11px] font-semibold uppercase tracking-[0.24em] text-site-accent" data-hero-text data-page-intro data-hero-intro>
            {aboutHero.eyebrow}
          </span>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[84px] font-medium tracking-tight leading-[1] text-site-text mb-6" data-hero-text data-page-intro data-hero-intro>
            {aboutHero.kicker}
          </h1>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-site-text/90 mb-10 tracking-tight" data-hero-text data-page-intro data-hero-intro>
            {aboutHero.title}
          </h2>
          
          <motion.div
            data-motion-reveal
            data-page-intro
            data-hero-intro
            initial={shouldPlay ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-base sm:text-lg text-site-body leading-relaxed max-w-2xl font-light" data-hero-text data-page-intro data-hero-intro>
              {aboutHero.description}
            </p>
          </motion.div>
        </motion.div>
      </Container>

      {/* Scroll indicator */}
      <motion.div 
        data-motion-reveal
        className="absolute bottom-12 left-6 lg:left-12 flex items-center gap-3 text-site-muted z-10"
        initial={shouldPlay ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <div className="flex h-10 w-6 justify-center rounded-full border border-site-border p-1">
          <motion.div 
            className="h-1.5 w-1.5 rounded-full bg-site-primary"
            animate={{ y: [0, 16, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </div>
        <span className="text-[10px] uppercase tracking-widest font-medium">KEŞFET</span>
      </motion.div>
    </section>
  );
}
