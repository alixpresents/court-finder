'use client';

import { useState, useMemo } from 'react';
import { useProject } from '@/context/ProjectContext';
import { useSubmissions } from '@/context/SubmissionsContext';
import { festivals } from '@/data/festivals';
import { GENRES } from '@/data/genres';
import { matchFestival } from '@/lib/matching';
import { getAllPremiereConflicts } from '@/lib/premieres';
import { filterFestivals, type FestivalFilters } from '@/lib/filters';
import FilterBar from '@/components/forms/FilterBar';
import FestivalCard from '@/components/cards/FestivalCard';
import PremiereTimeline from '@/components/festivals/PremiereTimeline';

const PAYS_OPTIONS = [...new Set(festivals.map((f) => f.pays))].sort().map((p) => ({ value: p, label: p }));

export default function FestivalsPage() {
  const { activeProject } = useProject();
  const { submissions } = useSubmissions();
  const [filters, setFilters] = useState<FestivalFilters>({ search: '', genre: '', pays: '', oscarOnly: false });

  const conflictMap = useMemo(() => getAllPremiereConflicts(submissions), [submissions]);
  const hasTrackedFestivals = submissions.some((s) => s.targetType === 'festival');

  const filtered = useMemo(() => {
    let list = filterFestivals(festivals, filters);
    if (activeProject) {
      list = list
        .map((f) => ({ festival: f, match: matchFestival(activeProject, f) }))
        .sort((a, b) => b.match.score - a.match.score)
        .map(({ festival }) => festival);
    }
    return list;
  }, [filters, activeProject]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-bold text-text-primary">Festivals</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {festivals.length} festivals{activeProject ? ' — triés par compatibilité avec votre projet' : ''}.
        </p>
      </div>

      <FilterBar
        search={filters.search}
        onSearchChange={(v) => setFilters((f) => ({ ...f, search: v }))}
        searchPlaceholder="Rechercher un festival..."
        filters={[
          { id: 'genre', label: 'Tous les genres', options: GENRES, value: filters.genre },
          { id: 'pays', label: 'Tous les pays', options: PAYS_OPTIONS, value: filters.pays },
        ]}
        onFilterChange={(id, v) => setFilters((f) => ({ ...f, [id]: v }))}
      />

      <div className="flex items-center gap-3">
        <button
          onClick={() => setFilters((f) => ({ ...f, oscarOnly: !f.oscarOnly }))}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
            filters.oscarOnly
              ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
              : 'border-border bg-surface-hover text-text-secondary hover:text-text-primary'
          }`}
        >
          🏆 Oscar Qualifying{filters.oscarOnly ? ' uniquement' : ''}
        </button>
      </div>

      {hasTrackedFestivals && <PremiereTimeline submissions={submissions} />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((festival) => (
          <FestivalCard
            key={festival.id}
            festival={festival}
            match={activeProject ? matchFestival(activeProject, festival) : undefined}
            hasConflict={conflictMap.has(festival.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-text-muted py-12">
          Aucun festival ne correspond à vos critères.
        </p>
      )}
    </div>
  );
}
