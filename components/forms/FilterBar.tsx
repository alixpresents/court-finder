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
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-lg border border-border bg-surface-hover py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent/50"
        />
      </div>
      {filters.map((filter) => (
        <select
          key={filter.id}
          value={filter.value}
          onChange={(e) => onFilterChange(filter.id, e.target.value)}
          className="rounded-lg border border-border bg-surface-hover px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent/50"
        >
          <option value="">{filter.label}</option>
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}
