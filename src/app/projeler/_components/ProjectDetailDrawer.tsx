"use client";

import Link from "next/link";
import { X, MapPin } from "lucide-react";
import { useEffect } from "react";
import { ProjectPlaceholderVisual } from "./ProjectPlaceholderVisual";
import { motion, AnimatePresence } from "motion/react";
import { useLenis } from "lenis/react";

interface ProjectDetailDrawerProps {
  project: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailDrawer({
  project,
  isOpen,
  onClose,
}: ProjectDetailDrawerProps) {
  const lenis = useLenis();

  // Prevent body scroll and pause Lenis scroll manager to eliminate background scroll events lag
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (lenis) lenis.stop();
    } else {
      document.body.style.overflow = "";
      if (lenis) lenis.start();
    }
    return () => {
      document.body.style.overflow = "";
      if (lenis) lenis.start();
    };
  }, [isOpen, lenis]);

  return (
    <AnimatePresence>
      {isOpen && project && (
        <>
          {/* Backdrop overlay - Removed backdrop-blur to prevent heavy real-time GPU shader repaints */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[999] bg-[#111111]/35"
            onClick={onClose}
          />

          {/* Slide-in Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 h-full w-full sm:w-[540px] md:w-[600px] bg-[#f8f7f3] border-l border-[rgba(0,0,0,0.12)] z-[1000] shadow-[0_0_50px_rgba(0,0,0,0.08)] flex flex-col will-change-transform"
            data-lenis-prevent
          >
            {/* Header Rail */}
            <div className="flex justify-between items-center px-6 py-6 border-b border-[rgba(0,0,0,0.12)] bg-[#f8f7f3]">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[rgba(0,0,0,0.55)]">
                MİMARİ PROJE BİLGİSİ
              </span>
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 text-[#111111] hover:text-[rgba(0,0,0,0.6)] font-mono text-[9px] tracking-widest uppercase cursor-pointer"
              >
                <span>KAPAT</span>
                <X size={14} />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div 
              className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8"
              data-lenis-prevent
            >
              {/* Main Visual Placeholder */}
              <div className="relative border border-[rgba(0,0,0,0.12)] bg-[#f4f2ed]">
                <ProjectPlaceholderVisual
                  category={project.category}
                  status={project.status || "Devam Eden"}
                  className="aspect-[16/10]"
                />
              </div>

              {/* Title & Metadata */}
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="font-mono text-[9px] uppercase tracking-wider bg-[#111111] text-white px-2 py-0.5 font-semibold">
                    {project.category}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider border border-[#111111] text-[#111111] px-2 py-0.5 font-semibold">
                    {project.status || "Devam Eden"}
                  </span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-[#111111] mb-3">
                  {project.title}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-[rgba(0,0,0,0.55)] font-medium">
                  <MapPin size={14} className="text-[#111111]" />
                  <span>{project.location} — Taner Tümer İnşaat</span>
                </div>
              </div>

              <hr className="border-t border-[rgba(0,0,0,0.12)]" />

              {/* Description */}
              <div className="space-y-4">
                <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-[#111111] block uppercase">
                  Proje Detayı
                </span>
                <p className="text-sm leading-relaxed text-[#111111] opacity-80">
                  {project.description || project.shortDescription}
                </p>
              </div>

              <hr className="border-t border-[rgba(0,0,0,0.12)]" />

              {/* Features */}
              {project.features && project.features.length > 0 && (
                <div className="space-y-4">
                  <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-[#111111] block uppercase">
                    Proje Özellikleri
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#111111]">
                    {project.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[#111111] rounded-none mt-1.5 shrink-0" />
                        <span className="leading-relaxed opacity-75">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <hr className="border-t border-[rgba(0,0,0,0.12)]" />

              {/* Gallery Blueprint Placeholder */}
              <div className="space-y-4">
                <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-[#111111] block uppercase">
                  MİMARİ DETAY GALERİSİ
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-[4/3] border border-[rgba(0,0,0,0.12)] bg-[#f4f2ed] flex items-center justify-center">
                    <span className="font-mono text-[8px] tracking-[0.2em] text-[rgba(0,0,0,0.4)] uppercase">
                      PLAN / KESİT AŞAMASINDA
                    </span>
                  </div>
                  <div className="aspect-[4/3] border border-[rgba(0,0,0,0.12)] bg-[#f4f2ed] flex items-center justify-center">
                    <span className="font-mono text-[8px] tracking-[0.2em] text-[rgba(0,0,0,0.4)] uppercase">
                      PLAN / KESİT AŞAMASINDA
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action / Contact Rail */}
            <div className="border-t border-[rgba(0,0,0,0.12)] bg-[#f8f7f3] p-6">
              <div className="grid grid-cols-3 gap-3">
                <a
                  href="https://wa.me/905330618001?text=Merhaba%2C%20projeniz%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-2 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 text-xs font-bold tracking-[0.2em] uppercase transition-colors rounded-sm"
                >
                  <i className="fa-brands fa-whatsapp text-base" />
                  <span className="hidden sm:inline">WhatsApp ile Detaylı Bilgi Al</span>
                  <span className="sm:hidden">WhatsApp</span>
                </a>
                <Link
                  href={`/projects/${project.slug}`}
                  className="col-span-1 flex items-center justify-center bg-[#111111] px-3 py-3.5 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[rgba(17,17,17,0.85)] rounded-sm"
                >
                  Detay
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
