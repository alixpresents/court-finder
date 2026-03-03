'use client';

import { useState, useMemo, useEffect } from 'react';
import { Plus, Trash2, Search, Trophy } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/components/ui/ToastProvider';
import Button from '@/components/ui/Button';
import SlidePanel from '@/components/ui/SlidePanel';
import SortableHeader from '@/components/admin/SortableHeader';
import AdminFestivalRow from '@/components/admin/AdminFestivalRow';
import FestivalEditForm from '@/components/admin/FestivalEditForm';
import { FESTIVAL_CATEGORIE_LABELS } from '@/lib/constants';
import { daysUntil } from '@/lib/dates';
import type { Festival } from '@/lib/types';

type SortField = 'nom' | 'ville' | 'deadline' | 'categorie';

function makeEmptyFestival(): Festival {
  return {
    id: `admin-${crypto.randomUUID().slice(0, 8)}`,
    nom: '',
    ville: '',
    pays: '',
    categorie: 'B',
    description: '',
    genres: [],
    premiereType: 'aucune',
    fraisInscription: false,
    deadline: '',
    dateEvent: '',
    documents: [],
    proTips: [],
    lienOfficiel: '',
  };
}

export default function AdminFestivalsPage() {
  const { mergedFestivals, createFestival, updateFestival, deleteFestival, bulkDeleteFestivals } = useAdmin();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [categorieFilter, setCategorieFilter] = useState('');
  const [oscarFilter, setOscarFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('nom');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingFestival, setEditingFestival] = useState<Festival | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Keyboard shortcut: N for new
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey && !editingFestival && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        handleCreate();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [editingFestival]);

  const filtered = useMemo(() => {
    let list = mergedFestivals;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((f) => f.nom.toLowerCase().includes(q) || f.ville.toLowerCase().includes(q) || f.pays.toLowerCase().includes(q));
    }
    if (categorieFilter) {
      list = list.filter((f) => f.categorie === categorieFilter);
    }
    if (oscarFilter) {
      list = list.filter((f) => f.oscarQualifying);
    }
    if (statusFilter === 'active') {
      list = list.filter((f) => daysUntil(f.deadline) >= 0);
    } else if (statusFilter === 'expired') {
      list = list.filter((f) => daysUntil(f.deadline) < 0);
    }

    list = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'nom': cmp = a.nom.localeCompare(b.nom); break;
        case 'ville': cmp = `${a.ville}${a.pays}`.localeCompare(`${b.ville}${b.pays}`); break;
        case 'deadline': cmp = new Date(a.deadline).getTime() - new Date(b.deadline).getTime(); break;
        case 'categorie': cmp = a.categorie.localeCompare(b.categorie); break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [mergedFestivals, search, categorieFilter, oscarFilter, statusFilter, sortField, sortDir]);

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
      setSelectedIds(new Set(filtered.map((f) => f.id)));
    }
  }

  function handleCreate() {
    setEditingFestival(makeEmptyFestival());
    setIsCreating(true);
  }

  function handleSave(festival: Festival) {
    if (isCreating) {
      createFestival(festival);
      toast('success', `Festival "${festival.nom}" créé`);
    } else {
      const { id, ...rest } = festival;
      updateFestival(id, rest);
      toast('success', `Festival "${festival.nom}" modifié`);
    }
    setEditingFestival(null);
    setIsCreating(false);
  }

  function handleDelete() {
    if (!editingFestival) return;
    deleteFestival(editingFestival.id);
    toast('success', `Festival "${editingFestival.nom}" supprimé`);
    setEditingFestival(null);
    setIsCreating(false);
  }

  function handleBulkDelete() {
    bulkDeleteFestivals(Array.from(selectedIds));
    toast('success', `${selectedIds.size} festival(s) supprimé(s)`);
    setSelectedIds(new Set());
    setShowDeleteConfirm(false);
  }

  const categorieOptions = Object.entries(FESTIVAL_CATEGORIE_LABELS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans text-2xl font-bold text-text-primary">Gérer les festivals</h1>
          <p className="mt-1 text-sm text-text-secondary">{mergedFestivals.length} festivals au total</p>
        </div>
        <Button icon={Plus} onClick={handleCreate}>
          Ajouter un festival
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

        {/* Categorie pills */}
        <button
          onClick={() => setCategorieFilter('')}
          className={`rounded px-3 py-1.5 text-xs font-medium border transition-colors ${
            !categorieFilter ? 'border-accent bg-accent/10 text-accent' : 'border-border bg-surface text-text-secondary hover:text-text-primary'
          }`}
        >
          Toutes
        </button>
        {categorieOptions.map(([value, label]) => (
          <button
            key={value}
            onClick={() => setCategorieFilter(categorieFilter === value ? '' : value)}
            className={`rounded px-3 py-1.5 text-xs font-medium border transition-colors ${
              categorieFilter === value ? 'border-accent bg-accent/10 text-accent' : 'border-border bg-surface text-text-secondary hover:text-text-primary'
            }`}
          >
            {label}
          </button>
        ))}

        <button
          onClick={() => setOscarFilter(!oscarFilter)}
          className={`inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-medium transition-colors ${
            oscarFilter ? 'border-amber-500/40 bg-amber-500/10 text-amber-300' : 'border-border bg-surface text-text-secondary hover:text-text-primary'
          }`}
        >
          <Trophy size={13} /> Oscar
        </button>

        {/* Status pills */}
        <span className="w-px h-4 bg-border" />
        <button
          onClick={() => setStatusFilter(statusFilter === 'active' ? '' : 'active')}
          className={`rounded px-3 py-1.5 text-xs font-medium border transition-colors ${
            statusFilter === 'active' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-border bg-surface text-text-secondary hover:text-text-primary'
          }`}
        >
          Actifs
        </button>
        <button
          onClick={() => setStatusFilter(statusFilter === 'expired' ? '' : 'expired')}
          className={`rounded px-3 py-1.5 text-xs font-medium border transition-colors ${
            statusFilter === 'expired' ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-border bg-surface text-text-secondary hover:text-text-primary'
          }`}
        >
          Expirés
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
              <SortableHeader label="Ville / Pays" field="ville" sortField={sortField} sortDir={sortDir} onSort={handleSort} className="hidden md:table-cell" />
              <SortableHeader label="Deadline" field="deadline" sortField={sortField} sortDir={sortDir} onSort={handleSort} className="hidden md:table-cell" />
              <SortableHeader label="Catégorie" field="categorie" sortField={sortField} sortDir={sortDir} onSort={handleSort} className="hidden sm:table-cell" />
              <th className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider text-text-tertiary hidden lg:table-cell">Oscar</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary hidden sm:table-cell">Notoriété</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((festival) => (
              <AdminFestivalRow
                key={festival.id}
                festival={festival}
                selected={selectedIds.has(festival.id)}
                onSelect={toggleSelect}
                onClick={() => { setEditingFestival(festival); setIsCreating(false); }}
              />
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-sm text-text-tertiary py-12">
            Aucun festival ne correspond à vos critères.
          </p>
        )}
      </div>

      {/* Edit SlidePanel */}
      <SlidePanel
        open={!!editingFestival}
        onClose={() => { setEditingFestival(null); setIsCreating(false); }}
        title={isCreating ? 'Nouveau festival' : `Modifier : ${editingFestival?.nom ?? ''}`}
      >
        {editingFestival && (
          <FestivalEditForm
            festival={editingFestival}
            isNew={isCreating}
            onSave={handleSave}
            onCancel={() => { setEditingFestival(null); setIsCreating(false); }}
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
              Supprimer {selectedIds.size} festival{selectedIds.size > 1 ? 's' : ''} ? Cette action est irréversible.
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
