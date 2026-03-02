import Link from 'next/link';
import { Calendar } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import MatchScore from '@/components/ui/MatchScore';
import type { Aide, MatchResult } from '@/lib/types';
import { AIDE_TYPE_LABELS, AIDE_TYPE_COLORS } from '@/lib/constants';
import { formatShortDate, daysUntil } from '@/lib/dates';

interface AideCardProps {
  aide: Aide;
  match?: MatchResult;
}

export default function AideCard({ aide, match }: AideCardProps) {
  const days = daysUntil(aide.deadline);
  const montant = aide.montantMax > 0
    ? `${(aide.montantMin / 1000).toFixed(0)}k – ${(aide.montantMax / 1000).toFixed(0)}k €`
    : 'Résidence';

  return (
    <Link href={`/aides/${aide.id}`}>
      <Card hover className="flex flex-col h-full p-5">
        <div className="flex items-start justify-between mb-3">
          <Badge className={AIDE_TYPE_COLORS[aide.type]}>
            {AIDE_TYPE_LABELS[aide.type]}
          </Badge>
          {match && <MatchScore score={match.score} size={40} />}
        </div>

        <h3 className="font-sans text-base font-semibold text-text-primary mb-1 line-clamp-2">
          {aide.nom}
        </h3>
        <p className="text-xs text-text-secondary mb-3">{aide.organisme}</p>
        <p className="text-sm text-text-secondary line-clamp-2 mb-4 flex-1">{aide.description}</p>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-sm font-medium text-accent">{montant}</span>
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Calendar size={12} />
            <span>{formatShortDate(aide.deadline)}</span>
            {days >= 0 && days <= 30 && (
              <Badge className="bg-red-500/15 text-red-400 ml-1">{days}j</Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
