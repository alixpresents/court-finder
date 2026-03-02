import Link from 'next/link';
import { MapPin, Calendar, AlertTriangle } from 'lucide-react';
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
}

export default function FestivalCard({ festival, match, hasConflict }: FestivalCardProps) {
  const days = daysUntil(festival.deadline);

  return (
    <Link href={`/festivals/${festival.id}`}>
      <Card hover className="flex flex-col h-full p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-festival/10 text-festival">
              {FESTIVAL_CATEGORIE_LABELS[festival.categorie]}
            </Badge>
            {festival.oscarQualifying && (
              <Badge className="bg-amber-500/15 text-amber-300">
                Oscar Qualifying 🏆
              </Badge>
            )}
            {festival.nbFilmsSoumis != null && festival.nbFilmsSelectionnes != null && (
              <Badge className="bg-white/5 text-text-muted">
                {festival.nbFilmsSelectionnes}/{festival.nbFilmsSoumis.toLocaleString('fr-FR')}
              </Badge>
            )}
          </div>
          {match && <MatchScore score={match.score} size={40} />}
        </div>

        <h3 className="font-sans text-base font-semibold text-text-primary mb-1 line-clamp-2">
          {festival.nom}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-3">
          <MapPin size={12} />
          <span>{festival.ville}, {festival.pays}</span>
        </div>
        <p className="text-sm text-text-secondary line-clamp-2 mb-4 flex-1">{festival.description}</p>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex gap-2">
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
            {festival.fraisInscription && (
              <Badge className="bg-amber-500/15 text-amber-400">
                {festival.fraisMontant ? `${festival.fraisMontant} $` : 'Frais'}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Calendar size={12} />
            <span>{formatShortDate(festival.deadline)}</span>
            {days >= 0 && <DeadlineBadge days={days} />}
          </div>
        </div>
      </Card>
    </Link>
  );
}
