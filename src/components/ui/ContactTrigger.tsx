"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContactTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function ContactTrigger({
  children,
  className,
  onClick,
  type = "button",
  ...props
}: ContactTriggerProps) {
  return (
    <button
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          window.dispatchEvent(new CustomEvent("tt:contact-open"));
        }
      }}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
