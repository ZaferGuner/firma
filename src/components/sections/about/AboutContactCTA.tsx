"use client";

import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { useSkipIntro } from "@/hooks/useSkipIntro";
import { IframeTransitionLink } from "@/components/animation/IframeTransitionLink";
import { aboutContact } from "@/data/about";

export function AboutContactCTA() {
  const reduceMotion = useReducedMotion();
  const skipIntro = useSkipIntro();

  return (
    <section className="relative bg-site-dark py-16 sm:py-20 lg:py-24 border-t border-white/5 overflow-hidden">
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left Title */}
          <motion.div
            data-motion-reveal
            initial={skipIntro ? false : { opacity: 0, x: -20 }}
            whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.15] text-site-dark-text max-w-xl">
              {aboutContact.title}
            </h2>
          </motion.div>

          {/* Right Content */}
          <motion.div
            data-motion-reveal
            initial={skipIntro ? false : { opacity: 0, x: 20 }}
            whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-10 lg:gap-14"
          >
            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] uppercase tracking-widest text-site-dark-label font-medium">
                  Adres
                </span>
                <p className="text-sm text-site-dark-body leading-relaxed font-light max-w-[200px]">
                  {aboutContact.address}
                </p>
              </div>

              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] uppercase tracking-widest text-site-dark-label font-medium">
                    Telefon
                  </span>
                  <a 
                    href={aboutContact.phoneHref}
                    className="text-sm text-site-dark-text hover:text-site-accent transition-colors"
                  >
                    {aboutContact.phoneLabel}
                  </a>
                </div>
                
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] uppercase tracking-widest text-site-dark-label font-medium">
                    E-Posta
                  </span>
                  <a 
                    href={aboutContact.emailHref}
                    className="text-sm text-site-dark-text hover:text-site-accent transition-colors"
                  >
                    {aboutContact.emailLabel}
                  </a>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[rgba(245,242,234,0.12)]">
              <IframeTransitionLink 
                href="/iletisim"
                className="inline-flex h-12 items-center justify-center bg-site-primary px-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-site-primary-hover"
              >
                Bilgi Al
              </IframeTransitionLink>
              
              <IframeTransitionLink 
                href="/projeler"
                className="inline-flex h-12 items-center justify-center border border-[rgba(245,242,234,0.20)] px-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-site-dark-text transition-colors hover:bg-white/5"
              >
                Projeleri İncele
              </IframeTransitionLink>
            </div>
          </motion.div>
          
        </div>
      </Container>
    </section>
  );
}

