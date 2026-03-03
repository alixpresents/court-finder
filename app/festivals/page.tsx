'use client';

import { useState, useMemo } from 'react';
import { Plus, Check, ExternalLink, Trophy } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { useSubmissions } from '@/context/SubmissionsContext';
import { useAdmin } from '@/context/AdminContext';
import { GENRES } from '@/data/genres';
import { matchFestival } from '@/lib/matching';
import { getAllPremiereConflicts } from '@/lib/premieres';
import { filterFestivals, type FestivalFilters } from '@/lib/filters';
import { FESTIVAL_CATEGORIE_LABELS, GENRE_LABELS, PREMIERE_TYPE_LABELS } from '@/lib/constants';
import { formatShortDate, daysUntil } from '@/lib/dates';
import FilterBar from '@/components/forms/FilterBar';
import FestivalCard from '@/components/cards/FestivalCard';
import PremiereTimeline from '@/components/festivals/PremiereTimeline';
import SlidePanel from '@/components/ui/SlidePanel';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import DeadlineBadge from '@/components/ui/DeadlineBadge';
import MatchScore from '@/components/ui/MatchScore';
import type { Festival } from '@/lib/types';

export default function FestivalsPage() {
  const { activeProject } = useProject();
  const { submissions, addSubmission } = useSubmissions();
  const { mergedFestivals: festivals } = useAdmin();
  const [filters, setFilters] = useState<FestivalFilters>({ search: '', genre: '', pays: '', oscarOnly: false });

  const PAYS_OPTIONS = useMemo(
    () => [...new Set(festivals.map((f) => f.pays))].sort().map((p) => ({ value: p, label: p })),
    [festivals],
  );
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);

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

  const selectedMatch = selectedFestival && activeProject ? matchFestival(activeProject, selectedFestival) : undefined;
  const isTracked = selectedFestival ? submissions.some((s) => s.targetId === selectedFestival.id) : false;

  function handleTrack() {
    if (!activeProject || !selectedFestival || isTracked) return;
    addSubmission({
      projectId: activeProject.id,
      targetId: selectedFestival.id,
      targetType: 'festival',
      targetNom: selectedFestival.nom,
      status: 'brouillon',
      deadline: selectedFestival.deadline,
      notes: '',
    });
  }

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
          className={`inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-medium transition-colors ${
            filters.oscarOnly
              ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
              : 'border-border bg-surface text-text-secondary hover:text-text-primary hover:border-border-hover'
          }`}
        >
          <Trophy size={13} /> Oscar Qualifying{filters.oscarOnly ? ' uniquement' : ''}
        </button>
      </div>

      {hasTrackedFestivals && <PremiereTimeline submissions={submissions} />}

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((festival) => (
          <FestivalCard
            key={festival.id}
            festival={festival}
            match={activeProject ? matchFestival(activeProject, festival) : undefined}
            hasConflict={conflictMap.has(festival.id)}
            onClick={() => setSelectedFestival(festival)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-text-tertiary py-12">
          Aucun festival ne correspond à vos critères.
        </p>
      )}

      {/* Slide panel detail */}
      <SlidePanel
        open={!!selectedFestival}
        onClose={() => setSelectedFestival(null)}
        title={selectedFestival?.nom ?? ''}
        footer={
          selectedFestival && activeProject ? (
            <div className="flex gap-3">
              {isTracked ? (
                <Button variant="secondary" icon={Check} disabled className="flex-1">Soumission suivie</Button>
              ) : (
                <Button icon={Plus} onClick={handleTrack} className="flex-1">Suivre cette soumission</Button>
              )}
              <a href={selectedFestival.lienOfficiel} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" icon={ExternalLink}>Site</Button>
              </a>
            </div>
          ) : undefined
        }
      >
        {selectedFestival && (
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
              <p className="text-xs text-text-secondary">{selectedFestival.ville}, {selectedFestival.pays}</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-festival/10 text-festival">
                  {FESTIVAL_CATEGORIE_LABELS[selectedFestival.categorie]}
                </Badge>
                {selectedFestival.oscarQualifying && (
                  <Badge className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/20">
                    <Trophy size={11} className="mr-1" /> Oscar Qualifying
                  </Badge>
                )}
                {selectedFestival.premiereType !== 'aucune' && (
                  <Badge className="bg-white/5 text-text-secondary">
                    {PREMIERE_TYPE_LABELS[selectedFestival.premiereType]}
                  </Badge>
                )}
                {daysUntil(selectedFestival.deadline) >= 0 && (
                  <DeadlineBadge days={daysUntil(selectedFestival.deadline)} />
                )}
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{selectedFestival.description}</p>
            </div>

            {/* Oscar info */}
            {selectedFestival.oscarQualifying && selectedFestival.qualifyingCategories && (
              <div className="rounded-md border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                <p className="text-sm font-medium text-amber-300 mb-1">Ce festival qualifie pour les Oscars</p>
                <p className="text-xs text-amber-300/80">
                  Catégories : {selectedFestival.qualifyingCategories.join(', ')}
                </p>
              </div>
            )}

            {/* Eligibility */}
            {activeProject && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-2">Éligibilité</h4>
                <div className="space-y-1.5">
                  {[
                    { label: 'Genre', met: selectedFestival.genres.includes(activeProject.genre), detail: GENRE_LABELS[activeProject.genre] },
                    { label: 'Film finalisé', met: activeProject.etape === 'postproduction' || activeProject.etape === 'production' },
                    { label: 'Durée', met: !selectedFestival.dureeMax || activeProject.dureeMinutes <= selectedFestival.dureeMax },
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
                {selectedFestival.documents.map((d, i) => (
                  <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                    <span className="text-text-tertiary mt-1">·</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips */}
            {selectedFestival.proTips.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-2">Conseils</h4>
                <ul className="space-y-1">
                  {selectedFestival.proTips.map((t, i) => (
                    <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                      <span className="text-accent mt-0.5">→</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stats & deadline */}
            <div className="pt-3 border-t border-border space-y-1 text-sm text-text-secondary">
              <p>Deadline : <span className="font-mono text-text-primary">{formatShortDate(selectedFestival.deadline)}</span></p>
              {selectedFestival.nbFilmsSoumis != null && (
                <p>Films soumis : <span className="font-mono text-text-primary">{selectedFestival.nbFilmsSoumis.toLocaleString('fr-FR')}</span></p>
              )}
              {selectedFestival.fraisInscription && (
                <p>Frais : <span className="font-mono text-text-primary">{selectedFestival.fraisMontant ? `${selectedFestival.fraisMontant} $` : 'Oui'}</span></p>
              )}
            </div>
          </div>
        )}
      </SlidePanel>
    </div>
  );
}
