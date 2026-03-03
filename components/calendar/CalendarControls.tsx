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
          className="rounded-md px-3 py-2 text-xs text-text-secondary border border-border hover:bg-surface-hover transition-colors min-h-[44px]"
        >
          Aujourd&apos;hui
        </button>
        <button
          onClick={onPrev}
          className="flex items-center justify-center rounded-md p-2.5 text-text-secondary hover:bg-surface-hover transition-colors min-h-[44px] min-w-[44px]"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={onNext}
          className="flex items-center justify-center rounded-md p-2.5 text-text-secondary hover:bg-surface-hover transition-colors min-h-[44px] min-w-[44px]"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
