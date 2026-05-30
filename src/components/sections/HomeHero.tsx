"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useShouldPlayHeroIntro } from "@/hooks/useShouldPlayHeroIntro";
import { Container } from "@/components/ui/Container";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useEditableContent } from "@/hooks/useEditableContent";
import { EditableSection } from "@/components/admin/EditableSection";
import { IframeTransitionLink } from "@/components/animation/IframeTransitionLink";

const ease = [0.19, 1, 0.22, 1] as const;

type HomeHeroProps = {
  intro?: boolean;
  initialData?: any;
};

export function HomeHero({ intro = true, initialData }: HomeHeroProps) {
  const shouldPlay = useShouldPlayHeroIntro();
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const [disableParallax, setDisableParallax] = useState(false);

  // Seeding default hero content sections
  const defaultHeroData = {
    eyebrow: "SEÇKİN YAŞAM PROJELERİ",
    title: "Düşünülmüş detaylarla<br className=\"hidden sm:inline\" /> inşa edilen yaşam alanları.",
    subtext: "Taner Tümer İnşaat; modern mimariyi, kaliteli malzeme seçimini ve güven veren uygulama disiplinini bir araya getirerek Adana’da seçkin yaşam projeleri geliştirir.",
    button1Text: "Projelerimizi İncele",
    button1Link: "/projects",
    button2Text: "Bilgi Al",
    button2Link: "/contact",
  };

  // Consume content from editing data-layer
  const data = useEditableContent("home.hero", defaultHeroData);

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

  // Scale and subtle shift for highly performant parallax
  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    disableParallax ? [1, 1] : [1.02, 1.1]
  );
  
  const imageOpacity = useTransform(
    scrollYProgress,
    [0, 0.8],
    [1, 0.35]
  );

  const handleContactClick = () => {
    window.dispatchEvent(new CustomEvent("tt:contact-open"));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease },
    },
  };

  return (
    <EditableSection sectionKey="home.hero" label="Hero Alanı">
      <section
        data-header-theme="dark"
        ref={sectionRef}
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-dark-bg text-dark-text"
        id="hero"
      >
        {/* Background Image Container */}
        <motion.div
          className="absolute inset-0 h-full w-full will-change-transform"
          style={{ scale: imageScale, opacity: imageOpacity }}
        >
          <Image
            alt="Taner Tümer İnşaat modern konut projesi"
            className="object-cover select-none"
            fill
            priority
            sizes="100vw"
            src="/images/projects/hero-house.jpg"
            style={{
              filter: "brightness(0.55) contrast(1.05) saturate(0.85)",
            }}
          />
        </motion.div>

        {/* Solid Vignette Overlays (Strictly Solid Gradients - No Glass Blur) */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(46,48,43,0.28)_0%,rgba(46,48,43,0.46)_100%)]" />

        {/* Main Content Area */}
        <Container className="relative z-10 flex flex-col items-center justify-center px-4 pt-32 pb-24 text-center">
          <motion.div
            variants={containerVariants}
            initial={shouldPlay ? "hidden" : "visible"}
            animate="visible"
            className="flex flex-col items-center max-w-4xl"
          >
            {/* Tagline */}
            <motion.div variants={itemVariants} className="mb-6" data-hero-text data-page-intro data-hero-intro>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-[#C5162E]">
                {data.eyebrow}
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl md:text-6xl lg:text-7xl text-[#F7F4EF]"
              dangerouslySetInnerHTML={{ __html: data.title }}
              data-hero-text
              data-page-intro
              data-hero-intro
            />

            {/* Subtext */}
            <motion.p
              variants={itemVariants}
              className="mt-8 max-w-2xl text-[15px] leading-relaxed text-[rgba(247,244,239,0.82)] sm:text-lg sm:leading-relaxed"
              data-hero-text
              data-page-intro
              data-hero-intro
            >
              {data.subtext}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-12 flex flex-col gap-4 w-full sm:w-auto sm:flex-row justify-center items-center"
            >
              <IframeTransitionLink
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center bg-site-primary px-8 text-[11px] font-bold uppercase tracking-[0.24em] text-white transition-colors hover:bg-site-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                href={data.button1Link === "#projects" ? "/projects" : data.button1Link}
              >
                {data.button1Text}
              </IframeTransitionLink>
              
              <button
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center border border-site-border bg-transparent px-8 text-[11px] font-bold uppercase tracking-[0.24em] text-site-dark-text transition-all hover:bg-site-primary-soft hover:text-site-text hover:border-site-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                onClick={handleContactClick}
                type="button"
              >
                {data.button2Text}
                <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
              </button>
            </motion.div>
          </motion.div>
        </Container>

        {/* Floating Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:block">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-dark-text/40 hover:text-dark-text transition-colors cursor-pointer"
            onClick={() => {
              const statement = document.getElementById("statement");
              statement?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <ChevronDown size={24} strokeWidth={1.5} />
          </motion.div>
        </div>
      </section>
    </EditableSection>
  );
}


