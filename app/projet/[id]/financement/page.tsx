'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { useProject } from '@/context/ProjectContext';
import FinancementSimulator from '@/components/financement/FinancementSimulator';

export default function FinancementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { projects, isHydrated } = useProject();

  if (!isHydrated) return null;

  const project = projects.find((p) => p.id === id);
  if (!project) return notFound();

  const hasBudget = project.budget > 0;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/projet/${project.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Retour au projet
        </Link>
        <h1 className="font-sans text-2xl font-bold text-text-primary">Plan de financement</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Simule le plan de financement pour &laquo;&nbsp;{project.titre}&nbsp;&raquo;
          {hasBudget && (
            <> — Budget : {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(project.budget)}</>
          )}
        </p>
      </div>

      {!hasBudget ? (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="text-sm text-text-secondary mb-4">
            Renseigne d&apos;abord un budget estimé dans ton projet pour utiliser le simulateur.
          </p>
          <Link
            href={`/projet/${project.id}`}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background hover:bg-accent-hover transition-colors"
          >
            Modifier le projet
          </Link>
        </div>
      ) : (
        <FinancementSimulator project={project} />
      )}
    </div>
  );
}
