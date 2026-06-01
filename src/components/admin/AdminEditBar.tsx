"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  Menu,
  RotateCcw,
  Save,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import { useAdminEdit } from "@/context/AdminEditContext";

type AdminPage = {
  label: string;
  value: "home" | "projects" | "contact" | "press" | "inquiries" | "settings";
  href: string;
  disabled?: boolean;
};

const adminPages: AdminPage[] = [
  { label: "Ana Sayfa", value: "home", href: "/admin/edit/home" },
  { label: "Projeler", value: "projects", href: "/admin/edit/projects" },
  { label: "İletişim", value: "contact", href: "/admin/edit/contact" },
  { label: "Basında Biz", value: "press", href: "/admin/edit/press" },
  { label: "Talepler", value: "inquiries", href: "/admin/inquiries" },
  { label: "Ayarlar / SEO", value: "settings", href: "/admin/settings" },
];

// Pages where save/discard/preview actions are not applicable
const NO_ACTIONS_PAGES: AdminPage["value"][] = ["inquiries"];

function resolveCurrentPage(pathname: string): AdminPage["value"] {
  if (pathname.startsWith("/admin/inquiries")) return "inquiries";
  if (pathname.startsWith("/admin/settings")) return "settings";

  const match = pathname.match(/^\/admin\/edit\/([^/]+)/);
  const value = match?.[1] as AdminPage["value"];

  if (value && adminPages.some((p) => p.value === value)) {
    return value;
  }

  return "home";
}

