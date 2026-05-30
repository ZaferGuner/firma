"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSkipIntro } from "@/hooks/useSkipIntro";

import { Container } from "@/components/ui/Container";

type HeroSectionProps = {
  intro?: boolean;
};

const ease = [0.19, 1, 0.22, 1] as const;

export function HeroSection({ intro = true }: HeroSectionProps) {
  const skipIntro = useSkipIntro();
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const [disableParallax, setDisableParallax] = useState(false);

  useEffect(() => {
    let timeout: number;
    if (reduceMotion || typeof window === "undefined") {
      timeout = window.setTimeout(() => setDisableParallax(true), 0);
      return () => window.clearTimeout(timeout);
    }

    const hasLowPowerDevice =
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      window.devicePixelRatio >= 2.5;

    timeout = window.setTimeout(() => setDisableParallax(hasLowPowerDevice), 0);
    return () => window.clearTimeout(timeout);
  }, [reduceMotion]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    disableParallax ? ["0svh", "0svh"] : ["-5svh", "35svh"],
  );

  return (
    <section data-header-theme="dark"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-background text-text"
    >
      <motion.div
        className="absolute inset-x-0 -top-[30svh] h-[150svh] will-change-transform"
        style={{ y: imageY }}
      >
        <Image
          alt="Taner Tümer İnşaat modern konut projesi"
          className="object-cover"
          fill
          priority
          sizes="100vw"
          src="/images/projects/hero-house.jpg"
          style={{
            filter: "brightness(0.68) contrast(1.04) saturate(0.82)",
          }}
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,11,0.26)_0%,rgba(8,9,11,0.34)_48%,rgba(8,9,11,0.82)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(244,241,234,0.08),transparent_36%),linear-gradient(90deg,rgba(8,9,11,0.44),transparent_34%,rgba(8,9,11,0.34))]" />

      <Container className="relative z-10 flex min-h-[120svh] flex-col items-center justify-center px-4 text-center">
        <motion.h1
          data-motion-reveal
          animate={intro ? { opacity: 1, y: 0 } : undefined}
          className="mt-[200px] max-w-4xl text-4xl font-medium leading-tight text-text sm:text-5xl md:text-6xl"
          initial={skipIntro ? false : (intro ? { opacity: 0, y: 20 } : false)}
          transition={{ duration: 0.8, ease }}
        >
          Düşünülmüş detaylarla inşa edilen yaşam alanları.
        </motion.h1>
      </Container>
    </section>
  );
}
