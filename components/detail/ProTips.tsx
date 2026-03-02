import { Lightbulb } from 'lucide-react';
import Card from '@/components/ui/Card';

interface ProTipsProps {
  tips: string[];
}

export default function ProTips({ tips }: ProTipsProps) {
  return (
    <Card className="p-5 border-accent/20">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={16} className="text-accent" />
        <h2 className="font-sans text-base font-semibold text-text-primary">Conseils</h2>
      </div>
      <ul className="space-y-2.5">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
            <span className="text-accent mt-1 shrink-0">-</span>
            {tip}
          </li>
        ))}
      </ul>
    </Card>
  );
}
