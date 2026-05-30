"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type SaveStatus = "idle" | "dirty" | "saving" | "success" | "error";

type DiscardOptions = {
  skipConfirm?: boolean;
};

interface AdminEditContextType {
  isPreviewMode: boolean;
  activeSectionKey: string | null;
  draftContent: Record<string, any>;
  publishedContent: Record<string, any>;
  draftProjects: any[];
  publishedProjects: any[];
  draftPressItems: any[];
  publishedPressItems: any[];
  dirtyFields: Record<string, boolean>;
  hasUnsavedChanges: boolean;
  saveStatus: SaveStatus;
  errorMessage: string | null;
  togglePreviewMode: () => void;
  openSectionEditor: (sectionKey: string) => void;
  closeSectionEditor: () => void;
  updateDraftContent: (sectionKey: string, field: string, value: any) => void;
  updateProjectDraft: (slug: string, updatedProject: any) => void;
  updatePressDraft: (id: string, updatedPressItem: any) => void;
  addNewProject: (project: any) => Promise<void>;
  addNewPressItem: (pressItem: any) => Promise<void>;
  saveChanges: () => Promise<boolean>;
  discardChanges: (options?: DiscardOptions) => Promise<boolean>;
}

export const AdminEditContext = createContext<AdminEditContextType | undefined>(undefined);

export function useAdminEdit() {
  const context = useContext(AdminEditContext);
  return context;
}

interface AdminEditProviderProps {
  children: React.ReactNode;
  initialDrafts: Record<string, any>;
  initialPublished: Record<string, any>;
  initialProjectsDrafts?: any[];
  initialProjectsPublished?: any[];
  initialPressDrafts?: any[];
  initialPressPublished?: any[];
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function splitSectionKey(sectionKey: string) {
  const separatorIndex = sectionKey.indexOf(".");
  if (separatorIndex === -1) {
    return { pageKey: sectionKey, actualSectionKey: sectionKey };
  }

  return {
    pageKey: sectionKey.slice(0, separatorIndex),
    actualSectionKey: sectionKey.slice(separatorIndex + 1),
  };
}

export function AdminEditProvider({
  children,
  initialDrafts,
  initialPublished,
  initialProjectsDrafts = [],
  initialProjectsPublished = [],
  initialPressDrafts = [],
  initialPressPublished = [],
}: AdminEditProviderProps) {
  const router = useRouter();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeSectionKey, setActiveSectionKey] = useState<string | null>(null);

  const [draftContent, setDraftContent] = useState<Record<string, any>>(initialDrafts);
  const [publishedContent, setPublishedContent] = useState<Record<string, any>>(initialPublished);
  const [draftProjects, setDraftProjects] = useState<any[]>(initialProjectsDrafts);
  const [publishedProjects, setPublishedProjects] = useState<any[]>(initialProjectsPublished);
  const [draftPressItems, setDraftPressItems] = useState<any[]>(initialPressDrafts);
  const [publishedPressItems, setPublishedPressItems] = useState<any[]>(initialPressPublished);

  const [dirtyFields, setDirtyFields] = useState<Record<string, boolean>>({});
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const debounceTimers = useRef<Record<string, number>>({});

  const clearDebounceTimers = () => {
    Object.values(debounceTimers.current).forEach((timerId) => window.clearTimeout(timerId));
    debounceTimers.current = {};
  };

  const checkDirtyStatus = (
    currentDrafts: Record<string, any>,
    currentProjects: any[],
    currentPressItems: any[]
  ) => {
    const dirty: Record<string, boolean> = {};

    Object.keys(currentDrafts).forEach((sectionKey) => {
      const draftSection = currentDrafts[sectionKey];
      const publishedSection = publishedContent[sectionKey];

      if (JSON.stringify(draftSection ?? null) !== JSON.stringify(publishedSection ?? null)) {
        dirty[sectionKey] = true;
      }
    });

    currentProjects.forEach((draftProject) => {
      const publishedProject = publishedProjects.find((project) => project.slug === draftProject.slug);

      if (!publishedProject || JSON.stringify(draftProject) !== JSON.stringify(publishedProject)) {
        dirty[`project.${draftProject.slug}`] = true;
      }
    });

    currentPressItems.forEach((draftPressItem) => {
      const publishedPressItem = publishedPressItems.find((item) => item.id === draftPressItem.id);

      if (!publishedPressItem || JSON.stringify(draftPressItem) !== JSON.stringify(publishedPressItem)) {
        dirty[`pressItem.${draftPressItem.id}`] = true;
      }
    });

    setDirtyFields(dirty);
    setSaveStatus(Object.keys(dirty).length > 0 ? "dirty" : "idle");
  };

