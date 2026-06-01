"use client";

import { useEffect, useRef } from "react";
import { useAdminEdit } from "@/context/AdminEditContext";

export function AdminAutoOpenSection({ sectionKey }: { sectionKey: string }) {
  const context = useAdminEdit();
  const openedRef = useRef(false);

  useEffect(() => {
    if (!context || context.isPreviewMode || openedRef.current) return;

    context.openSectionEditor(sectionKey);
    openedRef.current = true;
  }, [context, sectionKey]);

  return null;
}
