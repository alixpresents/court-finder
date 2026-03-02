import { getMonthDays, isSameDay, DAYS_FR } from '@/lib/dates';
import CalendarEvent from './CalendarEvent';
import type { CalendarEvent as CalendarEventType } from '@/lib/types';

interface CalendarGridProps {
  year: number;
  month: number;
  events: CalendarEventType[];
}

export default function CalendarGrid({ year, month, events }: CalendarGridProps) {
  const cells = getMonthDays(year, month);
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="grid grid-cols-7 border-b border-border">
        {DAYS_FR.map((day) => (
          <div key={day} className="px-2 py-2.5 text-center text-xs font-medium text-text-muted">
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

          return (
            <div
              key={i}
              className={`min-h-[100px] border-b border-r border-border p-1.5 ${
                !day ? 'bg-background/50' : 'hover:bg-surface-hover/50'
              } ${i % 7 === 6 ? 'border-r-0' : ''}`}
            >
              {day && (
                <>
                  <div className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                    isToday
                      ? 'bg-accent text-background font-bold'
                      : 'text-text-secondary'
                  }`}>
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 3).map((event) => (
                      <CalendarEvent key={event.id} event={event} />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-[10px] text-text-muted px-1.5">
                        +{dayEvents.length - 3} autres
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
  );
}
