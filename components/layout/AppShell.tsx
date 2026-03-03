'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useProject } from '@/context/ProjectContext';
import LoginPage from '@/components/auth/LoginPage';
import Onboarding from '@/components/onboarding/Onboarding';
import Sidebar from './Sidebar';
import { ToastProvider } from '@/components/ui/ToastProvider';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  const { projects, isHydrated } = useProject();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading || !isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!session) return <LoginPage />;
  if (projects.length === 0) return <Onboarding />;

  return (
    <ToastProvider>
      <div className="flex min-h-screen">
        {/* Mobile header */}
        <header className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/80 backdrop-blur-md px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
          >
            <Menu size={20} />
          </button>
          <span className="font-serif text-lg text-accent-gold italic">Court · Finder</span>
        </header>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-6 pt-20 lg:ml-[240px] lg:p-8 lg:pt-8">
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
