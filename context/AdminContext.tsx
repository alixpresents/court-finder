'use client';

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { aides as staticAides } from '@/data/aides';
import { festivals as staticFestivals } from '@/data/festivals';
import { ADMIN_PASSWORD } from '@/lib/constants';
import type { Aide, Festival, AdminHistoryEntry, AdminActionType, AdminEntityType } from '@/lib/types';

interface AdminContextType {
  isAdmin: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  mergedAides: Aide[];
  mergedFestivals: Festival[];
  createAide: (aide: Aide) => void;
  updateAide: (id: string, partial: Partial<Aide>) => void;
  deleteAide: (id: string) => void;
  bulkDeleteAides: (ids: string[]) => void;
  createFestival: (festival: Festival) => void;
  updateFestival: (id: string, partial: Partial<Festival>) => void;
  deleteFestival: (id: string) => void;
  bulkDeleteFestivals: (ids: string[]) => void;
  history: AdminHistoryEntry[];
  clearHistory: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

const KEYS = {
  auth: 'court-finder-admin',
  aideOverrides: 'court-finder-admin-aides',
  festivalOverrides: 'court-finder-admin-festivals',
  newAides: 'court-finder-admin-new-aides',
  newFestivals: 'court-finder-admin-new-festivals',
  deleted: 'court-finder-admin-deleted',
  history: 'court-finder-admin-history',
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [aideOverrides, setAideOverrides] = useState<Record<string, Partial<Aide>>>({});
  const [festivalOverrides, setFestivalOverrides] = useState<Record<string, Partial<Festival>>>({});
  const [newAides, setNewAides] = useState<Aide[]>([]);
  const [newFestivals, setNewFestivals] = useState<Festival[]>([]);
  const [deleted, setDeleted] = useState<string[]>([]);
  const [history, setHistory] = useState<AdminHistoryEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    setIsAdmin(load(KEYS.auth, false));
    setAideOverrides(load(KEYS.aideOverrides, {}));
    setFestivalOverrides(load(KEYS.festivalOverrides, {}));
    setNewAides(load(KEYS.newAides, []));
    setNewFestivals(load(KEYS.newFestivals, []));
    setDeleted(load(KEYS.deleted, []));
    setHistory(load(KEYS.history, []));
    setHydrated(true);
  }, []);

  // Persist each piece of state
  useEffect(() => { if (hydrated) save(KEYS.auth, isAdmin); }, [isAdmin, hydrated]);
  useEffect(() => { if (hydrated) save(KEYS.aideOverrides, aideOverrides); }, [aideOverrides, hydrated]);
  useEffect(() => { if (hydrated) save(KEYS.festivalOverrides, festivalOverrides); }, [festivalOverrides, hydrated]);
  useEffect(() => { if (hydrated) save(KEYS.newAides, newAides); }, [newAides, hydrated]);
  useEffect(() => { if (hydrated) save(KEYS.newFestivals, newFestivals); }, [newFestivals, hydrated]);
  useEffect(() => { if (hydrated) save(KEYS.deleted, deleted); }, [deleted, hydrated]);
  useEffect(() => { if (hydrated) save(KEYS.history, history); }, [history, hydrated]);

  const addHistoryEntry = useCallback((action: AdminActionType, entityType: AdminEntityType, entityId: string, entityName: string, changes?: Record<string, { before: unknown; after: unknown }>) => {
    const entry: AdminHistoryEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action,
      entityType,
      entityId,
      entityName,
      changes,
    };
    setHistory((prev) => [entry, ...prev]);
  }, []);

  // Merged data
  const mergedAides = useMemo(() => {
    const deletedSet = new Set(deleted);
    const base = staticAides
      .filter((a) => !deletedSet.has(a.id))
      .map((a) => (aideOverrides[a.id] ? { ...a, ...aideOverrides[a.id] } : a));
    return [...base, ...newAides.filter((a) => !deletedSet.has(a.id))];
  }, [aideOverrides, newAides, deleted]);

  const mergedFestivals = useMemo(() => {
    const deletedSet = new Set(deleted);
    const base = staticFestivals
      .filter((f) => !deletedSet.has(f.id))
      .map((f) => (festivalOverrides[f.id] ? { ...f, ...festivalOverrides[f.id] } : f));
    return [...base, ...newFestivals.filter((f) => !deletedSet.has(f.id))];
  }, [festivalOverrides, newFestivals, deleted]);

  // Auth
  const loginAdmin = useCallback((password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logoutAdmin = useCallback(() => {
    setIsAdmin(false);
  }, []);

  // CRUD Aides
  const createAide = useCallback((aide: Aide) => {
    setNewAides((prev) => [...prev, aide]);
    addHistoryEntry('create', 'aide', aide.id, aide.nom);
  }, [addHistoryEntry]);

  const updateAide = useCallback((id: string, partial: Partial<Aide>) => {
    const isNew = id.startsWith('admin-');
    if (isNew) {
      setNewAides((prev) => {
        const old = prev.find((a) => a.id === id);
        const changes: Record<string, { before: unknown; after: unknown }> = {};
        if (old) {
          for (const key of Object.keys(partial) as (keyof Aide)[]) {
            if (JSON.stringify(old[key]) !== JSON.stringify(partial[key])) {
              changes[key] = { before: old[key], after: partial[key] };
            }
          }
        }
        addHistoryEntry('update', 'aide', id, old?.nom ?? id, Object.keys(changes).length > 0 ? changes : undefined);
        return prev.map((a) => (a.id === id ? { ...a, ...partial } : a));
      });
    } else {
      const original = staticAides.find((a) => a.id === id);
      const current = original ? { ...original, ...aideOverrides[id] } : null;
      const changes: Record<string, { before: unknown; after: unknown }> = {};
      if (current) {
        for (const key of Object.keys(partial) as (keyof Aide)[]) {
          if (JSON.stringify(current[key]) !== JSON.stringify(partial[key])) {
            changes[key] = { before: current[key], after: partial[key] };
          }
        }
      }
      setAideOverrides((prev) => ({ ...prev, [id]: { ...prev[id], ...partial } }));
      addHistoryEntry('update', 'aide', id, current?.nom ?? id, Object.keys(changes).length > 0 ? changes : undefined);
    }
  }, [aideOverrides, addHistoryEntry]);

  const deleteAide = useCallback((id: string) => {
    const aide = mergedAides.find((a) => a.id === id);
    setDeleted((prev) => [...prev, id]);
    if (id.startsWith('admin-')) {
      setNewAides((prev) => prev.filter((a) => a.id !== id));
    }
    addHistoryEntry('delete', 'aide', id, aide?.nom ?? id);
  }, [mergedAides, addHistoryEntry]);

  const bulkDeleteAides = useCallback((ids: string[]) => {
    for (const id of ids) {
      const aide = mergedAides.find((a) => a.id === id);
      addHistoryEntry('delete', 'aide', id, aide?.nom ?? id);
    }
    setDeleted((prev) => [...prev, ...ids]);
    setNewAides((prev) => prev.filter((a) => !ids.includes(a.id)));
  }, [mergedAides, addHistoryEntry]);

  // CRUD Festivals
  const createFestival = useCallback((festival: Festival) => {
    setNewFestivals((prev) => [...prev, festival]);
    addHistoryEntry('create', 'festival', festival.id, festival.nom);
  }, [addHistoryEntry]);

  const updateFestival = useCallback((id: string, partial: Partial<Festival>) => {
    const isNew = id.startsWith('admin-');
    if (isNew) {
      setNewFestivals((prev) => {
        const old = prev.find((f) => f.id === id);
        const changes: Record<string, { before: unknown; after: unknown }> = {};
        if (old) {
          for (const key of Object.keys(partial) as (keyof Festival)[]) {
            if (JSON.stringify(old[key]) !== JSON.stringify(partial[key])) {
              changes[key] = { before: old[key], after: partial[key] };
            }
          }
        }
        addHistoryEntry('update', 'festival', id, old?.nom ?? id, Object.keys(changes).length > 0 ? changes : undefined);
        return prev.map((f) => (f.id === id ? { ...f, ...partial } : f));
      });
    } else {
      const original = staticFestivals.find((f) => f.id === id);
      const current = original ? { ...original, ...festivalOverrides[id] } : null;
      const changes: Record<string, { before: unknown; after: unknown }> = {};
      if (current) {
        for (const key of Object.keys(partial) as (keyof Festival)[]) {
          if (JSON.stringify(current[key]) !== JSON.stringify(partial[key])) {
            changes[key] = { before: current[key], after: partial[key] };
          }
        }
      }
      setFestivalOverrides((prev) => ({ ...prev, [id]: { ...prev[id], ...partial } }));
      addHistoryEntry('update', 'festival', id, current?.nom ?? id, Object.keys(changes).length > 0 ? changes : undefined);
    }
  }, [festivalOverrides, addHistoryEntry]);

  const deleteFestival = useCallback((id: string) => {
    const festival = mergedFestivals.find((f) => f.id === id);
    setDeleted((prev) => [...prev, id]);
    if (id.startsWith('admin-')) {
      setNewFestivals((prev) => prev.filter((f) => f.id !== id));
    }
    addHistoryEntry('delete', 'festival', id, festival?.nom ?? id);
  }, [mergedFestivals, addHistoryEntry]);

  const bulkDeleteFestivals = useCallback((ids: string[]) => {
    for (const id of ids) {
      const festival = mergedFestivals.find((f) => f.id === id);
      addHistoryEntry('delete', 'festival', id, festival?.nom ?? id);
    }
    setDeleted((prev) => [...prev, ...ids]);
    setNewFestivals((prev) => prev.filter((f) => !ids.includes(f.id)));
  }, [mergedFestivals, addHistoryEntry]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        loginAdmin,
        logoutAdmin,
        mergedAides,
        mergedFestivals,
        createAide,
        updateAide,
        deleteAide,
        bulkDeleteAides,
        createFestival,
        updateFestival,
        deleteFestival,
        bulkDeleteFestivals,
        history,
        clearHistory,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
