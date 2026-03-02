interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
}

export default function ProgressBar({ value, max = 100, color = 'bg-accent' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="h-1.5 w-full rounded-full bg-white/5">
      <div
        className={`h-full rounded-full transition-all ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
