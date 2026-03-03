'use client';

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
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

const AUTH_KEY = 'court-finder-admin';

/** Trigger a Supabase query without awaiting — fire-and-forget with error logging */
function sync(query: PromiseLike<{ error: { message: string } | null }>) {
  Promise.resolve(query).then(({ error }) => {
    if (error) console.error('[admin-sync]', error.message);
  });
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

  // Hydrate: isAdmin from localStorage, everything else from Supabase
  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) setIsAdmin(JSON.parse(raw));
    } catch { /* ignore */ }

    Promise.all([
      supabase.from('admin_overrides').select('*'),
      supabase.from('admin_deleted').select('entity_id'),
      supabase.from('admin_history').select('*').order('created_at', { ascending: false }),
    ]).then(([overridesRes, deletedRes, historyRes]) => {
      const rows = overridesRes.data ?? [];
      const ao: Record<string, Partial<Aide>> = {};
      const na: Aide[] = [];
      const fo: Record<string, Partial<Festival>> = {};
      const nf: Festival[] = [];

      for (const row of rows) {
        if (row.entity_type === 'aide') {
          if (row.is_new) na.push(row.data as Aide);
          else ao[row.entity_id] = row.data as Partial<Aide>;
        } else {
          if (row.is_new) nf.push(row.data as Festival);
          else fo[row.entity_id] = row.data as Partial<Festival>;
        }
      }

      setAideOverrides(ao);
      setNewAides(na);
      setFestivalOverrides(fo);
      setNewFestivals(nf);
      setDeleted((deletedRes.data ?? []).map((r) => r.entity_id));
      setHistory(
        (historyRes.data ?? []).map((r) => ({
          id: r.id,
          timestamp: r.created_at,
          action: r.action as AdminActionType,
          entityType: r.entity_type as AdminEntityType,
          entityId: r.entity_id,
          entityName: r.entity_name,
          changes: r.changes ?? undefined,
        }))
      );
      setHydrated(true);
    });
  }, []);

  // Persist isAdmin to localStorage only
  useEffect(() => {
    if (hydrated) localStorage.setItem(AUTH_KEY, JSON.stringify(isAdmin));
  }, [isAdmin, hydrated]);

  const addHistoryEntry = useCallback(
    (action: AdminActionType, entityType: AdminEntityType, entityId: string, entityName: string, changes?: Record<string, { before: unknown; after: unknown }>) => {
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
      sync(
        supabase.from('admin_history').insert({
          id: entry.id,
          action,
          entity_type: entityType,
          entity_id: entityId,
          entity_name: entityName,
          changes: changes ?? null,
          created_at: entry.timestamp,
        })
      );
    },
    []
  );

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
  const createAide = useCallback(
    (aide: Aide) => {
      setNewAides((prev) => [...prev, aide]);
      addHistoryEntry('create', 'aide', aide.id, aide.nom);
      sync(
        supabase.from('admin_overrides').upsert(
          { entity_type: 'aide', entity_id: aide.id, is_new: true, data: aide, updated_at: new Date().toISOString() },
          { onConflict: 'entity_type,entity_id' }
        )
      );
    },
    [addHistoryEntry]
  );

  const updateAide = useCallback(
    (id: string, partial: Partial<Aide>) => {
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
            sync(
              supabase.from('admin_overrides').upsert(
                { entity_type: 'aide', entity_id: id, is_new: true, data: { ...old, ...partial }, updated_at: new Date().toISOString() },
                { onConflict: 'entity_type,entity_id' }
              )
            );
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
        const mergedOverride = { ...aideOverrides[id], ...partial };
        setAideOverrides((prev) => ({ ...prev, [id]: mergedOverride }));
        addHistoryEntry('update', 'aide', id, current?.nom ?? id, Object.keys(changes).length > 0 ? changes : undefined);
        sync(
          supabase.from('admin_overrides').upsert(
            { entity_type: 'aide', entity_id: id, is_new: false, data: mergedOverride, updated_at: new Date().toISOString() },
            { onConflict: 'entity_type,entity_id' }
          )
        );
      }
    },
    [aideOverrides, addHistoryEntry]
  );

  const deleteAide = useCallback(
    (id: string) => {
      const aide = mergedAides.find((a) => a.id === id);
      setDeleted((prev) => [...prev, id]);
      if (id.startsWith('admin-')) {
        setNewAides((prev) => prev.filter((a) => a.id !== id));
        sync(supabase.from('admin_overrides').delete().eq('entity_type', 'aide').eq('entity_id', id));
      }
      addHistoryEntry('delete', 'aide', id, aide?.nom ?? id);
      sync(supabase.from('admin_deleted').upsert({ entity_id: id }, { onConflict: 'entity_id' }));
    },
    [mergedAides, addHistoryEntry]
  );

  const bulkDeleteAides = useCallback(
    (ids: string[]) => {
      for (const id of ids) {
        const aide = mergedAides.find((a) => a.id === id);
        addHistoryEntry('delete', 'aide', id, aide?.nom ?? id);
      }
      setDeleted((prev) => [...prev, ...ids]);
      const adminIds = ids.filter((id) => id.startsWith('admin-'));
      setNewAides((prev) => prev.filter((a) => !ids.includes(a.id)));
      sync(supabase.from('admin_deleted').upsert(ids.map((id) => ({ entity_id: id })), { onConflict: 'entity_id' }));
      if (adminIds.length > 0) {
        sync(supabase.from('admin_overrides').delete().eq('entity_type', 'aide').in('entity_id', adminIds));
      }
    },
    [mergedAides, addHistoryEntry]
  );

  // CRUD Festivals
  const createFestival = useCallback(
    (festival: Festival) => {
      setNewFestivals((prev) => [...prev, festival]);
      addHistoryEntry('create', 'festival', festival.id, festival.nom);
      sync(
        supabase.from('admin_overrides').upsert(
          { entity_type: 'festival', entity_id: festival.id, is_new: true, data: festival, updated_at: new Date().toISOString() },
          { onConflict: 'entity_type,entity_id' }
        )
      );
    },
    [addHistoryEntry]
  );

  const updateFestival = useCallback(
    (id: string, partial: Partial<Festival>) => {
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
            sync(
              supabase.from('admin_overrides').upsert(
                { entity_type: 'festival', entity_id: id, is_new: true, data: { ...old, ...partial }, updated_at: new Date().toISOString() },
                { onConflict: 'entity_type,entity_id' }
              )
            );
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
        const mergedOverride = { ...festivalOverrides[id], ...partial };
        setFestivalOverrides((prev) => ({ ...prev, [id]: mergedOverride }));
        addHistoryEntry('update', 'festival', id, current?.nom ?? id, Object.keys(changes).length > 0 ? changes : undefined);
        sync(
          supabase.from('admin_overrides').upsert(
            { entity_type: 'festival', entity_id: id, is_new: false, data: mergedOverride, updated_at: new Date().toISOString() },
            { onConflict: 'entity_type,entity_id' }
          )
        );
      }
    },
    [festivalOverrides, addHistoryEntry]
  );

  const deleteFestival = useCallback(
    (id: string) => {
      const festival = mergedFestivals.find((f) => f.id === id);
      setDeleted((prev) => [...prev, id]);
      if (id.startsWith('admin-')) {
        setNewFestivals((prev) => prev.filter((f) => f.id !== id));
        sync(supabase.from('admin_overrides').delete().eq('entity_type', 'festival').eq('entity_id', id));
      }
      addHistoryEntry('delete', 'festival', id, festival?.nom ?? id);
      sync(supabase.from('admin_deleted').upsert({ entity_id: id }, { onConflict: 'entity_id' }));
    },
    [mergedFestivals, addHistoryEntry]
  );

  const bulkDeleteFestivals = useCallback(
    (ids: string[]) => {
      for (const id of ids) {
        const festival = mergedFestivals.find((f) => f.id === id);
        addHistoryEntry('delete', 'festival', id, festival?.nom ?? id);
      }
      setDeleted((prev) => [...prev, ...ids]);
      const adminIds = ids.filter((id) => id.startsWith('admin-'));
      setNewFestivals((prev) => prev.filter((f) => !ids.includes(f.id)));
      sync(supabase.from('admin_deleted').upsert(ids.map((id) => ({ entity_id: id })), { onConflict: 'entity_id' }));
      if (adminIds.length > 0) {
        sync(supabase.from('admin_overrides').delete().eq('entity_type', 'festival').in('entity_id', adminIds));
      }
    },
    [mergedFestivals, addHistoryEntry]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    sync(supabase.from('admin_history').delete().gte('created_at', '1970-01-01T00:00:00Z'));
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
