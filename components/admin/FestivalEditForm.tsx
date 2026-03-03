'use client';

import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import MultiSelect from '@/components/ui/MultiSelect';
import ArrayEditor from '@/components/ui/ArrayEditor';
import Button from '@/components/ui/Button';
import { GENRE_LABELS, FESTIVAL_CATEGORIE_LABELS, PREMIERE_TYPE_LABELS } from '@/lib/constants';
import type { Festival, FestivalCategorie, Genre, PremiereType } from '@/lib/types';

interface FestivalEditFormProps {
  festival: Festival;
  onSave: (festival: Festival) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isNew?: boolean;
}

const GENRE_OPTIONS = Object.entries(GENRE_LABELS).map(([value, label]) => ({ value, label }));
const CATEGORIE_OPTIONS = Object.entries(FESTIVAL_CATEGORIE_LABELS).map(([value, label]) => ({ value, label }));
const PREMIERE_OPTIONS = Object.entries(PREMIERE_TYPE_LABELS).map(([value, label]) => ({ value, label }));
const OSCAR_CATEGORIES = [
  { value: 'Best Live Action Short', label: 'Best Live Action Short' },
  { value: 'Best Animated Short', label: 'Best Animated Short' },
  { value: 'Best Documentary Short', label: 'Best Documentary Short' },
];

export default function FestivalEditForm({ festival, onSave, onCancel, onDelete, isNew }: FestivalEditFormProps) {
  const [form, setForm] = useState<Festival>(festival);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setForm(festival);
    setIsDirty(false);
  }, [festival]);

  function update<K extends keyof Festival>(key: K, value: Festival[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nom"
        id="fest-nom"
        value={form.nom}
        onChange={(e) => update('nom', e.target.value)}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Ville"
          id="fest-ville"
          value={form.ville}
          onChange={(e) => update('ville', e.target.value)}
          required
        />
        <Input
          label="Pays"
          id="fest-pays"
          value={form.pays}
          onChange={(e) => update('pays', e.target.value)}
          required
        />
      </div>

      <Select
        label="Catégorie"
        id="fest-categorie"
        options={CATEGORIE_OPTIONS}
        value={form.categorie}
        onChange={(e) => update('categorie', e.target.value as FestivalCategorie)}
      />

      <Textarea
        label="Description"
        id="fest-description"
        value={form.description}
        onChange={(e) => update('description', e.target.value)}
      />

      <MultiSelect
        label="Genres"
        options={GENRE_OPTIONS}
        values={form.genres}
        onChange={(v) => update('genres', v as Genre[])}
      />

      <Input
        label="Durée max (min)"
        id="fest-duree-max"
        type="number"
        value={form.dureeMax ?? ''}
        onChange={(e) => update('dureeMax', e.target.value ? Number(e.target.value) : undefined)}
      />

      <Select
        label="Type de première"
        id="fest-premiere"
        options={PREMIERE_OPTIONS}
        value={form.premiereType}
        onChange={(e) => update('premiereType', e.target.value as PremiereType)}
      />

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
          <input
            type="checkbox"
            checked={form.fraisInscription}
            onChange={(e) => update('fraisInscription', e.target.checked)}
            className="h-3.5 w-3.5 rounded border-border accent-accent"
          />
          Frais d&apos;inscription
        </label>
        {form.fraisInscription && (
          <Input
            label="Montant ($)"
            id="fest-frais-montant"
            type="number"
            value={form.fraisMontant ?? ''}
            onChange={(e) => update('fraisMontant', e.target.value ? Number(e.target.value) : undefined)}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Deadline"
          id="fest-deadline"
          type="date"
          value={form.deadline}
          onChange={(e) => update('deadline', e.target.value)}
          required
        />
        <Input
          label="Ouverture inscriptions"
          id="fest-deadline-ouv"
          type="date"
          value={form.deadlineOuverture ?? ''}
          onChange={(e) => update('deadlineOuverture', e.target.value || undefined)}
        />
      </div>

      <Input
        label="Date de l'événement"
        id="fest-date-event"
        type="date"
        value={form.dateEvent}
        onChange={(e) => update('dateEvent', e.target.value)}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Films soumis"
          id="fest-soumis"
          type="number"
          value={form.nbFilmsSoumis ?? ''}
          onChange={(e) => update('nbFilmsSoumis', e.target.value ? Number(e.target.value) : undefined)}
        />
        <Input
          label="Films sélectionnés"
          id="fest-selectionnes"
          type="number"
          value={form.nbFilmsSelectionnes ?? ''}
          onChange={(e) => update('nbFilmsSelectionnes', e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>

      {/* Oscar section */}
      <div className="space-y-3 rounded-lg border border-border p-3">
        <label className="flex items-center gap-2 text-sm font-medium text-text-secondary cursor-pointer">
          <input
            type="checkbox"
            checked={form.oscarQualifying ?? false}
            onChange={(e) => {
              update('oscarQualifying', e.target.checked);
              if (!e.target.checked) update('qualifyingCategories', undefined);
            }}
            className="h-3.5 w-3.5 rounded border-border accent-amber-400"
          />
          Oscar Qualifying
        </label>
        {form.oscarQualifying && (
          <MultiSelect
            label="Catégories Oscar"
            options={OSCAR_CATEGORIES}
            values={form.qualifyingCategories ?? []}
            onChange={(v) => update('qualifyingCategories', v)}
          />
        )}
      </div>

      <Input
        label="Lien officiel"
        id="fest-lien"
        type="url"
        value={form.lienOfficiel}
        onChange={(e) => update('lienOfficiel', e.target.value)}
      />

      <ArrayEditor
        label="Documents requis"
        values={form.documents}
        onChange={(v) => update('documents', v)}
        placeholder="Nom du document..."
      />

      <ArrayEditor
        label="Conseils (Pro Tips)"
        values={form.proTips}
        onChange={(v) => update('proTips', v)}
        placeholder="Conseil..."
      />

      {/* Footer */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <Button type="submit" className="flex-1">
          {isNew ? 'Créer' : 'Enregistrer'}
        </Button>
        <Button variant="ghost" type="button" onClick={() => {
          if (isDirty && !confirm('Vous avez des modifications non sauvegardées. Quitter ?')) return;
          onCancel();
        }}>
          Annuler
        </Button>
        {onDelete && !isNew && (
          <Button variant="danger" type="button" icon={Trash2} onClick={onDelete}>
            Supprimer
          </Button>
        )}
      </div>
    </form>
  );
}
