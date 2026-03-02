import type { PremiereType, Submission } from './types';
import { festivals } from '@/data/festivals';
import { PREMIERE_HIERARCHY, PREMIERE_TYPE_LABELS } from './constants';

function premiereRank(type: PremiereType): number {
  return PREMIERE_HIERARCHY.indexOf(type);
}

export interface PremiereConflict {
  festivalId: string;
  festivalNom: string;
  premiereType: PremiereType;
  message: string;
}

/**
 * Check if adding a festival would create premiere conflicts with already-tracked festivals.
 *
 * Rules:
 * - A film shown at a festival requiring "première mondiale" cannot have been shown anywhere before.
 * - A film shown at a festival requiring "première internationale" can only have been shown in its home country.
 * - Same-level or higher-level premieres conflict with each other.
 */
export function detectPremiereConflicts(
  targetFestivalId: string,
  submissions: Submission[],
): PremiereConflict[] {
  const target = festivals.find((f) => f.id === targetFestivalId);
  if (!target || target.premiereType === 'aucune') return [];

  const targetRank = premiereRank(target.premiereType);
  const conflicts: PremiereConflict[] = [];

  const trackedFestivalIds = submissions
    .filter((s) => s.targetType === 'festival' && s.targetId !== targetFestivalId)
    .map((s) => s.targetId);

  for (const fId of trackedFestivalIds) {
    const f = festivals.find((fest) => fest.id === fId);
    if (!f) continue;

    const fRank = premiereRank(f.premiereType);

    // Conflict if the other festival has same or higher premiere requirement
    if (f.premiereType !== 'aucune' && fRank >= targetRank) {
      conflicts.push({
        festivalId: f.id,
        festivalNom: f.nom,
        premiereType: f.premiereType,
        message: `${f.nom} exige aussi une ${PREMIERE_TYPE_LABELS[f.premiereType].toLowerCase()}`,
      });
    }
  }

  return conflicts;
}

/**
 * Get all premiere conflicts for festivals already in submissions.
 * Returns a map: festivalId → list of conflicting festival IDs.
 */
export function getAllPremiereConflicts(
  submissions: Submission[],
): Map<string, PremiereConflict[]> {
  const map = new Map<string, PremiereConflict[]>();

  const festivalSubs = submissions.filter((s) => s.targetType === 'festival');

  for (const sub of festivalSubs) {
    const conflicts = detectPremiereConflicts(sub.targetId, submissions);
    if (conflicts.length > 0) {
      map.set(sub.targetId, conflicts);
    }
  }

  return map;
}

/**
 * Recommended submission order: festivals requiring the strictest premiere first.
 * Returns tracked festival IDs sorted from strictest to least strict premiere.
 */
export function getRecommendedOrder(submissions: Submission[]): string[] {
  const festivalSubs = submissions.filter((s) => s.targetType === 'festival');

  return festivalSubs
    .map((s) => {
      const f = festivals.find((fest) => fest.id === s.targetId);
      return { id: s.targetId, rank: f ? premiereRank(f.premiereType) : -1, deadline: f?.deadline ?? '' };
    })
    .sort((a, b) => b.rank - a.rank || a.deadline.localeCompare(b.deadline))
    .map((item) => item.id);
}
