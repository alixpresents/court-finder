import ProjectForm from '@/components/forms/ProjectForm';

export default function NouveauProjetPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-sans text-2xl font-bold text-text-primary">Nouveau projet</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Décrivez votre court métrage pour trouver les aides et festivals qui vous correspondent.
        </p>
      </div>
      <ProjectForm />
    </div>
  );
}
