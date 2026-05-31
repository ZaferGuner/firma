"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Diamond } from "lucide-react";
import { IframeTransitionLink } from "@/components/animation/IframeTransitionLink";

import { Button } from "@/components/ui/Button";
import { contactActions, navigationItems } from "@/data/navigation";

type NavigationOverlayProps = {
  open: boolean;
  onClose: () => void;
  onContactRequest: () => void;
};

const easeOutCss = "cubic-bezier(0.22, 1, 0.36, 1)";
const revealEaseCss = "cubic-bezier(0.76, 0, 0.24, 1)";
const slowEaseCss = "cubic-bezier(0.65, 0, 0.35, 1)";

export function NavigationOverlay({
  open,
  onClose,
  onContactRequest,
}: NavigationOverlayProps) {
  const visible = open;
  const pathname = usePathname();

  const closeFromOutside = (target: EventTarget | null) => {
    if (!(target instanceof Element)) {
      return;
    }

    if (!target.closest("[data-navigation-panel]")) {
      onClose();
    }
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  return (
    <div
      aria-hidden={!open}
      aria-labelledby="navigation-overlay-title"
      aria-modal={open}
      className="fixed inset-0 z-[110] overflow-y-auto bg-site-dark/[0.42]"
      id="navigation-overlay"
      onPointerDownCapture={(event) => closeFromOutside(event.target)}
      role="dialog"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: `opacity 340ms ${easeOutCss}`,
        willChange: "opacity",
      }}
    >
      <div className="absolute inset-0" onPointerDown={onClose} />
      <div className="relative z-10 flex min-h-screen items-end justify-center px-4 pb-[113px] pt-4 sm:px-6 sm:pb-[125px] sm:pt-6">
        <div
          className="flex w-full flex-col items-center"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <nav
            aria-label="Ana menü"
            className="w-[calc(100vw_-_64px)] max-w-[320px] md:w-[clamp(360px,28vw,440px)] md:max-w-none bg-site-dark py-[28px] px-6 sm:py-[44px] sm:px-12 text-site-dark-text shadow-[0_40px_120px_rgba(0,0,0,0.55)] will-change-transform border border-white/5 overflow-y-auto max-h-[calc(100svh_-_170px)] md:max-h-[620px] lg:max-h-[64vh]"
            data-navigation-panel
            style={{
              opacity: visible ? 1 : 0,
              transform: visible
                ? "translateY(0) scale(1)"
                : "translateY(15px) scale(0.12)",
              transformOrigin: "bottom center",
              transition: `opacity ${visible ? 430 : 320}ms ${
                visible ? revealEaseCss : slowEaseCss
              }, transform ${visible ? 430 : 320}ms ${
                visible ? revealEaseCss : slowEaseCss
              }`,
            }}
          >
            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : "translateX(-24px)",
                transition: `opacity ${visible ? 420 : 160}ms ${easeOutCss} ${
                  visible ? "500ms" : "0ms"
                }, transform ${visible ? 420 : 160}ms ${easeOutCss} ${
                  visible ? "500ms" : "0ms"
                }`,
              }}
            >
              {/* 1. Üst Etiket Alanı */}
              <div className="mb-6">
                <p
                  className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-site-dark-label"
                  id="navigation-overlay-title"
                >
                  MENÜ
                </p>
              </div>

              {/* 2. Ana Navigasyon Alanı */}
              <ul className="space-y-[6px] md:space-y-[8px]">
                {navigationItems.map((item) => {
                  const isActive = item.href === pathname || (item.href === "/" && pathname === "/");
                  
                  const isEditMode = pathname.startsWith("/admin/edit");
                  let href: string = item.href;
                  if (isEditMode) {
                    if (item.href === "/") href = "/admin/edit/home";
                    else if (item.href === "/projects") href = "/admin/edit/projects";
                    else if (item.href === "/contact") href = "/admin/edit/contact";
                    else if (item.href === "/press") href = "/admin/edit/press";
                  }

                  return (
                    <li key={item.href} className="relative">
                      <IframeTransitionLink
                        className={`relative block py-0.5 text-[clamp(20px,6vw,26px)] md:text-[clamp(26px,1.8vw,33px)] font-medium leading-[1.1] transition-all duration-300 hover:translate-x-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary pl-0 ${
                          isActive ? "text-site-dark-text" : "text-site-dark-muted hover:text-site-dark-text"
                        }`}
                        href={href}
                        onClick={onClose}
                      >
                        {isActive && (
                          <span className="absolute left-[-20px] md:left-[-26px] top-0 bottom-0 flex items-center justify-center pointer-events-none">
                            <Diamond className="text-site-red w-2 w-2 sm:w-2.5 sm:h-2.5" fill="currentColor" strokeWidth={1} />
                          </span>
                        )}
                        {item.label}
                      </IframeTransitionLink>
                    </li>
                  );
                })}
              </ul>

              {/* 3. Alt Bilgi Alanı */}
              <div className="mt-[34px] border-t border-white/5 pt-[28px] text-site-dark-muted">
                <div className="grid grid-cols-[90px_1fr] gap-x-[28px] gap-y-[10px] items-baseline">
                  <span className="text-site-dark-label text-[10px] font-semibold uppercase tracking-[0.12em] leading-none">SATIŞ</span>
                  <a
                    className="text-site-dark-text hover:text-site-accent transition-colors leading-none text-left break-all font-semibold text-[13px] sm:text-[14px]"
                    href={contactActions.phoneHref}
                  >
                    {contactActions.phoneText}
                  </a>
                </div>
                <div className="grid grid-cols-[90px_1fr] gap-x-[28px] gap-y-[10px] items-baseline mt-[10px]">
                  <span className="text-site-dark-label text-[10px] font-semibold uppercase tracking-[0.12em] leading-none">SHOWROOM</span>
                  <a
                    className="text-site-dark-text hover:text-site-accent transition-colors leading-none text-left break-all font-semibold text-[13px] sm:text-[14px]"
                    href="mailto:info@tanertumerinsaat.com"
                  >
                    info@tanertumerinsaat.com
                  </a>
                </div>
              </div>

              {/* 4. CTA Alanı */}
              <div className="mt-[28px] mb-1">
                <Button
                  className="h-[48px] w-full border-transparent bg-site-primary text-white text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-site-primary-hover rounded-none transition-colors duration-300"
                  onClick={onContactRequest}
                >
                  BİLGİ AL
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
