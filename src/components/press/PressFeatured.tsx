"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { EditableSection } from "@/components/admin/EditableSection";
import { useEditableContent } from "@/hooks/useEditableContent";
import { PressItem } from "@/data/press";

interface PressFeaturedProps {
  item: PressItem;
}

export function PressFeatured({ item }: PressFeaturedProps) {
  const data = useEditableContent(`pressItem.${item.id}`, item);
  const isLinked = Boolean(data.url);
  const MotionTag = isLinked ? motion.a : motion.article;

  return (
    <EditableSection sectionKey={`pressItem.${data.id}`} label={`Öne Çıkan Basın: ${data.title || "İçerik"}`}>
      <section className="py-12 bg-site-bg">
        <div className="container mx-auto px-6 lg:px-12 xl:px-20">
          <MotionTag
            {...(isLinked
              ? {
                  href: data.url,
                  target: "_blank",
                  rel: "noopener noreferrer",
                }
              : {})}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group flex flex-col lg:flex-row bg-site-surface border border-site-border overflow-hidden hover:border-[#CFC7BA] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(46,48,43,0.05)]"
          >
            <div className="relative w-full lg:w-1/2 aspect-[4/3] lg:aspect-auto overflow-hidden bg-site-soft">
              {data.image ? (
                <Image
                  src={data.image}
                  alt={data.title}
                  fill
                  className="object-cover transform group-hover:scale-[1.025] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-site-soft">
                  <div className="absolute inset-0 opacity-[0.08]">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--site-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--site-border)_1px,transparent_1px)] bg-[size:1rem_1rem]" />
                  </div>
                  <span className="font-mono text-xs text-site-muted uppercase tracking-[0.2em] relative z-10">
                    Öne Çıkan İçerik
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col flex-grow p-8 lg:p-12 xl:p-16 justify-center w-full lg:w-1/2">
              <div className="flex items-center gap-4 mb-6">
                <span className="inline-flex px-3 py-1 bg-site-accent-soft border border-[#E3D5C9] text-[#6F5F51] text-[10px] font-semibold uppercase tracking-widest">
                  Öne Çıkan
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-site-muted">
                  {data.type}
                </span>
                <span className="text-[10px] font-mono text-site-muted uppercase tracking-wider ml-auto">
                  {data.date}
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-site-text mb-6">
                {data.title}
              </h3>

              <p className="text-base md:text-lg text-site-body leading-relaxed mb-10">
                {data.description}
              </p>

              <div className="mt-auto flex items-center justify-between pt-8 border-t border-site-border">
                <span className="text-sm font-semibold text-site-text">
                  {data.source}
                </span>
                {isLinked && (
                  <div className="flex items-center text-xs font-semibold uppercase tracking-widest text-site-text group-hover:text-site-accent transition-colors duration-300">
                    Detayları Gör
                    <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                )}
              </div>
            </div>
          </MotionTag>
        </div>
      </section>
    </EditableSection>
  );
}
