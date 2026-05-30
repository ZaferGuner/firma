"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { TRANSITION_PREVIEW_PARAM } from "@/lib/iframePreview";

export function IframePreviewBoot() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const isPreview = searchParams.get(TRANSITION_PREVIEW_PARAM) === "1" || searchParams.get("__transitionPreview") === "1";

    if (!isPreview) return;

    const root = document.documentElement;
    root.classList.add("is-iframe-transition-preview");
    root.dataset.transitionPreview = "true";
    document.body.classList.add("is-iframe-transition-preview");

    window.history.scrollRestoration = "manual";

    const waitFrame = () =>
      new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    const run = async () => {
      try {
        if ("fonts" in document) {
          await document.fonts.ready;
        }
      } catch {}

      await waitFrame();
      await waitFrame();
      await waitFrame();

      window.dispatchEvent(new Event("resize"));

      await waitFrame();

      if (window.location.hash) {
        const cleanHash = window.location.hash.slice(1);
        const element = document.getElementById(cleanHash);

        if (element) {
          const offset = 96;
          const top =
            element.getBoundingClientRect().top +
            window.scrollY -
            offset;

          window.scrollTo({ top, left: 0, behavior: "auto" });
        }
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }

      window.parent?.postMessage(
        {
          type: "TT_IFRAME_PREVIEW_READY",
          href: window.location.pathname + window.location.search + window.location.hash,
        },
        window.location.origin
      );
    };

    run();

    return () => {
      root.classList.remove("is-iframe-transition-preview");
      document.body.classList.remove("is-iframe-transition-preview");
    };
  }, [searchParams]);

  return null;
}
