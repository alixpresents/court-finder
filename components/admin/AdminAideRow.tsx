'use client';

import Badge from '@/components/ui/Badge';
import { AIDE_TYPE_LABELS, AIDE_TYPE_COLORS } from '@/lib/constants';
import { formatShortDate, daysUntil } from '@/lib/dates';
import type { Aide } from '@/lib/types';

interface AdminAideRowProps {
  aide: Aide;
  selected: boolean;
  onSelect: (id: string) => void;
  onClick: () => void;
}

export default function AdminAideRow({ aide, selected, onSelect, onClick }: AdminAideRowProps) {
  const days = daysUntil(aide.deadline);
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
          onChange={() => onSelect(aide.id)}
          className="h-3.5 w-3.5 rounded border-border accent-accent"
        />
      </td>
      <td className="px-3 py-2.5">
        <span className="text-sm text-text-primary font-medium">{aide.nom}</span>
        {aide.id.startsWith('admin-') && (
          <span className="ml-2 text-[10px] text-accent-purple font-medium">CUSTOM</span>
        )}
      </td>
      <td className="px-3 py-2.5 text-sm text-text-secondary hidden md:table-cell">{aide.organisme}</td>
      <td className="px-3 py-2.5 hidden sm:table-cell">
        <Badge className={AIDE_TYPE_COLORS[aide.type]}>
          {AIDE_TYPE_LABELS[aide.type]}
        </Badge>
      </td>
      <td className="px-3 py-2.5 text-sm font-mono text-text-secondary hidden lg:table-cell">
        {aide.montantMax > 0 ? `${(aide.montantMin / 1000).toFixed(0)}k–${(aide.montantMax / 1000).toFixed(0)}k €` : '—'}
      </td>
      <td className="px-3 py-2.5 text-sm font-mono text-text-secondary hidden md:table-cell">
        {formatShortDate(aide.deadline)}
      </td>
      <td className="px-3 py-2.5">
        <Badge className={isExpired ? 'bg-red-500/15 text-red-400' : 'bg-emerald-500/15 text-emerald-400'}>
          {isExpired ? 'Expirée' : 'Active'}
        </Badge>
      </td>
    </tr>
  );
}
