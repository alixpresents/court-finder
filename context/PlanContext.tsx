'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useProject } from '@/context/ProjectContext';

interface PlanContextValue {
  isPro: boolean;
  canCreateProject: boolean;
  upgrade: () => Promise<void>;
  downgrade: () => void;
}

const PlanContext = createContext<PlanContextValue | undefined>(undefined);

const PLAN_KEY = 'court-finder-plan';

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const { projects } = useProject();
  const [isPro, setIsPro] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PLAN_KEY);
      if (stored === 'pro') setIsPro(true);
    } catch {}
    setHydrated(true);
  }, []);

  const canCreateProject = useMemo(
    () => isPro || projects.length < 1,
    [isPro, projects.length],
  );

  const upgrade = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 1500));
    setIsPro(true);
    localStorage.setItem(PLAN_KEY, 'pro');
  }, []);

  const downgrade = useCallback(() => {
    setIsPro(false);
    localStorage.removeItem(PLAN_KEY);
  }, []);

  if (!hydrated) return null;

  return (
    <PlanContext.Provider value={{ isPro, canCreateProject, upgrade, downgrade }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within PlanProvider');
  return ctx;
}
