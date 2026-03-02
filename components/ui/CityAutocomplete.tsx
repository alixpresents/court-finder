'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface Commune {
  nom: string;
  codeDepartement: string;
  codeRegion: string;
}

interface CityAutocompleteProps {
  label: string;
  id: string;
  value: string;
  onSelect: (city: string, codeRegion: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export default function CityAutocomplete({
  label,
  id,
  value,
  onSelect,
  onClear,
  placeholder = 'Rechercher une commune…',
}: CityAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Commune[]>([]);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Sync external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(q)}&fields=nom,codeDepartement,codeRegion&boost=population&limit=5`
      );
      if (res.ok) {
        const data: Commune[] = await res.json();
        setSuggestions(data);
        setOpen(true);
        setHighlightIndex(-1);
      }
    } catch {
      setSuggestions([]);
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setQuery(v);
    if (!v.trim()) {
      onClear();
      setSuggestions([]);
      setOpen(false);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(v), 300);
  }

  function handleSelect(commune: Commune) {
    setQuery(commune.nom);
    setSuggestions([]);
    setOpen(false);
    onSelect(commune.nom, commune.codeRegion);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[highlightIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={wrapperRef} className="relative flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text-secondary">
        {label}
      </label>
      <input
        id={id}
        type="text"
        autoComplete="off"
        className="rounded-lg border border-border bg-surface-hover px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/25"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 z-50 mt-1 max-h-48 overflow-auto rounded-lg border border-border bg-surface shadow-lg">
          {suggestions.map((c, i) => (
            <li
              key={`${c.nom}-${c.codeDepartement}`}
              className={`cursor-pointer px-3 py-2 text-sm ${
                i === highlightIndex
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-primary hover:bg-surface-hover'
              }`}
              onMouseDown={() => handleSelect(c)}
              onMouseEnter={() => setHighlightIndex(i)}
            >
              {c.nom}{' '}
              <span className="text-text-muted">({c.codeDepartement})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
