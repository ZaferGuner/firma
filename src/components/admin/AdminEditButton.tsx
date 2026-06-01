"use client";

import React from "react";

interface AdminEditButtonProps {
  onClick: () => void;
  label: string;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export function AdminEditButton({ onClick, label, position = "top-right" }: AdminEditButtonProps) {
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <div className={`absolute z-[10002] ${positionClasses[position]} opacity-0 group-hover:opacity-100 transition-opacity duration-200`} data-admin-edit-overlay>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }}
        type="button"
        data-admin-edit-button
        className="admin-blue-button pointer-events-auto flex items-center justify-center bg-dark-bg px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-dark-text transition-colors hover:bg-[var(--color-primary)] cursor-pointer"
        title={label}
      >
        [{label}]
      </button>
    </div>
  );
}
