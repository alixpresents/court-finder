'use client';

import { useState, useMemo } from 'react';
import { Plus, Check, ExternalLink } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { useSubmissions } from '@/context/SubmissionsContext';
import { useAdmin } from '@/context/AdminContext';
import { GENRES } from '@/data/genres';
import { matchAide } from '@/lib/matching';
import { filterAides, type AideFilters } from '@/lib/filters';
import { AIDE_TYPE_LABELS, GENRE_LABELS } from '@/lib/constants';
import { formatShortDate, daysUntil } from '@/lib/dates';
import FilterBar from '@/components/forms/FilterBar';
import AideCard from '@/components/cards/AideCard';
import SlidePanel from '@/components/ui/SlidePanel';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import DeadlineBadge from '@/components/ui/DeadlineBadge';
import MatchScore from '@/components/ui/MatchScore';
import type { Aide } from '@/lib/types';

export default function AidesPage() {
  const { activeProject } = useProject();
  const { submissions, addSubmission } = useSubmissions();
  const { mergedAides: aides } = useAdmin();
  const [filters, setFilters] = useState<AideFilters>({ search: '', type: '', genre: '' });
  const [selectedAide, setSelectedAide] = useState<Aide | null>(null);

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

  const selectedMatch = selectedAide && activeProject ? matchAide(activeProject, selectedAide) : undefined;
  const isTracked = selectedAide ? submissions.some((s) => s.targetId === selectedAide.id) : false;

  function handleTrack() {
    if (!activeProject || !selectedAide || isTracked) return;
    addSubmission({
      projectId: activeProject.id,
      targetId: selectedAide.id,
      targetType: 'aide',
      targetNom: selectedAide.nom,
      status: 'brouillon',
      deadline: selectedAide.deadline,
      notes: '',
    });
  }

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

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((aide) => (
          <AideCard
            key={aide.id}
            aide={aide}
            match={activeProject ? matchAide(activeProject, aide) : undefined}
            onClick={() => setSelectedAide(aide)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-text-tertiary py-12">
          Aucune aide ne correspond à vos critères.
        </p>
      )}

      {/* Slide panel detail */}
      <SlidePanel
        open={!!selectedAide}
        onClose={() => setSelectedAide(null)}
        title={selectedAide?.nom ?? ''}
        footer={
          selectedAide && activeProject ? (
            <div className="flex gap-3">
              {isTracked ? (
                <Button variant="secondary" icon={Check} disabled className="flex-1">Soumission suivie</Button>
              ) : (
                <Button icon={Plus} onClick={handleTrack} className="flex-1">Suivre cette soumission</Button>
              )}
              <a href={selectedAide.lienOfficiel} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" icon={ExternalLink}>Site</Button>
              </a>
            </div>
          ) : undefined
        }
      >
        {selectedAide && (
          <div className="space-y-5">
            {/* Match score */}
            {selectedMatch && (
              <div className="flex items-center gap-3">
                <MatchScore score={selectedMatch.score} />
                <span className="text-sm text-text-secondary">Compatibilité avec votre projet</span>
              </div>
            )}

            {/* Meta */}
            <div className="space-y-2">
              <p className="text-xs text-text-secondary">{selectedAide.organisme}</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-accent/10 text-accent">
                  {selectedAide.montantMax > 0
                    ? `${(selectedAide.montantMin / 1000).toFixed(0)}k – ${(selectedAide.montantMax / 1000).toFixed(0)}k €`
                    : 'Résidence'}
                </Badge>
                {daysUntil(selectedAide.deadline) >= 0 && (
                  <DeadlineBadge days={daysUntil(selectedAide.deadline)} />
                )}
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{selectedAide.description}</p>
            </div>

            {/* Eligibility */}
            {activeProject && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-2">Éligibilité</h4>
                <div className="space-y-1.5">
                  {[
                    { label: 'Genre', met: selectedAide.genres.includes(activeProject.genre), detail: GENRE_LABELS[activeProject.genre] },
                    { label: 'Étape', met: selectedAide.etapes.includes(activeProject.etape) },
                    { label: 'Profil', met: selectedAide.profils.includes(activeProject.profilRealisateur) },
                    { label: 'Durée', met: !selectedAide.dureeMax || activeProject.dureeMinutes <= selectedAide.dureeMax },
                  ].map((c) => (
                    <div key={c.label} className="flex items-center gap-2 text-sm">
                      <span className={c.met ? 'text-accent' : 'text-red-400'}>{c.met ? '✓' : '✗'}</span>
                      <span className="text-text-primary">{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-2">Documents requis</h4>
              <ul className="space-y-1">
                {selectedAide.documents.map((d, i) => (
                  <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                    <span className="text-text-tertiary mt-1">·</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips */}
            {selectedAide.proTips.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-2">Conseils</h4>
                <ul className="space-y-1">
                  {selectedAide.proTips.map((t, i) => (
                    <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                      <span className="text-accent mt-0.5">→</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Deadline */}
            <div className="pt-3 border-t border-border text-sm text-text-secondary">
              Deadline : <span className="font-mono text-text-primary">{formatShortDate(selectedAide.deadline)}</span>
              {selectedAide.session && <> — Session : {selectedAide.session}</>}
            </div>
          </div>
        )}
      </SlidePanel>
    </div>
  );
}
