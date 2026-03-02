import type { Metadata } from 'next';
import { DM_Sans, Inter } from 'next/font/google';
import './globals.css';
import AppShell from '@/components/layout/AppShell';
import { ProjectProvider } from '@/context/ProjectContext';
import { SubmissionsProvider } from '@/context/SubmissionsContext';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
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
      <body className={`${dmSans.variable} ${inter.variable} antialiased`}>
        <ProjectProvider>
          <SubmissionsProvider>
            <AppShell>{children}</AppShell>
          </SubmissionsProvider>
        </ProjectProvider>
      </body>
    </html>
  );
}
