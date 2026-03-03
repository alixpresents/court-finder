'use client';

import Card from '@/components/ui/Card';

interface FreshnessCardProps {
  score: number;
  label: string;
}

export default function FreshnessCard({ score, label }: FreshnessCardProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card className="p-5 flex flex-col items-center justify-center gap-3">
      <div className="relative h-24 w-24">
        <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96">
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-white/5"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-accent transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-2xl font-bold text-text-primary">{score}%</span>
        </div>
      </div>
      <p className="text-sm text-text-secondary text-center">{label}</p>
    </Card>
  );
}
