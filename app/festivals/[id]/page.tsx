'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { Plus, Check, AlertTriangle } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { useSubmissions } from '@/context/SubmissionsContext';
import { useAdmin } from '@/context/AdminContext';
import { matchFestival } from '@/lib/matching';
import { detectPremiereConflicts } from '@/lib/premieres';
import { FESTIVAL_CATEGORIE_LABELS, GENRE_LABELS, PREMIERE_TYPE_LABELS, PREMIERE_TYPE_COLORS } from '@/lib/constants';
import DetailHeader from '@/components/detail/DetailHeader';
import EligibilitySection from '@/components/detail/EligibilitySection';
import DocumentsList from '@/components/detail/DocumentsList';
import ProTips from '@/components/detail/ProTips';
import TimelineInfo from '@/components/detail/TimelineInfo';
import Button from '@/components/ui/Button';

export default function FestivalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { activeProject } = useProject();
  const { submissions, addSubmission } = useSubmissions();
  const { mergedFestivals } = useAdmin();

  const foundFestival = mergedFestivals.find((f) => f.id === id);
  if (!foundFestival) return notFound();
  const festival = foundFestival;

  const match = activeProject ? matchFestival(activeProject, festival) : undefined;
  const alreadyTracked = submissions.some((s) => s.targetId === festival.id);
  const conflicts = detectPremiereConflicts(festival.id, submissions);

  function handleTrack() {
    if (!activeProject || alreadyTracked) return;
    addSubmission({
      projectId: activeProject.id,
      targetId: festival.id,
      targetType: 'festival',
      targetNom: festival.nom,
      status: 'brouillon',
      deadline: festival.deadline,
      notes: '',
    });
  }

  const premiereMet = festival.premiereType === 'aucune';

  const criteria = activeProject ? [
    {
      label: `Genre : ${GENRE_LABELS[activeProject.genre]}`,
      met: festival.genres.includes(activeProject.genre),
      detail: `Genres acceptés : ${festival.genres.map((g) => GENRE_LABELS[g]).join(', ')}`,
    },
    {
      label: `Film terminé ou en production`,
      met: activeProject.etape === 'postproduction' || activeProject.etape === 'production',
      detail: 'Les festivals requièrent un film finalisé',
    },
    {
      label: `Durée : ${activeProject.dureeMinutes} min`,
      met: !festival.dureeMax || activeProject.dureeMinutes <= festival.dureeMax,
      detail: festival.dureeMax ? `Max ${festival.dureeMax} min` : undefined,
    },
    {
      label: festival.premiereType !== 'aucune'
        ? PREMIERE_TYPE_LABELS[festival.premiereType]
        : 'Pas de première requise',
      met: premiereMet,
      detail: festival.premiereType !== 'aucune'
        ? `Ce festival exige une ${PREMIERE_TYPE_LABELS[festival.premiereType].toLowerCase()}`
        : undefined,
    },
  ] : [];

  return (
    <div>
      <DetailHeader
        backHref="/festivals"
        backLabel="Retour aux festivals"
        title={festival.nom}
        subtitle={`${festival.ville}, ${festival.pays}`}
        badges={[
          { label: FESTIVAL_CATEGORIE_LABELS[festival.categorie], className: 'bg-festival/10 text-festival' },
          ...(festival.oscarQualifying ? [{ label: 'Oscar Qualifying 🏆', className: 'bg-amber-500/15 text-amber-300' }] : []),
          ...(festival.premiereType !== 'aucune' ? [{ label: PREMIERE_TYPE_LABELS[festival.premiereType], className: PREMIERE_TYPE_COLORS[festival.premiereType] }] : []),
          ...(festival.fraisInscription ? [{ label: festival.fraisMontant ? `Frais : ${festival.fraisMontant} $` : 'Frais d\'inscription', className: 'bg-amber-500/15 text-amber-400' }] : []),
          ...(festival.nbFilmsSoumis != null && festival.nbFilmsSelectionnes != null ? [{ label: `${festival.nbFilmsSelectionnes}/${festival.nbFilmsSoumis.toLocaleString('fr-FR')} sélectionnés`, className: 'bg-white/5 text-text-muted' }] : []),
        ]}
        match={match}
        lienOfficiel={festival.lienOfficiel}
      />

      <p className="text-sm text-text-secondary mb-6 max-w-3xl">{festival.description}</p>

      {festival.oscarQualifying && festival.qualifyingCategories && (
        <div className="mb-6 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <p className="text-sm font-medium text-amber-300 mb-1">🏆 Ce festival qualifie pour les Oscars</p>
          <p className="text-sm text-amber-300/80">
            Catégories : {festival.qualifyingCategories.join(', ')}
          </p>
        </div>
      )}

      {activeProject && (
        <div className="mb-6 space-y-3">
          <div>
            {alreadyTracked ? (
              <Button variant="secondary" icon={Check} disabled>Soumission suivie</Button>
            ) : (
              <Button icon={Plus} onClick={handleTrack}>Suivre cette soumission</Button>
            )}
          </div>
          {conflicts.length > 0 && (
            <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-red-400">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Conflit de première</p>
                <ul className="list-disc list-inside space-y-0.5 text-red-400/80">
                  {conflicts.map((c) => (
                    <li key={c.festivalId}>{c.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {activeProject && <EligibilitySection criteria={criteria} match={match} />}
        <TimelineInfo
          deadline={festival.deadline}
          dateEvent={festival.dateEvent}
          extraInfo={[
            ...(festival.dureeMax ? [{ label: 'Durée max', value: `${festival.dureeMax} min` }] : []),
            ...(festival.deadlineOuverture ? [{ label: 'Ouverture soumissions', value: festival.deadlineOuverture }] : []),
            ...(festival.nbFilmsSoumis != null ? [{ label: 'Films soumis', value: festival.nbFilmsSoumis.toLocaleString('fr-FR') }] : []),
            ...(festival.nbFilmsSelectionnes != null ? [{ label: 'Films sélectionnés', value: `${festival.nbFilmsSelectionnes}` }] : []),
            ...(festival.fraisMontant ? [{ label: 'Frais d\'inscription', value: `${festival.fraisMontant} $` }] : []),
          ]}
        />
        <DocumentsList documents={festival.documents} />
        <ProTips tips={festival.proTips} />
      </div>
    </div>
  );
}
