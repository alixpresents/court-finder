'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Project } from '@/lib/types';

interface ProjectContextValue {
  projects: Project[];
  activeProjectId: string | null;
  activeProject: Project | null;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (id: string | null) => void;
  isHydrated: boolean;
}

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);

const PROJECTS_KEY = 'court-finder-projects';
const ACTIVE_KEY = 'court-finder-active-project-id';
const LEGACY_KEY = 'court-finder-project';

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage + migrate legacy single-project key
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROJECTS_KEY);
      const storedActiveId = localStorage.getItem(ACTIVE_KEY);

      if (stored) {
        const parsed: Project[] = JSON.parse(stored);
        setProjects(parsed);
        setActiveProjectId(storedActiveId);
      } else {
        // Migration: convert legacy single-project to multi-project
        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy) {
          const legacyProject: Project = JSON.parse(legacy);
          setProjects([legacyProject]);
          setActiveProjectId(legacyProject.id);
          localStorage.setItem(PROJECTS_KEY, JSON.stringify([legacyProject]));
          localStorage.setItem(ACTIVE_KEY, legacyProject.id);
          localStorage.removeItem(LEGACY_KEY);
        }
      }
    } catch {}
    setIsHydrated(true);
  }, []);

  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeProjectId) ?? null,
    [projects, activeProjectId],
  );

  const addProject = useCallback((project: Project) => {
    setProjects((prev) => {
      const next = [...prev, project];
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(next));
      return next;
    });
    setActiveProjectId(project.id);
    localStorage.setItem(ACTIVE_KEY, project.id);
  }, []);

  const updateProject = useCallback((project: Project) => {
    setProjects((prev) => {
      const next = prev.map((p) => (p.id === project.id ? project : p));
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => {
      const next = prev.filter((p) => p.id !== id);
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(next));

      // If deleting the active project, pick the first remaining or null
      setActiveProjectId((prevActive) => {
        if (prevActive !== id) return prevActive;
        const newActiveId = next.length > 0 ? next[0].id : null;
        if (newActiveId) {
          localStorage.setItem(ACTIVE_KEY, newActiveId);
        } else {
          localStorage.removeItem(ACTIVE_KEY);
        }
        return newActiveId;
      });

      return next;
    });
  }, []);

  const setActiveProjectCb = useCallback((id: string | null) => {
    setActiveProjectId(id);
    if (id) {
      localStorage.setItem(ACTIVE_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_KEY);
    }
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProjectId,
        activeProject,
        addProject,
        updateProject,
        deleteProject,
        setActiveProject: setActiveProjectCb,
        isHydrated,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject must be used within ProjectProvider');
  return ctx;
}
