interface MatchScoreProps {
  score: number;
  size?: number;
}

function getScoreColor(score: number): string {
  if (score >= 70) return '#3ECF8E';
  if (score >= 40) return '#E8C547';
  return '#EF4444';
}

export default function MatchScore({ score, size = 48 }: MatchScoreProps) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={3}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
        />
      </svg>
      <span
        className="absolute text-xs font-semibold"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}
