"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type PageIntroContextValue = {
  shouldPlayPageIntro: boolean;
  suppressNextPageIntro: (reason?: string) => void;
  isPageIntroSuppressed: boolean;
};

const PageIntroContext = createContext<PageIntroContextValue | null>(null);

export function PageIntroProvider({ children }: { children: React.ReactNode }) {
  const [isSuppressed, setIsSuppressed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const previousPathRef = useRef(pathname);
  const suppressReasonRef = useRef<string | null>(null);

  // Set mounted on client mount to bypass hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const suppressNextPageIntro = (reason?: string) => {
    suppressReasonRef.current = reason || "manual";
    setIsSuppressed(true);
    if (typeof window !== "undefined") {
      document.documentElement.dataset.suppressPageIntro = "true";
      sessionStorage.setItem("tt-suppress-page-intro", "1");
      sessionStorage.setItem("tt-suppress-page-intro-ts", Date.now().toString());
    }
  };

  // Listen for back/forward popstate instantly
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      suppressNextPageIntro("popstate");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Pathname-change deferred cleanup
  useEffect(() => {
    if (previousPathRef.current !== pathname) {
      if (isSuppressed) {
        if (typeof window !== "undefined") {
          document.documentElement.dataset.suppressPageIntro = "true";
        }
      }
      previousPathRef.current = pathname;
    }
  }, [pathname, isSuppressed]);

  // Determine eligibility safely
  const getShouldPlayPageIntro = () => {
    // Hard load hydration guarantee: server and initial client tick must match (return true)
    if (typeof window === "undefined" || !mounted) {
      return true;
    }

    const isPreview =
      new URLSearchParams(window.location.search).get("__transitionPreview") === "1" ||
      new URLSearchParams(window.location.search).get("__ttPreview") === "1" ||
      document.documentElement.dataset.transitionPreview === "true" ||
      document.documentElement.classList.contains("is-iframe-transition-preview");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isAdmin = window.location.pathname.startsWith("/admin") || pathname.startsWith("/admin");

    if (isPreview || reduced || isAdmin || isSuppressed) {
      return false;
    }

    return true;
  };

  const shouldPlayPageIntro = getShouldPlayPageIntro();

  // Active development logging
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("[PageIntro]", {
        pathname,
        shouldPlayPageIntro,
        isPageIntroSuppressed: isSuppressed,
        reason: suppressReasonRef.current,
        suppressDataset: typeof window !== "undefined" ? document.documentElement.dataset.suppressPageIntro : undefined,
        session: typeof window !== "undefined" ? sessionStorage.getItem("tt-suppress-page-intro") : null,
      });
    }
  }, [pathname, shouldPlayPageIntro, isSuppressed]);

  return (
    <PageIntroContext.Provider
      value={{
        shouldPlayPageIntro,
        suppressNextPageIntro,
        isPageIntroSuppressed: isSuppressed,
      }}
    >
      {children}
    </PageIntroContext.Provider>
  );
}

export function usePageIntro() {
  const context = useContext(PageIntroContext);
  if (!context) {
    throw new Error("usePageIntro must be used within PageIntroProvider");
  }
  return context;
}

export function useShouldPlayPageIntro() {
  const { shouldPlayPageIntro } = usePageIntro();
  return shouldPlayPageIntro;
}
