'use client';

import { useMemo } from 'react';
import { ClipboardList, Send, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useProject } from '@/context/ProjectContext';
import { useSubmissions } from '@/context/SubmissionsContext';
import Button from '@/components/ui/Button';
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
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-6 relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-hover">
              <Send size={32} className="text-text-muted" />
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-surface border-2 border-border">
              <ClipboardList size={14} className="text-text-muted" />
            </div>
          </div>
          <h3 className="mb-2 font-sans text-lg font-semibold text-text-primary">
            Tu n&apos;as encore rien soumis
          </h3>
          <p className="mb-6 max-w-sm text-sm text-text-secondary">
            Commence par explorer tes festivals matchés et les aides qui te correspondent, puis clique sur &quot;Suivre cette soumission&quot;.
          </p>
          <div className="flex gap-3">
            <Link href="/festivals">
              <Button icon={Trophy}>Explorer les festivals</Button>
            </Link>
          </div>
        </div>
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
