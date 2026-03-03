'use client';

import { Search } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface Filter {
  id: string;
  label: string;
  options: FilterOption[];
  value: string;
}

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters: Filter[];
  onFilterChange: (filterId: string, value: string) => void;
}

export default function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder = 'Rechercher...',
  filters,
  onFilterChange,
}: FilterBarProps) {
  return (
    <div className="space-y-3">
      {/* Filter pills */}
      {filters.map((filter) => (
        <div key={filter.id} className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onFilterChange(filter.id, '')}
            className={`rounded px-3 py-1.5 text-xs font-medium border transition-colors ${
              filter.value === ''
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border bg-surface text-text-secondary hover:text-text-primary hover:border-border-hover'
            }`}
          >
            {filter.label}
          </button>
          {filter.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onFilterChange(filter.id, filter.value === opt.value ? '' : opt.value)}
              className={`rounded px-3 py-1.5 text-xs font-medium border transition-colors ${
                filter.value === opt.value
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-surface text-text-secondary hover:text-text-primary hover:border-border-hover'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      ))}

      {/* Search */}
      <div className="relative max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-colors focus:border-border-focus focus:ring-1 focus:ring-accent/25"
        />
      </div>
    </div>
  );
}
