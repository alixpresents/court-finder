'use client';

import { useState } from 'react';
import { Award, Trophy, Calendar, ClipboardList, Film, Star } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { usePlan } from '@/context/PlanContext';
import { useSubmissions } from '@/context/SubmissionsContext';
import EmptyState from '@/components/ui/EmptyState';
import StatsRow from '@/components/dashboard/StatsRow';
import ProjectSummaryCard from '@/components/dashboard/ProjectSummaryCard';
import ProjectProgress from '@/components/dashboard/ProjectProgress';
import UpcomingDeadlines from '@/components/dashboard/UpcomingDeadlines';
import RecentMatches from '@/components/dashboard/RecentMatches';
import UpgradeModal from '@/components/upgrade/UpgradeModal';
import { aides } from '@/data/aides';
import { festivals } from '@/data/festivals';
import { matchAide, matchFestival } from '@/lib/matching';
import { daysUntil } from '@/lib/dates';

export default function DashboardPage() {
  const { activeProject, projects, isHydrated } = useProject();
  const { isPro } = usePlan();
  const { submissions } = useSubmissions();
  const [showUpgrade, setShowUpgrade] = useState(false);

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
  const oscarFestivals = festivals.filter((f) => f.oscarQualifying && matchFestival(activeProject, f).score >= 50).length;

  const allDeadlineDays = [
    ...aides.map((a) => daysUntil(a.deadline)),
    ...festivals.map((f) => daysUntil(f.deadline)),
  ].filter((d) => d >= 0);
  const nextDeadlineDays = allDeadlineDays.length > 0 ? Math.min(...allDeadlineDays) : null;

  const activeSubmissions = submissions
    .filter((s) => s.projectId === activeProject.id && s.status !== 'refusee' && s.status !== 'acceptee')
    .length;

  const stats = [
    { label: 'Aides éligibles', value: eligibleAides, icon: Award, color: 'bg-accent/10 text-accent' },
    { label: 'Festivals compatibles', value: eligibleFestivals, icon: Trophy, color: 'bg-festival/10 text-festival' },
    { label: 'Oscar Qualifying', value: oscarFestivals, icon: Star, color: 'bg-amber-500/10 text-amber-400' },
    {
      label: 'Prochaine deadline',
      value: nextDeadlineDays != null ? `${nextDeadlineDays}j` : '—',
      icon: Calendar,
      color: nextDeadlineDays != null && nextDeadlineDays <= 7
        ? 'bg-red-500/10 text-red-400'
        : nextDeadlineDays != null && nextDeadlineDays <= 30
          ? 'bg-amber-500/10 text-amber-400'
          : 'bg-blue-500/10 text-blue-400',
    },
    { label: 'Soumissions actives', value: activeSubmissions, icon: ClipboardList, color: 'bg-purple-500/10 text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="font-sans text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Vue d&apos;ensemble de votre projet et opportunités.
        </p>
      </div>

      <ProjectSummaryCard />

      {!isPro && projects.length >= 1 && (
        <div className="rounded-lg border border-border bg-surface px-4 py-3 flex items-center justify-between text-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
          <span className="text-text-secondary">
            1/1 projet —{' '}
            <button
              onClick={() => setShowUpgrade(true)}
              className="text-accent hover:underline font-medium"
            >
              Passer à Pro
            </button>
          </span>
        </div>
      )}

      <StatsRow stats={stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-6 lg:grid-cols-2">
          <UpcomingDeadlines />
          <RecentMatches />
        </div>
        <ProjectProgress />
      </div>

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}
