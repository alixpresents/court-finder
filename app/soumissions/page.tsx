'use client';

import { useMemo } from 'react';
import { ClipboardList } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { useSubmissions } from '@/context/SubmissionsContext';
import EmptyState from '@/components/ui/EmptyState';
import SubmissionStats from '@/components/soumissions/SubmissionStats';
import StatusPipeline from '@/components/soumissions/StatusPipeline';
import SubmissionBoard from '@/components/soumissions/SubmissionBoard';

export default function SoumissionsPage() {
  const { activeProject, isHydrated: projectHydrated } = useProject();
  const { submissions, updateStatus, removeSubmission, isHydrated } = useSubmissions();

  const filtered = useMemo(
    () => activeProject ? submissions.filter((s) => s.projectId === activeProject.id) : submissions,
    [submissions, activeProject],
  );

  if (!isHydrated || !projectHydrated) return null;

  if (filtered.length === 0) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="font-sans text-2xl font-bold text-text-primary">Suivi des soumissions</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Suivez l&apos;avancement de vos candidatures{activeProject ? ` pour "${activeProject.titre}"` : ''}.
          </p>
        </div>
        <EmptyState
          icon={ClipboardList}
          title="Aucune soumission"
          description="Explorez les aides et festivals, puis cliquez sur 'Suivre cette soumission' pour commencer à tracker vos candidatures."
          actionLabel="Découvrir les aides"
          actionHref="/aides"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-bold text-text-primary">Suivi des soumissions</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {filtered.length} soumission{filtered.length > 1 ? 's' : ''} en cours de suivi{activeProject ? ` pour "${activeProject.titre}"` : ''}.
        </p>
      </div>

      <SubmissionStats submissions={filtered} />
      <StatusPipeline submissions={filtered} />
      <SubmissionBoard
        submissions={filtered}
        onStatusChange={updateStatus}
        onRemove={removeSubmission}
      />
    </div>
  );
}
