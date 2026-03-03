interface MatchScoreProps {
  score: number;
  size?: number;
}

function getScoreColor(score: number): string {
  if (score >= 70) return 'bg-emerald-500';
  if (score >= 40) return 'bg-amber-400';
  return 'bg-red-500';
}

function getTextColor(score: number): string {
  if (score >= 70) return 'text-emerald-400';
  if (score >= 40) return 'text-amber-400';
  return 'text-red-400';
}

export default function MatchScore({ score }: MatchScoreProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-1.5 w-16 rounded-full bg-white/8 overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${getScoreColor(score)} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`font-mono text-xs font-medium tabular-nums ${getTextColor(score)}`}>
        {score}%
      </span>
    </div>
  );
}
