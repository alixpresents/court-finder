import type { Metadata } from 'next';
import { DM_Sans, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import AppShell from '@/components/layout/AppShell';
import { AuthProvider } from '@/context/AuthContext';
import { ProjectProvider } from '@/context/ProjectContext';
import { PlanProvider } from '@/context/PlanContext';
import { SubmissionsProvider } from '@/context/SubmissionsContext';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Court·Finder — Trouvez vos financements',
  description: 'Aides au financement et festivals pour cinéastes de courts-métrages',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${dmSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} antialiased`}>
        <AuthProvider>
          <ProjectProvider>
            <PlanProvider>
              <SubmissionsProvider>
                <AppShell>{children}</AppShell>
              </SubmissionsProvider>
            </PlanProvider>
          </ProjectProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
