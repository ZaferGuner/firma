"use client";

import { motion } from "motion/react";
import { X, ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import { useEffect, useRef } from "react";
import { contactInfo } from "@/data/contact";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  placement?: ContactModalPlacement;
}

export type ContactModalPlacement = "top-right" | "bottom-center";

export function ContactModal({
  isOpen,
  onClose,
  placement = "top-right",
}: ContactModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const opensFromBottom = placement === "bottom-center";

  // Click outside & ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const overlayVariants = {
    hidden: { 
      opacity: 0, 
      transitionEnd: { display: "none" } 
    },
    visible: { 
      display: "block",
      opacity: 1, 
      transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] as const } 
    }
  };

  const wrapperVariants = {
    hidden: {
      transitionEnd: { display: "none" }
    },
    visible: {
      display: "flex"
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.18, 
      x: 0, 
      y: opensFromBottom ? 12 : -8, 
      filter: "blur(6px)", 
      clipPath: opensFromBottom
        ? "inset(100% 50% 0 50% round 999px)"
        : "inset(0 0 100% 100% round 999px)",
      transition: { 
        duration: 0.55, 
        ease: [0.19, 1, 0.22, 1] as const,
      }
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      x: 0, 
      y: 0, 
      filter: "blur(0px)", 
      clipPath: "inset(0 0 0 0 round 24px)",
      transition: { 
        duration: 0.55, 
        ease: [0.19, 1, 0.22, 1] as const,
        staggerChildren: 0.06,
        delayChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] as const } 
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div 
        variants={overlayVariants}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        className="fixed inset-0 z-[150] bg-site-dark/30 backdrop-blur-[2px]"
        aria-hidden="true"
      />

      {/* Modal Container to handle positioning and click outside */}
      <motion.div 
        variants={wrapperVariants}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        className="pointer-events-none fixed inset-0 z-[200] flex"
      >
        {/* Modal */}
        <motion.div
          data-contact-panel
          ref={modalRef}
          variants={modalVariants}
          className={
            opensFromBottom
              ? "pointer-events-auto absolute bottom-[118px] left-[14px] right-[14px] mx-auto flex max-w-[460px] flex-col overflow-y-auto bg-site-dark/95 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:bottom-[132px] sm:p-8"
              : "pointer-events-auto absolute left-[14px] right-[14px] top-[72px] flex flex-col overflow-y-auto bg-site-dark/95 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-8 md:left-auto md:right-[24px] md:top-[76px] md:w-[clamp(340px,32vw,460px)]"
          }
          style={{
            transformOrigin: opensFromBottom ? "bottom center" : "top right",
            maxHeight: opensFromBottom
              ? "calc(100vh - 156px)"
              : "calc(100vh - 88px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "24px"
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-site-dark-text transition-colors hover:bg-white/10 sm:right-6 sm:top-6"
            aria-label="Kapat"
          >
            <X size={16} strokeWidth={2} />
          </button>

          <motion.div variants={itemVariants} className="mb-2">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-site-accent">
              İletişim
            </span>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
            <h2 className="mb-2 text-2xl font-medium tracking-tight text-site-dark-text sm:text-3xl">
              Bilgi Alın
            </h2>
            <p className="text-[13px] leading-relaxed text-site-dark-body sm:text-sm">
              Taner Tümer İnşaat Projeleri hakkında detaylı bilgi, fiyatlandırma ve sunum randevusu için bizimle iletişime geçin.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8 flex flex-col gap-5 sm:gap-6">
            {/* Contact Items */}
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-site-dark-text ring-1 ring-white/10">
                <Phone size={15} />
              </div>
              <div>
                <div className="mb-0.5 text-[11px] font-semibold uppercase tracking-wider text-site-dark-label">Müşteri Hizmetleri</div>
                <a href={contactInfo.phoneHref} className="text-[15px] font-medium tracking-tight text-site-dark-text transition-colors hover:text-site-accent">
                  {contactInfo.phone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-site-dark-text ring-1 ring-white/10">
                <Mail size={15} />
              </div>
              <div>
                <div className="mb-0.5 text-[11px] font-semibold uppercase tracking-wider text-site-dark-label">E-Posta</div>
                <a href={contactInfo.emailHref} className="text-[15px] font-medium tracking-tight text-site-dark-text transition-colors hover:text-site-accent">
                  {contactInfo.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-site-dark-text ring-1 ring-white/10">
                <MapPin size={15} />
              </div>
              <div>
                <div className="mb-0.5 text-[11px] font-semibold uppercase tracking-wider text-site-dark-label">Satış Ofisi</div>
                <p className="text-[13px] leading-relaxed text-site-dark-body">
                  {contactInfo.address}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-auto">
            <a
              href={contactInfo.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full items-center justify-between bg-[#25D366] hover:bg-[#20ba5a] text-white px-5 py-3.5 text-[13px] font-semibold transition-all duration-300 rounded-sm shadow-sm"
            >
              <div className="flex items-center gap-2">
                <i className="fa-brands fa-whatsapp text-lg leading-none" />
                <span>WhatsApp ile İletişime Geç</span>
              </div>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>

        </motion.div>
      </motion.div>
    </>
  );
}
