'use client';

import Link from 'next/link';
import { Award, Trophy, ArrowRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import DeadlineBadge from '@/components/ui/DeadlineBadge';
import { useAdmin } from '@/context/AdminContext';
import { formatShortDate, daysUntil } from '@/lib/dates';

interface DeadlineItem {
  id: string;
  nom: string;
  deadline: string;
  type: 'aide' | 'festival';
  href: string;
}

export default function UpcomingDeadlines() {
  const { mergedAides: aides, mergedFestivals: festivals } = useAdmin();

  const allDeadlines: DeadlineItem[] = [
    ...aides.map((a) => ({
      id: a.id,
      nom: a.nom,
      deadline: a.deadline,
      type: 'aide' as const,
      href: `/aides/${a.id}`,
    })),
    ...festivals.map((f) => ({
      id: f.id,
      nom: f.nom,
      deadline: f.deadline,
      type: 'festival' as const,
      href: `/festivals/${f.id}`,
    })),
  ]
    .filter((d) => daysUntil(d.deadline) >= 0)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  return (
    <Card className="p-5">
      <h3 className="mb-4 text-sm font-semibold text-text-primary">Prochaines deadlines</h3>
      <div className="space-y-1">
        {allDeadlines.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-2 py-2 -mx-2 hover:bg-surface-hover transition-colors"
          >
            {item.type === 'aide' ? (
              <Award size={15} className="shrink-0 text-accent" />
            ) : (
              <Trophy size={15} className="shrink-0 text-festival" />
            )}
            <span className="flex-1 min-w-0 text-sm text-text-primary truncate">{item.nom}</span>
            <Badge className={item.type === 'aide' ? 'bg-accent/10 text-accent' : 'bg-festival/10 text-festival'}>
              {item.type === 'aide' ? 'Aide' : 'Festival'}
            </Badge>
            <span className="text-xs text-text-tertiary font-mono tabular-nums">{formatShortDate(item.deadline)}</span>
            <DeadlineBadge days={daysUntil(item.deadline)} />
          </Link>
        ))}
      </div>
      <Link href="/calendrier" className="mt-4 flex items-center gap-1 text-xs text-text-secondary hover:text-accent transition-colors">
        Voir le calendrier <ArrowRight size={12} />
      </Link>
    </Card>
  );
}
