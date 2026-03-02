import type { Submission, SubmissionStatus } from '@/lib/types';
import { SUBMISSION_PIPELINE, SUBMISSION_STATUS_LABELS, SUBMISSION_STATUS_COLORS } from '@/lib/constants';

interface StatusPipelineProps {
  submissions: Submission[];
}

export default function StatusPipeline({ submissions }: StatusPipelineProps) {
  const counts: Record<SubmissionStatus, number> = {
    brouillon: 0,
    en_preparation: 0,
    soumise: 0,
    acceptee: 0,
    refusee: 0,
  };

  submissions.forEach((s) => {
    counts[s.status]++;
  });

  return (
    <div className="flex items-center gap-1">
      {SUBMISSION_PIPELINE.map((status, i) => (
        <div key={status} className="flex items-center flex-1">
          <div className="flex-1 rounded-lg border border-border bg-surface p-3 text-center">
            <p className="text-lg font-bold font-sans text-text-primary">{counts[status]}</p>
            <p className="text-[11px] text-text-muted mt-0.5">{SUBMISSION_STATUS_LABELS[status]}</p>
          </div>
          {i < SUBMISSION_PIPELINE.length - 1 && (
            <div className="mx-1 text-text-muted text-xs">&rarr;</div>
          )}
        </div>
      ))}
    </div>
  );
}
