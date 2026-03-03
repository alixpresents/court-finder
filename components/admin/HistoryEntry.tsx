'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { ADMIN_ACTION_LABELS, ADMIN_ACTION_COLORS, ADMIN_ENTITY_LABELS } from '@/lib/constants';
import { formatDateTime } from '@/lib/dates';
import type { AdminHistoryEntry } from '@/lib/types';

interface HistoryEntryProps {
  entry: AdminHistoryEntry;
}

export default function HistoryEntry({ entry }: HistoryEntryProps) {
  const [expanded, setExpanded] = useState(false);
  const hasChanges = entry.changes && Object.keys(entry.changes).length > 0;

  return (
    <div className="border-b border-border last:border-0">
      <div
        className={`flex items-center gap-3 px-3 py-3 ${hasChanges ? 'cursor-pointer hover:bg-surface-hover/50' : ''} transition-colors`}
        onClick={() => hasChanges && setExpanded(!expanded)}
      >
        {hasChanges ? (
          expanded ? <ChevronDown size={14} className="text-text-tertiary shrink-0" /> : <ChevronRight size={14} className="text-text-tertiary shrink-0" />
        ) : (
          <span className="w-3.5 shrink-0" />
        )}

        <Badge className={ADMIN_ACTION_COLORS[entry.action]}>
          {ADMIN_ACTION_LABELS[entry.action]}
        </Badge>

        <Badge className="bg-white/8 text-text-secondary">
          {ADMIN_ENTITY_LABELS[entry.entityType]}
        </Badge>

        <span className="flex-1 min-w-0 text-sm text-text-primary truncate">{entry.entityName}</span>

        <span className="text-xs font-mono text-text-tertiary shrink-0 tabular-nums">
          {formatDateTime(entry.timestamp)}
        </span>
      </div>

      {expanded && entry.changes && (
        <div className="px-10 pb-3 space-y-1">
          {Object.entries(entry.changes).map(([field, { before, after }]) => (
            <div key={field} className="text-xs">
              <span className="text-text-tertiary font-medium">{field}</span>
              <span className="text-text-tertiary mx-1">:</span>
              <span className="text-red-400/70 line-through">{String(before ?? '—')}</span>
              <span className="text-text-tertiary mx-1">→</span>
              <span className="text-accent">{String(after ?? '—')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
