'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Award, Trophy, Calendar, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Card from '@/components/ui/Card';
import { useProject } from '@/context/ProjectContext';
import { aides } from '@/data/aides';
import { festivals } from '@/data/festivals';
import { matchAide, matchFestival } from '@/lib/matching';
import { daysUntil } from '@/lib/dates';

interface ActionItem {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  borderColor: string;
}

export default function ActionCards() {
  const { activeProject } = useProject();

  const actions = useMemo<ActionItem[]>(() => {
    if (!activeProject) return [];
    const items: ActionItem[] = [];

    // Urgent deadlines
    const urgentCount = [...aides, ...festivals].filter((item) => {
      const d = daysUntil(item.deadline);
      return d >= 0 && d <= 7;
    }).length;
    if (urgentCount > 0) {
      items.push({
        icon: Calendar,
        title: `${urgentCount} deadline${urgentCount > 1 ? 's' : ''} cette semaine`,
        description: 'Ne manquez pas ces opportunités imminentes',
        href: '/calendrier',
        borderColor: 'border-l-red-500',
      });
    }

    // Eligible aides
    const eligibleAides = aides.filter((a) => matchAide(activeProject, a).score >= 50);
    if (eligibleAides.length > 0) {
      items.push({
        icon: Award,
        title: `${eligibleAides.length} aide${eligibleAides.length > 1 ? 's' : ''} éligible${eligibleAides.length > 1 ? 's' : ''}`,
        description: 'Explorez les financements adaptés à votre projet',
        href: '/aides',
        borderColor: 'border-l-accent',
      });
    }

    // Eligible festivals
    const eligibleFestivals = festivals.filter((f) => matchFestival(activeProject, f).score >= 50);
    if (eligibleFestivals.length > 0) {
      items.push({
        icon: Trophy,
        title: `${eligibleFestivals.length} festival${eligibleFestivals.length > 1 ? 's' : ''} compatible${eligibleFestivals.length > 1 ? 's' : ''}`,
        description: 'Découvrez où soumettre votre film',
        href: '/festivals',
        borderColor: 'border-l-festival',
      });
    }

    return items.slice(0, 3);
  }, [activeProject]);

  if (actions.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {actions.map((action, i) => (
        <Link key={i} href={action.href}>
          <Card hover className={`p-4 border-l-[3px] ${action.borderColor}`}>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-hover">
                <action.icon size={18} className="text-text-secondary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary">{action.title}</p>
                <p className="mt-0.5 text-xs text-text-secondary line-clamp-1">{action.description}</p>
              </div>
              <ArrowRight size={14} className="shrink-0 mt-1 text-text-tertiary" />
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
