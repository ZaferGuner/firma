"use client";

import { motion, type Variants } from "motion/react";
import { useReducedMotion } from "motion/react";
import { useIsIframePreview } from "@/hooks/useIsIframePreview";

const values = [
  {
    id: "01",
    title: "Planlama",
    description:
      "Her proje, konum, kullanım alışkanlıkları ve uzun vadeli yaşam değeri birlikte düşünülerek ele alınır.",
  },
  {
    id: "02",
    title: "Mimari Dil",
    description:
      "Cephe, plan ve ortak alan kararları; sade, kullanışlı ve zamansız bir yaşam deneyimi hedefiyle kurgulanır.",
  },
  {
    id: "03",
    title: "Uygulama Disiplini",
    description:
      "Yapı süreci; teknik koordinasyon, malzeme seçimi ve kontrol adımlarıyla birlikte yönetilir.",
  },
  {
    id: "04",
    title: "Yaşam Değeri",
    description:
      "Projeler yalnızca konut olarak değil, günlük hayatı kolaylaştıran bütünlüklü yaşam alanları olarak değerlendirilir.",
  },
];

export function CompanyOverview() {
  const isIframePreview = useIsIframePreview();
  const reduceMotion = useReducedMotion() || isIframePreview;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section data-header-theme="dark" id="company" className="relative bg-background text-text py-24 lg:py-32 overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6 lg:px-12 xl:px-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-24">
          
          {/* Left: Content */}
          <motion.div 
            data-motion-reveal
            className="w-full lg:w-5/12 flex flex-col justify-center"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -30 }}
            whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="mb-6 inline-block text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
              TANER TÜMER İNŞAAT
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.1] text-dark-text mb-6">
              Yapı geliştirme sürecine mimari ve teknik bir bakış
            </h2>
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
              Taner Tümer İnşaat; planlama, uygulama ve yaşam deneyimini birlikte ele alan, modern konut projeleri geliştirmeye odaklanan bir yapı markasıdır.
            </p>
          </motion.div>

          {/* Right: Grid */}
          <motion.div 
            data-motion-reveal
            className="w-full lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-6"
            variants={reduceMotion ? {} : containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {values.map((item) => (
              <motion.div 
                key={item.id}
                data-motion-reveal
                variants={reduceMotion ? {} : itemVariants}
                className="group relative bg-[#0A0D0C]/50 border border-white/5 p-8 backdrop-blur-sm transition-colors hover:bg-surface/[0.03] hover:border-dark-text/10"
              >
                {/* Subtle blueprint grid line */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                
                <span className="block text-primary font-mono text-sm mb-4">{item.id}</span>
                <h3 className="text-lg font-medium text-dark-text mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
