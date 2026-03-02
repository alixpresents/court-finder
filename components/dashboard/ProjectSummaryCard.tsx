'use client';

import Link from 'next/link';
import { Film, Pencil } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useProject } from '@/context/ProjectContext';
import { GENRE_LABELS, ETAPE_LABELS, PROFIL_LABELS, GENRE_COLORS } from '@/lib/constants';

export default function ProjectSummaryCard() {
  const { activeProject } = useProject();

  if (!activeProject) return null;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
            <Film size={22} className="text-accent" />
          </div>
          <div>
            <h3 className="font-sans text-lg font-semibold text-text-primary">{activeProject.titre}</h3>
            <p className="mt-0.5 text-sm text-text-secondary line-clamp-1">{activeProject.logline}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge className={GENRE_COLORS[activeProject.genre]}>{GENRE_LABELS[activeProject.genre]}</Badge>
              <Badge>{ETAPE_LABELS[activeProject.etape]}</Badge>
              <Badge>{activeProject.dureeMinutes} min</Badge>
              <Badge>{PROFIL_LABELS[activeProject.profilRealisateur]}</Badge>
              <Badge>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(activeProject.budget)}</Badge>
            </div>
          </div>
        </div>
        <Link
          href={`/projet/${activeProject.id}`}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
        >
          <Pencil size={14} />
          Modifier
        </Link>
      </div>
    </Card>
  );
}
