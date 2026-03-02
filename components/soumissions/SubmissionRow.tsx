'use client';

import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import type { Submission, SubmissionStatus } from '@/lib/types';
import { SUBMISSION_STATUS_LABELS } from '@/lib/constants';
import { formatShortDate, daysUntil } from '@/lib/dates';

interface SubmissionRowProps {
  submission: Submission;
  onStatusChange: (id: string, status: SubmissionStatus) => void;
  onRemove: (id: string) => void;
}

const STATUS_OPTIONS: SubmissionStatus[] = ['brouillon', 'en_preparation', 'soumise', 'acceptee', 'refusee'];

export default function SubmissionRow({ submission, onStatusChange, onRemove }: SubmissionRowProps) {
  const days = daysUntil(submission.deadline);
  const href = submission.targetType === 'aide'
    ? `/aides/${submission.targetId}`
    : `/festivals/${submission.targetId}`;

  return (
    <tr className="border-b border-border hover:bg-surface-hover/50 transition-colors">
      <td className="px-4 py-3">
        <Link href={href} className="text-sm text-text-primary hover:text-accent transition-colors">
          {submission.targetNom}
        </Link>
        <span className={`ml-2 text-xs ${submission.targetType === 'aide' ? 'text-accent' : 'text-festival'}`}>
          {submission.targetType === 'aide' ? 'Aide' : 'Festival'}
        </span>
      </td>
      <td className="px-4 py-3">
        <select
          value={submission.status}
          onChange={(e) => onStatusChange(submission.id, e.target.value as SubmissionStatus)}
          className="rounded-md border border-border bg-surface-hover px-2 py-1 text-xs text-text-primary outline-none"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{SUBMISSION_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-text-secondary">{formatShortDate(submission.deadline)}</span>
        {days >= 0 && days <= 14 && (
          <span className="ml-2 text-xs text-red-400">({days}j)</span>
        )}
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => onRemove(submission.id)}
          className="rounded p-1 text-text-muted hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  );
}
