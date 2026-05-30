"use client";

import { motion } from "motion/react";
import { IframeTransitionLink } from "@/components/animation/IframeTransitionLink";
import { EditableSection } from "@/components/admin/EditableSection";
import { useEditableContent } from "@/hooks/useEditableContent";
import { pressPageDefaults } from "@/data/press";

type PressEmptyStateProps = {
  initialData?: any;
};

export function PressEmptyState({ initialData }: PressEmptyStateProps) {
  const data = useEditableContent("press.empty", initialData || pressPageDefaults.empty);

  return (
    <EditableSection sectionKey="press.empty" label="Basın Boş Durum">
      <section className="py-24 bg-site-bg border-y border-site-border">
        <div className="container mx-auto px-6 lg:px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto bg-site-surface border border-site-border p-12 md:p-20 flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-10 w-[1px] h-full bg-site-accent/12" />
            <div className="absolute top-0 right-10 w-[1px] h-full bg-site-accent/12" />

            <div className="mb-6 border border-site-border px-4 py-1.5 bg-site-primary-soft text-site-label">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-site-label">
                {data.eyebrow}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-site-text mb-6">
              {data.title}
            </h2>

            <p className="text-base text-site-body mb-4 max-w-lg">
              {data.description}
            </p>

            <p className="text-sm text-site-muted mb-10 max-w-sm">
              {data.secondaryText}
            </p>

            <IframeTransitionLink
              href="/iletisim"
              className="inline-flex items-center justify-center px-8 py-4 bg-site-primary text-white font-bold transition-colors hover:bg-site-primary-hover uppercase tracking-[0.22em] text-[11px]"
            >
              {data.buttonText}
            </IframeTransitionLink>
          </motion.div>
        </div>
      </section>
    </EditableSection>
  );
}
