'use client';

import Link from 'next/link';
import { Plus, Film, Pencil, Trash2, Check } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { GENRE_LABELS, ETAPE_LABELS, GENRE_COLORS } from '@/lib/constants';

export default function ProjetsPage() {
  const { projects, activeProject, setActiveProject, deleteProject, isHydrated } = useProject();

  if (!isHydrated) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans text-2xl font-bold text-text-primary">Mes projets</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {projects.length} projet{projects.length !== 1 ? 's' : ''} enregistré{projects.length !== 1 ? 's' : ''}.
          </p>
        </div>
        <Link href="/projet/nouveau">
          <Button icon={Plus}>Nouveau projet</Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={Film}
          title="Aucun projet"
          description="Créez votre premier projet de court métrage pour découvrir les aides et festivals qui vous correspondent."
          actionLabel="Créer un projet"
          actionHref="/projet/nouveau"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const isActive = p.id === activeProject?.id;
            return (
              <Card key={p.id} className={`p-5 ${isActive ? 'ring-1 ring-accent/50' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Film size={18} className="text-accent shrink-0" />
                    <h3 className="font-sans font-semibold text-text-primary truncate">{p.titre}</h3>
                  </div>
                  {isActive && (
                    <Badge className="bg-accent/10 text-accent shrink-0">Actif</Badge>
                  )}
                </div>

                <p className="text-sm text-text-secondary line-clamp-2 mb-3">{p.logline}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  <Badge className={GENRE_COLORS[p.genre]}>{GENRE_LABELS[p.genre]}</Badge>
                  <Badge>{ETAPE_LABELS[p.etape]}</Badge>
                  <Badge>{p.dureeMinutes} min</Badge>
                </div>

                <div className="flex items-center gap-2">
                  {!isActive && (
                    <button
                      onClick={() => setActiveProject(p.id)}
                      className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs text-text-secondary hover:bg-surface-hover hover:text-accent transition-colors"
                    >
                      <Check size={13} />
                      Activer
                    </button>
                  )}
                  <Link
                    href={`/projet/${p.id}`}
                    className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
                  >
                    <Pencil size={13} />
                    Modifier
                  </Link>
                  <button
                    onClick={() => { if (confirm('Supprimer ce projet ?')) deleteProject(p.id); }}
                    className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs text-text-secondary hover:bg-surface-hover hover:text-red-400 transition-colors ml-auto"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
