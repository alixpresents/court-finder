'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { Plus, Check } from 'lucide-react';
import { festivals } from '@/data/festivals';
import { useProject } from '@/context/ProjectContext';
import { useSubmissions } from '@/context/SubmissionsContext';
import { matchFestival } from '@/lib/matching';
import { FESTIVAL_CATEGORIE_LABELS, GENRE_LABELS } from '@/lib/constants';
import DetailHeader from '@/components/detail/DetailHeader';
import EligibilitySection from '@/components/detail/EligibilitySection';
import DocumentsList from '@/components/detail/DocumentsList';
import ProTips from '@/components/detail/ProTips';
import TimelineInfo from '@/components/detail/TimelineInfo';
import Button from '@/components/ui/Button';

export default function FestivalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const foundFestival = festivals.find((f) => f.id === id);
  if (!foundFestival) return notFound();
  const festival = foundFestival;

  const { activeProject } = useProject();
  const { submissions, addSubmission } = useSubmissions();

  const match = activeProject ? matchFestival(activeProject, festival) : undefined;
  const alreadyTracked = submissions.some((s) => s.targetId === festival.id);

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
      label: festival.premiereRequise ? 'Première mondiale requise' : 'Pas de première requise',
      met: !festival.premiereRequise,
      detail: festival.premiereRequise ? 'Ce festival exige une première mondiale ou internationale' : undefined,
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
          ...(festival.premiereRequise ? [{ label: 'Première requise', className: 'bg-purple-500/15 text-purple-400' }] : []),
          ...(festival.fraisInscription ? [{ label: 'Frais d\'inscription', className: 'bg-amber-500/15 text-amber-400' }] : []),
        ]}
        match={match}
        lienOfficiel={festival.lienOfficiel}
      />

      <p className="text-sm text-text-secondary mb-6 max-w-3xl">{festival.description}</p>

      {activeProject && (
        <div className="mb-6">
          {alreadyTracked ? (
            <Button variant="secondary" icon={Check} disabled>Soumission suivie</Button>
          ) : (
            <Button icon={Plus} onClick={handleTrack}>Suivre cette soumission</Button>
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
          ]}
        />
        <DocumentsList documents={festival.documents} />
        <ProTips tips={festival.proTips} />
      </div>
    </div>
  );
}
