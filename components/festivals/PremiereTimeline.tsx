'use client';

import Link from 'next/link';
import { ArrowRight, AlertTriangle, Crown } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { festivals } from '@/data/festivals';
import { getRecommendedOrder, getAllPremiereConflicts } from '@/lib/premieres';
import { PREMIERE_TYPE_LABELS, PREMIERE_TYPE_COLORS } from '@/lib/constants';
import { formatShortDate } from '@/lib/dates';
import type { Submission } from '@/lib/types';

interface PremiereTimelineProps {
  submissions: Submission[];
}

export default function PremiereTimeline({ submissions }: PremiereTimelineProps) {
  const order = getRecommendedOrder(submissions);
  const conflictMap = getAllPremiereConflicts(submissions);

  if (order.length < 2) return null;

  // Only show if at least one tracked festival requires a premiere
  const hasPremiereRequirement = order.some((id) => {
    const f = festivals.find((fest) => fest.id === id);
    return f && f.premiereType !== 'aucune';
  });

  if (!hasPremiereRequirement) return null;

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Crown size={16} className="text-festival" />
        <h3 className="font-sans text-sm font-semibold text-text-primary">
          Ordre de soumission recommandé
        </h3>
      </div>
      <p className="text-xs text-text-muted mb-4">
        Soumets d&apos;abord aux festivals exigeant la première la plus stricte (mondiale), puis descends dans la hiérarchie.
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        {order.map((id, i) => {
          const f = festivals.find((fest) => fest.id === id);
          if (!f) return null;
          const hasConflict = conflictMap.has(id);

          return (
            <div key={id} className="flex items-center gap-2">
              {i > 0 && <ArrowRight size={14} className="text-text-muted shrink-0" />}
              <Link
                href={`/festivals/${f.id}`}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-surface-hover ${
                  hasConflict ? 'border-red-500/30 bg-red-500/5' : 'border-border bg-surface'
                }`}
              >
                <span className="text-text-primary font-medium truncate max-w-[160px]">{f.nom.split('—')[0].trim()}</span>
                {f.premiereType !== 'aucune' && (
                  <Badge className={`${PREMIERE_TYPE_COLORS[f.premiereType]} text-[10px] px-1.5 py-0.5`}>
                    {PREMIERE_TYPE_LABELS[f.premiereType].replace('Première ', '')}
                  </Badge>
                )}
                {hasConflict && <AlertTriangle size={12} className="text-red-400 shrink-0" />}
                <span className="text-[10px] text-text-muted shrink-0">{formatShortDate(f.deadline)}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
