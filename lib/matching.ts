import type { Project, Aide, Festival, MatchResult } from './types';

function matchGenre(projectGenre: string, targetGenres: string[]): number {
  return targetGenres.includes(projectGenre) ? 25 : 0;
}

function matchEtape(projectEtape: string, targetEtapes: string[]): number {
  return targetEtapes.includes(projectEtape) ? 25 : 0;
}

function matchProfil(projectProfil: string, targetProfils: string[]): number {
  return targetProfils.includes(projectProfil) ? 15 : 0;
}

function matchBudget(projectBudget: number, montantMax?: number, budgetMax?: number): number {
  if (!budgetMax) return 15;
  if (projectBudget <= budgetMax) return 15;
  if (projectBudget <= budgetMax * 1.5) return 8;
  return 0;
}

function matchDuree(projectDuree: number, dureeMax?: number): number {
  if (!dureeMax) return 10;
  if (projectDuree <= dureeMax) return 10;
  if (projectDuree <= dureeMax * 1.2) return 5;
  return 0;
}

function matchRegion(
  regionTournage: string,
  regionProduction: string | undefined,
  targetRegions?: string[]
): { score: number; source: 'tournage' | 'production' | 'both' | null } {
  if (!targetRegions || targetRegions.length === 0)
    return { score: 10, source: null };

  const tMatch = targetRegions.includes(regionTournage);
  const pMatch = !!regionProduction && targetRegions.includes(regionProduction);

  if (tMatch && pMatch) return { score: 10, source: 'both' };
  if (tMatch) return { score: 10, source: 'tournage' };
  if (pMatch) return { score: 10, source: 'production' };
  return { score: 0, source: null };
}

function matchProducer(
  isAutoProduction: boolean,
  requiresProducer?: boolean,
  autoProductionEligible?: boolean
): { modifier: number; issue: 'requires_producer' | 'boost_auto' | null } {
  if (!isAutoProduction) return { modifier: 0, issue: null };
  if (requiresProducer) return { modifier: -20, issue: 'requires_producer' };
  if (autoProductionEligible) return { modifier: 5, issue: 'boost_auto' };
  return { modifier: 0, issue: null };
}

export function matchAide(project: Project, aide: Aide): MatchResult {
  const regionResult = matchRegion(project.region, project.regionProduction, aide.regions);

  const details = {
    genre: matchGenre(project.genre, aide.genres),
    etape: matchEtape(project.etape, aide.etapes),
    profil: matchProfil(project.profilRealisateur, aide.profils),
    budget: matchBudget(project.budget, aide.montantMax, aide.budgetMax),
    duree: matchDuree(project.dureeMinutes, aide.dureeMax),
    region: regionResult.score,
  };

  const baseScore = details.genre + details.etape + details.profil + details.budget + details.duree + details.region;
  const producer = matchProducer(!!project.autoProduction, aide.requiresProducer, aide.autoProductionEligible);
  const score = Math.max(0, Math.min(100, baseScore + producer.modifier));

  return { score, details, regionSource: regionResult.source, producerIssue: producer.issue };
}

export function matchFestival(project: Project, festival: Festival): MatchResult {
  const details = {
    genre: matchGenre(project.genre, festival.genres),
    etape: project.etape === 'postproduction' || project.etape === 'production' ? 25 : 0,
    profil: 15,
    budget: 15,
    duree: matchDuree(project.dureeMinutes, festival.dureeMax),
    region: 10,
  };

  const baseScore = details.genre + details.etape + details.profil + details.budget + details.duree + details.region;
  const oscarBoost = festival.oscarQualifying ? 5 : 0;
  const score = Math.min(100, baseScore + oscarBoost);

  return { score, details };
}
