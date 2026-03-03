'use client';

import Link from 'next/link';
import { getMonthDays, isSameDay, DAYS_FR, daysUntil, formatShortDate } from '@/lib/dates';
import type { CalendarEvent as CalendarEventType } from '@/lib/types';

interface CalendarGridProps {
  year: number;
  month: number;
  events: CalendarEventType[];
}

const TYPE_COLORS: Record<string, string> = {
  aide: 'bg-accent',
  festival: 'bg-festival',
  soumission: 'bg-blue-400',
};

const TYPE_TEXT: Record<string, string> = {
  aide: 'text-accent',
  festival: 'text-festival',
  soumission: 'text-blue-400',
};

export default function CalendarGrid({ year, month, events }: CalendarGridProps) {
  const cells = getMonthDays(year, month);
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  // Build list of events for this month for mobile view
  const monthEvents = events
    .filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <>
      {/* Desktop grid */}
      <div className="hidden md:block rounded-lg border border-border bg-surface overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border">
          {DAYS_FR.map((day) => (
            <div key={day} className="px-2 py-2.5 text-center text-xs font-medium text-text-tertiary">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            const dayEvents = day
              ? events.filter((e) => isSameDay(e.date, year, month, day))
              : [];
            const isToday = isCurrentMonth && day === today.getDate();
            const hasUrgent = dayEvents.some((e) => {
              const d = daysUntil(e.date);
              return d >= 0 && d < 7;
            });

            return (
              <div
                key={i}
                className={`min-h-[90px] border-b border-r border-border p-1.5 transition-colors ${
                  !day ? 'bg-background/50' : 'hover:bg-surface-hover/50'
                } ${i % 7 === 6 ? 'border-r-0' : ''} ${
                  hasUrgent && day ? 'ring-1 ring-inset ring-red-500/20' : ''
                }`}
              >
                {day && (
                  <>
                    <div className={`mb-1.5 flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                      isToday
                        ? 'bg-accent text-text-on-accent font-bold'
                        : 'text-text-secondary'
                    }`}>
                      {day}
                    </div>
                    {/* Dots */}
                    <div className="flex flex-wrap gap-1 px-0.5">
                      {dayEvents.slice(0, 5).map((event) => (
                        <Link
                          key={event.id}
                          href={event.type === 'aide' ? `/aides/${event.targetId}` : event.type === 'festival' ? `/festivals/${event.targetId}` : '/soumissions'}
                          title={event.title}
                        >
                          <div className={`h-2 w-2 rounded-full ${TYPE_COLORS[event.type]} hover:scale-150 transition-transform`} />
                        </Link>
                      ))}
                      {dayEvents.length > 5 && (
                        <span className="text-[9px] text-text-tertiary leading-none mt-0.5">
                          +{dayEvents.length - 5}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile list view */}
      <div className="md:hidden space-y-1">
        {monthEvents.length === 0 && (
          <p className="text-center text-sm text-text-tertiary py-8">
            Aucun événement ce mois-ci.
          </p>
        )}
        {monthEvents.map((event) => {
          const d = daysUntil(event.date);
          const href = event.type === 'aide' ? `/aides/${event.targetId}` : event.type === 'festival' ? `/festivals/${event.targetId}` : '/soumissions';
          return (
            <Link
              key={event.id}
              href={href}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-surface-hover transition-colors"
            >
              <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${TYPE_COLORS[event.type]}`} />
              <span className="flex-1 min-w-0 text-sm text-text-primary truncate">{event.title}</span>
              <span className="text-xs font-mono text-text-tertiary tabular-nums">{formatShortDate(event.date)}</span>
              {d >= 0 && d < 7 && (
                <span className="text-[10px] font-mono text-red-400 font-semibold">{d}j</span>
              )}
            </Link>
          );
        })}
      </div>
    </>
  );
}
