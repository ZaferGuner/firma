"use client";

const filterOptions = [
  "Tümü",
  "Haber",
  "Duyuru",
  "Röportaj",
  "Proje Tanıtımı",
];

interface PressFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function PressFilters({ activeFilter, onFilterChange }: PressFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-12">
      {filterOptions.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`px-5 py-2.5 rounded-none text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
            activeFilter === filter
              ? "bg-site-primary text-white border border-site-primary"
              : "bg-site-surface text-site-label border border-site-border hover:border-site-primary hover:text-site-text"
          }`}
          type="button"
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
