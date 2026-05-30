"use client";

import { motion } from "motion/react";
import React from "react";
import { EditableSection } from "@/components/admin/EditableSection";
import { useEditableContent } from "@/hooks/useEditableContent";
import { contactPageDefaults } from "@/data/contact";

type ContactProcessProps = {
  initialData?: any;
};

export const ContactProcess = ({ initialData }: ContactProcessProps) => {
  const data = useEditableContent("contact.process", initialData || contactPageDefaults.process);
  const steps = Array.isArray(data.steps) ? data.steps : contactPageDefaults.process.steps;

  return (
    <EditableSection sectionKey="contact.process" label="İletişim Süreci">
      <section className="w-full py-16 md:py-24 bg-surface border-t border-stone-100">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-light text-stone-900 mb-4">{data.title}</h2>
            <p className="text-stone-500">{data.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-stone-100 z-0" />

            {steps.map((step: any, index: number) => (
              <motion.div
                key={step.number || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 flex flex-col items-center text-center bg-surface"
              >
                <div className="w-24 h-24 rounded-full bg-surface border border-stone-200 flex items-center justify-center mb-6 shadow-sm">
                  <span className="text-2xl font-light text-stone-900">{step.number}</span>
                </div>
                <h3 className="text-lg font-medium text-stone-900 mb-3">{step.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed max-w-[280px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </EditableSection>
  );
};
