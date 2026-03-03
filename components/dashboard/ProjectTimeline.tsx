'use client';

import { Check } from 'lucide-react';
import Card from '@/components/ui/Card';
import { useProject } from '@/context/ProjectContext';
import { ETAPE_LABELS } from '@/lib/constants';
import type { Etape } from '@/lib/types';

const STEPS: { key: Etape; label: string }[] = [
  { key: 'ecriture', label: 'Écriture' },
  { key: 'developpement', label: 'Développement' },
  { key: 'preproduction', label: 'Pré-prod' },
  { key: 'production', label: 'Production' },
  { key: 'postproduction', label: 'Post-prod' },
];

const STEP_INDEX: Record<Etape, number> = {
  ecriture: 0,
  developpement: 1,
  preproduction: 2,
  production: 3,
  postproduction: 4,
};

export default function ProjectTimeline() {
  const { activeProject, updateProject } = useProject();
  if (!activeProject) return null;

  const currentIdx = STEP_INDEX[activeProject.etape] ?? 0;

  return (
    <Card className="p-5">
      <h3 className="mb-4 text-sm font-semibold text-text-primary">Avancement du projet</h3>
      <div className="flex items-center">
        {STEPS.map((step, i) => {
          const isPast = i < currentIdx;
          const isCurrent = i === currentIdx;
          const isFuture = i > currentIdx;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => updateProject({ ...activeProject, etape: step.key })}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all ${
                    isPast
                      ? 'border-accent bg-accent text-text-on-accent'
                      : isCurrent
                        ? 'border-accent bg-accent/15 text-accent'
                        : 'border-border bg-transparent text-text-tertiary group-hover:border-border-hover'
                  }`}
                >
                  {isPast ? <Check size={14} strokeWidth={3} /> : <span className="text-[10px] font-mono font-bold">{i + 1}</span>}
                </div>
                <span
                  className={`text-[10px] leading-tight text-center whitespace-nowrap ${
                    isCurrent ? 'font-semibold text-text-primary' : 'text-text-tertiary'
                  }`}
                >
                  {step.label}
                </span>
              </button>

              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="flex-1 mx-1.5">
                  <div
                    className={`h-[2px] rounded-full transition-colors ${
                      i < currentIdx ? 'bg-accent' : 'bg-border'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
