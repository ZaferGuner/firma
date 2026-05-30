"use client";

import { motion } from "motion/react";
import { IframeTransitionLink } from "@/components/animation/IframeTransitionLink";
import { EditableSection } from "@/components/admin/EditableSection";
import { useEditableContent } from "@/hooks/useEditableContent";
import { pressPageDefaults } from "@/data/press";

type PressProjectsCTAProps = {
  initialData?: any;
};

export function PressProjectsCTA({ initialData }: PressProjectsCTAProps) {
  const data = useEditableContent("press.projectsCta", initialData || pressPageDefaults.projectsCta);

  return (
    <EditableSection sectionKey="press.projectsCta" label="Basın Projeler CTA">
      <section className="py-16 md:py-20 bg-site-dark text-site-dark-text" data-header-theme="dark">
        <div className="container mx-auto px-6 lg:px-12 xl:px-20 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              {data.title}
            </h2>
            <p className="text-site-dark-body text-lg md:text-xl leading-relaxed mb-10">
              {data.description}
            </p>

            <IframeTransitionLink
              href="/projects"
              className="inline-flex items-center justify-center px-8 h-12 bg-site-surface text-site-text rounded-none text-[11px] font-bold tracking-[0.24em] uppercase hover:bg-site-soft transition-colors duration-300"
            >
              {data.buttonText}
            </IframeTransitionLink>
          </motion.div>
        </div>
      </section>
    </EditableSection>
  );
}
