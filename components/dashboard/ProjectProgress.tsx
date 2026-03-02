'use client';

import { useMemo } from 'react';
import Card from '@/components/ui/Card';
import { useProject } from '@/context/ProjectContext';
import { useSubmissions } from '@/context/SubmissionsContext';
import { aides } from '@/data/aides';
import { festivals } from '@/data/festivals';
import { matchAide, matchFestival } from '@/lib/matching';

function ProgressBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-secondary">{label}</span>
        <span className="text-text-muted tabular-nums">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-hover overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function ProjectProgress() {
  const { activeProject } = useProject();
  const { submissions } = useSubmissions();

  const { profileCompletion, aidesExplored, submissionsSent } = useMemo(() => {
    if (!activeProject) return { profileCompletion: 0, aidesExplored: 0, submissionsSent: 0 };

    // Profile completion: check which optional fields are filled
    const fields = [
      activeProject.titre,
      activeProject.logline,
      activeProject.genre,
      activeProject.etape,
      activeProject.dureeMinutes > 0,
      activeProject.budget > 0,
      activeProject.profilRealisateur,
      activeProject.region,
      activeProject.lieuTournage,
      activeProject.productionNom,
    ];
    const filled = fields.filter(Boolean).length;
    const profileCompletion = Math.round((filled / fields.length) * 100);

    // Aides explored: % of eligible aides that have been tracked as submissions
    const eligibleAides = aides.filter((a) => matchAide(activeProject, a).score >= 50);
    const eligibleFestivals = festivals.filter((f) => matchFestival(activeProject, f).score >= 50);
    const totalEligible = eligibleAides.length + eligibleFestivals.length;
    const projectSubs = submissions.filter((s) => s.projectId === activeProject.id);
    const aidesExplored = totalEligible > 0
      ? Math.min(100, Math.round((projectSubs.length / totalEligible) * 100))
      : 0;

    // Submissions sent: % in soumise/acceptee state
    const sent = projectSubs.filter((s) => s.status === 'soumise' || s.status === 'acceptee').length;
    const submissionsSent = projectSubs.length > 0
      ? Math.round((sent / projectSubs.length) * 100)
      : 0;

    return { profileCompletion, aidesExplored, submissionsSent };
  }, [activeProject, submissions]);

  if (!activeProject) return null;

  return (
    <Card className="p-5 animate-fade-in" style={{ animationDelay: '200ms' }}>
      <h3 className="font-sans text-sm font-semibold text-text-primary mb-4">Progression</h3>
      <div className="space-y-4">
        <ProgressBar label="Profil complété" value={profileCompletion} color="bg-accent" />
        <ProgressBar label="Opportunités suivies" value={aidesExplored} color="bg-festival" />
        <ProgressBar label="Soumissions envoyées" value={submissionsSent} color="bg-blue-400" />
      </div>
    </Card>
  );
}
