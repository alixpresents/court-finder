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

function matchRegion(projectRegion: string, targetRegions?: string[]): number {
  if (!targetRegions || targetRegions.length === 0) return 10;
  return targetRegions.includes(projectRegion) ? 10 : 0;
}

export function matchAide(project: Project, aide: Aide): MatchResult {
  const details = {
    genre: matchGenre(project.genre, aide.genres),
    etape: matchEtape(project.etape, aide.etapes),
    profil: matchProfil(project.profilRealisateur, aide.profils),
    budget: matchBudget(project.budget, aide.montantMax, aide.budgetMax),
    duree: matchDuree(project.dureeMinutes, aide.dureeMax),
    region: matchRegion(project.region, aide.regions),
  };

  const score = details.genre + details.etape + details.profil + details.budget + details.duree + details.region;

  return { score, details };
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

  const score = details.genre + details.etape + details.profil + details.budget + details.duree + details.region;

  return { score, details };
}
