"use client";

import { useEffect, useState } from "react";
import { useShouldPlayPageIntro } from "./useShouldPlayPageIntro";

export function useSkipIntro() {
  const shouldPlayPageIntro = useShouldPlayPageIntro();
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const skipPath = sessionStorage.getItem("ttSkipIntroPath");
      const skipTime = sessionStorage.getItem("ttSkipIntroTime");
      if (skipPath === window.location.pathname && skipTime) {
        const elapsed = Date.now() - parseInt(skipTime, 10);
        if (elapsed < 15000) {
          setSkip(true);
        }
      }
    } catch {}
  }, []);

  // shouldPlayPageIntro is hydration-safe (evaluates to true during hydration, then safely updates after mount).
  // This completely eliminates any hydration mismatches.
  return skip || !shouldPlayPageIntro;
}
