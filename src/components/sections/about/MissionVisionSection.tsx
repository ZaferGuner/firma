"use client";

import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { aboutMissionVision } from "@/data/about";

export function MissionVisionSection() {
  const reduceMotion = useReducedMotion();

  const cards = [
    {
      id: "mission",
      ...aboutMissionVision.mission,
    },
    {
      id: "vision",
      ...aboutMissionVision.vision,
    },
  ];

  return (
    <section id="mission-vision" className="relative bg-background py-24 lg:py-40 overflow-hidden">
      {/* Background blueprint grid */}
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none" 
        style={{ 
          backgroundImage: "linear-gradient(var(--site-border) 1px, transparent 1px), linear-gradient(90deg, var(--site-border) 1px, transparent 1px)",
          backgroundSize: "64px 64px" 
        }} 
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
              whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="group relative min-h-[360px] p-10 lg:p-14 border border-site-border bg-site-surface overflow-hidden transition-all duration-300 hover:border-[#CFC7BA] hover:shadow-[0_12px_32px_rgba(46,48,43,0.05)]"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-0 h-[2px] bg-site-accent transition-all duration-700 group-hover:w-full" />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-site-accent mb-8 block">
                  {card.id}
                </span>
                
                <h3 className="text-3xl lg:text-4xl font-medium tracking-tight text-site-text mb-8">
                  {card.title}
                </h3>
                
                <p className="text-base lg:text-lg text-site-body leading-relaxed font-light mt-auto">
                  {card.text}
                </p>
              </div>

              {/* Decorative Large Background Letter */}
              <span className="absolute -bottom-10 -right-10 text-[240px] font-bold text-site-accent/[0.025] leading-none select-none pointer-events-none group-hover:text-site-accent/[0.05] transition-colors duration-700">
                {card.title.charAt(0)}
              </span>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