  useEffect(() => {
    checkDirtyStatus(draftContent, draftProjects, draftPressItems);
  }, [publishedContent, publishedProjects, publishedPressItems]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (saveStatus === "dirty") {
        event.preventDefault();
        event.returnValue = "Kaydedilmemiş değişiklikleriniz var. Sayfadan ayrılmak istediğinize emin misiniz?";
        return event.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [saveStatus]);

  const togglePreviewMode = () => {
    setIsPreviewMode((prev) => !prev);
    setActiveSectionKey(null);
  };

  const openSectionEditor = (sectionKey: string) => {
    if (isPreviewMode) return;
    setActiveSectionKey(sectionKey);
  };

  const closeSectionEditor = () => {
    setActiveSectionKey(null);
  };

  const updateDraftContent = (sectionKey: string, field: string, value: any) => {
    const updatedDraft = {
      ...draftContent,
      [sectionKey]: {
        ...(draftContent[sectionKey] || {}),
        [field]: value,
      },
    };

    setDraftContent(updatedDraft);
    checkDirtyStatus(updatedDraft, draftProjects, draftPressItems);

    if (debounceTimers.current[sectionKey]) {
      window.clearTimeout(debounceTimers.current[sectionKey]);
    }

    debounceTimers.current[sectionKey] = window.setTimeout(async () => {
      try {
        const { pageKey, actualSectionKey } = splitSectionKey(sectionKey);

        await fetch("/api/admin/draft", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pageKey,
            sectionKey: actualSectionKey,
            data: updatedDraft[sectionKey],
          }),
        });
      } catch (error) {
        console.error("Autosave draft failed:", error);
      }
    }, 300) as unknown as number;
  };

  const updateProjectDraft = (slug: string, updatedProject: any) => {
    const updatedProjects = draftProjects.map((project) =>
      project.slug === slug ? updatedProject : project
    );

    setDraftProjects(updatedProjects);
    checkDirtyStatus(draftContent, updatedProjects, draftPressItems);

    const trackingKey = `project.${slug}`;
    if (debounceTimers.current[trackingKey]) {
      window.clearTimeout(debounceTimers.current[trackingKey]);
    }

    debounceTimers.current[trackingKey] = window.setTimeout(async () => {
      try {
        await fetch("/api/admin/projects/draft", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug,
            data: updatedProject,
          }),
        });
      } catch (error) {
        console.error("Autosave project draft failed:", error);
      }
    }, 300) as unknown as number;
  };

  const updatePressDraft = (id: string, updatedPressItem: any) => {
    const updatedPressItems = draftPressItems.map((item) =>
      item.id === id ? updatedPressItem : item
    );

    setDraftPressItems(updatedPressItems);
    checkDirtyStatus(draftContent, draftProjects, updatedPressItems);

    const trackingKey = `pressItem.${id}`;
    if (debounceTimers.current[trackingKey]) {
      window.clearTimeout(debounceTimers.current[trackingKey]);
    }

    debounceTimers.current[trackingKey] = window.setTimeout(async () => {
      try {
        await fetch("/api/admin/press/draft", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            data: updatedPressItem,
          }),
        });
      } catch (error) {
        console.error("Autosave press item draft failed:", error);
      }
    }, 300) as unknown as number;
  };

  const addNewProject = async (project: any) => {
    setSaveStatus("saving");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/projects/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Proje eklenemedi.");
      }

      const localNewProject = {
        id: crypto.randomUUID(),
        ...project,
        published: project.published ?? false,
        featured: project.featured ?? false,
        order: project.order ?? (draftProjects.length + 1),
        imageCount: project.imageCount ?? 1,
        features: project.features || [],
        gallery: project.gallery || [project.coverImage || "/projects/villa-the-same/01.jpg"],
        ctaText: project.ctaText || "Yeni yaşam alanınızı birlikte planlayalım.",
        ctaBtnText: project.ctaBtnText || "Bilgi Al",
        ctaBtnLink: project.ctaBtnLink || "/iletisim",
      };

      const updatedProjects = [...draftProjects, localNewProject];
      setDraftProjects(updatedProjects);
      checkDirtyStatus(draftContent, updatedProjects, draftPressItems);
      setSaveStatus("dirty");
      setActiveSectionKey(null);
      router.refresh();
    } catch (error) {
      setSaveStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Proje eklenirken hata oluştu.");
      throw error;
    }
  };

  const addNewPressItem = async (pressItem: any) => {
    setSaveStatus("saving");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/press/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pressItem),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Basın içeriği eklenemedi.");
      }

      const updatedPressItems = [...draftPressItems, data.item];
      setDraftPressItems(updatedPressItems);
      checkDirtyStatus(draftContent, draftProjects, updatedPressItems);
      setSaveStatus("dirty");
      setActiveSectionKey(`pressItem.${data.item.id}`);
      router.refresh();
    } catch (error) {
      setSaveStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Basın içeriği eklenirken hata oluştu.");
      throw error;
    }
  };

  const flushPendingDrafts = async () => {
    clearDebounceTimers();

    await Promise.all([
      ...Object.entries(draftContent).map(([sectionKey, data]) => {
        const { pageKey, actualSectionKey } = splitSectionKey(sectionKey);
        return fetch("/api/admin/draft", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pageKey,
            sectionKey: actualSectionKey,
            data,
          }),
        });
      }),
      ...draftProjects.map((project) =>
        fetch("/api/admin/projects/draft", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug: project.slug,
            data: project,
          }),
        })
      ),
      ...draftPressItems.map((item) =>
        fetch("/api/admin/press/draft", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: item.id,
            data: item,
          }),
        })
      ),
    ]);
  };

  const saveChanges = async () => {
    setSaveStatus("saving");
    setErrorMessage(null);

    try {
      await flushPendingDrafts();

      const response = await fetch("/api/admin/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Değişiklikler kaydedilemedi.");
      }

      setPublishedContent(deepClone(draftContent));
      setPublishedProjects(deepClone(draftProjects));
      setPublishedPressItems(deepClone(draftPressItems));
      setDirtyFields({});
      setSaveStatus("success");

      window.setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);

      router.refresh();
      return true;
    } catch (error) {
      setSaveStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Beklenmedik bir hata oluştu.");
      return false;
    }
  };

  const discardChanges = async (options?: DiscardOptions) => {
    if (!options?.skipConfirm) {
      const confirmed = window.confirm(
        "Tüm kaydedilmemiş değişiklikleri geri almak istediğinize emin misiniz?"
      );

      if (!confirmed) {
        return false;
      }
    }

    clearDebounceTimers();
    setSaveStatus("saving");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/discard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Değişiklikler geri alınamadı.");
      }

      setDraftContent(deepClone(publishedContent));
      setDraftProjects(deepClone(publishedProjects));
      setDraftPressItems(deepClone(publishedPressItems));
      setDirtyFields({});
      setSaveStatus("idle");
      setActiveSectionKey(null);
      router.refresh();
      return true;
    } catch (error) {
      setSaveStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Beklenmedik bir hata oluştu.");
      return false;
    }
  };

  const hasUnsavedChanges = Object.keys(dirtyFields).length > 0;

  return (
    <AdminEditContext.Provider
      value={{
        isPreviewMode,
        activeSectionKey,
        draftContent,
        publishedContent,
        draftProjects,
        publishedProjects,
        draftPressItems,
        publishedPressItems,
        dirtyFields,
        hasUnsavedChanges,
        saveStatus,
        errorMessage,
        togglePreviewMode,
        openSectionEditor,
        closeSectionEditor,
        updateDraftContent,
        updateProjectDraft,
        updatePressDraft,
        addNewProject,
        addNewPressItem,
        saveChanges,
        discardChanges,
      }}
    >
      {children}
    </AdminEditContext.Provider>
  );
}
