import Link from 'next/link';
import type { CalendarEvent as CalendarEventType } from '@/lib/types';

interface CalendarEventProps {
  event: CalendarEventType;
}

const TYPE_COLORS: Record<string, string> = {
  aide: 'bg-accent',
  festival: 'bg-festival',
  soumission: 'bg-blue-400',
};

export default function CalendarEvent({ event }: CalendarEventProps) {
  const href = event.type === 'aide'
    ? `/aides/${event.targetId}`
    : event.type === 'festival'
    ? `/festivals/${event.targetId}`
    : '/soumissions';

  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 rounded px-1.5 py-0.5 hover:bg-surface-hover transition-colors group"
    >
      <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${TYPE_COLORS[event.type] ?? 'bg-white/30'}`} />
      <span className="text-[11px] text-text-secondary group-hover:text-text-primary truncate">
        {event.title}
      </span>
    </Link>
  );
}
