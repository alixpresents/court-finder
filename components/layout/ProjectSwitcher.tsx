'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Plus, Settings, Film } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';

export default function ProjectSwitcher() {
  const { projects, activeProject, setActiveProject } = useProject();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Click-outside to close
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative px-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-left text-sm transition-colors hover:bg-surface-hover"
      >
        <Film size={16} className="shrink-0 text-accent" />
        <span className="flex-1 truncate text-text-primary">
          {activeProject ? activeProject.titre : 'Aucun projet'}
        </span>
        <ChevronDown size={14} className={`shrink-0 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-3 right-3 top-full z-50 mt-1 overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
          {projects.length > 0 && (
            <div className="max-h-48 overflow-y-auto py-1">
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setActiveProject(p.id); setOpen(false); }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-surface-hover ${
                    p.id === activeProject?.id ? 'text-accent font-medium' : 'text-text-secondary'
                  }`}
                >
                  <span className="truncate">{p.titre}</span>
                  {p.id === activeProject?.id && (
                    <span className="ml-auto shrink-0 h-1.5 w-1.5 rounded-full bg-accent" />
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-border py-1">
            <Link
              href="/projet/nouveau"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
            >
              <Plus size={14} />
              Nouveau projet
            </Link>
            <Link
              href="/projets"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
            >
              <Settings size={14} />
              Gérer les projets
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
