'use client';

import Link from 'next/link';
import { Calendar } from 'lucide-react';
import Card from '@/components/ui/Card';
import DeadlineBadge from '@/components/ui/DeadlineBadge';
import { aides } from '@/data/aides';
import { festivals } from '@/data/festivals';
import { formatShortDate, daysUntil } from '@/lib/dates';

interface DeadlineItem {
  id: string;
  nom: string;
  deadline: string;
  type: 'aide' | 'festival';
  href: string;
}

export default function UpcomingDeadlines() {
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
      <div className="mb-4 flex items-center gap-2">
        <Calendar size={16} className="text-text-muted" />
        <h3 className="font-sans text-sm font-semibold text-text-primary">Prochaines deadlines</h3>
      </div>
      <div className="space-y-3">
        {allDeadlines.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-center justify-between rounded-lg px-3 py-2 -mx-3 hover:bg-surface-hover transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`h-2 w-2 rounded-full shrink-0 ${
                  item.type === 'aide' ? 'bg-accent' : 'bg-festival'
                }`}
              />
              <span className="text-sm text-text-primary truncate">{item.nom}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-3">
              <span className="text-xs text-text-muted">{formatShortDate(item.deadline)}</span>
              <DeadlineBadge days={daysUntil(item.deadline)} />
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
