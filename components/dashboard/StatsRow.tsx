'use client';

import { useState, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';
import Card from '@/components/ui/Card';

interface Stat {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

interface StatsRowProps {
  stats: Stat[];
}

function AnimatedValue({ value }: { value: string | number }) {
  const [display, setDisplay] = useState(0);
  const target = typeof value === 'number' ? value : 0;
  const isNumber = typeof value === 'number';

  useEffect(() => {
    if (!isNumber || target === 0) {
      setDisplay(target);
      return;
    }
    setDisplay(0);
    const duration = 800;
    const step = Math.max(1, Math.floor(duration / target));
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      setDisplay(current);
    }, step);
    return () => clearInterval(interval);
  }, [target, isNumber]);

  if (!isNumber) return <>{value}</>;
  return <>{display}</>;
}

export default function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {stats.map((stat, i) => (
        <Card
          key={stat.label}
          className="p-4 animate-fade-in"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary font-sans tabular-nums">
                <AnimatedValue value={stat.value} />
              </p>
              <p className="text-xs text-text-secondary">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
