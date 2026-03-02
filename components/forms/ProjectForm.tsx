'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProject } from '@/context/ProjectContext';
import { usePlan } from '@/context/PlanContext';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import CityAutocomplete from '@/components/ui/CityAutocomplete';
import { GENRES } from '@/data/genres';
import { ETAPE_LABELS, PROFIL_LABELS } from '@/lib/constants';
import { resolveRegion } from '@/data/codeRegionMap';
import type { Project, Etape, ProfilRealisateur } from '@/lib/types';

const ETAPE_OPTIONS = Object.entries(ETAPE_LABELS).map(([value, label]) => ({ value, label }));
const PROFIL_OPTIONS = Object.entries(PROFIL_LABELS).map(([value, label]) => ({ value, label }));

interface ProjectFormProps {
  editProject?: Project;
}

export default function ProjectForm({ editProject }: ProjectFormProps) {
  const { addProject, updateProject, setActiveProject } = useProject();
  const { canCreateProject } = usePlan();
  const router = useRouter();
  const isEdit = !!editProject;

  const [form, setForm] = useState({
    titre: editProject?.titre ?? '',
    logline: editProject?.logline ?? '',
    genre: editProject?.genre ?? '',
    etape: editProject?.etape ?? '',
    dureeMinutes: editProject?.dureeMinutes?.toString() ?? '',
    budget: editProject?.budget?.toString() ?? '',
    profilRealisateur: editProject?.profilRealisateur ?? '',
    region: editProject?.region ?? '',
    lieuTournage: editProject?.lieuTournage ?? '',
    regionLabel: '',
    autoProduction: editProject?.autoProduction ?? false,
    productionNom: editProject?.productionNom ?? '',
    productionVille: editProject?.productionVille ?? '',
    regionProduction: editProject?.regionProduction ?? '',
    regionProductionLabel: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  }

  function handleTournageSelect(city: string, codeRegion: string) {
    const resolved = resolveRegion(codeRegion);
    setForm((f) => ({
      ...f,
      lieuTournage: city,
      region: resolved?.value ?? '',
      regionLabel: resolved?.label ?? '',
    }));
    setErrors((e) => ({ ...e, lieuTournage: '' }));
  }

  function handleTournageClear() {
    setForm((f) => ({
      ...f,
      lieuTournage: '',
      region: '',
      regionLabel: '',
    }));
  }

  function handleProductionVilleSelect(city: string, codeRegion: string) {
    const resolved = resolveRegion(codeRegion);
    setForm((f) => ({
      ...f,
      productionVille: city,
      regionProduction: resolved?.value ?? '',
      regionProductionLabel: resolved?.label ?? '',
    }));
  }

  function handleProductionVilleClear() {
    setForm((f) => ({
      ...f,
      productionVille: '',
      regionProduction: '',
      regionProductionLabel: '',
    }));
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.titre.trim()) errs.titre = 'Titre requis';
    if (!form.logline.trim()) errs.logline = 'Logline requise';
    if (!form.genre) errs.genre = 'Genre requis';
    if (!form.etape) errs.etape = 'Étape requise';
    if (!form.dureeMinutes || Number(form.dureeMinutes) <= 0) errs.dureeMinutes = 'Durée requise';
    if (!form.budget || Number(form.budget) <= 0) errs.budget = 'Budget requis';
    if (!form.profilRealisateur) errs.profilRealisateur = 'Profil requis';
    if (!form.lieuTournage.trim()) errs.lieuTournage = 'Lieu de tournage requis';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isEdit && !canCreateProject) return;
    if (!validate()) return;

    const p: Project = {
      id: editProject?.id ?? crypto.randomUUID(),
      titre: form.titre.trim(),
      logline: form.logline.trim(),
      genre: form.genre as Project['genre'],
      etape: form.etape as Etape,
      dureeMinutes: Number(form.dureeMinutes),
      budget: Number(form.budget),
      profilRealisateur: form.profilRealisateur as ProfilRealisateur,
      region: form.region,
      lieuTournage: form.lieuTournage,
      autoProduction: form.autoProduction || undefined,
      productionNom: form.autoProduction ? undefined : (form.productionNom.trim() || undefined),
      productionVille: form.autoProduction ? undefined : (form.productionVille || undefined),
      regionProduction: form.autoProduction ? undefined : (form.regionProduction || undefined),
      createdAt: editProject?.createdAt ?? new Date().toISOString(),
    };

    if (isEdit) {
      updateProject(p);
    } else {
      addProject(p);
      setActiveProject(p.id);
    }
    router.push('/projets');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <Input
          label="Titre du projet"
          id="titre"
          placeholder="Ex: La Dernière Vague"
          value={form.titre}
          onChange={(e) => update('titre', e.target.value)}
        />
        {errors.titre && <p className="mt-1 text-xs text-red-400">{errors.titre}</p>}
      </div>

      <div>
        <Textarea
          label="Logline"
          id="logline"
          placeholder="En une phrase, de quoi parle votre film ?"
          value={form.logline}
          onChange={(e) => update('logline', e.target.value)}
        />
        {errors.logline && <p className="mt-1 text-xs text-red-400">{errors.logline}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Select
            label="Genre"
            id="genre"
            options={GENRES}
            placeholder="Sélectionner un genre"
            value={form.genre}
            onChange={(e) => update('genre', e.target.value)}
          />
          {errors.genre && <p className="mt-1 text-xs text-red-400">{errors.genre}</p>}
        </div>
        <div>
          <Select
            label="Étape du projet"
            id="etape"
            options={ETAPE_OPTIONS}
            placeholder="Sélectionner une étape"
            value={form.etape}
            onChange={(e) => update('etape', e.target.value)}
          />
          {errors.etape && <p className="mt-1 text-xs text-red-400">{errors.etape}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            label="Durée estimée (minutes)"
            id="dureeMinutes"
            type="number"
            min="1"
            max="60"
            placeholder="Ex: 15"
            value={form.dureeMinutes}
            onChange={(e) => update('dureeMinutes', e.target.value)}
          />
          {errors.dureeMinutes && <p className="mt-1 text-xs text-red-400">{errors.dureeMinutes}</p>}
        </div>
        <div>
          <Input
            label="Budget estimé (€)"
            id="budget"
            type="number"
            min="0"
            placeholder="Ex: 25000"
            value={form.budget}
            onChange={(e) => update('budget', e.target.value)}
          />
          {errors.budget && <p className="mt-1 text-xs text-red-400">{errors.budget}</p>}
        </div>
      </div>

      <div>
        <Select
          label="Profil réalisateur"
          id="profilRealisateur"
          options={PROFIL_OPTIONS}
          placeholder="Sélectionner un profil"
          value={form.profilRealisateur}
          onChange={(e) => update('profilRealisateur', e.target.value)}
        />
        {errors.profilRealisateur && <p className="mt-1 text-xs text-red-400">{errors.profilRealisateur}</p>}
      </div>

      {/* Lieu de tournage */}
      <div>
        <CityAutocomplete
          label="Lieu de tournage"
          id="lieuTournage"
          value={form.lieuTournage}
          onSelect={handleTournageSelect}
          onClear={handleTournageClear}
          placeholder="Rechercher une commune…"
        />
        {form.regionLabel && (
          <span className="mt-1.5 inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
            Région : {form.regionLabel}
          </span>
        )}
        {errors.lieuTournage && <p className="mt-1 text-xs text-red-400">{errors.lieuTournage}</p>}
      </div>

      {/* Auto-production */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.autoProduction}
          onChange={(e) => {
            const checked = e.target.checked;
            setForm((f) => ({
              ...f,
              autoProduction: checked,
              ...(checked ? { productionNom: '', productionVille: '', regionProduction: '', regionProductionLabel: '' } : {}),
            }));
          }}
          className="mt-1 h-4 w-4 rounded border-border bg-surface accent-accent"
        />
        <div>
          <span className="text-sm font-medium text-text-primary">Auto-production (pas de société de production)</span>
          <p className="text-xs text-text-muted mt-0.5">Tu portes le projet seul, sans producteur délégué.</p>
        </div>
      </label>

      {/* Production */}
      {!form.autoProduction && (
        <fieldset className="space-y-4 rounded-lg border border-border p-4">
          <legend className="px-2 text-sm font-medium text-text-secondary">Production (optionnel)</legend>
          <Input
            label="Société de production"
            id="productionNom"
            placeholder="Ex: Les Films du Fleuve"
            value={form.productionNom}
            onChange={(e) => update('productionNom', e.target.value)}
          />
          <div>
            <CityAutocomplete
              label="Ville de domiciliation"
              id="productionVille"
              value={form.productionVille}
              onSelect={handleProductionVilleSelect}
              onClear={handleProductionVilleClear}
              placeholder="Rechercher une commune…"
            />
            {form.regionProductionLabel && (
              <span className="mt-1.5 inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                Région : {form.regionProductionLabel}
              </span>
            )}
          </div>
        </fieldset>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="submit">
          {isEdit ? 'Mettre à jour le projet' : 'Créer le projet'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push('/projets')}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
