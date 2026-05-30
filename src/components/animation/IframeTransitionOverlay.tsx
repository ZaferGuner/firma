"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useIframeTransition } from "./IframeTransitionProvider";
import { isTransitionPreviewHref, toIframePreviewHref } from "@/lib/iframePreview";

const PREWARM_PREVIEW_HREFS = ["/", "/about", "/projects"];

const LINK_OVERLAY_TIMINGS = {
  enter: 0.56,
  hold: 0.26,
  expand: 0.56,
  exit: 0.36,
};

const POPSTATE_OVERLAY_TIMINGS = {
  enter: 0.42,
  hold: 0.12,
  expand: 0.42,
  exit: 0.24,
};

function createPanelVariants(timings: typeof LINK_OVERLAY_TIMINGS) {
  return {
    hidden: {
      y: "110vh",
      scale: 0.75,
      borderRadius: 10,
      opacity: 1,
    },
    preparing: {
      y: "110vh",
      scale: 0.75,
      borderRadius: 10,
      opacity: 1,
    },
    enter: {
      y: 0,
      scale: 0.75,
      borderRadius: 10,
      opacity: 1,
      transition: {
        duration: timings.enter,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
    hold: {
      y: 0,
      scale: 0.75,
      borderRadius: 10,
      opacity: 1,
      transition: {
        duration: timings.hold,
        ease: "linear" as const,
      },
    },
    expand: {
      y: 0,
      scale: 1,
      borderRadius: 0,
      opacity: 1,
      transition: {
        duration: timings.expand,
        ease: [0.76, 0, 0.24, 1] as const,
      },
    },
    routing: {
      y: 0,
      scale: 1,
      borderRadius: 0,
      opacity: 1,
    },
    exit: {
      y: 0,
      scale: 1,
      borderRadius: 0,
      opacity: 1,
      transition: {
        duration: 0,
      },
    },
  };
}

function BackgroundFreezeIframe({ src }: { src: string }) {
  return (
    <iframe
      key={src}
      src={src}
      className="pointer-events-none fixed inset-0 z-[145] h-full w-full border-0 bg-[#050A0A]"
      tabIndex={-1}
      aria-hidden="true"
      style={{
        opacity: 1,
        pointerEvents: "none",
        colorScheme: "dark",
      }}
    />
  );
}

export function IframeTransitionOverlay() {
  const {
    phase,
    targetHref,
    backgroundHref,
    transitionSource,
    previewReady,
    cachedPreviewHrefs,
    notifyPreviewReady,
  } = useIframeTransition();
  const isVisible = phase !== "idle";
  const [shouldRenderPreviewCache, setShouldRenderPreviewCache] = useState(false);
  const targetIframeRef = useRef<HTMLIFrameElement | null>(null);
  const isPopstate = transitionSource === "popstate";
  const timings = isPopstate ? POPSTATE_OVERLAY_TIMINGS : LINK_OVERLAY_TIMINGS;
  const panelVariants = useMemo(() => createPanelVariants(timings), [timings]);

  const targetIframeSrc = targetHref ? toIframePreviewHref(targetHref) : undefined;
  const backgroundIframeSrc = backgroundHref ? toIframePreviewHref(backgroundHref) : undefined;
  const showBackgroundFreeze =
    isPopstate &&
    Boolean(backgroundIframeSrc) &&
    phase !== "idle";
  const cacheHrefs = useMemo(
    () =>
      Array.from(
        new Set([...PREWARM_PREVIEW_HREFS, ...cachedPreviewHrefs])
      ).slice(0, 6),
    [cachedPreviewHrefs]
  );

  useEffect(() => {
    if (isTransitionPreviewHref()) return;

    const cacheTimer = window.setTimeout(() => {
      setShouldRenderPreviewCache(true);
    }, 0);

    return () => {
      window.clearTimeout(cacheTimer);
    };
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "TT_IFRAME_PREVIEW_READY") return;
      if (!targetIframeRef.current) return;
      if (event.source !== targetIframeRef.current.contentWindow) return;

      notifyPreviewReady();
    };

    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, [notifyPreviewReady]);

  return (
    <>
      {shouldRenderPreviewCache && phase === "idle" && cacheHrefs.length > 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 h-screen w-screen overflow-hidden opacity-0"
          inert
          style={{ left: "-200vw", zIndex: -1 }}
        >
          {cacheHrefs.map((href) => {
            const src = toIframePreviewHref(href);

            return (
              <iframe
                key={src}
                src={src}
                tabIndex={-1}
                className="h-screen w-screen border-0"
                aria-hidden="true"
              />
            );
          })}
        </div>
      )}

      <AnimatePresence>
      {isVisible && (
        <div
          className="pointer-events-none fixed inset-0 z-[140] overflow-hidden"
          aria-hidden="true"
        >
          {/* Backdrop */}
          <motion.div
            data-route-transition-overlay="backdrop"
            className="absolute inset-0 bg-[#050A0A]/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "exit" ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: phase === "exit" ? timings.exit : timings.enter }}
          />

          {/* Background freeze layer for popstate */}
          {showBackgroundFreeze && (
            <>
              <div className="pointer-events-none fixed inset-0 z-[140] bg-[#050A0A]" />
              {backgroundIframeSrc && <BackgroundFreezeIframe src={backgroundIframeSrc} />}
            </>
          )}

          {/* Intermediate overlay */}
          <motion.div
            data-route-transition-overlay="dim"
            className="pointer-events-none fixed inset-0 z-[150] bg-[#050A0A]/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "exit" ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: phase === "exit" ? timings.exit : timings.enter }}
          />

          <motion.div
            className="pointer-events-none fixed inset-0 z-[160] overflow-hidden bg-[#050A0A]"
            initial="hidden"
            animate={phase as keyof typeof panelVariants}
            exit="exit"
            variants={panelVariants}
            style={{
              transformOrigin: "center center",
              boxShadow: "0 44px 160px rgba(0,0,0,0.65)",
              willChange: "transform, opacity, border-radius",
            }}
          >
            {/* Iframe target preview */}
            {targetIframeSrc && (
              <iframe
                ref={targetIframeRef}
                key={targetIframeSrc}
                src={targetIframeSrc}
                className="h-full w-full border-0 bg-[#050A0A]"
                onLoad={() => {
                  // Fallback: Notify after a timeout if the message is never received
                  // but we won't show the white flash
                }}
                tabIndex={-1}
                aria-hidden="true"
                style={{
                  opacity: 1,
                  pointerEvents: "none",
                  colorScheme: "dark",
                }}
              />
            )}

            {/* Subtle glass reflection to enforce the "window" look without whitening */}
            <div className="pointer-events-none absolute inset-0 border border-dark-text/10" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_45%)]" />
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </>
  );
}
