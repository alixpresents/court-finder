'use client';

import { useState, useMemo, useEffect } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/components/ui/ToastProvider';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import SlidePanel from '@/components/ui/SlidePanel';
import SortableHeader from '@/components/admin/SortableHeader';
import AdminAideRow from '@/components/admin/AdminAideRow';
import AideEditForm from '@/components/admin/AideEditForm';
import { AIDE_TYPE_LABELS } from '@/lib/constants';
import { daysUntil } from '@/lib/dates';
import type { Aide } from '@/lib/types';

type SortField = 'nom' | 'organisme' | 'type' | 'montantMax' | 'deadline';

function makeEmptyAide(): Aide {
  return {
    id: `admin-${crypto.randomUUID().slice(0, 8)}`,
    nom: '',
    organisme: '',
    type: 'nationale',
    description: '',
    montantMin: 0,
    montantMax: 0,
    genres: [],
    etapes: [],
    profils: [],
    deadline: '',
    documents: [],
    proTips: [],
    lienOfficiel: '',
  };
}

export default function AdminAidesPage() {
  const { mergedAides, createAide, updateAide, deleteAide, bulkDeleteAides } = useAdmin();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('nom');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingAide, setEditingAide] = useState<Aide | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Keyboard shortcut: N for new
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey && !editingAide && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        handleCreate();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [editingAide]);

  const filtered = useMemo(() => {
    let list = mergedAides;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((a) => a.nom.toLowerCase().includes(q) || a.organisme.toLowerCase().includes(q));
    }
    if (typeFilter) {
      list = list.filter((a) => a.type === typeFilter);
    }
    if (statusFilter === 'active') {
      list = list.filter((a) => daysUntil(a.deadline) >= 0);
    } else if (statusFilter === 'expired') {
      list = list.filter((a) => daysUntil(a.deadline) < 0);
    }

    list = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'nom': cmp = a.nom.localeCompare(b.nom); break;
        case 'organisme': cmp = a.organisme.localeCompare(b.organisme); break;
        case 'type': cmp = a.type.localeCompare(b.type); break;
        case 'montantMax': cmp = a.montantMax - b.montantMax; break;
        case 'deadline': cmp = new Date(a.deadline).getTime() - new Date(b.deadline).getTime(); break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [mergedAides, search, typeFilter, statusFilter, sortField, sortDir]);

  function handleSort(field: string) {
    if (field === sortField) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field as SortField);
      setSortDir('asc');
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((a) => a.id)));
    }
  }

  function handleCreate() {
    setEditingAide(makeEmptyAide());
    setIsCreating(true);
  }

  function handleSave(aide: Aide) {
    if (isCreating) {
      createAide(aide);
      toast('success', `Aide "${aide.nom}" créée`);
    } else {
      const { id, ...rest } = aide;
      updateAide(id, rest);
      toast('success', `Aide "${aide.nom}" modifiée`);
    }
    setEditingAide(null);
    setIsCreating(false);
  }

  function handleDelete() {
    if (!editingAide) return;
    deleteAide(editingAide.id);
    toast('success', `Aide "${editingAide.nom}" supprimée`);
    setEditingAide(null);
    setIsCreating(false);
  }

  function handleBulkDelete() {
    bulkDeleteAides(Array.from(selectedIds));
    toast('success', `${selectedIds.size} aide(s) supprimée(s)`);
    setSelectedIds(new Set());
    setShowDeleteConfirm(false);
  }

  const typeOptions = Object.entries(AIDE_TYPE_LABELS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans text-2xl font-bold text-text-primary">Gérer les aides</h1>
          <p className="mt-1 text-sm text-text-secondary">{mergedAides.length} aides au total</p>
        </div>
        <Button icon={Plus} onClick={handleCreate}>
          Ajouter une aide
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-colors focus:border-border-focus focus:ring-1 focus:ring-accent/25"
          />
        </div>

        {/* Type pills */}
        <button
          onClick={() => setTypeFilter('')}
          className={`rounded px-3 py-1.5 text-xs font-medium border transition-colors ${
            !typeFilter ? 'border-accent bg-accent/10 text-accent' : 'border-border bg-surface text-text-secondary hover:text-text-primary'
          }`}
        >
          Tous types
        </button>
        {typeOptions.map(([value, label]) => (
          <button
            key={value}
            onClick={() => setTypeFilter(typeFilter === value ? '' : value)}
            className={`rounded px-3 py-1.5 text-xs font-medium border transition-colors ${
              typeFilter === value ? 'border-accent bg-accent/10 text-accent' : 'border-border bg-surface text-text-secondary hover:text-text-primary'
            }`}
          >
            {label}
          </button>
        ))}

        {/* Status pills */}
        <span className="w-px h-4 bg-border" />
        <button
          onClick={() => setStatusFilter(statusFilter === 'active' ? '' : 'active')}
          className={`rounded px-3 py-1.5 text-xs font-medium border transition-colors ${
            statusFilter === 'active' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-border bg-surface text-text-secondary hover:text-text-primary'
          }`}
        >
          Actives
        </button>
        <button
          onClick={() => setStatusFilter(statusFilter === 'expired' ? '' : 'expired')}
          className={`rounded px-3 py-1.5 text-xs font-medium border transition-colors ${
            statusFilter === 'expired' ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-border bg-surface text-text-secondary hover:text-text-primary'
          }`}
        >
          Expirées
        </button>

        {selectedIds.size > 0 && (
          <>
            <span className="w-px h-4 bg-border" />
            <Button variant="danger" size="sm" icon={Trash2} onClick={() => setShowDeleteConfirm(true)}>
              Supprimer ({selectedIds.size})
            </Button>
          </>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full">
          <thead className="bg-surface-hover/50">
            <tr>
              <th className="px-3 py-2 w-10">
                <input
                  type="checkbox"
                  checked={filtered.length > 0 && selectedIds.size === filtered.length}
                  onChange={toggleAll}
                  className="h-3.5 w-3.5 rounded border-border accent-accent"
                />
              </th>
              <SortableHeader label="Nom" field="nom" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Organisme" field="organisme" sortField={sortField} sortDir={sortDir} onSort={handleSort} className="hidden md:table-cell" />
              <SortableHeader label="Type" field="type" sortField={sortField} sortDir={sortDir} onSort={handleSort} className="hidden sm:table-cell" />
              <SortableHeader label="Montant" field="montantMax" sortField={sortField} sortDir={sortDir} onSort={handleSort} className="hidden lg:table-cell" />
              <SortableHeader label="Deadline" field="deadline" sortField={sortField} sortDir={sortDir} onSort={handleSort} className="hidden md:table-cell" />
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((aide) => (
              <AdminAideRow
                key={aide.id}
                aide={aide}
                selected={selectedIds.has(aide.id)}
                onSelect={toggleSelect}
                onClick={() => { setEditingAide(aide); setIsCreating(false); }}
              />
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-sm text-text-tertiary py-12">
            Aucune aide ne correspond à vos critères.
          </p>
        )}
      </div>

      {/* Edit SlidePanel */}
      <SlidePanel
        open={!!editingAide}
        onClose={() => { setEditingAide(null); setIsCreating(false); }}
        title={isCreating ? 'Nouvelle aide' : `Modifier : ${editingAide?.nom ?? ''}`}
      >
        {editingAide && (
          <AideEditForm
            aide={editingAide}
            isNew={isCreating}
            onSave={handleSave}
            onCancel={() => { setEditingAide(null); setIsCreating(false); }}
            onDelete={!isCreating ? handleDelete : undefined}
          />
        )}
      </SlidePanel>

      {/* Bulk delete confirm modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[12px]" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative w-full max-w-sm mx-4 rounded-xl border border-border bg-elevated p-6 shadow-2xl animate-modal-scale-in">
            <h2 className="text-lg font-semibold text-text-primary mb-2">Confirmer la suppression</h2>
            <p className="text-sm text-text-secondary mb-5">
              Supprimer {selectedIds.size} aide{selectedIds.size > 1 ? 's' : ''} ? Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <Button variant="danger" className="flex-1" onClick={handleBulkDelete}>
                Supprimer
              </Button>
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
