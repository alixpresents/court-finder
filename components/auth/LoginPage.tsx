'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { LogIn, UserPlus } from 'lucide-react';

const TEST_EMAIL = 'test@courtfinder.app';
const TEST_PASSWORD = 'prototype2025';

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState(TEST_EMAIL);
  const [password, setPassword] = useState(TEST_PASSWORD);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) setError(error);
    setLoading(false);
  };

  const handleSignUp = async () => {
    setError(null);
    setSignUpSuccess(false);
    setLoading(true);
    const { error } = await signUp(email, password);
    if (error) {
      setError(error);
    } else {
      setSignUpSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-background font-bold text-lg">
            CF
          </div>
          <h1 className="font-sans text-2xl font-semibold text-text-primary tracking-tight">
            Court·Finder
          </h1>
          <p className="text-sm text-text-muted">Connectez-vous pour accéder au prototype</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              required
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
          )}

          {signUpSuccess && (
            <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
              Compte créé ! Vous pouvez maintenant vous connecter.
            </p>
          )}

          <Button type="submit" icon={LogIn} disabled={loading} className="w-full">
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={handleSignUp}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors disabled:opacity-50"
          >
            <UserPlus size={14} />
            Créer le compte test
          </button>
        </div>
      </div>
    </div>
  );
}
