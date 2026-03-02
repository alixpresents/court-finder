'use client';

import { useState, useMemo } from 'react';
import { useProject } from '@/context/ProjectContext';
import { aides } from '@/data/aides';
import { GENRES } from '@/data/genres';
import { matchAide } from '@/lib/matching';
import { filterAides, type AideFilters } from '@/lib/filters';
import { AIDE_TYPE_LABELS } from '@/lib/constants';
import FilterBar from '@/components/forms/FilterBar';
import AideCard from '@/components/cards/AideCard';

export default function AidesPage() {
  const { activeProject } = useProject();
  const [filters, setFilters] = useState<AideFilters>({ search: '', type: '', genre: '' });

  const filtered = useMemo(() => {
    let list = filterAides(aides, filters);
    if (activeProject) {
      list = list
        .map((a) => ({ aide: a, match: matchAide(activeProject, a) }))
        .sort((a, b) => b.match.score - a.match.score)
        .map(({ aide }) => aide);
    }
    return list;
  }, [filters, activeProject]);

  const typeOptions = Object.entries(AIDE_TYPE_LABELS).map(([value, label]) => ({ value, label }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-bold text-text-primary">Aides au financement</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {aides.length} aides disponibles{activeProject ? ' — triées par compatibilité avec votre projet' : ''}.
        </p>
      </div>

      <FilterBar
        search={filters.search}
        onSearchChange={(v) => setFilters((f) => ({ ...f, search: v }))}
        searchPlaceholder="Rechercher une aide..."
        filters={[
          { id: 'type', label: 'Tous les types', options: typeOptions, value: filters.type },
          { id: 'genre', label: 'Tous les genres', options: GENRES, value: filters.genre },
        ]}
        onFilterChange={(id, v) => setFilters((f) => ({ ...f, [id]: v }))}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((aide) => (
          <AideCard
            key={aide.id}
            aide={aide}
            match={activeProject ? matchAide(activeProject, aide) : undefined}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-text-muted py-12">
          Aucune aide ne correspond à vos critères.
        </p>
      )}
    </div>
  );
}
