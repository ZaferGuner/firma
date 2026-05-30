"use client";

interface ProjectFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function ProjectFilters({ activeFilter, onFilterChange }: ProjectFiltersProps) {
  const filterList = [
    "Tümü",
    "Villa Projeleri",
    "Konut Projeleri",
    "Devam Eden",
    "Tamamlanan",
  ];

  return (
    <section className="px-6 md:px-12 py-8 bg-[#f4f2ed]">
      <div className="max-w-7xl mx-auto border-b border-[rgba(0,0,0,0.08)] pb-4">
        {/* Scrollable Container for Mobile */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pb-2 -mb-2">
          {filterList.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => onFilterChange(filter)}
                className={`px-5 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-300 rounded-sm border cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[#111111] border-[#111111] text-white"
                    : "bg-[#f8f7f3] border-[rgba(0,0,0,0.12)] text-[rgba(0,0,0,0.6)] hover:bg-[#f0eee9] hover:border-[rgba(0,0,0,0.25)] hover:text-[#111111]"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
