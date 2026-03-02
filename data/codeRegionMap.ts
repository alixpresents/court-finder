export const CODE_REGION_MAP: Record<string, { value: string; label: string }> = {
  '11': { value: 'ile-de-france', label: 'Île-de-France' },
  '24': { value: 'centre-val-de-loire', label: 'Centre-Val de Loire' },
  '27': { value: 'bourgogne-franche-comte', label: 'Bourgogne-Franche-Comté' },
  '28': { value: 'normandie', label: 'Normandie' },
  '32': { value: 'hauts-de-france', label: 'Hauts-de-France' },
  '44': { value: 'grand-est', label: 'Grand Est' },
  '52': { value: 'pays-de-la-loire', label: 'Pays de la Loire' },
  '53': { value: 'bretagne', label: 'Bretagne' },
  '75': { value: 'nouvelle-aquitaine', label: 'Nouvelle-Aquitaine' },
  '76': { value: 'occitanie', label: 'Occitanie' },
  '84': { value: 'auvergne-rhone-alpes', label: 'Auvergne-Rhône-Alpes' },
  '93': { value: 'provence-alpes-cote-dazur', label: "Provence-Alpes-Côte d'Azur" },
  '94': { value: 'corse', label: 'Corse' },
};

export function resolveRegion(codeRegion: string): { value: string; label: string } | null {
  return CODE_REGION_MAP[codeRegion] ?? null;
}
