import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import MatchScore from '@/components/ui/MatchScore';
import type { MatchResult } from '@/lib/types';

interface DetailHeaderProps {
  backHref: string;
  backLabel: string;
  title: string;
  subtitle: string;
  badges: { label: string; className?: string }[];
  match?: MatchResult;
  lienOfficiel: string;
}

export default function DetailHeader({
  backHref,
  backLabel,
  title,
  subtitle,
  badges,
  match,
  lienOfficiel,
}: DetailHeaderProps) {
  return (
    <div className="mb-8">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4 min-h-[44px]"
      >
        <ArrowLeft size={16} />
        {backLabel}
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="font-sans text-2xl font-bold text-text-primary mb-1">{title}</h1>
          <p className="text-sm text-text-secondary mb-3">{subtitle}</p>
          <div className="flex flex-wrap gap-2">
            {badges.map((b, i) => (
              <Badge key={i} className={b.className}>{b.label}</Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {match && <MatchScore score={match.score} />}
          <a
            href={lienOfficiel}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-text-on-accent hover:brightness-110 transition-all min-h-[44px] inline-flex items-center"
          >
            Site officiel
          </a>
        </div>
      </div>
    </div>
  );
}
