"use client";

import { motion } from "motion/react";
import React from "react";
import { EditableSection } from "@/components/admin/EditableSection";
import { useEditableContent } from "@/hooks/useEditableContent";
import { contactPageDefaults } from "@/data/contact";
import { useShouldPlayHeroIntro } from "@/hooks/useShouldPlayHeroIntro";

type ContactHeroProps = {
  initialData?: any;
};

export const ContactHero = ({ initialData }: ContactHeroProps) => {
  const shouldPlay = useShouldPlayHeroIntro();
  const data = useEditableContent("contact.hero", initialData || contactPageDefaults.hero);

  return (
    <EditableSection sectionKey="contact.hero" label="İletişim Hero">
      <section 
        data-header-theme="light"
        className="relative w-full pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-site-bg"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(var(--site-border) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.5,
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={shouldPlay ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-4"
              data-hero-text
              data-page-intro
              data-hero-intro
            >
              <span className="font-mono text-[10px] font-bold tracking-[0.25em] text-[#C5162E] uppercase">
                {data.eyebrow}
              </span>
            </motion.div>

            <motion.h1
              initial={shouldPlay ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-6xl font-light tracking-tight text-site-text mb-6"
              data-hero-text
              data-page-intro
              data-hero-intro
            >
              {data.title} <br className="hidden md:block" />
              <span className="font-medium">{data.highlight}</span>
            </motion.h1>

            <motion.p
              initial={shouldPlay ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg md:text-xl text-site-body max-w-xl font-light leading-relaxed"
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
};
