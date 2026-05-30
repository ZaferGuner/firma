"use client";

import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { aboutValues } from "@/data/about";

export function AboutValues() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="values" className="relative bg-background py-32 lg:py-48 border-b border-site-border overflow-hidden">
      <Container className="relative z-10">
        <motion.div
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 lg:mb-32"
        >
          <span className="mb-6 inline-block text-[11px] font-semibold uppercase tracking-[0.24em] text-site-accent">
            DEĞERLERİMİZ
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-site-text mb-6 max-w-2xl leading-[1.1]">
            Çalışma kültürümüzü belirleyen değerler
          </h2>
          <p className="text-lg text-site-body font-light max-w-xl">
            Her kararın arkasında daha sade, daha güvenilir ve daha yaşanabilir bir yapı üretme sorumluluğu bulunur.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-site-border border border-site-border">
          {aboutValues.map((value, index) => (
            <motion.div
              key={value.number}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
              whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group relative bg-site-surface p-10 lg:p-16 min-h-[320px] lg:min-h-[400px] flex flex-col overflow-hidden"
            >
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-site-soft/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              {/* Hover effect line */}
              <div className="absolute left-0 top-0 h-full w-[2px] bg-site-accent scale-y-0 origin-top group-hover:scale-y-100 transition-transform duration-500 ease-[0.16,1,0.3,1]" />

              <span className="text-6xl md:text-7xl lg:text-[100px] font-light text-site-accent/25 tracking-tighter mb-8 lg:mb-auto group-hover:text-site-accent/45 transition-colors duration-500 select-none">
                {value.number}
              </span>
              
              <div className="mt-auto relative z-10">
                <h3 className="text-2xl lg:text-3xl font-medium text-site-text mb-4 tracking-tight group-hover:text-site-accent transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-base text-site-body leading-relaxed font-light">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
