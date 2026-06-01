"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { hardScrollToTop, hardScrollToHashWithRetry } from "@/lib/scrollToHash";
import { getHrefParts, isSpecialHref, normalizePath } from "@/lib/transitionNavigation";
import { usePageIntro } from "@/providers/PageIntroProvider";

type IframeTransitionPhase =
  | "idle"
  | "preparing"
  | "enter"
  | "hold"
  | "expand"
  | "routing"
  | "exit";

type TransitionSource = "link" | "popstate";

type TransitionTimings = {
  enter: number;
  hold: number;
  expand: number;
  exit: number;
};

const LINK_TRANSITION_TIMINGS: TransitionTimings = {
  enter: 560,
  hold: 260,
  expand: 560,
  exit: 360,
};

const POPSTATE_TRANSITION_TIMINGS: TransitionTimings = {
  enter: 420,
  hold: 120,
  expand: 420,
  exit: 240,
};

function getTransitionTimings(source: TransitionSource) {
  return source === "popstate"
    ? POPSTATE_TRANSITION_TIMINGS
    : LINK_TRANSITION_TIMINGS;
}

type IframeTransitionContextValue = {
  phase: IframeTransitionPhase;
  targetHref: string | null;
  backgroundHref: string | null;
  transitionSource: TransitionSource;
  previewReady: boolean;
  cachedPreviewHrefs: string[];
  isTransitioning: boolean;
  navigate: (href: string, options?: { onBeforeNavigate?: () => void }) => void;
  notifyPreviewReady: () => void;
  registerPreviewHref: (href: string) => void;
};

const IframeTransitionContext = createContext<IframeTransitionContextValue | null>(null);

export function useIframeTransition() {
  const context = useContext(IframeTransitionContext);
  if (!context) {
    throw new Error("useIframeTransition must be used within IframeTransitionProvider");
  }
  return context;
}

function getCurrentHref() {
  if (typeof window === "undefined") return "/";
  return window.location.pathname + window.location.search + window.location.hash;
}

