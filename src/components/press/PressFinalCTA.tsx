"use client";

import { motion } from "motion/react";
import { IframeTransitionLink } from "@/components/animation/IframeTransitionLink";
import { EditableSection } from "@/components/admin/EditableSection";
import { useEditableContent } from "@/hooks/useEditableContent";
import { pressPageDefaults } from "@/data/press";

type PressFinalCTAProps = {
  initialData?: any;
};

export function PressFinalCTA({ initialData }: PressFinalCTAProps) {
  const data = useEditableContent("press.finalCta", initialData || pressPageDefaults.finalCta);

  return (
    <EditableSection sectionKey="press.finalCta" label="Basın Final CTA">
      <section className="py-16 md:py-20 bg-[#FAFAFA]" data-header-theme="light">
        <div className="container mx-auto px-6 lg:px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-[#111111] mb-6">
              {data.title}
            </h2>
            <p className="text-[#111111]/70 text-lg leading-relaxed mb-10">
              {data.description}
            </p>
            <IframeTransitionLink
              href="/iletisim"
              className="inline-flex items-center justify-center px-8 h-12 bg-[#111111] text-white rounded-none text-[11px] font-bold tracking-[0.24em] uppercase hover:bg-site-primary transition-colors duration-300"
            >
              {data.buttonText}
            </IframeTransitionLink>
          </motion.div>
        </div>
      </section>
    </EditableSection>
  );
}
