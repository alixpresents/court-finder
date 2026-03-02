'use client';

import { GripVertical, Trash2 } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { FINANCEMENT_CATEGORY_LABELS, FINANCEMENT_CATEGORY_COLORS } from '@/lib/constants';
import type { FinancementSource, Aide } from '@/lib/types';

interface SourceRowProps {
  source: FinancementSource;
  aide?: Aide;
  onMontantChange: (id: string, montant: number) => void;
  onRemove: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
}

export default function SourceRow({
  source,
  aide,
  onMontantChange,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
}: SourceRowProps) {
  const color = FINANCEMENT_CATEGORY_COLORS[source.category];
  const min = aide?.montantMin ?? 0;
  const max = aide?.montantMax ?? 999999;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, source.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, source.id)}
      className="group flex items-center gap-3 rounded-lg border border-border bg-surface p-3 transition-colors hover:border-border-hover"
    >
      <div className="cursor-grab text-text-muted hover:text-text-secondary active:cursor-grabbing">
        <GripVertical size={16} />
      </div>

      <div
        className="h-8 w-1 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">{source.label}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <Badge className="bg-white/5 text-text-muted">
            {FINANCEMENT_CATEGORY_LABELS[source.category]}
          </Badge>
          {aide?.tauxSelection != null && (
            <span className="text-xs text-text-muted">~{aide.tauxSelection}% sélection</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="relative">
          <input
            type="number"
            min={min}
            max={max}
            step={500}
            value={source.montant || ''}
            onChange={(e) => onMontantChange(source.id, Number(e.target.value))}
            className="w-28 rounded-lg border border-border bg-surface-hover px-3 py-1.5 text-right text-sm text-text-primary tabular-nums outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/25"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted pointer-events-none">€</span>
        </div>

        <button
          onClick={() => onRemove(source.id)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
