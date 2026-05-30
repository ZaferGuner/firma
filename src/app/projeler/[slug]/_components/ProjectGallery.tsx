"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useEditableContent } from "@/hooks/useEditableContent";
import { EditableSection } from "@/components/admin/EditableSection";

interface ProjectGalleryProps {
  project: any;
}

export function ProjectGallery({ project }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0); // 0-indexed array mapping
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  
  const data = useEditableContent(`project.${project.slug}`, project);

  // Fallback to auto-numbered file paths if no custom gallery array is set in db
  const galleryImages = data.gallery && data.gallery.length > 0
    ? data.gallery
    : Array.from({ length: data.imageCount || 0 }, (_, i) => {
        const paddedIndex = (i + 1).toString().padStart(2, "0");
        return `${data.imagesFolder || ""}/${paddedIndex}.jpg`;
      });

  if (galleryImages.length === 0) {
    return null;
  }

  // Adjust activeIndex if out of bounds (e.g. after image deletion)
  const safeIndex = activeIndex >= galleryImages.length ? 0 : activeIndex;

  const handleImageError = (index: number) => {
    setImageError((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <EditableSection sectionKey={`project.${project.slug}`} label="Proje Galerisi">
      <section className="px-4 md:px-8 py-20 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-4">
              Proje Galerisi
            </h2>
            <p className="text-neutral-500 text-lg">
              Projemizden kareleri inceleyebilirsiniz.
            </p>
          </div>

          {/* Main Big Image */}
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-neutral-100 mb-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={safeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                {!imageError[safeIndex] ? (
                  <Image
                    src={galleryImages[safeIndex]}
                    alt={`${data.title} - Görsel ${safeIndex + 1}`}
                    fill
                    className="object-cover"
                    onError={() => handleImageError(safeIndex)}
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center text-neutral-400">
                    <span className="font-medium text-lg uppercase tracking-widest">Görsel Hazırlanıyor</span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {galleryImages.map((imgSrc: string, imgIndex: number) => (
              <button
                key={imgIndex}
                onClick={() => setActiveIndex(imgIndex)}
                type="button"
                className={`relative shrink-0 w-32 md:w-48 aspect-[4/3] bg-neutral-100 transition-all snap-start ${
                  safeIndex === imgIndex 
                    ? "ring-2 ring-black ring-offset-2 opacity-100" 
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                {!imageError[imgIndex] ? (
                  <Image
                    src={imgSrc}
                    alt={`${data.title} - Thumbnail ${imgIndex + 1}`}
                    fill
                    className="object-cover"
                    onError={() => handleImageError(imgIndex)}
                    sizes="(max-width: 768px) 128px, 192px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center text-neutral-400">
                    <span className="font-medium text-[10px] uppercase tracking-widest">Görsel</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>
    </EditableSection>
  );
}

