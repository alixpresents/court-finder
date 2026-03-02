import type { Submission } from '@/lib/types';
import Card from '@/components/ui/Card';

interface SubmissionStatsProps {
  submissions: Submission[];
}

export default function SubmissionStats({ submissions }: SubmissionStatsProps) {
  const total = submissions.length;
  const enCours = submissions.filter((s) => s.status === 'soumise').length;
  const acceptees = submissions.filter((s) => s.status === 'acceptee').length;
  const refusees = submissions.filter((s) => s.status === 'refusee').length;

  const stats = [
    { label: 'Total', value: total, color: 'text-text-primary' },
    { label: 'En cours', value: enCours, color: 'text-blue-400' },
    { label: 'Acceptées', value: acceptees, color: 'text-emerald-400' },
    { label: 'Refusées', value: refusees, color: 'text-red-400' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label} className="p-4 text-center">
          <p className={`text-2xl font-bold font-sans ${s.color}`}>{s.value}</p>
          <p className="text-xs text-text-muted mt-1">{s.label}</p>
        </Card>
      ))}
    </div>
  );
}
