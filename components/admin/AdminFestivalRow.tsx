'use client';

import { Star } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { FESTIVAL_CATEGORIE_LABELS } from '@/lib/constants';
import { formatShortDate, daysUntil } from '@/lib/dates';
import type { Festival } from '@/lib/types';

interface AdminFestivalRowProps {
  festival: Festival;
  selected: boolean;
  onSelect: (id: string) => void;
  onClick: () => void;
}

export default function AdminFestivalRow({ festival, selected, onSelect, onClick }: AdminFestivalRowProps) {
  const days = daysUntil(festival.deadline);
  const isExpired = days < 0;

  return (
    <tr
      className="border-b border-border hover:bg-surface-hover/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <td className="px-3 py-2.5 w-10" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(festival.id)}
          className="h-3.5 w-3.5 rounded border-border accent-accent"
        />
      </td>
      <td className="px-3 py-2.5">
        <span className="text-sm text-text-primary font-medium">{festival.nom}</span>
        {festival.id.startsWith('admin-') && (
          <span className="ml-2 text-[10px] text-accent-purple font-medium">CUSTOM</span>
        )}
      </td>
      <td className="px-3 py-2.5 text-sm text-text-secondary hidden md:table-cell">
        {festival.ville}, {festival.pays}
      </td>
      <td className="px-3 py-2.5 text-sm font-mono text-text-secondary hidden md:table-cell">
        {formatShortDate(festival.deadline)}
      </td>
      <td className="px-3 py-2.5 hidden sm:table-cell">
        <Badge className="bg-festival/10 text-festival">
          {FESTIVAL_CATEGORIE_LABELS[festival.categorie]}
        </Badge>
      </td>
      <td className="px-3 py-2.5 hidden lg:table-cell text-center">
        {festival.oscarQualifying && (
          <Star size={14} className="text-amber-400 fill-amber-400 inline" />
        )}
      </td>
      <td className="px-3 py-2.5 hidden sm:table-cell">
        <Badge className={
          festival.categorie === 'A' ? 'bg-accent-purple/15 text-accent-purple' :
          festival.categorie === 'B' ? 'bg-blue-500/15 text-blue-400' :
          'bg-white/10 text-text-secondary'
        }>
          {festival.categorie}
        </Badge>
      </td>
      <td className="px-3 py-2.5">
        <Badge className={isExpired ? 'bg-red-500/15 text-red-400' : 'bg-emerald-500/15 text-emerald-400'}>
          {isExpired ? 'Expirée' : 'Active'}
        </Badge>
      </td>
    </tr>
  );
}
