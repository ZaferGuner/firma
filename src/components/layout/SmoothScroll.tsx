"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";

import { hardScrollToTop } from "@/lib/scrollToHash";

function RouteScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) {
      return;
    }

    previousPathname.current = pathname;

    const resetScroll = () => {
      lenis?.scrollTo(0, { immediate: true, force: true });
      hardScrollToTop();
    };

    resetScroll();

    let secondFrame: number | null = null;
    const firstFrame = window.requestAnimationFrame(() => {
      resetScroll();
      secondFrame = window.requestAnimationFrame(resetScroll);
    });
    const settleTimer = window.setTimeout(resetScroll, 160);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame !== null) {
        window.cancelAnimationFrame(secondFrame);
      }
      window.clearTimeout(settleTimer);
    };
  }, [lenis, pathname]);

  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.05,
        duration: 1.5,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      }}
    >
      <RouteScrollReset />
      {children}
    </ReactLenis>
  );
}
