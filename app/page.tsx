'use client';

import { useState, useMemo } from 'react';
import { Award, Trophy, Calendar, ClipboardList, Film } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { usePlan } from '@/context/PlanContext';
import { useSubmissions } from '@/context/SubmissionsContext';
import EmptyState from '@/components/ui/EmptyState';
import StatsRow from '@/components/dashboard/StatsRow';
import ProjectTimeline from '@/components/dashboard/ProjectTimeline';
import ActionCards from '@/components/dashboard/ActionCards';
import UpcomingDeadlines from '@/components/dashboard/UpcomingDeadlines';
import UpgradeModal from '@/components/upgrade/UpgradeModal';
import { aides } from '@/data/aides';
import { festivals } from '@/data/festivals';
import { matchAide, matchFestival } from '@/lib/matching';
import { daysUntil } from '@/lib/dates';

export default function DashboardPage() {
  const { activeProject, isHydrated } = useProject();
  const { isPro } = usePlan();
  const { submissions } = useSubmissions();
  const [showUpgrade, setShowUpgrade] = useState(false);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }, []);

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

  const allDeadlineDays = [
    ...aides.map((a) => daysUntil(a.deadline)),
    ...festivals.map((f) => daysUntil(f.deadline)),
  ].filter((d) => d >= 0);
  const nextDeadlineDays = allDeadlineDays.length > 0 ? Math.min(...allDeadlineDays) : null;

  const activeSubmissions = submissions
    .filter((s) => s.projectId === activeProject.id && s.status !== 'refusee' && s.status !== 'acceptee')
    .length;

  const urgentCount = allDeadlineDays.filter((d) => d <= 7).length;

  const stats = [
    { label: 'Aides éligibles', value: eligibleAides, icon: Award, color: 'bg-accent/10 text-accent' },
    { label: 'Festivals matchés', value: eligibleFestivals, icon: Trophy, color: 'bg-festival/10 text-festival' },
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
    { label: 'Soumissions', value: activeSubmissions, icon: ClipboardList, color: 'bg-accent-purple/10 text-accent-purple' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="font-sans text-2xl font-bold text-text-primary">
          {greeting}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {urgentCount > 0
            ? `Tu as ${urgentCount} deadline${urgentCount > 1 ? 's' : ''} cette semaine`
            : 'Ton projet avance bien, continue comme ça'}
        </p>
      </div>

      {/* Timeline */}
      <ProjectTimeline />

      {/* Action cards */}
      <ActionCards />

      {/* Stats */}
      <StatsRow stats={stats} />

      {/* Deadlines */}
      <UpcomingDeadlines />

      {!isPro && (
        <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
      )}
    </div>
  );
}
