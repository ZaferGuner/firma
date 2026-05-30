"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { EditableSection } from "@/components/admin/EditableSection";
import { useEditableContent } from "@/hooks/useEditableContent";
import { PressItem } from "@/data/press";

export function PressCard({ item }: { item: PressItem }) {
  const data = useEditableContent(`pressItem.${item.id}`, item);
  const isLinked = Boolean(data.url);
  const MotionTag = isLinked ? motion.a : motion.article;

  return (
    <EditableSection sectionKey={`pressItem.${data.id}`} label={`Basın: ${data.title || "İçerik"}`}>
      <MotionTag
        {...(isLinked
          ? {
              href: data.url,
              target: "_blank",
              rel: "noopener noreferrer",
            }
          : {})}
        className="group block flex flex-col h-full bg-site-surface border border-site-border overflow-hidden hover:border-[#CFC7BA] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(46,48,43,0.05)]"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-site-soft">
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
              <span className="font-mono text-[10px] text-site-muted uppercase tracking-[0.2em] relative z-10">
                Taner Tümer İnşaat
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-grow p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-site-muted">
              {data.type}
            </span>
            <span className="text-[10px] font-mono text-site-muted uppercase tracking-wider">
              {data.date}
            </span>
          </div>

          <h3 className="text-xl font-bold tracking-tight text-site-text mb-3 line-clamp-2">
            {data.title}
          </h3>

          <p className="text-sm text-site-body leading-relaxed mb-6 line-clamp-3">
            {data.description}
          </p>

          <div className="mt-auto flex items-center justify-between pt-6 border-t border-site-border">
            <span className="text-xs font-semibold text-site-text">
              {data.source}
            </span>
            {isLinked && (
              <div className="flex items-center text-[10px] font-semibold uppercase tracking-widest text-site-text group-hover:text-site-accent transition-colors duration-300">
                İncele
                <ArrowRight size={14} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            )}
          </div>
        </div>
      </MotionTag>
    </EditableSection>
  );
}
