'use client';

import { useMemo, useState } from 'react';
import { LayoutDashboard, Film, FolderOpen, Award, Trophy, Calendar, ClipboardList, DollarSign, Settings, Bell, LogOut, ArrowRight, Shield, BarChart3, History } from 'lucide-react';
import SidebarLink from './SidebarLink';
import ProjectSwitcher from './ProjectSwitcher';
import Badge from '@/components/ui/Badge';
import AdminPasswordModal from '@/components/admin/AdminPasswordModal';
import { useAuth } from '@/context/AuthContext';
import { usePlan } from '@/context/PlanContext';
import { useProject } from '@/context/ProjectContext';
import { useAdmin } from '@/context/AdminContext';
import { daysUntil } from '@/lib/dates';
import { matchAide } from '@/lib/matching';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { signOut } = useAuth();
  const { isPro, upgrade, downgrade } = usePlan();
  const { activeProject, projects } = useProject();
  const { isAdmin, logoutAdmin, mergedAides, mergedFestivals } = useAdmin();
  const [showAdminModal, setShowAdminModal] = useState(false);

  const counts = useMemo(() => {
    const eligibleAides = activeProject ? mergedAides.filter((a) => matchAide(activeProject, a).score >= 50).length : 0;
    const eligibleFestivals = activeProject ? mergedFestivals.filter((f) => daysUntil(f.deadline) >= 0).length : 0;
    const urgentDeadlines = [...mergedAides, ...mergedFestivals].filter((item) => {
      const d = daysUntil(item.deadline);
      return d >= 0 && d < 7;
    }).length;
    return { eligibleAides, eligibleFestivals, urgentDeadlines };
  }, [activeProject, mergedAides, mergedFestivals]);

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen w-[240px] flex-col border-r border-border bg-surface transition-transform duration-300 ease-out lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Header: logo + plan badge */}
      <div className="flex h-14 items-center gap-2 px-5">
        <span className="font-serif text-xl text-accent-gold italic tracking-tight">
          Court · Finder
        </span>
        <Badge className={isPro ? 'bg-accent/10 text-accent' : 'bg-white/8 text-text-tertiary'}>
          {isPro ? 'Pro' : 'Free'}
        </Badge>
        {isAdmin && (
          <Badge className="bg-accent-purple/10 text-accent-purple">Admin</Badge>
        )}
      </div>

      {/* Project Switcher */}
      <div className="mb-1">
        <ProjectSwitcher onNavigate={onClose} />
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-2">
        {/* MON PROJET */}
        <p className="px-2 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
          Mon projet
        </p>
        <SidebarLink href="/app" icon={LayoutDashboard} label="Dashboard" onClick={onClose} />
        <SidebarLink
          href={projects.length > 1 ? '/projets' : activeProject ? `/projet/${activeProject.id}` : '/projets'}
          icon={projects.length > 1 ? FolderOpen : Film}
          label={projects.length > 1 ? 'Mes films' : 'Mon film'}
          onClick={onClose}
        />

        {/* OPPORTUNITES */}
        <p className="px-2 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
          Opportunités
        </p>
        <SidebarLink
          href="/aides"
          icon={Award}
          label="Aides éligibles"
          badge={counts.eligibleAides > 0 ? { count: counts.eligibleAides, color: 'bg-accent/15 text-accent' } : undefined}
          onClick={onClose}
        />
        <SidebarLink
          href="/festivals"
          icon={Trophy}
          label="Festivals"
          badge={counts.eligibleFestivals > 0 ? { count: counts.eligibleFestivals, color: 'bg-festival/15 text-festival' } : undefined}
          onClick={onClose}
        />
        <SidebarLink
          href="/calendrier"
          icon={Calendar}
          label="Calendrier"
          badge={counts.urgentDeadlines > 0 ? { count: counts.urgentDeadlines, color: 'bg-red-500/15 text-red-400' } : undefined}
          onClick={onClose}
        />

        {/* SUIVI */}
        <p className="px-2 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
          Suivi
        </p>
        <SidebarLink href="/soumissions" icon={ClipboardList} label="Soumissions" onClick={onClose} />
        {activeProject && (
          <SidebarLink href={`/projet/${activeProject.id}/financement`} icon={DollarSign} label="Plan de financement" onClick={onClose} />
        )}

        {/* ADMIN */}
        {isAdmin && (
          <>
            <p className="px-2 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-accent-purple/60">
              Admin
            </p>
            <SidebarLink href="/admin" icon={BarChart3} label="Vue d'ensemble" onClick={onClose} />
            <SidebarLink href="/admin/aides" icon={Award} label="Gérer les aides" onClick={onClose} />
            <SidebarLink href="/admin/festivals" icon={Trophy} label="Gérer les festivals" onClick={onClose} />
            <SidebarLink href="/admin/historique" icon={History} label="Historique" onClick={onClose} />
          </>
        )}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border px-3 py-2 space-y-1">
        {isAdmin ? (
          <button
            onClick={logoutAdmin}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-accent-purple bg-accent-purple/8 hover:bg-accent-purple/15 transition-colors"
          >
            <Shield size={14} />
            Quitter admin
          </button>
        ) : (
          <button
            onClick={() => setShowAdminModal(true)}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-text-tertiary hover:text-text-secondary hover:bg-surface-hover transition-colors"
          >
            <Shield size={14} />
            Mode admin
          </button>
        )}

        {!isPro && (
          <button
            onClick={upgrade}
            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-accent-gold bg-accent-gold/8 hover:bg-accent-gold/15 transition-colors"
          >
            <span>Passer à Pro</span>
            <ArrowRight size={14} />
          </button>
        )}

        <div className="flex items-center justify-between px-1 py-1">
          <div className="flex items-center gap-2">
            {isPro && (
              <button
                onClick={downgrade}
                className="text-[11px] text-text-tertiary hover:text-text-secondary transition-colors"
              >
                Revenir en Free
              </button>
            )}
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-colors"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>

      <AdminPasswordModal open={showAdminModal} onClose={() => setShowAdminModal(false)} />
    </aside>
  );
}
