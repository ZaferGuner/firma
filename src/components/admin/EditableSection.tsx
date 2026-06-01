"use client";

import React from "react";
import { useAdminEdit } from "@/context/AdminEditContext";

interface EditableSectionProps {
  sectionKey: string;
  label: string;
  children: React.ReactNode;
}

export function EditableSection({ sectionKey, label, children }: EditableSectionProps) {
  const adminContext = useAdminEdit();

  // 1. If no admin context is present (public visitor mode), render strictly children with zero DOM footprint
  if (!adminContext) {
    return <>{children}</>;
  }

  const { isPreviewMode, activeSectionKey, openSectionEditor } = adminContext;

  // 2. If in Preview Mode, render strictly children with zero overlays or outlines
  if (isPreviewMode) {
    return <>{children}</>;
  }

  const isActive = activeSectionKey === sectionKey;

  return (
    <div
      className={`relative group/editable transition-all duration-300 ${
        isActive
          ? "outline outline-1 outline-offset-[-1px] outline-[var(--color-primary)] shadow-2xl"
          : "hover:outline hover:outline-1 hover:outline-offset-[-1px] hover:outline-neutral-500"
      }`}
    >
      {children}
      
      {/* SOLID EDIT BUTTON CONTAINER (No transparency or glassmorphism used) */}
      <div
        className="absolute right-4 top-4 z-[10002] opacity-0 group-hover/editable:opacity-100 transition-opacity duration-200 pointer-events-none"
        data-admin-edit-overlay
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openSectionEditor(sectionKey);
          }}
          type="button"
          data-admin-edit-button
          className="admin-blue-button pointer-events-auto flex items-center justify-center bg-dark-bg px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-dark-text transition-colors hover:bg-[var(--color-primary)] cursor-pointer"
        >
          [Düzenle]
        </button>
      </div>

      {/* FLOAT AREA LABEL */}
      <div className="absolute left-4 top-4 z-[10001] opacity-0 group-hover/editable:opacity-100 transition-opacity duration-200 pointer-events-none">
        <span className="bg-dark-bg px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-dark-text/50">
          {label}
        </span>
      </div>
    </div>
  );
}
