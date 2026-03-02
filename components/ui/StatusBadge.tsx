import type { SubmissionStatus } from '@/lib/types';
import { SUBMISSION_STATUS_LABELS, SUBMISSION_STATUS_COLORS } from '@/lib/constants';
import Badge from './Badge';

interface StatusBadgeProps {
  status: SubmissionStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge className={SUBMISSION_STATUS_COLORS[status]}>
      {SUBMISSION_STATUS_LABELS[status]}
    </Badge>
  );
}
