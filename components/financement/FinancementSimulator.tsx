'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Award, Wallet } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SourceRow from './SourceRow';
import DonutChart from './DonutChart';
import BudgetBar from './BudgetBar';
import AlertsPanel from './AlertsPanel';
import { useAdmin } from '@/context/AdminContext';
import { matchAide } from '@/lib/matching';
import { FINANCEMENT_CATEGORY_LABELS } from '@/lib/constants';
import type { Project, FinancementSource, FinancementCategory } from '@/lib/types';

const STORAGE_KEY = 'court-finder-financement';

const MANUAL_CATEGORIES: FinancementCategory[] = [
  'apport_producteur',
  'crowdfunding',
  'pre_achats',
  'industrie_technique',
  'apport_personnel',
];

function loadSources(projectId: string): FinancementSource[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}-${projectId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSources(projectId: string, sources: FinancementSource[]) {
  localStorage.setItem(`${STORAGE_KEY}-${projectId}`, JSON.stringify(sources));
}

interface FinancementSimulatorProps {
  project: Project;
}

export default function FinancementSimulator({ project }: FinancementSimulatorProps) {
  const { mergedAides: allAides } = useAdmin();
  const [sources, setSources] = useState<FinancementSource[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [showAidePicker, setShowAidePicker] = useState(false);
  const [showManualPicker, setShowManualPicker] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  // Hydrate
  useEffect(() => {
    setSources(loadSources(project.id));
    setHydrated(true);
  }, [project.id]);

  // Persist
  useEffect(() => {
    if (hydrated) saveSources(project.id, sources);
  }, [sources, project.id, hydrated]);

  // Eligible aides not yet added
  const eligibleAides = useMemo(() => {
    const addedIds = new Set(sources.filter((s) => s.aideId).map((s) => s.aideId));
    return allAides
      .filter((a) => matchAide(project, a).score >= 50 && !addedIds.has(a.id))
      .sort((a, b) => matchAide(project, b).score - matchAide(project, a).score);
  }, [project, sources]);

  const total = sources.reduce((s, src) => s + src.montant, 0);

  // Category totals for donut
  const categoryTotals = useMemo(() => {
    const map: Partial<Record<FinancementCategory, number>> = {};
    for (const src of sources) {
      map[src.category] = (map[src.category] ?? 0) + src.montant;
    }
    return Object.entries(map).map(([category, total]) => ({
      category: category as FinancementCategory,
      total: total as number,
    }));
  }, [sources]);

  const update = useCallback((fn: (prev: FinancementSource[]) => FinancementSource[]) => {
    setSources(fn);
  }, []);

  function addAide(aideId: string) {
    const aide = allAides.find((a) => a.id === aideId);
    if (!aide) return;
    const montant = Math.round((aide.montantMin + aide.montantMax) / 2);
    update((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        aideId: aide.id,
        label: aide.nom,
        montant,
        category: 'aide_publique',
      },
    ]);
    setShowAidePicker(false);
  }

  function addManual(category: FinancementCategory) {
    update((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        label: FINANCEMENT_CATEGORY_LABELS[category],
        montant: 0,
        category,
      },
    ]);
    setShowManualPicker(false);
  }

  function changeMontant(id: string, montant: number) {
    update((prev) => prev.map((s) => (s.id === id ? { ...s, montant } : s)));
  }

  function remove(id: string) {
    update((prev) => prev.filter((s) => s.id !== id));
  }

  // Drag and drop
  function handleDragStart(e: React.DragEvent, id: string) {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function handleDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault();
    if (!dragId || dragId === targetId) return;
    update((prev) => {
      const arr = [...prev];
      const fromIdx = arr.findIndex((s) => s.id === dragId);
      const toIdx = arr.findIndex((s) => s.id === targetId);
      if (fromIdx < 0 || toIdx < 0) return prev;
      const [item] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, item);
      return arr;
    });
    setDragId(null);
  }

  if (!hydrated) return null;

  return (
    <div className="space-y-6">
      {/* Top row: budget bar + donut */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-5 md:col-span-2">
          <BudgetBar covered={total} budget={project.budget} />
        </Card>
        <Card className="p-5 flex items-center justify-center">
          <DonutChart slices={categoryTotals} budget={project.budget} />
        </Card>
      </div>

      {/* Alerts */}
      <AlertsPanel
        sources={sources}
        project={project}
        aides={allAides}
        budget={project.budget}
      />

      {/* Sources list */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-sans text-base font-semibold text-text-primary">
            Sources de financement
          </h3>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Button
                variant="secondary"
                size="sm"
                icon={Award}
                onClick={() => { setShowAidePicker((v) => !v); setShowManualPicker(false); }}
              >
                Ajouter une aide
              </Button>
              {showAidePicker && (
                <div className="absolute right-0 top-full mt-1 w-80 max-h-64 overflow-auto rounded-xl border border-border bg-surface shadow-xl z-50">
                  {eligibleAides.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-text-muted">
                      Toutes les aides éligibles ont été ajoutées
                    </p>
                  ) : (
                    eligibleAides.map((aide) => (
                      <button
                        key={aide.id}
                        onClick={() => addAide(aide.id)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-surface-hover transition-colors border-b border-border last:border-0"
                      >
                        <div className="min-w-0">
                          <p className="text-sm text-text-primary truncate">{aide.nom}</p>
                          <p className="text-xs text-text-muted">{aide.organisme}</p>
                        </div>
                        <span className="text-xs text-accent font-medium shrink-0 ml-3">
                          {(aide.montantMin / 1000).toFixed(0)}k–{(aide.montantMax / 1000).toFixed(0)}k €
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <Button
                variant="secondary"
                size="sm"
                icon={Wallet}
                onClick={() => { setShowManualPicker((v) => !v); setShowAidePicker(false); }}
              >
                Autre source
              </Button>
              {showManualPicker && (
                <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-border bg-surface shadow-xl z-50">
                  {MANUAL_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => addManual(cat)}
                      className="w-full px-4 py-2.5 text-left text-sm text-text-primary hover:bg-surface-hover transition-colors border-b border-border last:border-0"
                    >
                      {FINANCEMENT_CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {sources.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-hover mb-4">
              <Plus size={24} className="text-text-muted" />
            </div>
            <p className="text-sm text-text-secondary mb-1">Aucune source ajoutée</p>
            <p className="text-xs text-text-muted">
              Commence par ajouter tes aides éligibles ou d&apos;autres sources de financement.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sources.map((source) => (
              <SourceRow
                key={source.id}
                source={source}
                aide={source.aideId ? allAides.find((a) => a.id === source.aideId) : undefined}
                onMontantChange={changeMontant}
                onRemove={remove}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))}
          </div>
        )}

        {sources.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-sm font-medium text-text-secondary">Total</span>
            <span className="text-lg font-bold text-text-primary tabular-nums">
              {new Intl.NumberFormat('fr-FR').format(total)} €
            </span>
          </div>
        )}
      </Card>
    </div>
  );
}
