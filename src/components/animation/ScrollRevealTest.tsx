"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function ScrollRevealTest() {
  const containerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !cardRef.current) return;

    const ctx = gsap.context(() => {
      // Create a simple scrub animation for the card
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0.35,
          scale: 0.94,
          y: 40,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            end: "center center",
            scrub: true,
          },
        }
      );
    }, containerRef); // Scope to container

    return () => {
      // Revert all animations and kill ScrollTriggers in this context
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[140vh] items-center justify-center bg-[#070A09] px-4"
    >
      <div className="sticky top-1/2 -translate-y-1/2 w-full max-w-md">
        <div
          ref={cardRef}
          className="flex flex-col items-center justify-center rounded-2xl border border-dark-text/10 bg-surface/5 p-10 text-center backdrop-blur-xl"
        >
          <div className="mb-4 rounded-full border border-dark-text/10 bg-surface/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-text/70">
            SCROLLTRIGGER TEST
          </div>
          <h2 className="mb-3 text-2xl font-medium tracking-tight text-text sm:text-3xl">
            Scroll altyapısı hazır
          </h2>
          <p className="text-sm leading-relaxed text-text/60">
            Bu alan ileride mimari reveal sahneleri için kullanılacak.
          </p>
        </div>
      </div>
    </section>
  );
}
