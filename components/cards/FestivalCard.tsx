import { MapPin, Calendar, AlertTriangle, Trophy } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import MatchScore from '@/components/ui/MatchScore';
import DeadlineBadge from '@/components/ui/DeadlineBadge';
import type { Festival, MatchResult } from '@/lib/types';
import { FESTIVAL_CATEGORIE_LABELS, PREMIERE_TYPE_LABELS, PREMIERE_TYPE_COLORS } from '@/lib/constants';
import { formatShortDate, daysUntil } from '@/lib/dates';

interface FestivalCardProps {
  festival: Festival;
  match?: MatchResult;
  hasConflict?: boolean;
  onClick?: () => void;
}

export default function FestivalCard({ festival, match, hasConflict, onClick }: FestivalCardProps) {
  const days = daysUntil(festival.deadline);

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
            <Badge className="bg-festival/10 text-festival">
              {FESTIVAL_CATEGORIE_LABELS[festival.categorie]}
            </Badge>
            {festival.oscarQualifying && (
              <Badge className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/20">
                <Trophy size={11} className="mr-1" /> Oscar
              </Badge>
            )}
          </div>
          {match && <MatchScore score={match.score} />}
        </div>

        <h3 className="font-sans text-base font-semibold text-text-primary mb-1 line-clamp-2">
          {festival.nom}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-3">
          <MapPin size={12} />
          <span>{festival.ville}, {festival.pays}</span>
        </div>

        <div className="flex items-center justify-between pt-3 mt-auto border-t border-border">
          <div className="flex gap-2 flex-wrap">
            {festival.premiereType !== 'aucune' && (
              <Badge className={PREMIERE_TYPE_COLORS[festival.premiereType]}>
                {PREMIERE_TYPE_LABELS[festival.premiereType]}
              </Badge>
            )}
            {hasConflict && (
              <Badge className="bg-red-500/15 text-red-400">
                <AlertTriangle size={12} className="inline -mt-0.5 mr-1" />
                Conflit
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
            <Calendar size={12} />
            <span>{formatShortDate(festival.deadline)}</span>
            {days >= 0 && <DeadlineBadge days={days} />}
          </div>
        </div>
      </div>
    </Card>
  );
}
