import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMonthName } from '@/lib/dates';

interface CalendarControlsProps {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function CalendarControls({ year, month, onPrev, onNext, onToday }: CalendarControlsProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="font-sans text-lg font-semibold text-text-primary capitalize">
        {getMonthName(month)} {year}
      </h2>
      <div className="flex items-center gap-2">
        <button
          onClick={onToday}
          className="rounded-lg px-3 py-1.5 text-xs text-text-secondary border border-border hover:bg-surface-hover transition-colors"
        >
          Aujourd&apos;hui
        </button>
        <button
          onClick={onPrev}
          className="rounded-lg p-1.5 text-text-secondary hover:bg-surface-hover transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={onNext}
          className="rounded-lg p-1.5 text-text-secondary hover:bg-surface-hover transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
