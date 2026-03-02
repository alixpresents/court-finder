'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Submission, SubmissionStatus } from '@/lib/types';

interface SubmissionsContextValue {
  submissions: Submission[];
  addSubmission: (submission: Omit<Submission, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateStatus: (id: string, status: SubmissionStatus) => void;
  removeSubmission: (id: string) => void;
  isHydrated: boolean;
}

const SubmissionsContext = createContext<SubmissionsContextValue | undefined>(undefined);

const STORAGE_KEY = 'court-finder-submissions';

export function SubmissionsProvider({ children }: { children: React.ReactNode }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSubmissions(JSON.parse(stored));
    } catch {}
    setIsHydrated(true);
  }, []);

  function persist(subs: Submission[]) {
    setSubmissions(subs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
  }

  const addSubmission = useCallback((data: Omit<Submission, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const sub: Submission = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setSubmissions((prev) => {
      const next = [...prev, sub];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateStatus = useCallback((id: string, status: SubmissionStatus) => {
    setSubmissions((prev) => {
      const next = prev.map((s) =>
        s.id === id ? { ...s, status, updatedAt: new Date().toISOString() } : s
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeSubmission = useCallback((id: string) => {
    setSubmissions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <SubmissionsContext.Provider value={{ submissions, addSubmission, updateStatus, removeSubmission, isHydrated }}>
      {children}
    </SubmissionsContext.Provider>
  );
}

export function useSubmissions() {
  const ctx = useContext(SubmissionsContext);
  if (!ctx) throw new Error('useSubmissions must be used within SubmissionsProvider');
  return ctx;
}
