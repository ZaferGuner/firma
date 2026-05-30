"use client";

import { cn } from "@/lib/utils";

import type { AnimationLabItem } from "./animationLabData";
import { DefaultDemo, demoMap } from "./demos";

function getDisplayedDifficultyLabel(item: AnimationLabItem) {
  if (item.difficulty === 2) return "Kolay-Orta";
  return item.difficultyLabel;
}

export function AnimationDemoCard({ item }: { item: AnimationLabItem }) {
  const Demo = demoMap[item.id] ?? DefaultDemo;
  const displayedDifficultyLabel = getDisplayedDifficultyLabel(item);

  return (
    <article className="group/card relative flex min-h-[306px] flex-col overflow-hidden rounded-[24px] border border-dark-text/10 bg-[#071010]/80 p-3.5 shadow-[0_18px_80px_rgba(0,0,0,0.28)] transition-colors duration-300 hover:border-[#C5162E]/45 sm:min-h-[318px] sm:p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(197,22,46,0.12),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.055),transparent_44%)] opacity-80" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:26px_26px]" />

      <div className="relative h-[142px] overflow-hidden rounded-[18px] border border-dark-text/10 bg-[#050A0A] sm:h-[152px]">
        <Demo />
      </div>

      <div className="relative mt-3 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-[15px] font-semibold leading-tight text-[#F3EFE7]">
            {item.title}
          </h2>
          <span className="shrink-0 rounded-full border border-dark-text/10 bg-surface/[0.04] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#F3EFE7]/70">
            {item.category}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#F3EFE7]/62">
          {item.description}
        </p>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#F3EFE7]/45">
              {displayedDifficultyLabel}
            </span>
            <span className="text-[11px] text-[#F3EFE7]/60">
              Zorluk {item.difficulty}/5
            </span>
          </div>

          <div className="flex items-center gap-1" aria-label={`Zorluk ${item.difficulty}/5`}>
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                aria-hidden="true"
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  index < item.difficulty
                    ? "bg-[#C5162E] shadow-[0_0_10px_rgba(197,22,46,0.45)]"
                    : "bg-surface/18",
                )}
                key={`${item.id}-difficulty-${index}`}
              />
            ))}
          </div>
        </div>

        <p className="mt-2 border-t border-dark-text/10 pt-2 text-[11px] text-[#F3EFE7]/50">
          Deneme: <span className="text-[#F3EFE7]/75">{item.instruction}</span>
        </p>
      </div>
    </article>
  );
}
