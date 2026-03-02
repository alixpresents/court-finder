'use client';

import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from './Button';

interface ConfirmDeleteModalProps {
  open: boolean;
  projectName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const CONFIRM_WORD = 'SUPPRIMER';

export default function ConfirmDeleteModal({
  open,
  projectName,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isValid = value === CONFIRM_WORD;

  useEffect(() => {
    if (open) {
      setValue('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 rounded-xl border border-border bg-surface p-6 shadow-2xl">
        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
        >
          <X size={18} />
        </button>

        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <div>
            <h2 className="font-sans text-lg font-semibold text-text-primary">
              Supprimer le projet
            </h2>
            <p className="text-sm text-text-muted">Cette action est irréversible.</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary mb-4">
          Le projet <strong className="text-text-primary">{projectName}</strong> ainsi que
          toutes ses soumissions associées seront définitivement supprimés.
        </p>

        {/* Confirmation input */}
        <div className="space-y-2 mb-6">
          <label className="block text-sm text-text-secondary">
            Tapez <strong className="text-red-400">{CONFIRM_WORD}</strong> pour confirmer :
          </label>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && isValid) onConfirm(); }}
            placeholder={CONFIRM_WORD}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>Annuler</Button>
          <Button variant="danger" onClick={onConfirm} disabled={!isValid}>
            Supprimer définitivement
          </Button>
        </div>
      </div>
    </div>
  );
}
