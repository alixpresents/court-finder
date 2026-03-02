'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
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
      <div className="mb-8">
        <h1 className="font-sans text-2xl font-bold text-text-primary">Modifier le projet</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Mettez à jour les informations de &laquo;&nbsp;{project.titre}&nbsp;&raquo;.
        </p>
      </div>
      <ProjectForm editProject={project} />
    </div>
  );
}