export function IframeTransitionProvider({ children }: { children: ReactNode }) {
  const { suppressNextPageIntro } = usePageIntro();
  const [phase, setPhase] = useState<IframeTransitionPhase>("idle");
  const [targetHref, setTargetHref] = useState<string | null>(null);
  const [backgroundHref, setBackgroundHref] = useState<string | null>(null);
  const [transitionSource, setTransitionSource] = useState<TransitionSource>("link");
  const [previewReady, setPreviewReady] = useState(false);
  const [cachedPreviewHrefs, setCachedPreviewHrefs] = useState<string[]>([]);

  const pathname = usePathname();
  const router = useRouter();

  const phaseRef = useRef<IframeTransitionPhase>("idle");
  const transitionSourceRef = useRef<TransitionSource>("link");
  const previousHrefRef = useRef<string>("/");
  const pendingHrefRef = useRef<string | null>(null);
  const startHrefRef = useRef<string | null>(null);
  const startPathRef = useRef<string | null>(null);
  const timersRef = useRef<number[]>([]);
  const routingCompletionStartedRef = useRef(false);
  const previewTimeoutRef = useRef<number | null>(null);
  const hasPushedRef = useRef(false);

  const hasTransitionedRef = useRef(false);

  useEffect(() => {
    phaseRef.current = phase;

    if (typeof window !== "undefined") {
      const html = document.documentElement;

      // Map internal iframe transition phases to standard global route transition states
      let mappedPhase = "idle";
      if (phase === "idle") mappedPhase = "idle";
      else if (phase === "preparing") mappedPhase = "preparing";
      else if (phase === "enter" || phase === "hold" || phase === "expand") mappedPhase = "previewing";
      else if (phase === "routing") mappedPhase = "committing";
      else if (phase === "exit") mappedPhase = "completed";

      html.dataset.routeTransition = mappedPhase;

      if (phase !== "idle") {
        hasTransitionedRef.current = true;
        html.classList.add("route-transition-active");
        html.classList.remove("suppress-hero-text-animation");
      } else {
        html.classList.remove("route-transition-active");
        if (hasTransitionedRef.current) {
          html.classList.add("suppress-hero-text-animation");
        }
      }
    }
  }, [phase]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];

    if (previewTimeoutRef.current !== null) {
      window.clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }
  }, []);

  const addTimer = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
    return timer;
  }, []);

  const registerPreviewHref = useCallback((href: string) => {
    setCachedPreviewHrefs((current) => {
      if (!href) return current;
      if (current.includes(href)) return current;

      const next = [href, ...current];
      return next.slice(0, 5);
    });
  }, []);

  useEffect(() => {
    const currentHref = getCurrentHref();
    previousHrefRef.current = currentHref;
    window.history.scrollRestoration = "manual";

    const cacheTimer = window.setTimeout(() => {
      registerPreviewHref(currentHref);
    }, 0);

    return () => {
      window.clearTimeout(cacheTimer);
    };
  }, [registerPreviewHref]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const notifyPreviewReady = useCallback(() => {
    setPreviewReady(true);

    if (transitionSourceRef.current !== "link") {
      return;
    }

    if (phaseRef.current !== "preparing") {
      return;
    }

    requestAnimationFrame(() => {
      if (phaseRef.current === "preparing") {
        phaseRef.current = "enter";
        setPhase("enter");
      }
    });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const targetHref = getCurrentHref();
      clearTimers();
      phaseRef.current = "idle";
      setPhase("idle");
      setTargetHref(null);
      setBackgroundHref(null);
      setPreviewReady(false);
      pendingHrefRef.current = null;
      startHrefRef.current = null;
      startPathRef.current = null;
      routingCompletionStartedRef.current = false;
      hasPushedRef.current = false;
      previousHrefRef.current = targetHref;
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [clearTimers]);

  const navigate = useCallback((href: string, options?: { onBeforeNavigate?: () => void }) => {
    if (phaseRef.current !== "idle") return;
    if (isSpecialHref(href)) return;

    if (options?.onBeforeNavigate) {
      options.onBeforeNavigate();
    }

    clearTimers();

    // Set route transition arrival flag for site link navigation
    if (typeof window !== "undefined") {
      sessionStorage.setItem("tt-route-transition-arrival", "1");
      sessionStorage.setItem("tt-route-transition-ts", Date.now().toString());
      document.documentElement.dataset.suppressPageIntro = "true";
      suppressNextPageIntro("link-transition");
    }

    transitionSourceRef.current = "link";
    setTransitionSource("link");
    setBackgroundHref(null);
    pendingHrefRef.current = href;
    startHrefRef.current = getCurrentHref();
    startPathRef.current = pathname;
    routingCompletionStartedRef.current = false;
    hasPushedRef.current = false;

    setTargetHref(href);
    setPreviewReady(false);
    phaseRef.current = "preparing";
    setPhase("preparing");

    previewTimeoutRef.current = window.setTimeout(() => {
      if (
        phaseRef.current === "preparing" &&
        transitionSourceRef.current === "link"
      ) {
        notifyPreviewReady();
      }
    }, 1200);
  }, [pathname, clearTimers, notifyPreviewReady]);

  const completeRouteMountIfReady = useCallback(() => {
    if (routingCompletionStartedRef.current) return false;

    const pendingHref = pendingHrefRef.current;
    if (!pendingHref) return false;

    const targetParts = getHrefParts(pendingHref);
    const targetPath = normalizePath(targetParts.path || "/");
    const currentPath = normalizePath(window.location.pathname || "/");

    if (currentPath !== targetPath) {
      return false;
    }

    routingCompletionStartedRef.current = true;

    if (targetParts.hash) {
      hardScrollToHashWithRetry(targetParts.hash, 5);
    } else {
      hardScrollToTop();
    }

    window.dispatchEvent(new Event("resize"));

    requestAnimationFrame(() => {
      if (!targetParts.hash) {
        hardScrollToTop();
      }

      setPhase("exit");
    });

    return true;
  }, []);

  const finishTransitionCleanup = useCallback(() => {
    clearTimers();

    const currentHref = getCurrentHref();
    previousHrefRef.current = currentHref;
    registerPreviewHref(currentHref);

    transitionSourceRef.current = "link";
    setTransitionSource("link");
    pendingHrefRef.current = null;
    startHrefRef.current = null;
    startPathRef.current = null;
    routingCompletionStartedRef.current = false;
    hasPushedRef.current = false;

    setTargetHref(null);
    setBackgroundHref(null);
    setPreviewReady(false);
    setPhase("idle");
  }, [clearTimers, registerPreviewHref]);

  useEffect(() => {
    const timings = getTransitionTimings(transitionSourceRef.current);

    if (phase === "enter") {
      addTimer(() => setPhase("hold"), timings.enter);
    }

    if (phase === "hold") {
      addTimer(() => setPhase("expand"), timings.hold);
    }

    if (phase === "expand") {
      addTimer(() => {
        const pendingHref = pendingHrefRef.current;
        if (!pendingHref) {
          setPhase("exit");
          return;
        }

        setPhase("routing");

        if (transitionSourceRef.current === "link") {
          if (!hasPushedRef.current) {
            hasPushedRef.current = true;
            if (typeof window !== "undefined") {
              try {
                const pathnameOnly = pendingHref.split("#")[0].split("?")[0];
                sessionStorage.setItem("ttSkipIntroPath", pathnameOnly);
                sessionStorage.setItem("ttSkipIntroTime", Date.now().toString());
              } catch {}
            }
            router.push(pendingHref, { scroll: false });
          }
        } else {
          // Popstate akışında browser URL'yi zaten değiştirdi.
          // router.push / replace yok.
          requestAnimationFrame(() => {
            completeRouteMountIfReady();
          });
        }
      }, timings.expand);
    }

    if (phase === "exit") {
      addTimer(() => {
        finishTransitionCleanup();
      }, timings.exit);
    }
  }, [phase, addTimer, router, completeRouteMountIfReady, finishTransitionCleanup]);

  useEffect(() => {
    if (phase !== "routing") return;

    completeRouteMountIfReady();
  }, [pathname, phase, completeRouteMountIfReady]);

  const previousPathRef = useRef(pathname);

  useEffect(() => {
    if (previousPathRef.current !== pathname) {
      if (typeof window !== "undefined") {
        const arrivedFromTransition = sessionStorage.getItem("tt-route-transition-arrival") === "1";

        if (arrivedFromTransition) {
          document.documentElement.dataset.suppressPageIntro = "true";
          sessionStorage.removeItem("tt-route-transition-arrival");
          sessionStorage.removeItem("tt-route-transition-ts");

          window.dispatchEvent(
            new CustomEvent("tt:suppress-page-intro", {
              detail: { pathname },
            })
          );
        }
      }
      previousPathRef.current = pathname;
    }
  }, [pathname]);

  return (
    <IframeTransitionContext.Provider
      value={{
        phase,
        targetHref,
        backgroundHref,
        transitionSource,
        previewReady,
        cachedPreviewHrefs,
        isTransitioning: phase !== "idle",
        navigate,
        notifyPreviewReady,
        registerPreviewHref,
      }}
    >
      {children}
    </IframeTransitionContext.Provider>
  );
}
