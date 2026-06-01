"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useLenis } from "lenis/react";
import { type RefObject, useEffect, useRef, useState } from "react";
import { useShouldPlayHeroIntro } from "@/hooks/useShouldPlayHeroIntro";
import { Container } from "@/components/ui/Container";
import { ArrowUpRight } from "lucide-react";
import { useEditableContent } from "@/hooks/useEditableContent";
import { EditableSection } from "@/components/admin/EditableSection";
import { IframeTransitionLink } from "@/components/animation/IframeTransitionLink";

const ease = [0.19, 1, 0.22, 1] as const;

type HeroContent = {
  eyebrow: string;
  title: string;
  subtext: string;
  button1Text: string;
  button1Link: string;
  button2Text: string;
  button2Link: string;
};

type HomeHeroProps = {
  intro?: boolean;
  initialData?: Partial<HeroContent>;
};

type DepthLayerRefs = {
  scrollRef: RefObject<HTMLDivElement | null>;
};

const defaultHeroData: HeroContent = {
  eyebrow: "SEÇKİN YAŞAM PROJELERİ",
  title: "Düşünülmüş detaylarla<br class=\"hidden sm:inline\" /> inşa edilen yaşam alanları.",
  subtext:
    "Taner Tümer İnşaat; modern mimariyi, kaliteli malzeme seçimini ve güven veren uygulama disiplinini bir araya getirerek Adana'da seçkin yaşam projeleri geliştirir.",
  button1Text: "Projelerimizi İncele",
  button1Link: "/projeler",
  button2Text: "Bilgi Al",
  button2Link: "/iletisim",
};

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setPrefersReducedMotion(query.matches);
    };
    const timeout = window.setTimeout(updatePreference, 0);

    query.addEventListener("change", updatePreference);

    return () => {
      window.clearTimeout(timeout);
      query.removeEventListener("change", updatePreference);
    };
  }, []);

  return prefersReducedMotion;
}

function HeroBackgroundLayer({ scrollRef }: DepthLayerRefs) {
  return (
    <div
      ref={scrollRef}
      className="absolute inset-x-0 -top-8 bottom-[-4.5rem] z-0 overflow-hidden will-change-transform md:-top-12 md:bottom-[-6rem]"
    >
      <div className="absolute -inset-x-8 -inset-y-5 md:-inset-x-10 md:-inset-y-6">
        <Image
          alt="Taner Tümer İnşaat modern konut projesi"
          className="object-cover object-center select-none"
          fill
          priority
          sizes="100vw"
          src="/images/projects/hero-house.jpg"
          style={{
            filter: "brightness(0.58) contrast(1.08) saturate(0.82) sepia(0.04)",
          }}
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(32,34,36,0.18) 0%, rgba(32,34,36,0.38) 52%, rgba(32,34,36,0.58) 100%), radial-gradient(circle at 52% 32%, rgba(247,244,239,0.12), transparent 42%)",
        }}
      />
    </div>
  );
}

function HeroArchitecturalOverlay({ scrollRef }: DepthLayerRefs) {
  return (
    <div
      aria-hidden="true"
      ref={scrollRef}
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden opacity-[0.16] will-change-transform md:opacity-[0.2]"
    >
      <div className="absolute inset-[-10%]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(247,244,239,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(247,244,239,0.16) 1px, transparent 1px)",
            backgroundPosition: "center",
            backgroundSize: "86px 86px",
            maskImage:
              "linear-gradient(90deg, transparent 0%, black 18%, black 82%, transparent 100%)",
          }}
        />

        <div className="absolute left-[12%] top-[12%] h-[62%] w-px bg-site-dark-text/45" />
        <div className="absolute right-[18%] top-[6%] h-[76%] w-px bg-site-dark-text/35" />
        <div className="absolute left-[8%] top-[28%] h-px w-[44%] bg-site-dark-text/35" />
        <div className="absolute bottom-[24%] right-[10%] h-px w-[38%] bg-site-dark-text/28" />
        <div className="absolute left-[22%] top-[16%] h-px w-[32%] origin-left rotate-[24deg] bg-site-dark-text/25" />
        <div className="absolute right-[11%] top-[44%] h-px w-[24%] origin-right rotate-[-18deg] bg-site-dark-text/25" />
        <div className="absolute left-[18%] bottom-[18%] h-[18%] w-[18%] border-l border-t border-site-dark-text/25" />
        <div className="absolute right-[24%] top-[22%] h-[20%] w-[16%] border-r border-b border-site-dark-text/20" />
        <div className="absolute left-[14%] top-[64%] h-px w-[22%] bg-site-red/70" />
      </div>
    </div>
  );
}

function HeroDepthFrame() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(8,9,11,0.08) 44%, rgba(8,9,11,0.42) 100%), linear-gradient(90deg, rgba(8,9,11,0.44), transparent 22%, transparent 78%, rgba(8,9,11,0.38)), linear-gradient(180deg, rgba(8,9,11,0.18), transparent 32%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[38%]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(32,34,36,0.26) 48%, rgba(32,34,36,0.78) 100%)",
        }}
      />
    </>
  );
}

