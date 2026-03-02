'use client';

import { Award, Trophy, Calendar, ClipboardList } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { useSubmissions } from '@/context/SubmissionsContext';
import EmptyState from '@/components/ui/EmptyState';
import StatsRow from '@/components/dashboard/StatsRow';
import ProjectSummaryCard from '@/components/dashboard/ProjectSummaryCard';
import UpcomingDeadlines from '@/components/dashboard/UpcomingDeadlines';
import RecentMatches from '@/components/dashboard/RecentMatches';
import { aides } from '@/data/aides';
import { festivals } from '@/data/festivals';
import { matchAide, matchFestival } from '@/lib/matching';
import { daysUntil } from '@/lib/dates';
import { Film } from 'lucide-react';

export default function DashboardPage() {
  const { activeProject, isHydrated } = useProject();
  const { submissions } = useSubmissions();

  if (!isHydrated) return null;

  if (!activeProject) {
    return (
      <EmptyState
        icon={Film}
        title="Bienvenue sur Court·Finder"
        description="Commencez par décrire votre projet de court métrage pour découvrir les aides et festivals qui vous correspondent."
        actionLabel="Créer mon projet"
        actionHref="/projet/nouveau"
      />
    );
  }

  const eligibleAides = aides.filter((a) => matchAide(activeProject, a).score >= 50).length;
  const eligibleFestivals = festivals.filter((f) => matchFestival(activeProject, f).score >= 50).length;

  const allDeadlines = [
    ...aides.map((a) => a.deadline),
    ...festivals.map((f) => f.deadline),
  ].filter((d) => daysUntil(d) >= 0 && daysUntil(d) <= 30).length;

  const activeSubmissions = submissions
    .filter((s) => s.projectId === activeProject.id && s.status !== 'refusee' && s.status !== 'acceptee')
    .length;

  const stats = [
    { label: 'Aides éligibles', value: eligibleAides, icon: Award, color: 'bg-accent/10 text-accent' },
    { label: 'Festivals compatibles', value: eligibleFestivals, icon: Trophy, color: 'bg-festival/10 text-festival' },
    { label: 'Deadlines ce mois', value: allDeadlines, icon: Calendar, color: 'bg-blue-500/10 text-blue-400' },
    { label: 'Soumissions actives', value: activeSubmissions, icon: ClipboardList, color: 'bg-purple-500/10 text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Vue d&apos;ensemble de votre projet et opportunités.
        </p>
      </div>

      <ProjectSummaryCard />
      <StatsRow stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingDeadlines />
        <RecentMatches />
      </div>
    </div>
  );
}
