'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

export default function SidebarLink({ href, icon: Icon, label }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = href === '/'
    ? pathname === '/'
    : href === '/projets'
      ? pathname.startsWith('/projets') || pathname.startsWith('/projet/')
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        isActive
          ? 'bg-accent/10 text-accent font-medium'
          : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
      }`}
    >
      <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
      {label}
    </Link>
  );
}
