import type { Genre, Etape, ProfilRealisateur, AideType, FestivalCategorie, SubmissionStatus } from './types';

export const GENRE_LABELS: Record<Genre, string> = {
  fiction: 'Fiction',
  documentaire: 'Documentaire',
  animation: 'Animation',
  experimental: 'Expérimental',
  hybride: 'Hybride',
};

export const ETAPE_LABELS: Record<Etape, string> = {
  ecriture: 'Écriture',
  developpement: 'Développement',
  preproduction: 'Pré-production',
  production: 'Production',
  postproduction: 'Post-production',
};

export const PROFIL_LABELS: Record<ProfilRealisateur, string> = {
  premier_film: 'Premier film',
  emergent: 'Émergent',
  confirme: 'Confirmé',
};

export const AIDE_TYPE_LABELS: Record<AideType, string> = {
  nationale: 'Nationale',
  regionale: 'Régionale',
  privee: 'Privée',
};

export const FESTIVAL_CATEGORIE_LABELS: Record<FestivalCategorie, string> = {
  A: 'Catégorie A',
  B: 'Catégorie B',
  C: 'Catégorie C',
};

export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  brouillon: 'Brouillon',
  en_preparation: 'En préparation',
  soumise: 'Soumise',
  acceptee: 'Acceptée',
  refusee: 'Refusée',
};

export const SUBMISSION_STATUS_COLORS: Record<SubmissionStatus, string> = {
  brouillon: 'bg-white/10 text-white/60',
  en_preparation: 'bg-amber-500/15 text-amber-400',
  soumise: 'bg-blue-500/15 text-blue-400',
  acceptee: 'bg-emerald-500/15 text-emerald-400',
  refusee: 'bg-red-500/15 text-red-400',
};

export const GENRE_COLORS: Record<Genre, string> = {
  fiction: 'bg-blue-500/15 text-blue-400',
  documentaire: 'bg-emerald-500/15 text-emerald-400',
  animation: 'bg-purple-500/15 text-purple-400',
  experimental: 'bg-rose-500/15 text-rose-400',
  hybride: 'bg-amber-500/15 text-amber-400',
};

export const AIDE_TYPE_COLORS: Record<AideType, string> = {
  nationale: 'bg-blue-500/15 text-blue-400',
  regionale: 'bg-emerald-500/15 text-emerald-400',
  privee: 'bg-purple-500/15 text-purple-400',
};

export const ETAPE_ORDER: Etape[] = [
  'ecriture',
  'developpement',
  'preproduction',
  'production',
  'postproduction',
];

export const SUBMISSION_PIPELINE: SubmissionStatus[] = [
  'brouillon',
  'en_preparation',
  'soumise',
  'acceptee',
  'refusee',
];
