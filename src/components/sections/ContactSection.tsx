"use client";

import { useState } from "react";
import { contactInfo } from "@/data/contact";
import { motion } from "motion/react";
import { useReducedMotion } from "motion/react";
import { useIsIframePreview } from "@/hooks/useIsIframePreview";

const inquiryTypes = [
  "Proje hakkında bilgi almak istiyorum",
  "Daire tiplerini incelemek istiyorum",
  "Randevu talep etmek istiyorum",
  "Fiyat ve ödeme seçenekleri hakkında bilgi almak istiyorum",
  "Proje broşürü istiyorum"
];

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const isIframePreview = useIsIframePreview();
  const reduceMotion = useReducedMotion() || isIframePreview;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  return (
    <section data-header-theme="dark" id="contact" className="relative bg-background text-text py-24 lg:py-32 border-t border-white/5 overflow-hidden">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-primary/5 blur-[80px]" />
        <div className="absolute top-[20%] left-[10%] h-px w-[20%] bg-primary/20 rotate-45" />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12 xl:px-20">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* LEFT: TEXT & QUICK ACTIONS */}
          <motion.div 
            data-motion-reveal
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 flex flex-col justify-center"
          >
            <span className="mb-4 inline-block text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
              İLETİŞİM
            </span>
            <h2 className="mb-6 text-3xl font-medium tracking-tight text-text sm:text-4xl lg:text-5xl lg:leading-[1.1]">
              Projeyi yakından inceleyin
            </h2>
            <p className="mb-8 text-base leading-relaxed text-muted-foreground lg:text-lg">
              Tümerhan Towers hakkında detaylı bilgi almak, daire tiplerini değerlendirmek veya satış süreciyle ilgili görüşmek için bizimle iletişime geçebilirsiniz.
            </p>

            {/* TRUST NOTES */}
            <div className="flex flex-wrap gap-4 mb-12">
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-text/80">
                <span className="h-px w-3 bg-primary" /> Bilgi talebi
              </span>
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-text/80">
                <span className="h-px w-3 bg-primary" /> Randevu planlama
              </span>
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-text/80">
                <span className="h-px w-3 bg-primary" /> Proje danışmanlığı
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 mb-12 lg:mb-0">
              <a 
                href={contactInfo.phoneHref}
                className="flex flex-col gap-1 p-5 rounded-sm bg-surface/[0.02] border border-white/5 hover:bg-surface/[0.04] transition-colors group"
              >
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Ara</span>
                <span className="text-sm font-medium text-text">{contactInfo.phone}</span>
              </a>
              <a 
                href={contactInfo.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-1 p-5 rounded-sm bg-surface/[0.02] border border-white/5 hover:bg-surface/[0.04] transition-colors group"
              >
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">WhatsApp</span>
                <span className="text-sm font-medium text-text">WhatsApp'tan Yaz</span>
              </a>
              <a 
                href={contactInfo.emailHref}
                className="flex flex-col gap-1 p-5 rounded-sm bg-surface/[0.02] border border-white/5 hover:bg-surface/[0.04] transition-colors group"
              >
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">E-posta</span>
                <span className="text-sm font-medium text-text">{contactInfo.email}</span>
              </a>
              <div className="flex flex-col gap-1 p-5 rounded-sm bg-surface/[0.02] border border-white/5">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Satış Ofisi</span>
                <span className="text-sm font-medium text-text">Adana / Türkiye</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: FORM PANEL */}
          <motion.div 
            data-motion-reveal
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative p-8 lg:p-10 rounded-md bg-surface/[0.02] backdrop-blur-md border border-dark-text/10 shadow-2xl">
              
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center text-center py-20" role="status">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-6 border border-primary/50">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-medium text-text mb-4">Talebiniz Alındı</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                    İlginiz için teşekkür ederiz. Ekibimiz sizinle en kısa sürede iletişime geçecektir.
                  </p>
                  <a href={contactInfo.whatsappHref} className="mt-8 text-xs font-semibold uppercase tracking-widest text-primary hover:text-dark-text transition-colors">
                    Dilerseniz WhatsApp&apos;tan yazın &rarr;
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="name" className="text-[10px] uppercase tracking-widest text-muted-foreground">Ad Soyad</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required
                        placeholder="Adınız Soyadınız"
                        className="w-full bg-[#0B0F0E] border border-dark-text/10 rounded-sm px-4 py-3 text-sm text-text placeholder:text-dark-text/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <label htmlFor="phone" className="text-[10px] uppercase tracking-widest text-muted-foreground">Telefon</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        required
                        placeholder="05XX XXX XX XX"
                        className="w-full bg-[#0B0F0E] border border-dark-text/10 rounded-sm px-4 py-3 text-sm text-text placeholder:text-dark-text/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-[10px] uppercase tracking-widest text-muted-foreground">E-posta (Opsiyonel)</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      placeholder="ornek@email.com"
                      className="w-full bg-[#0B0F0E] border border-dark-text/10 rounded-sm px-4 py-3 text-sm text-text placeholder:text-dark-text/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="inquiry" className="text-[10px] uppercase tracking-widest text-muted-foreground">Talep Türü</label>
                    <select 
                      id="inquiry" 
                      name="inquiry" 
                      required
                      defaultValue=""
                      className="w-full bg-[#0B0F0E] border border-dark-text/10 rounded-sm px-4 py-3 text-sm text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Bir talep türü seçin...</option>
                      {inquiryTypes.map((type, idx) => (
                        <option key={idx} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-[10px] uppercase tracking-widest text-muted-foreground">Mesajınız (Opsiyonel)</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={3}
                      placeholder="Eklemek istediğiniz notlar..."
                      className="w-full bg-[#0B0F0E] border border-dark-text/10 rounded-sm px-4 py-3 text-sm text-text placeholder:text-dark-text/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-dark-text font-semibold uppercase tracking-widest text-xs py-4 rounded-sm transition-colors mt-2"
                  >
                    {isSubmitting ? "Gönderiliyor..." : "Bilgi Talebi Gönder"}
                  </button>

                  <p className="text-[10px] text-muted-foreground/60 leading-relaxed text-center mt-2">
                    Kişisel bilgileriniz yalnızca talebinizle ilgili iletişim amacıyla kullanılacaktır.
                  </p>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
