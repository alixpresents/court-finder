import Link from 'next/link';
import { MapPin, Calendar } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import MatchScore from '@/components/ui/MatchScore';
import type { Festival, MatchResult } from '@/lib/types';
import { FESTIVAL_CATEGORIE_LABELS } from '@/lib/constants';
import { formatShortDate, daysUntil } from '@/lib/dates';

interface FestivalCardProps {
  festival: Festival;
  match?: MatchResult;
}

export default function FestivalCard({ festival, match }: FestivalCardProps) {
  const days = daysUntil(festival.deadline);

  return (
    <Link href={`/festivals/${festival.id}`}>
      <Card hover className="flex flex-col h-full p-5">
        <div className="flex items-start justify-between mb-3">
          <Badge className="bg-festival/10 text-festival">
            {FESTIVAL_CATEGORIE_LABELS[festival.categorie]}
          </Badge>
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
            {festival.premiereRequise && (
              <Badge className="bg-purple-500/15 text-purple-400">Première requise</Badge>
            )}
            {festival.fraisInscription && (
              <Badge className="bg-amber-500/15 text-amber-400">Frais</Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Calendar size={12} />
            <span>{formatShortDate(festival.deadline)}</span>
            {days >= 0 && days <= 30 && (
              <Badge className="bg-red-500/15 text-red-400 ml-1">{days}j</Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
