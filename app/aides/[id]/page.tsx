'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { Plus, Check } from 'lucide-react';
import { aides } from '@/data/aides';
import { useProject } from '@/context/ProjectContext';
import { useSubmissions } from '@/context/SubmissionsContext';
import { matchAide } from '@/lib/matching';
import { AIDE_TYPE_LABELS, AIDE_TYPE_COLORS, GENRE_LABELS } from '@/lib/constants';
import DetailHeader from '@/components/detail/DetailHeader';
import EligibilitySection from '@/components/detail/EligibilitySection';
import DocumentsList from '@/components/detail/DocumentsList';
import ProTips from '@/components/detail/ProTips';
import TimelineInfo from '@/components/detail/TimelineInfo';
import Button from '@/components/ui/Button';

export default function AideDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const foundAide = aides.find((a) => a.id === id);
  if (!foundAide) return notFound();
  const aide = foundAide;

  const { activeProject } = useProject();
  const { submissions, addSubmission } = useSubmissions();

  const match = activeProject ? matchAide(activeProject, aide) : undefined;
  const alreadyTracked = submissions.some((s) => s.targetId === aide.id);

  function handleTrack() {
    if (!activeProject || alreadyTracked) return;
    addSubmission({
      projectId: activeProject.id,
      targetId: aide.id,
      targetType: 'aide',
      targetNom: aide.nom,
      status: 'brouillon',
      deadline: aide.deadline,
      notes: '',
    });
  }

  const criteria = activeProject ? [
    {
      label: `Genre : ${GENRE_LABELS[activeProject.genre]}`,
      met: aide.genres.includes(activeProject.genre),
      detail: `Genres acceptés : ${aide.genres.map((g) => GENRE_LABELS[g]).join(', ')}`,
    },
    {
      label: `Étape : ${activeProject.etape}`,
      met: aide.etapes.includes(activeProject.etape),
    },
    {
      label: `Profil : ${activeProject.profilRealisateur}`,
      met: aide.profils.includes(activeProject.profilRealisateur),
    },
    {
      label: `Durée : ${activeProject.dureeMinutes} min`,
      met: !aide.dureeMax || activeProject.dureeMinutes <= aide.dureeMax,
      detail: aide.dureeMax ? `Max ${aide.dureeMax} min` : undefined,
    },
    {
      label: `Région : ${activeProject.region}`,
      met: !aide.regions || aide.regions.length === 0 || aide.regions.includes(activeProject.region),
      detail: aide.regions?.length ? `Régions : ${aide.regions.join(', ')}` : 'Toutes régions',
    },
  ] : [];

  const montant = `${aide.montantMin.toLocaleString('fr-FR')} – ${aide.montantMax.toLocaleString('fr-FR')} €`;

  return (
    <div>
      <DetailHeader
        backHref="/aides"
        backLabel="Retour aux aides"
        title={aide.nom}
        subtitle={aide.organisme}
        badges={[
          { label: AIDE_TYPE_LABELS[aide.type], className: AIDE_TYPE_COLORS[aide.type] },
          { label: montant, className: 'bg-accent/10 text-accent' },
        ]}
        match={match}
        lienOfficiel={aide.lienOfficiel}
      />

      <p className="text-sm text-text-secondary mb-6 max-w-3xl">{aide.description}</p>

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
          deadline={aide.deadline}
          extraInfo={[
            { label: 'Montant', value: montant },
            ...(aide.dureeMax ? [{ label: 'Durée max', value: `${aide.dureeMax} min` }] : []),
          ]}
        />
        <DocumentsList documents={aide.documents} />
        <ProTips tips={aide.proTips} />
      </div>
    </div>
  );
}
