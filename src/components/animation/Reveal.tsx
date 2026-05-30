"use client";

import { motion, type MotionProps } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useSkipIntro } from "@/hooks/useSkipIntro";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
} & Pick<MotionProps, "viewport">;

const ease = [0.19, 1, 0.22, 1] as const;

export function Reveal({
  children,
  className,
  delay = 0,
  viewport = { once: true, amount: 0.22 },
  y = 24,
}: RevealProps) {
  const skipIntro = useSkipIntro();

  return (
    <motion.div
      data-motion-reveal
      className={cn(className)}
      initial={skipIntro ? false : { opacity: 0, y }}
      transition={{ delay, duration: 0.78, ease }}
      viewport={viewport}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
