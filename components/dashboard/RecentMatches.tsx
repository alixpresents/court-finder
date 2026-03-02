'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import Card from '@/components/ui/Card';
import MatchScore from '@/components/ui/MatchScore';
import Badge from '@/components/ui/Badge';
import { useProject } from '@/context/ProjectContext';
import { aides } from '@/data/aides';
import { festivals } from '@/data/festivals';
import { matchAide, matchFestival } from '@/lib/matching';

export default function RecentMatches() {
  const { activeProject } = useProject();

  if (!activeProject) return null;

  const aideMatches = aides
    .map((a) => ({ ...a, match: matchAide(activeProject, a), type: 'aide' as const }))
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, 3);

  const festivalMatches = festivals
    .map((f) => ({ ...f, match: matchFestival(activeProject, f), type: 'festival' as const }))
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, 2);

  const topMatches = [...aideMatches, ...festivalMatches].sort((a, b) => b.match.score - a.match.score);

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles size={16} className="text-accent" />
        <h3 className="font-sans text-sm font-semibold text-text-primary">Meilleurs matchs</h3>
      </div>
      <div className="space-y-3">
        {topMatches.map((item) => (
          <Link
            key={item.id}
            href={`/${item.type === 'aide' ? 'aides' : 'festivals'}/${item.id}`}
            className="flex items-center justify-between rounded-lg px-3 py-2 -mx-3 hover:bg-surface-hover transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <MatchScore score={item.match.score} size={36} />
              <div className="min-w-0">
                <span className="text-sm text-text-primary truncate block">{item.nom}</span>
                <Badge className={item.type === 'aide' ? 'bg-accent/10 text-accent' : 'bg-festival/10 text-festival'}>
                  {item.type === 'aide' ? 'Aide' : 'Festival'}
                </Badge>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
