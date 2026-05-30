"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";

export function AboutLivingStory() {
  const reduceMotion = useReducedMotion();

  const points = [
    "Ferah planlama",
    "Sade estetik",
    "Aidiyet hissi",
    "Yaşam değeri",
  ];

  return (
    <section className="relative bg-background py-24 lg:py-40 border-b border-site-border overflow-hidden">
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Text Column */}
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -30 }}
            whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] text-site-text mb-8">
              Bir evden fazlası
            </h2>
            
            <p className="text-lg md:text-xl text-site-body leading-relaxed font-light mb-12 max-w-lg">
              Günlük yaşamın karmaşasını geride bırakan; ferah, sade ve yuvanızda hissettiren yaşam alanları oluşturmayı önemsiyoruz.
            </p>

            <ul className="flex flex-col gap-4">
              {points.map((point, index) => (
                <li key={index} className="flex items-center gap-4 text-site-text/90">
                  <span className="h-px w-6 bg-site-accent" />
                  <span className="text-sm tracking-wide font-medium">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Visual Column */}
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
            whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full rounded-sm overflow-hidden bg-[#0A0C0B] border border-white/10 shadow-2xl">
              {/* Glass Frame Fallback (Abstract Frame) */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent mix-blend-overlay" />
              
              {/* Warm light lines */}
              <div className="absolute -top-[30%] -right-[30%] w-[80%] h-[80%] rounded-full bg-orange-900/10 blur-[80px]" />
              <div className="absolute -bottom-[30%] -left-[30%] w-[80%] h-[80%] rounded-full bg-primary/5 blur-[100px]" />
              
              {/* Architectural Line Art */}
              <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,80 L40,80 L40,20 L100,20" stroke="white" strokeWidth="0.2" fill="none" />
                <path d="M20,100 L20,60 L80,60 L80,0" stroke="white" strokeWidth="0.2" fill="none" />
                <circle cx="60" cy="40" r="15" stroke="white" strokeWidth="0.1" fill="none" />
              </svg>

              {/* Real Image Placeholder - Will show if image exists, otherwise falls back gracefully */}
              <div className="absolute inset-0">
                <Image
                  src="/images/projects/hero-house.jpg"
                  alt="Yaşam Alanı"
                  fill
                  className="object-cover opacity-60 transition-opacity duration-700"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>

              {/* Inner Border */}
              <div className="absolute inset-4 border border-white/5 pointer-events-none" />
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}
