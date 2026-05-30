"use client";

import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { useState } from "react";
import { ProjectPlaceholderVisual } from "./ProjectPlaceholderVisual";

interface ProjectCardProps {
  project: any;
  onSelect: (project: any) => void;
  className?: string;
}

export function ProjectCard({ project, onSelect, className = "" }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);

  // Show placeholder if no cover image is defined or if the image fails to load
  const showPlaceholder = !project.coverImage || imageError;

  return (
    <div
      onClick={() => onSelect(project)}
      className={`group flex flex-col bg-[#f8f7f3] border border-[rgba(0,0,0,0.12)] rounded-sm overflow-hidden cursor-pointer transition-all duration-500 ease-out hover:border-[rgba(0,0,0,0.35)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] h-full ${className}`}
    >
      {/* Category / Image slot */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f4f2ed]">
        {!showPlaceholder ? (
          <>
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
              onError={() => setImageError(true)}
            />
            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-[#111111]/0 group-hover:bg-[#111111]/5 transition-colors duration-500" />
            
            {/* Upper Category Label */}
            <div className="absolute top-4 left-4 z-10 bg-[#111111] text-white px-2.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider rounded-none">
              {project.category}
            </div>

            {/* Bottom Status Label */}
            <div className="absolute bottom-4 right-4 z-10 bg-[#f8f7f3] border border-[rgba(0,0,0,0.12)] text-[#111111] px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider rounded-none">
              {project.status || "Devam Eden"}
            </div>
          </>
        ) : (
          <ProjectPlaceholderVisual
            category={project.category}
            status={project.status || "Devam Eden"}
            className="w-full h-full aspect-auto transition-transform duration-700 ease-out group-hover:scale-103"
          />
        )}
      </div>

      {/* Info details */}
      <div className="flex flex-col flex-grow p-6 md:p-8 justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl md:text-2xl font-bold text-[#111111] leading-tight">
              {project.title}
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-[rgba(0,0,0,0.55)] font-semibold uppercase tracking-wider shrink-0 shrink ml-4">
              <MapPin size={12} className="text-[#111111]" />
              <span>{project.location}</span>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-[rgba(0,0,0,0.55)] line-clamp-3">
            {project.description || project.shortDescription}
          </p>

          {/* Features list */}
          {project.features && project.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {project.features.slice(0, 3).map((feat: string, index: number) => (
                <span
                  key={index}
                  className="font-mono text-[9px] tracking-wide text-[rgba(0,0,0,0.6)] bg-[#f4f2ed] border border-[rgba(0,0,0,0.08)] px-2 py-0.5 rounded-none"
                >
                  {feat}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Link row */}
        <div className="pt-6 border-t border-[rgba(0,0,0,0.06)] mt-6 flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#111111] uppercase">
            PROJEYİ İNCELE
          </span>
          <ArrowRight
            size={16}
            className="text-[#111111] transition-transform duration-500 ease-out group-hover:translate-x-1.5"
          />
        </div>
      </div>
    </div>
  );
}
