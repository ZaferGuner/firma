"use client";

import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { aboutSignature } from "@/data/about";

export function AboutSignature() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center bg-background py-24 overflow-hidden">
      {/* Abstract background text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none z-0">
        <span className="text-[clamp(100px,15vw,280px)] font-bold text-site-accent/[0.03] tracking-tighter whitespace-nowrap">
          TÜMER
        </span>
      </div>

      <Container className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
          whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-site-text mb-8">
            {aboutSignature.title}
          </h2>
          
          <p className="text-xl sm:text-2xl text-site-body font-light leading-relaxed max-w-2xl mb-12">
            {aboutSignature.text}
          </p>

          {/* Accent Line / Signature Mark */}
          <div className="h-12 w-px bg-site-accent" />
        </motion.div>
      </Container>
    </section>
  );
}
