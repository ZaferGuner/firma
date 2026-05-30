"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PressItem } from "@/data/press";
import { PressCard } from "./PressCard";
import { PressFilters } from "./PressFilters";

interface PressGridProps {
  items: PressItem[];
}

export function PressGrid({ items }: PressGridProps) {
  const [activeFilter, setActiveFilter] = useState("Tümü");

  const filteredItems = items.filter((item) =>
    activeFilter === "Tümü" ? true : item.type === activeFilter
  );

  return (
    <section className="py-24 bg-site-bg border-t border-site-border">
      <div className="container mx-auto px-6 lg:px-12 xl:px-20">
        <PressFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <PressCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="py-20 text-center text-site-muted text-sm">
            Bu kategoride içerik bulunamadı.
          </div>
        )}
      </div>
    </section>
  );
}
