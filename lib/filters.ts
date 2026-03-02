import type { Aide, Festival, Genre, AideType } from './types';

export interface AideFilters {
  search: string;
  type: AideType | '';
  genre: Genre | '';
}

export interface FestivalFilters {
  search: string;
  genre: Genre | '';
  pays: string;
}

export function filterAides(list: Aide[], filters: AideFilters): Aide[] {
  return list.filter((a) => {
    if (filters.search && !a.nom.toLowerCase().includes(filters.search.toLowerCase()) && !a.organisme.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.type && a.type !== filters.type) return false;
    if (filters.genre && !a.genres.includes(filters.genre)) return false;
    return true;
  });
}

export function filterFestivals(list: Festival[], filters: FestivalFilters): Festival[] {
  return list.filter((f) => {
    if (filters.search && !f.nom.toLowerCase().includes(filters.search.toLowerCase()) && !f.ville.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.genre && !f.genres.includes(filters.genre)) return false;
    if (filters.pays && f.pays !== filters.pays) return false;
    return true;
  });
}
