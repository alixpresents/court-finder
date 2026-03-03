'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  badge?: { count: number; color: string };
  onClick?: () => void;
}

export default function SidebarLink({ href, icon: Icon, label, badge, onClick }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = href === '/' || href === '/admin'
    ? pathname === href
    : href === '/projets'
      ? pathname.startsWith('/projets') || pathname.startsWith('/projet/')
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
        isActive
          ? 'bg-surface-hover text-text-primary font-medium'
          : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] rounded-full bg-accent" />
      )}
      <Icon size={17} strokeWidth={isActive ? 2 : 1.5} />
      <span className="flex-1">{label}</span>
      {badge && badge.count > 0 && (
        <span className={`inline-flex items-center justify-center rounded px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${badge.color}`}>
          {badge.count}
        </span>
      )}
    </Link>
  );
}
