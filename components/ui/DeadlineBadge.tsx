import Badge from './Badge';

interface DeadlineBadgeProps {
  days: number;
}

export default function DeadlineBadge({ days }: DeadlineBadgeProps) {
  if (days < 3) {
    return (
      <Badge className="bg-red-500/15 text-red-400 animate-blink-urgent">
        {days}j
      </Badge>
    );
  }
  if (days < 7) {
    return (
      <Badge className="bg-red-500/15 text-red-400">
        {days}j
      </Badge>
    );
  }
  if (days <= 30) {
    return (
      <Badge className="bg-amber-500/15 text-amber-400">
        {days}j
      </Badge>
    );
  }
  return (
    <Badge className="bg-emerald-500/15 text-emerald-400">
      {days}j
    </Badge>
  );
}
