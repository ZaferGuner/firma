"use client";

import { useState, useEffect } from "react";
import { isTransitionPreviewHref } from "@/lib/iframePreview";

export function useIsIframePreview() {
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsPreview(isTransitionPreviewHref()), 0);
    return () => clearTimeout(timer);
  }, []);

  return isPreview;
}
