'use client';

import { useState, useEffect } from 'react';
import { Crown, Check, X, Loader2 } from 'lucide-react';
import { usePlan } from '@/context/PlanContext';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

const ADVANTAGES = [
  'Projets illimités',
  'Matching intelligent',
  'Alertes email',
  'Export PDF',
  'Conseils stratégiques',
];

type ModalState = 'idle' | 'loading' | 'success';

export default function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  const { upgrade } = usePlan();
  const [state, setState] = useState<ModalState>('idle');
  const [annual, setAnnual] = useState(false);

  useEffect(() => {
    if (open) setState('idle');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state !== 'loading') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose, state]);

  useEffect(() => {
    if (state === 'success') {
      const timer = setTimeout(onClose, 1500);
      return () => clearTimeout(timer);
    }
  }, [state, onClose]);

  async function handleUpgrade() {
    setState('loading');
    await upgrade();
    setState('success');
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={state !== 'loading' ? onClose : undefined} />

      <div className="relative w-full max-w-md mx-4 rounded-xl border border-border bg-surface p-6 shadow-2xl">
        <button
          onClick={onClose}
          disabled={state === 'loading'}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors disabled:opacity-50"
        >
          <X size={18} />
        </button>

        {state === 'success' ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 mb-4 animate-[scale-in_0.3s_ease-out]">
              <Check size={28} className="text-accent" />
            </div>
            <h2 className="font-sans text-xl font-bold text-text-primary">
              Bienvenue sur Court·Finder Pro
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              Vous avez désormais accès à toutes les fonctionnalités.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                <Crown size={20} className="text-accent" />
              </div>
              <h2 className="font-sans text-lg font-semibold text-text-primary">
                Passez à Court·Finder Pro
              </h2>
            </div>

            <ul className="space-y-2 mb-5">
              {ADVANTAGES.map((a) => (
                <li key={a} className="flex items-center gap-2 text-sm text-text-secondary">
                  <Check size={15} className="text-accent shrink-0" />
                  {a}
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-center gap-3 mb-5">
              <button
                onClick={() => setAnnual(false)}
                className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${!annual ? 'bg-accent/10 text-accent font-medium' : 'text-text-muted hover:text-text-secondary'}`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${annual ? 'bg-accent/10 text-accent font-medium' : 'text-text-muted hover:text-text-secondary'}`}
              >
                Annuel
              </button>
            </div>

            <div className="text-center mb-5">
              <span className="text-2xl font-bold text-text-primary">
                {annual ? '39€' : '4,99€'}
              </span>
              <span className="text-sm text-text-muted">
                {annual ? '/an' : '/mois'}
              </span>
              {annual && (
                <Badge className="bg-accent/10 text-accent ml-2">
                  −34 %
                </Badge>
              )}
            </div>

            <Button
              className="w-full"
              onClick={handleUpgrade}
              disabled={state === 'loading'}
            >
              {state === 'loading' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : null}
              {state === 'loading' ? 'Traitement…' : 'Passer à Pro'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
