"use client";

import { ArrowUpRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { IframeTransitionLink } from "@/components/animation/IframeTransitionLink";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

import { AnimationDemoCard } from "./AnimationDemoCard";
import {
  animationLabItems,
  categoryFilters,
  difficultyFilters,
  type CategoryFilter,
  type DifficultyFilter,
} from "./animationLabData";
import { DemoStyles } from "./demos";

function matchesDifficulty(
  difficulty: number,
  activeDifficulty: DifficultyFilter,
) {
  if (activeDifficulty === "Tümü") return true;
  if (activeDifficulty === "Kolay") return difficulty <= 2;
  if (activeDifficulty === "Orta") return difficulty === 3;
  if (activeDifficulty === "Zor") return difficulty === 4;
  return difficulty === 5;
}

export function AnimationLab() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("Tümü");
  const [activeDifficulty, setActiveDifficulty] =
    useState<DifficultyFilter>("Tümü");
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");

    return animationLabItems.filter((item) => {
      const categoryMatch =
        activeCategory === "Tümü" || item.category === activeCategory;
      const difficultyMatch = matchesDifficulty(
        item.difficulty,
        activeDifficulty,
      );
      const queryMatch =
        normalizedQuery.length === 0 ||
        `${item.title} ${item.description}`
          .toLocaleLowerCase("tr-TR")
          .includes(normalizedQuery);

      return categoryMatch && difficultyMatch && queryMatch;
    });
  }, [activeCategory, activeDifficulty, query]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050A0A] pb-28 pt-28 text-[#F3EFE7] sm:pt-32">
      <DemoStyles />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(197,22,46,0.16),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(180,210,210,0.10),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(180,210,210,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(180,210,210,0.12)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/60 to-transparent" />

      <Container className="relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#C5162E]">
              ANİMASYON LABORATUVARI
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.04] tracking-normal text-[#F3EFE7] sm:text-5xl lg:text-6xl">
              Premium yapı sitesi için mikro etkileşim test alanı
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#F3EFE7]/62 sm:text-base">
              Bu sayfa, Taner Tümer İnşaat sitesinde kullanılabilecek niş
              animasyonları küçük kartlar üzerinde test etmek için
              oluşturulmuştur.
            </p>
            <p className="mt-4 inline-flex max-w-full rounded-full border border-dark-text/10 bg-surface/[0.04] px-4 py-2 text-xs text-[#F3EFE7]/58">
              Bu alan deneysel animasyonları test etmek içindir. Ana site
              akışını etkilemez.
            </p>
          </div>

          <IframeTransitionLink
            className="inline-flex w-fit items-center gap-2 border border-dark-text/10 bg-surface/[0.04] px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#F3EFE7]/75 transition-colors hover:border-[#C5162E]/50 hover:text-[#F3EFE7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C5162E]"
            href="/"
          >
            Ana Sayfaya Dön
            <ArrowUpRight size={15} strokeWidth={1.8} />
          </IframeTransitionLink>
        </div>

        <section
          aria-label="Animasyon filtreleri"
          className="mt-10 rounded-[24px] border border-dark-text/10 bg-[#071010]/80 p-3 shadow-[0_18px_80px_rgba(0,0,0,0.24)] sm:p-4"
        >
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0 flex-1">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#F3EFE7]/42">
                Kategori
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {categoryFilters.map((category) => (
                  <button
                    aria-pressed={activeCategory === category}
                    className={cn(
                      "shrink-0 border px-3.5 py-2 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5162E]",
                      activeCategory === category
                        ? "border-[#C5162E] bg-[#C5162E] text-[#F3EFE7]"
                        : "border-dark-text/10 bg-surface/[0.035] text-[#F3EFE7]/62 hover:border-[#C5162E]/40 hover:text-[#F3EFE7]",
                    )}
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    type="button"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-w-0 xl:w-[360px]">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#F3EFE7]/42">
                Zorluk
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {difficultyFilters.map((difficulty) => (
                  <button
                    aria-pressed={activeDifficulty === difficulty}
                    className={cn(
                      "shrink-0 border px-3.5 py-2 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5162E]",
                      activeDifficulty === difficulty
                        ? "border-[#C5162E] bg-[#C5162E] text-[#F3EFE7]"
                        : "border-dark-text/10 bg-surface/[0.035] text-[#F3EFE7]/62 hover:border-[#C5162E]/40 hover:text-[#F3EFE7]",
                    )}
                    key={difficulty}
                    onClick={() => setActiveDifficulty(difficulty)}
                    type="button"
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>

            <label className="relative xl:w-[310px]">
              <span className="sr-only">Efekt adıyla ara</span>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#F3EFE7]/38"
                size={16}
                strokeWidth={1.8}
              />
              <input
                className="h-11 w-full border border-dark-text/10 bg-dark-bg/20 pl-10 pr-3 text-sm text-[#F3EFE7] outline-none transition-colors placeholder:text-[#F3EFE7]/34 focus:border-[#C5162E]/60 focus:bg-dark-bg/30"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Efekt adıyla ara"
                type="search"
                value={query}
              />
            </label>
          </div>
        </section>

        <div className="mt-7 flex items-center justify-between gap-4">
          <p className="text-sm text-[#F3EFE7]/58">
            {filteredItems.length} efekt gösteriliyor
          </p>
          <p className="hidden text-xs uppercase tracking-[0.22em] text-[#F3EFE7]/34 sm:block">
            Toplam {animationLabItems.length} mikro animasyon
          </p>
        </div>

        <section
          aria-label="Animasyon demo kartları"
          className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {filteredItems.map((item) => (
            <AnimationDemoCard item={item} key={item.id} />
          ))}
        </section>

        {filteredItems.length === 0 ? (
          <div className="mt-6 rounded-[24px] border border-dark-text/10 bg-[#071010]/80 p-8 text-center text-sm text-[#F3EFE7]/62">
            Bu filtrelerle eşleşen animasyon bulunamadı.
          </div>
        ) : null}
      </Container>
    </main>
  );
}