type HeroTextLayerProps = {
  data: HeroContent;
  intro: boolean;
  shouldPlay: boolean;
  prefersReducedMotion: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
  onContactClick: () => void;
};

function HeroTextLayer({
  data,
  intro,
  shouldPlay,
  prefersReducedMotion,
  scrollRef,
  onContactClick,
}: HeroTextLayerProps) {
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: intro && shouldPlay && !prefersReducedMotion ? 0.08 : 0,
        delayChildren: intro && shouldPlay && !prefersReducedMotion ? 0.05 : 0,
      },
    },
  };

  const shouldAnimateIntro = intro && shouldPlay && !prefersReducedMotion;

  const itemVariants = {
    hidden: {
      opacity: shouldAnimateIntro ? 0 : 1,
      y: shouldAnimateIntro ? -32 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.01 : 1.2,
        ease,
      },
    },
  };

  const primaryHref =
    data.button1Link === "#projects" || data.button1Link === "/projects"
      ? "/projeler"
      : data.button1Link;

  return (
    <div
      ref={scrollRef}
      className="relative z-40 flex min-h-[100svh] w-full items-start justify-center py-0 will-change-transform"
      data-hero-text-depth
    >
      <div className="w-full">
        <Container className="flex flex-col items-center justify-center px-4 pt-[28svh] text-center sm:pt-[30svh] md:pt-[32svh] lg:pt-[33svh]">
          <motion.div
            animate="visible"
            className="flex max-w-4xl flex-col items-center"
            initial={shouldPlay ? "hidden" : "visible"}
            variants={containerVariants}
          >
            <motion.div
              className="mb-6"
              data-hero-intro
              data-hero-text
              data-page-intro
              variants={itemVariants}
            >
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-[#C5162E]">
                {data.eyebrow}
              </span>
            </motion.div>

            <motion.h1
              className="max-w-[11ch] text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#F7F4EF] [text-shadow:0_18px_52px_rgba(0,0,0,0.42)] sm:max-w-none sm:text-5xl md:text-6xl lg:text-7xl"
              dangerouslySetInnerHTML={{ __html: data.title }}
              data-hero-intro
              data-hero-text
              data-page-intro
              variants={itemVariants}
            />

            <motion.p
              className="mt-8 max-w-2xl text-[15px] leading-relaxed text-[rgba(247,244,239,0.84)] [text-shadow:0_10px_34px_rgba(0,0,0,0.34)] sm:text-lg sm:leading-relaxed"
              data-hero-intro
              data-hero-text
              data-page-intro
              variants={itemVariants}
            >
              {data.subtext}
            </motion.p>

            <motion.div
              className="mt-12 flex w-[calc(100vw-80px)] max-w-[340px] flex-col items-center justify-center gap-4 md:w-auto md:max-w-none md:flex-row"
              variants={itemVariants}
            >
              <IframeTransitionLink
                className="inline-flex h-12 w-full items-center justify-center bg-site-primary px-8 text-[11px] font-bold uppercase tracking-[0.24em] text-white transition-colors hover:bg-site-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:w-auto"
                href={primaryHref}
              >
                {data.button1Text}
              </IframeTransitionLink>

              <button
                className="inline-flex h-12 w-full items-center justify-center border border-site-dark-text/24 bg-transparent px-8 text-[11px] font-bold uppercase tracking-[0.24em] text-site-dark-text transition-colors hover:border-site-dark-text/70 hover:bg-site-dark-text/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:w-auto"
                onClick={onContactClick}
                type="button"
              >
                {data.button2Text}
                <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
              </button>
            </motion.div>
          </motion.div>
        </Container>
      </div>

    </div>
  );
}

function HeroFoldCue() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[calc(100svh+1px)] z-40">
      <div className="ml-auto flex w-[82vw] max-w-[640px] translate-x-[10px] flex-col items-end pl-4">
        <div className="h-px w-full bg-gradient-to-r from-site-dark-text/42 via-site-dark-text/42 to-transparent" />
        <p className="mt-5 max-w-[560px] pr-4 text-right font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-site-dark-text/72 sm:text-[11px]">
          Mimari duruşu güçlü, yaşam değeri kalıcı projeler.
        </p>
      </div>
    </div>
  );
}

