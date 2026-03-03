'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import Card from '@/components/ui/Card';
import type { Aide, Festival } from '@/lib/types';
import { daysUntil } from '@/lib/dates';

interface AdminAlertsProps {
  aides: Aide[];
  festivals: Festival[];
}

interface Alert {
  id: string;
  name: string;
  issue: string;
  href: string;
}

export default function AdminAlerts({ aides, festivals }: AdminAlertsProps) {
  const alerts: Alert[] = [];

  for (const a of aides) {
    if (daysUntil(a.deadline) < 0) {
      alerts.push({ id: a.id, name: a.nom, issue: 'Deadline expirée', href: '/admin/aides' });
    }
    if (!a.description) {
      alerts.push({ id: `${a.id}-desc`, name: a.nom, issue: 'Pas de description', href: '/admin/aides' });
    }
    if (!a.lienOfficiel) {
      alerts.push({ id: `${a.id}-link`, name: a.nom, issue: 'Pas de lien officiel', href: '/admin/aides' });
    }
  }

  for (const f of festivals) {
    if (daysUntil(f.deadline) < 0) {
      alerts.push({ id: f.id, name: f.nom, issue: 'Deadline expirée', href: '/admin/festivals' });
    }
    if (!f.description) {
      alerts.push({ id: `${f.id}-desc`, name: f.nom, issue: 'Pas de description', href: '/admin/festivals' });
    }
    if (!f.lienOfficiel) {
      alerts.push({ id: `${f.id}-link`, name: f.nom, issue: 'Pas de lien officiel', href: '/admin/festivals' });
    }
  }

  if (alerts.length === 0) return null;

  return (
    <Card className="p-5">
      <h3 className="mb-3 text-sm font-semibold text-text-primary flex items-center gap-2">
        <AlertTriangle size={15} className="text-amber-400" />
        Alertes ({alerts.length})
      </h3>
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {alerts.slice(0, 20).map((alert) => (
          <Link
            key={alert.id}
            href={alert.href}
            className="flex items-center gap-3 rounded-md px-2 py-2 -mx-2 hover:bg-surface-hover transition-colors"
          >
            <AlertTriangle size={13} className="shrink-0 text-amber-400" />
            <span className="flex-1 min-w-0 text-sm text-text-primary truncate">{alert.name}</span>
            <span className="text-xs text-text-tertiary shrink-0">{alert.issue}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
