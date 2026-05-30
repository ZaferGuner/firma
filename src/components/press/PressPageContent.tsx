"use client";

import { useAdminEdit } from "@/context/AdminEditContext";
import { PressHero } from "@/components/press/PressHero";
import { PressEmptyState } from "@/components/press/PressEmptyState";
import { PressFeatured } from "@/components/press/PressFeatured";
import { PressGrid } from "@/components/press/PressGrid";
import { PressProjectsCTA } from "@/components/press/PressProjectsCTA";
import { PressFinalCTA } from "@/components/press/PressFinalCTA";
import { PressItem } from "@/data/press";

type PressPageContentProps = {
  initialData?: Record<string, any>;
  initialItems?: PressItem[];
};

export function PressPageContent({ initialData, initialItems = [] }: PressPageContentProps) {
  const adminContext = useAdminEdit();
  const isAdminEditing = !!adminContext && !adminContext.isPreviewMode;
  const items = adminContext ? adminContext.draftPressItems : initialItems;
  const sortedItems = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
  const featuredItem = sortedItems.find((item) => item.featured) || sortedItems[0];
  const gridItems = sortedItems.filter((item) => item.id !== featuredItem?.id);

  return (
    <>
      <PressHero initialData={initialData?.hero} />

      {isAdminEditing && (
        <div className="flex justify-center bg-[#FAFAFA] pt-8">
          <button
            onClick={() => adminContext.openSectionEditor("new-press-item")}
            type="button"
            className="flex items-center gap-2 bg-dark-bg text-dark-text px-8 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.24em] transition-colors hover:bg-[#C5162E] cursor-pointer shadow-lg"
          >
            + Yeni Basın İçeriği Ekle
          </button>
        </div>
      )}

      {sortedItems.length > 0 ? (
        <>
          {featuredItem && <PressFeatured item={featuredItem} />}
          <PressGrid items={gridItems} />
        </>
      ) : (
        <PressEmptyState initialData={initialData?.empty} />
      )}

      <PressProjectsCTA initialData={initialData?.projectsCta} />
      <PressFinalCTA initialData={initialData?.finalCta} />
    </>
  );
}
