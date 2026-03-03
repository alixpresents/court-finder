'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Film, User, BarChart3, Check } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import CityAutocomplete from '@/components/ui/CityAutocomplete';
import { GENRES } from '@/data/genres';
import { ETAPE_LABELS, PROFIL_LABELS } from '@/lib/constants';
import { resolveRegion } from '@/data/codeRegionMap';
import { aides } from '@/data/aides';
import { festivals } from '@/data/festivals';
import { matchAide, matchFestival } from '@/lib/matching';
import type { Project, Etape, ProfilRealisateur } from '@/lib/types';

const ETAPE_OPTIONS = Object.entries(ETAPE_LABELS).map(([value, label]) => ({ value, label }));
const PROFIL_OPTIONS = Object.entries(PROFIL_LABELS).map(([value, label]) => ({ value, label }));

const STEPS = [
  { label: 'Bienvenue', icon: Sparkles },
  { label: 'Ton projet', icon: Film },
  { label: 'Ton profil', icon: User },
  { label: 'Résultats', icon: BarChart3 },
];

function AnimatedCount({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const step = Math.max(1, Math.floor(duration / target));
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      setCount(current);
    }, step);
    return () => clearInterval(interval);
  }, [target, duration]);

  return <span>{count}</span>;
}

export default function Onboarding() {
  const { addProject, setActiveProject } = useProject();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [isAnimating, setIsAnimating] = useState(false);

  const [form, setForm] = useState({
    titre: '',
    genre: '',
    etape: '',
    dureeMinutes: '',
    profilRealisateur: '',
    lieuTournage: '',
    region: '',
    regionLabel: '',
    autoProduction: false,
    productionNom: '',
    productionVille: '',
    regionProduction: '',
    regionProductionLabel: '',
  });

  const [results, setResults] = useState({ aideCount: 0, festivalCount: 0 });

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function goTo(nextStep: number) {
    if (isAnimating) return;
    setDirection(nextStep > step ? 'forward' : 'back');
    setIsAnimating(true);
    setStep(nextStep);
    setTimeout(() => setIsAnimating(false), 400);
  }

  const buildProject = useCallback((): Project => {
    return {
      id: crypto.randomUUID(),
      titre: form.titre.trim() || 'Mon projet',
      logline: '',
      genre: (form.genre || 'fiction') as Project['genre'],
      etape: (form.etape || 'ecriture') as Etape,
      dureeMinutes: Number(form.dureeMinutes) || 15,
      budget: 0,
      profilRealisateur: (form.profilRealisateur || 'premier_film') as ProfilRealisateur,
      region: form.region || '',
      lieuTournage: form.lieuTournage || undefined,
      autoProduction: form.autoProduction || undefined,
      productionNom: form.autoProduction ? undefined : (form.productionNom.trim() || undefined),
      productionVille: form.autoProduction ? undefined : (form.productionVille || undefined),
      regionProduction: form.autoProduction ? undefined : (form.regionProduction || undefined),
      createdAt: new Date().toISOString(),
    };
  }, [form]);

  function computeResults() {
    const project = buildProject();
    const eligibleAides = aides.filter((a) => matchAide(project, a).score >= 50).length;
    const eligibleFestivals = festivals.filter((f) => matchFestival(project, f).score >= 50).length;
    setResults({ aideCount: eligibleAides, festivalCount: eligibleFestivals });
  }

  function handleGoToResults() {
    computeResults();
    goTo(3);
  }

  function handleComplete() {
    const project = buildProject();
    addProject(project);
    setActiveProject(project.id);
    router.push('/');
  }

  function handleSkip() {
    const project = buildProject();
    addProject(project);
    setActiveProject(project.id);
    router.push('/');
  }

  function handleTournageSelect(city: string, codeRegion: string) {
    const resolved = resolveRegion(codeRegion);
    setForm((f) => ({
      ...f,
      lieuTournage: city,
      region: resolved?.value ?? '',
      regionLabel: resolved?.label ?? '',
    }));
  }

  function handleTournageClear() {
    setForm((f) => ({ ...f, lieuTournage: '', region: '', regionLabel: '' }));
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
    setForm((f) => ({ ...f, productionVille: '', regionProduction: '', regionProductionLabel: '' }));
  }

  const step1Valid = form.titre.trim().length > 0 && form.genre && form.etape;
  const step2Valid = form.profilRealisateur.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Circle stepper */}
      <div className="flex items-center justify-center gap-0 px-4 pt-8 pb-4">
        {STEPS.map((s, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <div key={s.label} className="flex items-center">
              {i > 0 && (
                <div className={`h-[2px] w-8 sm:w-12 transition-colors duration-300 ${done ? 'bg-accent-purple' : 'bg-border'}`} />
              )}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    done
                      ? 'border-accent-purple bg-accent-purple text-white'
                      : active
                        ? 'border-accent-purple bg-accent-purple/15 text-accent-purple'
                        : 'border-border bg-transparent text-text-tertiary'
                  }`}
                >
                  {done ? <Check size={16} strokeWidth={3} /> : <s.icon size={16} />}
                </div>
                <span className={`text-[10px] font-medium ${active ? 'text-text-primary' : 'text-text-tertiary'}`}>
                  {s.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Skip link */}
      {step < 3 && (
        <div className="flex justify-center">
          <button
            onClick={handleSkip}
            className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
          >
            Je remplirai plus tard
          </button>
        </div>
      )}

      {/* Steps content */}
      <div className="flex-1 flex items-center justify-center overflow-hidden px-4">
        <div
          className="w-full max-w-lg transition-all duration-400 ease-out"
          style={{
            transform: isAnimating
              ? direction === 'forward'
                ? 'translateX(40px)'
                : 'translateX(-40px)'
              : 'translateX(0)',
            opacity: isAnimating ? 0 : 1,
          }}
        >
          {/* Step 0 — Bienvenue */}
          {step === 0 && (
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-purple/10">
                <Sparkles className="h-8 w-8 text-accent-purple" />
              </div>
              <div className="space-y-3">
                <h1 className="font-serif text-4xl italic text-accent-gold">
                  Court·Finder
                </h1>
                <p className="text-base text-text-secondary max-w-sm">
                  Court·Finder t&apos;aide à financer et diffuser ton court-métrage. On commence ?
                </p>
              </div>
              <button
                onClick={() => goTo(1)}
                className="inline-flex items-center gap-2 rounded-md bg-accent-purple px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] w-full max-w-xs justify-center min-h-[48px]"
              >
                C&apos;est parti
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 1 — Ton projet */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold text-text-primary">Ton projet</h2>
                <p className="text-sm text-text-secondary">
                  Dis-nous l&apos;essentiel sur ton court-métrage.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Titre du projet"
                  id="ob-titre"
                  placeholder="Mon premier court"
                  value={form.titre}
                  onChange={(e) => update('titre', e.target.value)}
                />
                <Select
                  label="Genre"
                  id="ob-genre"
                  options={GENRES}
                  placeholder="Sélectionner un genre"
                  value={form.genre}
                  onChange={(e) => update('genre', e.target.value)}
                />
                <Select
                  label="Étape du projet"
                  id="ob-etape"
                  options={ETAPE_OPTIONS}
                  placeholder="Où en es-tu ?"
                  value={form.etape}
                  onChange={(e) => update('etape', e.target.value)}
                />
                <Input
                  label="Durée estimée (minutes)"
                  id="ob-duree"
                  type="number"
                  min="1"
                  max="60"
                  placeholder="15"
                  value={form.dureeMinutes}
                  onChange={(e) => update('dureeMinutes', e.target.value)}
                />
              </div>

              <button
                onClick={() => goTo(2)}
                disabled={!step1Valid}
                className="inline-flex items-center gap-2 rounded-md bg-accent-purple px-5 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed w-full justify-center min-h-[48px]"
              >
                Continuer
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 2 — Ton profil */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold text-text-primary">Ton profil</h2>
                <p className="text-sm text-text-secondary">
                  Quelques infos pour affiner tes résultats.
                </p>
              </div>

              <div className="space-y-4">
                <Select
                  label="Profil réalisateur"
                  id="ob-profil"
                  options={PROFIL_OPTIONS}
                  placeholder="Sélectionner ton profil"
                  value={form.profilRealisateur}
                  onChange={(e) => update('profilRealisateur', e.target.value)}
                />

                <div>
                  <CityAutocomplete
                    label="Lieu de tournage"
                    id="ob-lieu"
                    value={form.lieuTournage}
                    onSelect={handleTournageSelect}
                    onClear={handleTournageClear}
                    placeholder="Rechercher une commune..."
                  />
                  {form.regionLabel && (
                    <span className="mt-1.5 inline-block rounded bg-accent-purple/10 px-2.5 py-0.5 text-xs font-medium text-accent-purple">
                      Région : {form.regionLabel}
                    </span>
                  )}
                </div>

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
                    className="mt-1 h-4 w-4 rounded border-border bg-surface accent-accent-purple"
                  />
                  <div>
                    <span className="text-sm font-medium text-text-primary">Auto-production</span>
                    <p className="text-xs text-text-tertiary mt-0.5">Tu portes le projet seul, sans producteur délégué.</p>
                  </div>
                </label>

                {!form.autoProduction && (
                  <fieldset className="space-y-3 rounded-lg border border-border p-4">
                    <legend className="px-2 text-sm font-medium text-text-secondary">
                      Production (optionnel)
                    </legend>
                    <Input
                      label="Société de production"
                      id="ob-prod-nom"
                      placeholder="Ex: Les Films du Fleuve"
                      value={form.productionNom}
                      onChange={(e) => update('productionNom', e.target.value)}
                    />
                    <div>
                      <CityAutocomplete
                        label="Ville de domiciliation"
                        id="ob-prod-ville"
                        value={form.productionVille}
                        onSelect={handleProductionVilleSelect}
                        onClear={handleProductionVilleClear}
                        placeholder="Rechercher une commune..."
                      />
                      {form.regionProductionLabel && (
                        <span className="mt-1.5 inline-block rounded bg-accent-purple/10 px-2.5 py-0.5 text-xs font-medium text-accent-purple">
                          Région : {form.regionProductionLabel}
                        </span>
                      )}
                    </div>
                  </fieldset>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => goTo(1)}
                  className="rounded-md px-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors min-h-[48px]"
                >
                  Retour
                </button>
                <button
                  onClick={handleGoToResults}
                  disabled={!step2Valid}
                  className="flex-1 inline-flex items-center gap-2 justify-center rounded-md bg-accent-purple px-5 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed min-h-[48px]"
                >
                  Voir mes résultats
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Résultats */}
          {step === 3 && (
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-text-primary">
                  Tes opportunités
                </h2>
                <p className="text-sm text-text-secondary">
                  Voici ce qu&apos;on a trouvé pour ton projet.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
                <div className="rounded-lg border border-accent/20 bg-accent/5 p-6 space-y-1 animate-confetti" style={{ boxShadow: '0 0 40px rgba(62,207,142,0.08)' }}>
                  <div className="text-5xl font-bold text-accent font-mono tabular-nums">
                    <AnimatedCount target={results.aideCount} />
                  </div>
                  <p className="text-sm text-text-secondary">aides trouvées</p>
                </div>
                <div className="rounded-lg border border-festival/20 bg-festival/5 p-6 space-y-1 animate-confetti" style={{ animationDelay: '150ms', boxShadow: '0 0 40px rgba(232,197,71,0.08)' }}>
                  <div className="text-5xl font-bold text-festival font-mono tabular-nums">
                    <AnimatedCount target={results.festivalCount} />
                  </div>
                  <p className="text-sm text-text-secondary">festivals qui matchent</p>
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-text-on-accent transition-all hover:brightness-110 active:scale-[0.98] w-full max-w-xs justify-center min-h-[48px]"
              >
                Explorer mes opportunités
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
