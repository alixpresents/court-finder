'use client';

import { useState, useMemo } from 'react';
import { Trash2, History as HistoryIcon } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/components/ui/ToastProvider';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import HistoryEntry from '@/components/admin/HistoryEntry';
import type { AdminActionType, AdminEntityType } from '@/lib/types';

export default function AdminHistoriquePage() {
  const { history, clearHistory } = useAdmin();
  const { toast } = useToast();
  const [actionFilter, setActionFilter] = useState<AdminActionType | ''>('');
  const [entityFilter, setEntityFilter] = useState<AdminEntityType | ''>('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filtered = useMemo(() => {
    let list = history;
    if (actionFilter) list = list.filter((h) => h.action === actionFilter);
    if (entityFilter) list = list.filter((h) => h.entityType === entityFilter);
    return list;
  }, [history, actionFilter, entityFilter]);

  function handleClear() {
    clearHistory();
    toast('success', 'Historique vidé');
    setShowClearConfirm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans text-2xl font-bold text-text-primary">Historique</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {history.length} action{history.length !== 1 ? 's' : ''} enregistrée{history.length !== 1 ? 's' : ''}.
          </p>
        </div>
        {history.length > 0 && (
          <Button variant="danger" size="sm" icon={Trash2} onClick={() => setShowClearConfirm(true)}>
            Vider l&apos;historique
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Action type pills */}
        {(['', 'create', 'update', 'delete'] as const).map((action) => (
          <button
            key={action}
            onClick={() => setActionFilter(action)}
            className={`rounded px-3 py-1.5 text-xs font-medium border transition-colors ${
              actionFilter === action
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border bg-surface text-text-secondary hover:text-text-primary'
            }`}
          >
            {action === '' ? 'Toutes actions' : action === 'create' ? 'Créations' : action === 'update' ? 'Modifications' : 'Suppressions'}
          </button>
        ))}

        <span className="w-px h-4 bg-border" />

        {/* Entity type pills */}
        {(['', 'aide', 'festival'] as const).map((entity) => (
          <button
            key={entity}
            onClick={() => setEntityFilter(entity)}
            className={`rounded px-3 py-1.5 text-xs font-medium border transition-colors ${
              entityFilter === entity
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border bg-surface text-text-secondary hover:text-text-primary'
            }`}
          >
            {entity === '' ? 'Tout' : entity === 'aide' ? 'Aides' : 'Festivals'}
          </button>
        ))}
      </div>

      {/* History list */}
      {filtered.length > 0 ? (
        <Card className="overflow-hidden">
          {filtered.map((entry) => (
            <HistoryEntry key={entry.id} entry={entry} />
          ))}
        </Card>
      ) : (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-hover mb-4">
            <HistoryIcon size={24} className="text-text-muted" />
          </div>
          <p className="text-sm text-text-secondary mb-1">Aucune action enregistrée</p>
          <p className="text-xs text-text-muted">
            Les modifications admin apparaîtront ici.
          </p>
        </div>
      )}

      {/* Clear confirm modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[12px]" onClick={() => setShowClearConfirm(false)} />
          <div className="relative w-full max-w-sm mx-4 rounded-xl border border-border bg-elevated p-6 shadow-2xl animate-modal-scale-in">
            <h2 className="text-lg font-semibold text-text-primary mb-2">Vider l&apos;historique ?</h2>
            <p className="text-sm text-text-secondary mb-5">
              Cette action est irréversible. Toutes les entrées seront supprimées.
            </p>
            <div className="flex gap-3">
              <Button variant="danger" className="flex-1" onClick={handleClear}>
                Vider
              </Button>
              <Button variant="ghost" onClick={() => setShowClearConfirm(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
