"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { EditableSection } from "@/components/admin/EditableSection";
import { useEditableContent } from "@/hooks/useEditableContent";
import { pressPageDefaults } from "@/data/press";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any },
  },
};

type MediaKitSectionProps = {
  initialData?: any;
};

export function MediaKitSection({ initialData }: MediaKitSectionProps) {
  const data = useEditableContent("press.mediaKit", initialData || pressPageDefaults.mediaKit);
  const items = Array.isArray(data.items) ? data.items : pressPageDefaults.mediaKit.items;

  return (
    <EditableSection sectionKey="press.mediaKit" label="Medya Kiti">
      <section className="py-24 md:py-32 bg-surface border-b border-black/5">
        <div className="container mx-auto px-6 lg:px-12 xl:px-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#111111] mb-4">
                {data.title}
              </h2>
              <p className="text-[#111111]/70 leading-relaxed text-lg">
                {data.description}
              </p>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {items.map((item: any, index: number) => (
              <motion.div
                key={`${item.title}-${index}`}
                variants={itemVariants}
                className="group flex flex-col p-8 border border-black/10 bg-[#FAFAFA] hover:bg-surface transition-colors duration-300"
              >
                <div className="mb-auto">
                  <h3 className="text-lg font-semibold text-[#111111] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#111111]/70 leading-relaxed mb-8">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center text-xs font-semibold uppercase tracking-widest text-[#111111]/40 group-hover:text-[#111111] transition-colors duration-300">
                  {data.requestText}
                  <ArrowUpRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </EditableSection>
  );
}
