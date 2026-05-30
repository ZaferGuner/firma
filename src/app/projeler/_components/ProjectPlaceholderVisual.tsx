"use client";

interface ProjectPlaceholderVisualProps {
  category?: string;
  status?: string;
  className?: string;
}

export function ProjectPlaceholderVisual({
  category,
  status,
  className = "",
}: ProjectPlaceholderVisualProps) {
  return (
    <div
      className={`relative w-full aspect-[4/3] bg-[#f8f7f3] border-b border-[rgba(0,0,0,0.12)] flex flex-col justify-between p-6 overflow-hidden select-none ${className}`}
    >
      {/* Repeating fine blueprint layout lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top row with Category */}
      <div className="relative z-10 flex justify-between items-start">
        {category && (
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] bg-[#111111] text-white px-2.5 py-1 font-semibold rounded-none">
            {category}
          </span>
        )}
      </div>

      {/* Middle row: Blueprint Text */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
        <div className="w-12 h-[1px] bg-[rgba(0,0,0,0.3)] mb-4" />
        <span className="font-mono text-[10px] font-bold tracking-[0.3em] text-[#111111] opacity-75 uppercase">
          Visual / Render in Progress
        </span>
        <span className="font-mono text-[8px] tracking-[0.15em] text-[rgba(0,0,0,0.45)] mt-1.5 uppercase">
          Taner Tümer İnşaat — Portfolio dossier
        </span>
        <div className="w-12 h-[1px] bg-[rgba(0,0,0,0.3)] mt-4" />
      </div>

      {/* Bottom row: Status */}
      <div className="relative z-10 flex justify-end">
        {status && (
          <span className="font-mono text-[9px] uppercase tracking-[0.15em] border border-[#111111] text-[#111111] bg-transparent px-2.5 py-0.5 font-semibold rounded-none">
            {status}
          </span>
        )}
      </div>
    </div>
  );
}
