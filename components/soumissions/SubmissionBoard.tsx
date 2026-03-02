'use client';

import Card from '@/components/ui/Card';
import SubmissionRow from './SubmissionRow';
import type { Submission, SubmissionStatus } from '@/lib/types';

interface SubmissionBoardProps {
  submissions: Submission[];
  onStatusChange: (id: string, status: SubmissionStatus) => void;
  onRemove: (id: string) => void;
}

export default function SubmissionBoard({ submissions, onStatusChange, onRemove }: SubmissionBoardProps) {
  return (
    <Card className="overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-surface-hover/50">
            <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">Cible</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">Statut</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">Deadline</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-text-muted w-12"></th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => (
            <SubmissionRow
              key={sub.id}
              submission={sub}
              onStatusChange={onStatusChange}
              onRemove={onRemove}
            />
          ))}
        </tbody>
      </table>
    </Card>
  );
}
