'use client';

import { FINANCEMENT_CATEGORY_LABELS, FINANCEMENT_CATEGORY_COLORS } from '@/lib/constants';
import type { FinancementCategory } from '@/lib/types';

interface Slice {
  category: FinancementCategory;
  total: number;
}

interface DonutChartProps {
  slices: Slice[];
  budget: number;
}

export default function DonutChart({ slices, budget }: DonutChartProps) {
  const total = slices.reduce((s, sl) => s + sl.total, 0);
  const size = 160;
  const stroke = 24;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  // Build segments
  let offset = 0;
  const segments = slices
    .filter((s) => s.total > 0)
    .map((s) => {
      const pct = budget > 0 ? s.total / budget : 0;
      const length = pct * circumference;
      const seg = {
        category: s.category,
        color: FINANCEMENT_CATEGORY_COLORS[s.category],
        dashArray: `${length} ${circumference - length}`,
        dashOffset: -offset,
        pct,
      };
      offset += length;
      return seg;
    });

  const coveredPct = budget > 0 ? Math.min(Math.round((total / budget) * 100), 999) : 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--surface-hover)"
            strokeWidth={stroke}
          />
          {/* Data segments */}
          {segments.map((seg) => (
            <circle
              key={seg.category}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              strokeDasharray={seg.dashArray}
              strokeDashoffset={seg.dashOffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-text-primary tabular-nums">{coveredPct}%</span>
          <span className="text-xs text-text-muted">couvert</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {slices
          .filter((s) => s.total > 0)
          .map((s) => (
            <div key={s.category} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: FINANCEMENT_CATEGORY_COLORS[s.category] }}
              />
              <span className="text-xs text-text-secondary">
                {FINANCEMENT_CATEGORY_LABELS[s.category]}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
