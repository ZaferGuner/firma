"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle, Eye, EyeOff, Loader2, LogOut, RotateCcw, Save } from "lucide-react";
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

function resolveCurrentPage(pathname: string): AdminPage["value"] {
  if (pathname.startsWith("/admin/inquiries")) return "inquiries";
  if (pathname.startsWith("/admin/settings")) return "settings";
  
  const match = pathname.match(/^\/admin\/edit\/([^/]+)/);
  const value = match?.[1] as AdminPage["value"];

  if (value && adminPages.some(p => p.value === value)) {
    return value;
  }

  return "home";
}

export function AdminEditBar() {
  const router = useRouter();
  const pathname = usePathname();
  const context = useAdminEdit();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [targetPage, setTargetPage] = useState<AdminPage | null>(null);
  const [modalAction, setModalAction] = useState<"discard" | "save" | null>(null);

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

    navigateTo(page);
  };

  const handleDiscardAndNavigate = async () => {
    if (!targetPage) return;
    setModalAction("discard");

    const discarded = await discardChanges({ skipConfirm: true });
    if (discarded) {
      const nextPage = targetPage;
      closeUnsavedModal();
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

      if (!confirmed) {
        return;
      }
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

  const renderStatus = () => {
    switch (saveStatus) {
      case "saving":
        return (
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-yellow-500 uppercase tracking-wider">
            <Loader2 className="h-3 w-3 animate-spin" />
            Yayınlanıyor...
          </span>
        );
      case "success":
        return (
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-green-500 uppercase tracking-wider">
            <CheckCircle className="h-3 w-3" />
            Değişiklikler yayınlandı!
          </span>
        );
      case "error":
        return (
          <span
            className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--color-primary)] uppercase tracking-wider"
            title={errorMessage || undefined}
          >
            <AlertTriangle className="h-3 w-3" />
            Hata oluştu, tekrar deneyin
          </span>
        );
      case "dirty":
        return (
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-orange-400 uppercase tracking-wider animate-pulse">
            {dirtySectionsCount} bölüm düzenlendi (Kaydedilmedi)
          </span>
        );
      case "idle":
      default:
        return (
          <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider">
            Tüm değişiklikler kaydedildi
          </span>
        );
    }
  };

  return (
    <>
      <div className="admin-edit-bar fixed top-0 left-0 right-0 z-[9999] pointer-events-auto h-[60px] border-b border-neutral-800 bg-dark-bg px-6 text-dark-text select-none">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                TANER TÜMER İNŞAAT
              </span>
              <span className="mt-0.5 font-mono text-[8px] uppercase tracking-widest text-neutral-400">
                Yönetsel Görsel Editör
              </span>
            </div>

            <div className="h-6 w-[1px] bg-neutral-800" />

            <div className="flex items-center gap-2">
              <label
                className="font-mono text-[9px] uppercase tracking-wider text-neutral-500"
                htmlFor="admin-page-selector"
              >
                Sayfa:
              </label>
              <select
                aria-label="Admin edit sayfası seç"
                className="relative z-[10000] bg-neutral-900 border border-neutral-800 px-3 py-1 font-mono text-[10px] font-semibold text-dark-text uppercase focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
                id="admin-page-selector"
                value={currentPage}
                onChange={(event) => {
                  const nextPage = adminPages.find((page) => page.value === event.target.value);
                  if (!nextPage) return;
                  handlePageChange(nextPage);
                }}
              >
                {adminPages.map((page) => (
                  <option key={page.value} disabled={page.disabled} value={page.value}>
                    {page.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="hidden md:block">{renderStatus()}</div>

          <div className="flex items-center gap-4">
            <div className="block md:hidden mr-2">{renderStatus()}</div>

            <button
              onClick={togglePreviewMode}
              disabled={currentPage === "inquiries"}
              type="button"
              className={`flex items-center gap-1.5 border px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] transition-colors cursor-pointer ${
                currentPage === "inquiries"
                  ? "border-neutral-800 bg-transparent text-neutral-600 cursor-not-allowed"
                  : "border-neutral-800 bg-neutral-900 text-dark-text hover:bg-neutral-800"
              }`}
              title={currentPage === "inquiries" ? "Bu sayfada önizleme kullanılamaz" : isPreviewMode ? "Düzenleme moduna geç" : "Önizleme moduna geç"}
            >
              {isPreviewMode ? (
                <>
                  <EyeOff size={12} />
                  <span>Düzenleme Modu</span>
                </>
              ) : (
                <>
                  <Eye size={12} />
                  <span>Önizleme</span>
                </>
              )}
            </button>

            <button
              onClick={() => discardChanges()}
              disabled={!hasUnsavedChanges || saveStatus === "saving" || currentPage === "inquiries"}
              type="button"
              className={`flex items-center gap-1.5 px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] border transition-colors cursor-pointer ${
                hasUnsavedChanges && saveStatus !== "saving" && currentPage !== "inquiries"
                  ? "border-neutral-700 bg-transparent text-dark-text hover:bg-neutral-800"
                  : "border-neutral-800 bg-transparent text-neutral-600 cursor-not-allowed"
              }`}
              title="Tüm düzenlemeleri geri al"
            >
              <RotateCcw size={12} />
              <span>Vazgeç</span>
            </button>

            <button
              onClick={saveChanges}
              disabled={!hasUnsavedChanges || saveStatus === "saving" || currentPage === "inquiries"}
              type="button"
              className={`flex items-center gap-1.5 px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] transition-colors cursor-pointer ${
                hasUnsavedChanges && saveStatus !== "saving" && currentPage !== "inquiries"
                  ? "bg-[var(--color-primary)] text-dark-text hover:bg-[var(--color-primary-hover)]"
                  : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
              }`}
              title="Değişiklikleri yayına al"
            >
              {saveStatus === "saving" ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Save size={12} />
              )}
              <span>Kaydet & Yayınla</span>
            </button>

            <div className="h-6 w-[1px] bg-neutral-800" />

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              type="button"
              className="flex items-center justify-center p-2 text-neutral-400 hover:text-dark-text transition-colors cursor-pointer"
              title="Çıkış Yap"
            >
              {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
            </button>
          </div>
        </div>
      </div>

      {showUnsavedModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-dark-bg/60 backdrop-blur-sm select-none">
          <div className="w-[min(450px,calc(100vw-32px))] bg-dark-bg border border-neutral-800 p-8 shadow-2xl flex flex-col gap-6 text-dark-text">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold uppercase tracking-wider text-[var(--color-primary)]">
                Kaydedilmemiş değişiklikler var
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-mono">
                Sayfa değiştirirseniz yayınlanmamış taslak değişiklikleriniz korunur ancak önce kaydetmeniz önerilir.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 font-mono text-[9px] font-bold uppercase tracking-widest pt-2 border-t border-neutral-900">
              <button
                type="button"
                onClick={closeUnsavedModal}
                disabled={modalAction !== null}
                className="px-5 py-2.5 bg-transparent border border-neutral-800 text-neutral-400 hover:text-dark-text hover:border-neutral-700 transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-60"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleDiscardAndNavigate}
                disabled={modalAction !== null}
                className="px-5 py-2.5 bg-transparent border border-[var(--color-primary)]/30 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-60"
              >
                {modalAction === "discard" ? "Geçiliyor..." : "Vazgeç ve Geç"}
              </button>
              <button
                type="button"
                onClick={handleSaveAndNavigate}
                disabled={modalAction !== null}
                className="px-5 py-2.5 bg-[var(--color-primary)] text-dark-text hover:bg-[var(--color-primary-hover)] transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-70"
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
