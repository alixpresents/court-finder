'use client';

import { useAuth } from '@/context/AuthContext';
import { useProject } from '@/context/ProjectContext';
import LoginPage from '@/components/auth/LoginPage';
import Onboarding from '@/components/onboarding/Onboarding';
import Sidebar from './Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  const { projects, isHydrated } = useProject();

  if (isLoading || !isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  if (projects.length === 0) {
    return <Onboarding />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-[260px] flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
