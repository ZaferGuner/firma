"use client";

import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { aboutManifesto } from "@/data/about";
import { useIsIframePreview } from "@/hooks/useIsIframePreview";

export function AboutManifesto() {
  const isIframePreview = useIsIframePreview();
  const reduceMotion = useReducedMotion() || isIframePreview;

  // Helper function to highlight specific keywords
  const formatText = (text: string) => {
    const highlights = ["yuva", "sadelik", "estetik", "güven", "yaşam alanı", "yaşam alanları", "mutluluğun temelini"];
    
    // Simple replacement to wrap keywords in a span for slight emphasis
    // In a real robust implementation, a proper parser would be better, but this works for static text
    let formattedText = text;
    highlights.forEach(word => {
      // Case sensitive replacement to avoid breaking HTML, but our text matches these exactly
      const regex = new RegExp(`(${word})`, "gi");
      formattedText = formattedText.replace(regex, `<span class="text-site-text font-normal">$1</span>`);
    });
    
    return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  return (
    <section id="manifesto" className="relative bg-background py-32 lg:py-48 border-b border-site-border">
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-12 lg:gap-24">
          
          {/* Sticky Label Column */}
          <div className="relative">
            <div className="lg:sticky lg:top-40">
              <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.24em] text-site-accent">
                MANİFESTO
              </span>
              <div className="mt-8 hidden lg:block w-px h-24 bg-site-border" />
            </div>
          </div>

          {/* Paragraphs Column */}
          <div className="flex flex-col gap-16 lg:gap-24">
            {aboutManifesto.map((paragraph, index) => (
              <motion.div
                key={index}
                data-motion-reveal
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-2xl sm:text-3xl md:text-4xl leading-[1.4] md:leading-[1.4] text-site-body font-light tracking-tight max-w-4xl">
                  {formatText(paragraph)}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
}
