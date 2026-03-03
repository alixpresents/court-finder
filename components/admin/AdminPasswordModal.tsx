'use client';

import { useState, useEffect } from 'react';
import { Shield, X } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import Button from '@/components/ui/Button';

interface AdminPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminPasswordModal({ open, onClose }: AdminPasswordModalProps) {
  const { loginAdmin } = useAdmin();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (open) {
      setPassword('');
      setError(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loginAdmin(password)) {
      onClose();
    } else {
      setError(true);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[12px]" onClick={onClose} />

      <div className="relative w-full max-w-[400px] mx-4 rounded-xl border border-border bg-elevated p-6 shadow-2xl animate-modal-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-purple/10">
            <Shield size={20} className="text-accent-purple" />
          </div>
          <div>
            <h2 className="font-sans text-lg font-semibold text-text-primary">Mode Admin</h2>
            <p className="text-xs text-text-tertiary">Accès protégé par mot de passe</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-password" className="text-sm font-medium text-text-secondary">
              Mot de passe
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Entrez le mot de passe admin"
              autoFocus
              className={`rounded-lg border bg-surface-hover px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:ring-1 focus:ring-accent/25 ${
                error ? 'border-red-500/50 focus:border-red-500/50' : 'border-border focus:border-border-focus'
              }`}
            />
            {error && (
              <p className="text-xs text-red-400">Mot de passe incorrect</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              Connexion
            </Button>
            <Button variant="ghost" type="button" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