export function HomeHero({ intro = true, initialData }: HomeHeroProps) {
  const shouldPlay = useShouldPlayHeroIntro();
  const sectionRef = useRef<HTMLElement | null>(null);
  const backgroundScrollRef = useRef<HTMLDivElement | null>(null);
  const overlayScrollRef = useRef<HTMLDivElement | null>(null);
  const textScrollRef = useRef<HTMLDivElement | null>(null);
  const depthRafRef = useRef<number | null>(null);
  const lenis = useLenis();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [depthMode, setDepthMode] = useState({
    isMobile: false,
  });

  const data = useEditableContent<HeroContent>("home.hero", {
    ...defaultHeroData,
    ...initialData,
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (prefersReducedMotion) {
      const timeout = window.setTimeout(() => {
        setDepthMode({ isMobile: true });
      }, 0);
      return () => window.clearTimeout(timeout);
    }

    const mobileQuery = window.matchMedia("(max-width: 767px)");

    const updateDepthMode = () => {
      setDepthMode({ isMobile: mobileQuery.matches });
    };

    const timeout = window.setTimeout(updateDepthMode, 0);

    mobileQuery.addEventListener("change", updateDepthMode);
    window.addEventListener("resize", updateDepthMode, { passive: true });

    return () => {
      window.clearTimeout(timeout);
      mobileQuery.removeEventListener("change", updateDepthMode);
      window.removeEventListener("resize", updateDepthMode);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const section = sectionRef.current;
    const backgroundScroll = backgroundScrollRef.current;
    const overlayScroll = overlayScrollRef.current;
    const textScroll = textScrollRef.current;

    if (
      !section ||
      !backgroundScroll ||
      !overlayScroll ||
      !textScroll ||
      typeof window === "undefined"
    ) {
      return;
    }

    const target = {
      pixel: 0,
      progress: 0,
    };
    const current = {
      pixel: 0,
      progress: 0,
    };

    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
    const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

    const applyDepth = () => {
      const mobile = depthMode.isMobile;
      const progress = current.progress;
      const textLimit = mobile ? 108 : 178;
      const textReach = mobile ? 320 : 420;
      const textProgress = clamp(current.pixel / textReach, 0, 1);

      const backgroundY = progress * (mobile ? -38 : -104);
      const overlayY = progress * (mobile ? -116 : -248);
      const textY = textLimit * easeOutCubic(textProgress);

      backgroundScroll.style.transform = `translate3d(0, ${backgroundY.toFixed(2)}px, 0)`;
      overlayScroll.style.transform = `translate3d(0, ${overlayY.toFixed(2)}px, 0)`;
      textScroll.style.transform = `translate3d(0, ${textY.toFixed(2)}px, 0)`;
    };

    const resetDepth = () => {
      backgroundScroll.style.transform = "translate3d(0, 0, 0)";
      overlayScroll.style.transform = "translate3d(0, 0, 0)";
      textScroll.style.transform = "translate3d(0, 0, 0)";
    };

    if (prefersReducedMotion) {
      resetDepth();
      return;
    }

    const updateTargets = () => {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, rect.height);
      target.pixel = clamp(-rect.top, 0, travel);
      target.progress = target.pixel / travel;
    };

    let isTracking = false;

    const tick = () => {
      updateTargets();

      const progressDelta = target.progress - current.progress;
      const pixelDelta = target.pixel - current.pixel;

      current.progress += progressDelta * 0.18;
      current.pixel += pixelDelta * 0.18;
      applyDepth();

      if (isTracking) {
        depthRafRef.current = window.requestAnimationFrame(tick);
      }
    };

    const syncScrollDepth = () => {
      updateTargets();
      current.progress += (target.progress - current.progress) * 0.22;
      current.pixel += (target.pixel - current.pixel) * 0.22;
      applyDepth();
    };

    const startTracking = () => {
      if (isTracking) {
        return;
      }

      isTracking = true;
      tick();
    };

    const stopTracking = () => {
      isTracking = false;

      if (depthRafRef.current !== null) {
        window.cancelAnimationFrame(depthRafRef.current);
        depthRafRef.current = null;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startTracking();
          return;
        }

        stopTracking();
      },
      { threshold: 0 }
    );

    observer.observe(section);
    lenis?.on("scroll", syncScrollDepth);
    window.addEventListener("scroll", syncScrollDepth, { passive: true });
    window.addEventListener("resize", syncScrollDepth, { passive: true });
    startTracking();

    return () => {
      observer.disconnect();
      lenis?.off("scroll", syncScrollDepth);
      window.removeEventListener("scroll", syncScrollDepth);
      window.removeEventListener("resize", syncScrollDepth);
      stopTracking();
    };
  }, [depthMode.isMobile, lenis, prefersReducedMotion]);

  const handleContactClick = () => {
    window.dispatchEvent(new CustomEvent("tt:contact-open"));
  };

  return (
    <EditableSection sectionKey="home.hero" label="Hero Alanı">
      <section
        className="relative isolate flex min-h-[125svh] items-start justify-center overflow-hidden bg-dark-bg text-dark-text md:min-h-[125svh]"
        data-header-theme="dark"
        id="hero"
        ref={sectionRef}
      >
        <HeroBackgroundLayer scrollRef={backgroundScrollRef} />
        <HeroArchitecturalOverlay scrollRef={overlayScrollRef} />
        <HeroDepthFrame />
        <HeroFoldCue />
        <HeroTextLayer
          data={data}
          intro={intro}
          onContactClick={handleContactClick}
          prefersReducedMotion={prefersReducedMotion}
          scrollRef={textScrollRef}
          shouldPlay={shouldPlay}
        />

      </section>
    </EditableSection>
  );
}
