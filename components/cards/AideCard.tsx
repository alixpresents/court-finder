import { Calendar } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import MatchScore from '@/components/ui/MatchScore';
import DeadlineBadge from '@/components/ui/DeadlineBadge';
import type { Aide, MatchResult } from '@/lib/types';
import { AIDE_TYPE_LABELS, AIDE_TYPE_COLORS } from '@/lib/constants';
import { formatShortDate, daysUntil } from '@/lib/dates';

interface AideCardProps {
  aide: Aide;
  match?: MatchResult;
  onClick?: () => void;
}

export default function AideCard({ aide, match, onClick }: AideCardProps) {
  const days = daysUntil(aide.deadline);
  const montant = aide.montantMax > 0
    ? `${(aide.montantMin / 1000).toFixed(0)}k – ${(aide.montantMax / 1000).toFixed(0)}k €`
    : 'Résidence';

  return (
    <Card hover className="flex flex-col h-full overflow-hidden" onClick={onClick}>
      {/* Match bar */}
      {match && (
        <div className="h-1 w-full bg-surface-hover">
          <div
            className={`h-full transition-all duration-500 ${
              match.score >= 70 ? 'bg-emerald-500' : match.score >= 40 ? 'bg-amber-400' : 'bg-red-500'
            }`}
            style={{ width: `${match.score}%` }}
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={AIDE_TYPE_COLORS[aide.type]}>
              {AIDE_TYPE_LABELS[aide.type]}
            </Badge>
            {aide.tauxSelection != null && (
              <Badge className="bg-white/5 text-text-tertiary">
                ~{aide.tauxSelection}% sélection
              </Badge>
            )}
          </div>
          {match && <MatchScore score={match.score} />}
        </div>

        <h3 className="font-sans text-base font-semibold text-text-primary mb-1 line-clamp-2">
          {aide.nom}
        </h3>
        <p className="text-xs text-text-secondary mb-3">{aide.organisme}</p>

        <div className="flex items-center justify-between pt-3 mt-auto border-t border-border">
          <span className="text-sm font-medium font-mono text-accent">{montant}</span>
          <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
            <Calendar size={12} />
            <span>{formatShortDate(aide.deadline)}</span>
            {days >= 0 && <DeadlineBadge days={days} />}
          </div>
        </div>
      </div>
    </Card>
  );
}
