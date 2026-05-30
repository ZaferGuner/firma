"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { IframeTransitionLink } from "@/components/animation/IframeTransitionLink";
import { useIframeTransition } from "@/components/animation/IframeTransitionProvider";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { NavigationOverlay } from "@/components/layout/NavigationOverlay";
import {
  ContactModal,
  type ContactModalPlacement,
} from "@/components/ui/ContactModal";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/data/navigation";

const navigationEase = "cubic-bezier(0.65, 0, 0.35, 1)";
const barTransition = `transform 360ms ${navigationEase}, border-radius 360ms ${navigationEase}`;
const barContentTransition = `opacity 260ms ${navigationEase}, transform 260ms ${navigationEase}`;
const navigationContactOpenDelay = 120;

export function Header({ initialCtaText = "BİLGİ AL", initialCtaLink = "/iletisim" }: { initialCtaText?: string, initialCtaLink?: string }) {
  const { phase } = useIframeTransition();
  const [ctaVisible, setCtaVisible] = useState(true);

  useEffect(() => {
    if (phase !== "idle") {
      setCtaVisible(false);
      return;
    }
    const timeout = window.setTimeout(() => {
      setCtaVisible(true);
    }, 600);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  const [open, setOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactPlacement, setContactPlacement] =
    useState<ContactModalPlacement>("top-right");
  const [barCollapsed, setBarCollapsed] = useState(false);
  const [barWidth, setBarWidth] = useState(360);
  const [barHovered, setBarHovered] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [headerTheme, setHeaderTheme] = useState<"dark" | "light">("dark");
  const openedAt = useRef(0);
  const contactOpenTimer = useRef<number | null>(null);
  
  const pathname = usePathname();
  const currentPageTitle = navigationItems.find((item) => item.href === pathname)?.label || "Ana Sayfa";

  const openNavigation = useCallback(() => {
    openedAt.current = window.performance.now();
    setBarCollapsed(true);
    setOpen(true);
  }, []);

  const closeNavigation = useCallback(() => {
    setHasAutoOpened(true);
    setOpen(false);
    setBarCollapsed(false);
  }, []);

  const clearPendingContactOpen = useCallback(() => {
    if (contactOpenTimer.current !== null) {
      window.clearTimeout(contactOpenTimer.current);
      contactOpenTimer.current = null;
    }
  }, []);

  const openContact = useCallback(
    (placement: ContactModalPlacement) => {
      clearPendingContactOpen();
      setContactPlacement(placement);
      setContactOpen(true);
    },
    [clearPendingContactOpen],
  );

  const openContactFromNavigation = useCallback(() => {
    clearPendingContactOpen();
    closeNavigation();
    setContactOpen(false);
    setContactPlacement("bottom-center");

    contactOpenTimer.current = window.setTimeout(() => {
      contactOpenTimer.current = null;
      setContactOpen(true);
    }, navigationContactOpenDelay);
  }, [clearPendingContactOpen, closeNavigation]);

  useEffect(() => {
    return () => {
      clearPendingContactOpen();
    };
  }, [clearPendingContactOpen]);

  useEffect(() => {
    const handleContactOpen = () => {
      setOpen(false);
      setBarCollapsed(false);
      openContact("top-right");
    };

    window.addEventListener("tt:contact-open", handleContactOpen);

    return () => {
      window.removeEventListener("tt:contact-open", handleContactOpen);
    };
  }, [openContact]);

  useEffect(() => {
    return () => {
      clearPendingContactOpen();
    };
  }, [clearPendingContactOpen]);

  useEffect(() => {
    const updateBarWidth = () => {
      setBarWidth(Math.max(58, Math.min(360, window.innerWidth - 32)));
    };

    updateBarWidth();
    window.addEventListener("resize", updateBarWidth);

    return () => {
      window.removeEventListener("resize", updateBarWidth);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const documentElement = document.documentElement;
      const isScrollable =
        documentElement.scrollHeight > window.innerHeight + 80;
      const reachedBottom =
        window.innerHeight + window.scrollY >= documentElement.scrollHeight - 24;

      if (
        !open &&
        !barCollapsed &&
        !hasAutoOpened &&
        isScrollable &&
        reachedBottom
      ) {
        setHasAutoOpened(true);
        openNavigation();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [barCollapsed, hasAutoOpened, open, openNavigation]);

  // Auto-close on scroll removed to prevent conflicts with smooth scroll momentum

  useEffect(() => {
    // Tüm temalı bölümleri bul
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-header-theme]"));

    const handleThemeScroll = () => {
      const headerY = 36; // Header'ın orta noktası (y-ekseninde)
      
      for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].getBoundingClientRect();
        // Eğer bölüm, Header'ın ortasını kapsıyorsa
        if (rect.top <= headerY && rect.bottom > headerY) {
          const theme = sections[i].getAttribute("data-header-theme");
          if (theme === "light" || theme === "dark") {
            setHeaderTheme(theme);
          }
          break;
        }
      }
    };

    window.addEventListener("scroll", handleThemeScroll, { passive: true });
    handleThemeScroll(); // İlk yüklemede çalıştır

    return () => window.removeEventListener("scroll", handleThemeScroll);
  }, [pathname]);

  const menuActive = open || barCollapsed;
  const sideToCenterOffset = Math.max(0, barWidth / 2 - 32);

  const isEditMode = pathname.startsWith("/admin/edit");
  const getAdminLink = (originalHref: string) => {
    if (!isEditMode) return originalHref;
    if (originalHref === "/") return "/admin/edit/home";
    if (originalHref === "/projects") return "/admin/edit/projects";
    if (originalHref === "/contact") return "/admin/edit/contact";
    if (originalHref === "/press") return "/admin/edit/press";
    return originalHref;
  };

  const logoHref = getAdminLink("/");

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[100] h-[72px]">
        <IframeTransitionLink
          className={`pointer-events-auto absolute left-1/2 top-5 flex -translate-x-1/2 flex-col items-center text-center transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-red ${
            headerTheme === "light" ? "text-[#111111]" : "text-white/90"
          }`}
          href={logoHref}
        >
          <span className="text-sm font-semibold">TANER TÜMER</span>
          <span
            className={`mt-1 text-[10px] font-medium transition-colors duration-300 ${
              headerTheme === "light" ? "text-[#111111]/60" : "text-white/50"
            }`}
          >
            İNŞAAT
          </span>
        </IframeTransitionLink>

        {initialCtaLink === "/iletisim" || initialCtaLink === "/contact" ? (
          <button
            data-floating-cta="true"
            className={`pointer-events-auto fixed right-5 top-[18px] inline-flex h-10 items-center gap-1.5 px-5 text-[10px] font-bold uppercase tracking-[0.24em] transition-all duration-[350ms] ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-red sm:right-6 ${
              headerTheme === "light"
                ? "bg-[#111111] text-white hover:bg-[#222222]"
                : "bg-white text-black hover:bg-neutral-200"
            } ${
              ctaVisible
                ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                : "opacity-0 -translate-y-3 scale-[0.96] pointer-events-none"
            }`}
            onClick={() => openContact("top-right")}
            type="button"
          >
            {initialCtaText.toUpperCase()}
            <ArrowUpRight size={13} strokeWidth={2} />
          </button>
        ) : (
          <a
            data-floating-cta="true"
            href={initialCtaLink}
            className={`pointer-events-auto fixed right-5 top-[18px] inline-flex h-10 items-center gap-1.5 px-5 text-[10px] font-bold uppercase tracking-[0.24em] transition-all duration-[350ms] ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-red sm:right-6 ${
              headerTheme === "light"
                ? "bg-[#111111] text-white hover:bg-[#222222]"
                : "bg-white text-black hover:bg-neutral-200"
            } ${
              ctaVisible
                ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                : "opacity-0 -translate-y-3 scale-[0.96] pointer-events-none"
            }`}
          >
            {initialCtaText.toUpperCase()}
            <ArrowUpRight size={13} strokeWidth={2} />
          </a>
        )}
      </div>

      <div
        className="fixed bottom-10 left-1/2 z-[140] h-[58px] -translate-x-1/2 text-site-dark-text sm:bottom-[52px]"
        onMouseEnter={() => setBarHovered(true)}
        onMouseLeave={() => setBarHovered(false)}
        style={{
          pointerEvents: barCollapsed ? "none" : "auto",
          width: barWidth,
        }}
      >
        <div
          className="absolute inset-0 origin-center overflow-hidden bg-site-dark/94 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm will-change-transform"
          style={{
            borderRadius: barCollapsed ? 2 : 0,
            transform: `scaleX(${barCollapsed ? 58 / barWidth : 1})`,
            transition: barTransition,
          }}
        />
        <div
          className="absolute inset-0 origin-center bg-white/[0.04] will-change-transform"
          style={{
            opacity: barHovered ? 1 : 0,
            transform: `scaleX(${barCollapsed ? 58 / barWidth : 1})`,
            transition: `opacity 260ms ${navigationEase}, transform 360ms ${navigationEase}`,
          }}
        />

        <div
          aria-hidden={barCollapsed}
          className="absolute inset-0 grid h-full grid-cols-[64px_1fr_64px] items-center"
          style={{
            pointerEvents: barCollapsed ? "none" : "auto",
          }}
        >
          <div
            className="h-full"
            style={{
              opacity: barCollapsed ? 0 : 1,
              transform: `translateX(${barCollapsed ? sideToCenterOffset : 0}px)`,
              transition: barContentTransition,
            }}
          >
            <IframeTransitionLink
              aria-label="Ana sayfaya dön"
              className="flex h-full items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-accent-red"
              href={logoHref}
              tabIndex={barCollapsed ? -1 : undefined}
            >
              <span className="flex h-8 w-8 items-center justify-center font-mono text-[11px] font-semibold text-site-dark-text transition-colors hover:text-site-accent">
                TT
              </span>
            </IframeTransitionLink>
          </div>

          <button
            aria-expanded={menuActive}
            className="group flex h-full cursor-pointer items-center justify-center px-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-site-dark-muted transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-accent-red"
            disabled={barCollapsed}
            onClick={openNavigation}
            style={{
              opacity: barCollapsed ? 0 : 1,
              transform: `translateX(${barCollapsed ? -18 : 0}px) scaleX(${barCollapsed ? 0.2 : 1})`,
              transition: `${barContentTransition}, color 150ms ease`,
            }}
            tabIndex={barCollapsed ? -1 : undefined}
            type="button"
          >
            <span>
              {currentPageTitle}
            </span>
          </button>

          <button
            aria-controls="navigation-overlay"
            aria-expanded={menuActive}
            aria-label="Menüyü aç"
            className="flex h-full items-center justify-center text-site-dark-text transition-colors hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-accent-red"
            disabled={barCollapsed}
            onClick={openNavigation}
            style={{
              opacity: barCollapsed ? 0 : 1,
              transform: `translateX(${barCollapsed ? -sideToCenterOffset : 0}px)`,
              transition: `${barContentTransition}, background-color 150ms ease`,
            }}
            tabIndex={barCollapsed ? -1 : undefined}
            type="button"
          >
            <Menu size={20} strokeWidth={1.8} />
          </button>
        </div>

      </div>

      <button
        aria-controls="navigation-overlay"
        aria-expanded={menuActive}
        aria-hidden={!barCollapsed}
        aria-label="Menüyü kapat"
        className="fixed bottom-10 left-1/2 z-[160] flex h-[58px] w-[58px] items-center justify-center text-site-dark-text transition-[background-color] duration-150 hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-accent-red sm:bottom-[52px]"
        onClick={(event) => {
          event.stopPropagation();
          closeNavigation();
        }}
        style={{
          opacity: barCollapsed ? 1 : 0,
          pointerEvents: barCollapsed ? "auto" : "none",
          transform: `translateX(-50%) scale(${barCollapsed ? 1 : 0.45})`,
          transition: `opacity 280ms ${navigationEase}, transform 280ms ${navigationEase}, background-color 150ms ease`,
        }}
        tabIndex={barCollapsed ? 0 : -1}
        type="button"
      >
        <X className="pointer-events-none" size={20} strokeWidth={1.8} />
      </button>

      <NavigationOverlay
        open={open}
        onClose={closeNavigation}
        onContactRequest={openContactFromNavigation}
      />
      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        placement={contactPlacement}
      />
    </>
  );
}
