"use client";

import { motion } from "motion/react";
import { EditableSection } from "@/components/admin/EditableSection";
import { useEditableContent } from "@/hooks/useEditableContent";
import { pressPageDefaults } from "@/data/press";
import { useShouldPlayPageIntro } from "@/hooks/useShouldPlayPageIntro";

type PressHeroProps = {
  initialData?: any;
};

export function PressHero({ initialData }: PressHeroProps) {
  const shouldPlay = useShouldPlayPageIntro();
  const data = useEditableContent("press.hero", initialData || pressPageDefaults.hero);

  return (
    <EditableSection sectionKey="press.hero" label="Basın Hero">
      <section
        className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-site-bg text-site-text"
        data-header-theme="light"
      >
        <div className="absolute inset-0 pointer-events-none opacity-[0.08]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--site-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--site-border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 xl:px-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            <motion.div
              initial={shouldPlay ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 inline-flex items-center gap-2"
              data-hero-text
              data-page-intro
              data-hero-intro
            >
              <div className="w-2 h-2 rounded-full bg-site-accent" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-site-label">
                {data.eyebrow}
              </span>
            </motion.div>

            <motion.h1
              initial={shouldPlay ? { opacity: 0, y: 30 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-site-text mb-8"
              data-hero-text
              data-page-intro
              data-hero-intro
            >
              {data.title}
            </motion.h1>

            <motion.p
              initial={shouldPlay ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-site-body leading-relaxed max-w-2xl"
              data-hero-text
              data-page-intro
              data-hero-intro
            >
              {data.description}
            </motion.p>
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
