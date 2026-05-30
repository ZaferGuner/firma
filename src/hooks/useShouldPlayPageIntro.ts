"use client";

import { usePageIntro } from "@/providers/PageIntroProvider";

export function useShouldPlayPageIntro() {
  const { shouldPlayPageIntro } = usePageIntro();
  return shouldPlayPageIntro;
}
