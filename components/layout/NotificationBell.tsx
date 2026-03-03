'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { aides } from '@/data/aides';
import { festivals } from '@/data/festivals';
import { daysUntil } from '@/lib/dates';
import DeadlineBadge from '@/components/ui/DeadlineBadge';

interface Notification {
  id: string;
  message: string;
  days?: number;
  href: string;
  type: 'deadline' | 'info';
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const notifications = useMemo<Notification[]>(() => {
    const items: Notification[] = [];

    // Upcoming aide deadlines within 30 days
    for (const aide of aides) {
      const days = daysUntil(aide.deadline);
      if (days >= 0 && days <= 30) {
        items.push({
          id: `aide-${aide.id}`,
          message: `${aide.nom} — deadline dans ${days}j`,
          days,
          href: `/aides/${aide.id}`,
          type: 'deadline',
        });
      }
    }

    // Upcoming festival deadlines within 30 days
    for (const festival of festivals) {
      const days = daysUntil(festival.deadline);
      if (days >= 0 && days <= 30) {
        items.push({
          id: `fest-${festival.id}`,
          message: `${festival.nom} — deadline dans ${days}j`,
          days,
          href: `/festivals/${festival.id}`,
          type: 'deadline',
        });
      }
    }

    // Sort by urgency
    items.sort((a, b) => (a.days ?? 99) - (b.days ?? 99));

    return items;
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const count = notifications.length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-colors"
      >
        <Bell size={16} />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-surface shadow-xl z-50">
          <div className="px-4 py-3 border-b border-border">
            <h4 className="text-sm font-semibold text-text-primary">
              Notifications
            </h4>
            <p className="text-xs text-text-muted">{count} alerte{count !== 1 ? 's' : ''}</p>
          </div>
          <div className="max-h-72 overflow-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-text-muted">
                Aucune notification
              </p>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover transition-colors border-b border-border last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-text-primary truncate">{n.message}</p>
                  </div>
                  {n.days != null && <DeadlineBadge days={n.days} />}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
