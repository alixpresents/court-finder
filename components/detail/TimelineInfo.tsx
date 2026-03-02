import { Clock } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate, daysUntil } from '@/lib/dates';

interface TimelineInfoProps {
  deadline: string;
  dateEvent?: string;
  extraInfo?: { label: string; value: string }[];
}

export default function TimelineInfo({ deadline, dateEvent, extraInfo }: TimelineInfoProps) {
  const days = daysUntil(deadline);

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-text-muted" />
        <h2 className="font-sans text-base font-semibold text-text-primary">Calendrier</h2>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Deadline</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">{formatDate(deadline)}</span>
            <Badge className={
              days < 0 ? 'bg-red-500/15 text-red-400' :
              days <= 14 ? 'bg-red-500/15 text-red-400' :
              days <= 30 ? 'bg-amber-500/15 text-amber-400' :
              'bg-white/10 text-text-secondary'
            }>
              {days < 0 ? 'Passée' : `${days}j`}
            </Badge>
          </div>
        </div>
        {dateEvent && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Événement</span>
            <span className="text-sm font-medium text-text-primary">{formatDate(dateEvent)}</span>
          </div>
        )}
        {extraInfo?.map((info, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">{info.label}</span>
            <span className="text-sm font-medium text-text-primary">{info.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
