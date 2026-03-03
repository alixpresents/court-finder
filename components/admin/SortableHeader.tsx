'use client';

import { ChevronUp, ChevronDown } from 'lucide-react';

interface SortableHeaderProps {
  label: string;
  field: string;
  sortField: string;
  sortDir: 'asc' | 'desc';
  onSort: (field: string) => void;
  className?: string;
}

export default function SortableHeader({ label, field, sortField, sortDir, onSort, className = '' }: SortableHeaderProps) {
  const isActive = sortField === field;

  return (
    <th
      className={`px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary cursor-pointer select-none hover:text-text-secondary transition-colors ${className}`}
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive ? (
          sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />
        ) : (
          <ChevronDown size={13} className="opacity-0 group-hover:opacity-30" />
        )}
      </span>
    </th>
  );
}
