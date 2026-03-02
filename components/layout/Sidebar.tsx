'use client';

import { LayoutDashboard, FolderOpen, Award, Trophy, Calendar, ClipboardList, LogOut } from 'lucide-react';
import SidebarLink from './SidebarLink';
import ProjectSwitcher from './ProjectSwitcher';
import NotificationBell from './NotificationBell';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { usePlan } from '@/context/PlanContext';

const NAV_ITEMS = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/projets', icon: FolderOpen, label: 'Mes projets' },
  { href: '/aides', icon: Award, label: 'Aides' },
  { href: '/festivals', icon: Trophy, label: 'Festivals' },
  { href: '/calendrier', icon: Calendar, label: 'Calendrier' },
  { href: '/soumissions', icon: ClipboardList, label: 'Soumissions' },
];

export default function Sidebar() {
  const { signOut } = useAuth();
  const { isPro, downgrade } = usePlan();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[260px] flex-col border-r border-border bg-surface">
      <div className="flex h-16 items-center gap-2.5 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-background font-bold text-sm">
          CF
        </div>
        <span className="font-sans text-lg font-semibold text-text-primary tracking-tight">
          Court·Finder
        </span>
        <Badge className={isPro ? 'bg-accent/10 text-accent' : 'bg-white/10 text-text-muted'}>
          {isPro ? 'Pro' : 'Free'}
        </Badge>
        <div className="ml-auto">
          <NotificationBell />
        </div>
      </div>

      <div className="mb-2">
        <ProjectSwitcher />
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <SidebarLink key={item.href} {...item} />
        ))}
      </nav>

      <div className="border-t border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-xs text-text-muted">v0.1</p>
          {isPro && (
            <button
              onClick={downgrade}
              className="text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              Revenir en Free
            </button>
          )}
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
        >
          <LogOut size={14} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
