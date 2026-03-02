import type { Genre } from '@/lib/types';

export const GENRES: { value: Genre; label: string }[] = [
  { value: 'fiction', label: 'Fiction' },
  { value: 'documentaire', label: 'Documentaire' },
  { value: 'animation', label: 'Animation' },
  { value: 'experimental', label: 'Expérimental' },
  { value: 'hybride', label: 'Hybride' },
];
