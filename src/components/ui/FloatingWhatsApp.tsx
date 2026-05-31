"use client";

import React, { useState, useEffect } from "react";
import { useIframeTransition } from "@/components/animation/IframeTransitionProvider";

export function FloatingWhatsApp() {
  const { phase } = useIframeTransition();
  const [shouldRender, setShouldRender] = useState(false);
  const [visible, setVisible] = useState(false);

  const whatsappUrl =
    "https://wa.me/905330618001?text=Merhaba%2C%20Taner%20T%C3%BCmer%20%C4%B0n%C5%9Faat%20projeleri%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.";

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Premium safety checks: exclude admin pages or transition previews
    const isAdmin = window.location.pathname.startsWith("/admin");
    const params = new URLSearchParams(window.location.search);
    const isPreview =
      params.get("__ttPreview") === "1" ||
      params.get("__transitionPreview") === "1" ||
      document.documentElement.dataset.transitionPreview === "true" ||
      document.documentElement.classList.contains("is-iframe-transition-preview");

    const isMaintenance = window.location.pathname === "/bakim";

    if (isAdmin || isPreview || isMaintenance) {
      setShouldRender(false);
      return;
    }

    setShouldRender(true);
  }, []);

  useEffect(() => {
    if (!shouldRender) return;

    // Preparing, previewing, committing etc. -> Immediately hide
    if (phase !== "idle") {
      setVisible(false);
      return;
    }

    // Completed transition -> Fade + slide back in with a premium 600ms delay
    const timeout = window.setTimeout(() => {
      setVisible(true);
    }, 600);

    return () => window.clearTimeout(timeout);
  }, [phase, shouldRender]);

  if (!shouldRender) return null;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile iletişime geçin"
      data-floating-whatsapp="true"
      className={`fixed bottom-[110px] right-5 md:bottom-8 md:right-8 z-[60] flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-pointer transition-all duration-[350ms] ease-out ${
        visible
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-3 scale-[0.96] pointer-events-none"
      }`}
    >
      <i className="fa-brands fa-whatsapp text-[28px] md:text-[32px] leading-none" />
    </a>
  );
}