const drawerVariants = {
  hidden: { x: "-100%" },
  visible: {
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  exit: {
    x: "-100%",
    transition: { duration: 0.26, ease: "easeIn" as const },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export function AdminEditBar() {
  const router = useRouter();
  const pathname = usePathname();
  const context = useAdminEdit();
  const lenis = useLenis();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [targetPage, setTargetPage] = useState<AdminPage | null>(null);
  const [modalAction, setModalAction] = useState<"discard" | "save" | null>(null);

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen && !showUnsavedModal) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    lenis?.stop();

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      lenis?.start();
    };
  }, [isOpen, showUnsavedModal, lenis]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showUnsavedModal) {
          closeUnsavedModal();
        } else {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showUnsavedModal]);

  if (!context) {
    return null;
  }

  const {
    isPreviewMode,
    dirtyFields,
    hasUnsavedChanges,
    saveStatus,
    errorMessage,
    togglePreviewMode,
    saveChanges,
    discardChanges,
  } = context;

  const dirtySectionsCount = Object.keys(dirtyFields).length;
  const currentPage = resolveCurrentPage(pathname);
  const isNoActionsPage = NO_ACTIONS_PAGES.includes(currentPage);

  const navigateTo = (page: AdminPage) => {
    if (pathname === page.href) return;
    router.push(page.href);
  };

  const closeUnsavedModal = () => {
    setShowUnsavedModal(false);
    setTargetPage(null);
    setModalAction(null);
  };

  const handlePageChange = (page: AdminPage) => {
    if (page.disabled || currentPage === page.value || pathname === page.href) return;

    if (hasUnsavedChanges) {
      setTargetPage(page);
      setShowUnsavedModal(true);
      return;
    }

    setIsOpen(false);
    navigateTo(page);
  };

  const handleDiscardAndNavigate = async () => {
    if (!targetPage) return;
    setModalAction("discard");

    const discarded = await discardChanges({ skipConfirm: true });
    if (discarded) {
      const nextPage = targetPage;
      closeUnsavedModal();
      setIsOpen(false);
      navigateTo(nextPage);
      return;
    }

    setModalAction(null);
  };

  const handleSaveAndNavigate = async () => {
    if (!targetPage) return;
    setModalAction("save");

    const saved = await saveChanges();
    if (saved) {
      const nextPage = targetPage;
      closeUnsavedModal();
      setIsOpen(false);
      navigateTo(nextPage);
      return;
    }

    setModalAction(null);
  };

  const handleLogout = async () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "Kaydedilmemiş değişiklikleriniz var. Çıkış yapmak istediğinize emin misiniz?"
      );
      if (!confirmed) return;
    }

    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (response.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const renderStatusBadge = () => {
    switch (saveStatus) {
      case "saving":
        return (
          <span className="flex items-center gap-1.5 font-mono text-[9px] text-yellow-400 uppercase tracking-wider">
            <Loader2 className="h-2.5 w-2.5 animate-spin" />
            Yayınlanıyor...
          </span>
        );
      case "success":
        return (
          <span className="flex items-center gap-1.5 font-mono text-[9px] text-green-400 uppercase tracking-wider">
            <CheckCircle className="h-2.5 w-2.5" />
            Yayınlandı
          </span>
        );
      case "error":
        return (
          <span
            className="flex items-center gap-1.5 font-mono text-[9px] text-red-400 uppercase tracking-wider"
            title={errorMessage || undefined}
          >
            <AlertTriangle className="h-2.5 w-2.5" />
            Hata oluştu
          </span>
        );
      case "dirty":
        return (
          <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider animate-pulse" style={{ color: "#B6A18D" }}>
            {dirtySectionsCount} bölüm düzenlendi
          </span>
        );
      case "idle":
      default:
        return (
          <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: "#A8A197" }}>
            Kaydedildi
          </span>
        );
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        type="button"
        aria-label="Admin panelini aç"
        onClick={() => setIsOpen(true)}
        className="fixed z-[9990] flex items-center justify-center transition-all duration-200 cursor-pointer"
        style={{
          left: 20,
          top: 24,
          width: 40,
          height: 40,
          background: "#111518",
          border: "1px solid rgba(244, 241, 234, 0.12)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
        }}
      >
        <Menu size={16} color="#F4F1EA" />
      </button>

      {/* Drawer + Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="admin-overlay"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-[9991]"
              style={{ background: "rgba(0,0,0,0.45)" }}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              key="admin-drawer"
              ref={drawerRef}
              role="dialog"
              aria-label="Admin kontrol paneli"
              aria-modal="true"
              data-lenis-prevent
              onWheel={(event) => event.stopPropagation()}
              onTouchMove={(event) => event.stopPropagation()}
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed left-0 top-0 z-[9992] flex flex-col"
              style={{
                width: "min(340px, 88vw)",
                height: "100dvh",
                background: "#111518",
                borderRight: "1px solid rgba(244, 241, 234, 0.12)",
                boxShadow: "4px 0 24px rgba(0,0,0,0.5)",
              }}
            >
              {/* Header */}
              <div
                className="flex items-start justify-between px-6 py-5"
                style={{ borderBottom: "1px solid rgba(244, 241, 234, 0.08)" }}
              >
                <div className="flex flex-col gap-1">
                  <span
                    className="font-mono text-[11px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: "#F4F1EA" }}
                  >
                    TANER TÜMER
                  </span>
                  <span
                    className="font-mono text-[9px] uppercase tracking-widest"
                    style={{ color: "#A8A197" }}
                  >
                    Admin Editör
                  </span>
                  <div className="mt-1.5">{renderStatusBadge()}</div>
                </div>
                <button
                  type="button"
                  aria-label="Paneli kapat"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center transition-colors cursor-pointer"
                  style={{
                    width: 32,
                    height: 32,
                    color: "#A8A197",
                    marginTop: -2,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#F4F1EA")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#A8A197")}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Navigation */}
              <nav
                className="flex-1 overflow-y-auto py-4"
                data-lenis-prevent
                style={{ borderBottom: "1px solid rgba(244, 241, 234, 0.08)" }}
              >
                <div
                  className="px-4 pb-2 font-mono text-[8px] uppercase tracking-[0.2em]"
                  style={{ color: "#A8A197" }}
                >
                  Sayfalar
                </div>
                {adminPages.map((page) => {
                  const isActive = currentPage === page.value;
                  return (
                    <button
                      key={page.value}
                      type="button"
                      disabled={page.disabled}
                      onClick={() => handlePageChange(page)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150 cursor-pointer relative"
                      style={{
                        background: isActive ? "#1D211E" : "transparent",
                        color: isActive ? "#B6A18D" : "#A8A197",
                        borderLeft: isActive
                          ? "2px solid #B6A18D"
                          : "2px solid transparent",
                        opacity: page.disabled ? 0.4 : 1,
                        cursor: page.disabled ? "not-allowed" : "pointer",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive && !page.disabled) {
                          e.currentTarget.style.color = "#F4F1EA";
                          e.currentTarget.style.background = "rgba(244,241,234,0.04)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive && !page.disabled) {
                          e.currentTarget.style.color = "#A8A197";
                          e.currentTarget.style.background = "transparent";
                        }
                      }}
                    >
                      <span className="font-mono text-[11px] font-medium tracking-wide">
                        {page.label}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* Actions */}
              <div className="px-5 py-5 flex flex-col gap-3">
                {!isNoActionsPage && (
                  <>
                    {/* Preview / Edit Toggle */}
                    <button
                      type="button"
                      onClick={togglePreviewMode}
                      className="w-full flex items-center gap-2 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      style={{
                        background: "#1D211E",
                        border: "1px solid rgba(244, 241, 234, 0.12)",
                        color: "#F4F1EA",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#252A26")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#1D211E")}
                    >
                      {isPreviewMode ? (
                        <>
                          <EyeOff size={13} />
                          <span>Düzenleme Modu</span>
                        </>
                      ) : (
                        <>
                          <Eye size={13} />
                          <span>Önizleme</span>
                        </>
                      )}
                    </button>

                    {/* Discard */}
                    <button
                      type="button"
                      onClick={() => discardChanges()}
                      disabled={!hasUnsavedChanges || saveStatus === "saving"}
                      className="w-full flex items-center gap-2 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors"
                      style={{
                        background: "transparent",
                        border: "1px solid rgba(244, 241, 234, 0.12)",
                        color: hasUnsavedChanges ? "#F4F1EA" : "#A8A197",
                        cursor:
                          hasUnsavedChanges && saveStatus !== "saving"
                            ? "pointer"
                            : "not-allowed",
                        opacity:
                          hasUnsavedChanges && saveStatus !== "saving" ? 1 : 0.45,
                      }}
                    >
                      <RotateCcw size={13} />
                      <span>Vazgeç</span>
                    </button>

                    {/* Save */}
                    <button
                      type="button"
                      onClick={saveChanges}
                      disabled={!hasUnsavedChanges || saveStatus === "saving"}
                      className="w-full flex items-center gap-2 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors"
                      style={{
                        background:
                          hasUnsavedChanges && saveStatus !== "saving"
                            ? "#F4F1EA"
                            : "#1D211E",
                        border: "1px solid rgba(244, 241, 234, 0.12)",
                        color:
                          hasUnsavedChanges && saveStatus !== "saving"
                            ? "#111518"
                            : "#A8A197",
                        cursor:
                          hasUnsavedChanges && saveStatus !== "saving"
                            ? "pointer"
                            : "not-allowed",
                        opacity:
                          hasUnsavedChanges && saveStatus !== "saving" ? 1 : 0.45,
                      }}
                    >
                      {saveStatus === "saving" ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Save size={13} />
                      )}
                      <span>Kaydet & Yayınla</span>
                    </button>
                  </>
                )}

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-2 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(244, 241, 234, 0.12)",
                    color: "#A8A197",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#F4F1EA")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#A8A197")}
                >
                  {isLoggingOut ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <LogOut size={13} />
                  )}
                  <span>Çıkış Yap</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Unsaved Changes Modal */}
      {showUnsavedModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center select-none" style={{ background: "rgba(17,21,24,0.7)" }}>
          <div
            className="w-[min(450px,calc(100vw-32px))] flex flex-col gap-6 p-8"
            style={{
              background: "#111518",
              border: "1px solid rgba(244, 241, 234, 0.12)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
            }}
          >
            <div className="flex flex-col gap-2">
              <h3
                className="text-base font-bold uppercase tracking-wider font-mono"
                style={{ color: "#B6A18D" }}
              >
                Kaydedilmemiş değişiklikler var
              </h3>
              <p className="text-xs leading-relaxed font-mono" style={{ color: "#A8A197" }}>
                Sayfa değiştirirseniz yayınlanmamış taslak değişiklikleriniz korunur ancak önce kaydetmeniz önerilir.
              </p>
            </div>

            <div
              className="flex flex-wrap items-center justify-end gap-3 font-mono text-[9px] font-bold uppercase tracking-widest pt-4"
              style={{ borderTop: "1px solid rgba(244, 241, 234, 0.08)" }}
            >
              <button
                type="button"
                onClick={closeUnsavedModal}
                disabled={modalAction !== null}
                className="px-5 py-2.5 transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-60"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(244, 241, 234, 0.12)",
                  color: "#A8A197",
                }}
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleDiscardAndNavigate}
                disabled={modalAction !== null}
                className="px-5 py-2.5 transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-60"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(182, 161, 141, 0.35)",
                  color: "#B6A18D",
                }}
              >
                {modalAction === "discard" ? "Geçiliyor..." : "Vazgeç ve Geç"}
              </button>
              <button
                type="button"
                onClick={handleSaveAndNavigate}
                disabled={modalAction !== null}
                className="px-5 py-2.5 transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-70"
                style={{
                  background: "#F4F1EA",
                  border: "1px solid #F4F1EA",
                  color: "#111518",
                }}
              >
                {modalAction === "save" ? "Kaydediliyor..." : "Kaydet ve Geç"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
