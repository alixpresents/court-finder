'use client';

import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import MultiSelect from '@/components/ui/MultiSelect';
import ArrayEditor from '@/components/ui/ArrayEditor';
import Button from '@/components/ui/Button';
import { GENRE_LABELS, ETAPE_LABELS, PROFIL_LABELS, AIDE_TYPE_LABELS } from '@/lib/constants';
import type { Aide, AideType, Genre, Etape, ProfilRealisateur } from '@/lib/types';

interface AideEditFormProps {
  aide: Aide;
  onSave: (aide: Aide) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isNew?: boolean;
}

const GENRE_OPTIONS = Object.entries(GENRE_LABELS).map(([value, label]) => ({ value, label }));
const ETAPE_OPTIONS = Object.entries(ETAPE_LABELS).map(([value, label]) => ({ value, label }));
const PROFIL_OPTIONS = Object.entries(PROFIL_LABELS).map(([value, label]) => ({ value, label }));
const TYPE_OPTIONS = Object.entries(AIDE_TYPE_LABELS).map(([value, label]) => ({ value, label }));

export default function AideEditForm({ aide, onSave, onCancel, onDelete, isNew }: AideEditFormProps) {
  const [form, setForm] = useState<Aide>(aide);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setForm(aide);
    setIsDirty(false);
  }, [aide]);

  function update<K extends keyof Aide>(key: K, value: Aide[K]) {
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
        id="aide-nom"
        value={form.nom}
        onChange={(e) => update('nom', e.target.value)}
        required
      />

      <Input
        label="Organisme"
        id="aide-organisme"
        value={form.organisme}
        onChange={(e) => update('organisme', e.target.value)}
        required
      />

      <Select
        label="Type"
        id="aide-type"
        options={TYPE_OPTIONS}
        value={form.type}
        onChange={(e) => update('type', e.target.value as AideType)}
      />

      <Textarea
        label="Description"
        id="aide-description"
        value={form.description}
        onChange={(e) => update('description', e.target.value)}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Montant min (€)"
          id="aide-montant-min"
          type="number"
          value={form.montantMin}
          onChange={(e) => update('montantMin', Number(e.target.value))}
        />
        <Input
          label="Montant max (€)"
          id="aide-montant-max"
          type="number"
          value={form.montantMax}
          onChange={(e) => update('montantMax', Number(e.target.value))}
        />
      </div>

      <MultiSelect
        label="Genres"
        options={GENRE_OPTIONS}
        values={form.genres}
        onChange={(v) => update('genres', v as Genre[])}
      />

      <MultiSelect
        label="Étapes"
        options={ETAPE_OPTIONS}
        values={form.etapes}
        onChange={(v) => update('etapes', v as Etape[])}
      />

      <MultiSelect
        label="Profils"
        options={PROFIL_OPTIONS}
        values={form.profils}
        onChange={(v) => update('profils', v as ProfilRealisateur[])}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Durée max (min)"
          id="aide-duree-max"
          type="number"
          value={form.dureeMax ?? ''}
          onChange={(e) => update('dureeMax', e.target.value ? Number(e.target.value) : undefined)}
        />
        <Input
          label="Budget max (€)"
          id="aide-budget-max"
          type="number"
          value={form.budgetMax ?? ''}
          onChange={(e) => update('budgetMax', e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>

      <Input
        label="Deadline"
        id="aide-deadline"
        type="date"
        value={form.deadline}
        onChange={(e) => update('deadline', e.target.value)}
        required
      />

      <Input
        label="Session"
        id="aide-session"
        value={form.session ?? ''}
        onChange={(e) => update('session', e.target.value || undefined)}
      />

      <Input
        label="Taux de sélection (%)"
        id="aide-taux"
        type="number"
        value={form.tauxSelection ?? ''}
        onChange={(e) => update('tauxSelection', e.target.value ? Number(e.target.value) : undefined)}
      />

      <Input
        label="Lien officiel"
        id="aide-lien"
        type="url"
        value={form.lienOfficiel}
        onChange={(e) => update('lienOfficiel', e.target.value)}
      />

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
          <input
            type="checkbox"
            checked={form.requiresProducer ?? false}
            onChange={(e) => update('requiresProducer', e.target.checked)}
            className="h-3.5 w-3.5 rounded border-border accent-accent"
          />
          Nécessite un producteur
        </label>
        <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
          <input
            type="checkbox"
            checked={form.autoProductionEligible ?? false}
            onChange={(e) => update('autoProductionEligible', e.target.checked)}
            className="h-3.5 w-3.5 rounded border-border accent-accent"
          />
          Auto-production éligible
        </label>
      </div>

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

      {/* Footer actions */}
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
