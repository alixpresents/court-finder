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

export default function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary font-sans">{stat.value}</p>
              <p className="text-xs text-text-secondary">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
