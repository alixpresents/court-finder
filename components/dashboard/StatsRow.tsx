'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  const rafRef = useRef<number>(0);
  const target = typeof value === 'number' ? value : 0;
  const isNumber = typeof value === 'number';

  const animate = useCallback(() => {
    if (!isNumber || target === 0) {
      setDisplay(target);
      return;
    }
    const duration = 600;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [target, isNumber]);

  useEffect(() => {
    animate();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [animate]);

  if (!isNumber) return <>{value}</>;
  return <>{display}</>;
}

export default function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Card
          key={stat.label}
          className="p-4 animate-fade-in"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-start gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <div>
              <p className="text-[32px] font-bold text-text-primary font-mono tabular-nums leading-none">
                <AnimatedValue value={stat.value} />
              </p>
              <p className="mt-1 text-xs text-text-secondary">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
