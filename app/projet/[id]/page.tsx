'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PiggyBank } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import ProjectForm from '@/components/forms/ProjectForm';

export default function EditProjetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { projects, isHydrated } = useProject();

  if (!isHydrated) return null;

  const project = projects.find((p) => p.id === id);
  if (!project) return notFound();

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-sans text-2xl font-bold text-text-primary">Modifier le projet</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Mettez à jour les informations de &laquo;&nbsp;{project.titre}&nbsp;&raquo;.
          </p>
        </div>
        <Link
          href={`/projet/${project.id}/financement`}
          className="inline-flex items-center gap-2 rounded-lg bg-surface-hover px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors border border-border"
        >
          <PiggyBank size={16} />
          Plan de financement
        </Link>
      </div>
      <ProjectForm editProject={project} />
    </div>
  );
}
