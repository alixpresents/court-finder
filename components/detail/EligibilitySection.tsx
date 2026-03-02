import { Check, X } from 'lucide-react';
import Card from '@/components/ui/Card';
import type { MatchResult } from '@/lib/types';

interface Criterion {
  label: string;
  met: boolean;
  detail?: string;
}

interface EligibilitySectionProps {
  criteria: Criterion[];
  match?: MatchResult;
}

export default function EligibilitySection({ criteria, match }: EligibilitySectionProps) {
  const metCount = criteria.filter((c) => c.met).length;

  return (
    <Card className="p-5">
      <h2 className="font-sans text-base font-semibold text-text-primary mb-4">
        Éligibilité {match && `— ${match.score}/100`}
      </h2>
      <div className="space-y-3">
        {criteria.map((c, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full shrink-0 ${
              c.met ? 'bg-accent/15 text-accent' : 'bg-red-500/15 text-red-400'
            }`}>
              {c.met ? <Check size={12} /> : <X size={12} />}
            </div>
            <div>
              <p className={`text-sm ${c.met ? 'text-text-primary' : 'text-text-secondary'}`}>{c.label}</p>
              {c.detail && <p className="text-xs text-text-muted mt-0.5">{c.detail}</p>}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <p className="text-xs text-text-muted">{metCount}/{criteria.length} critères remplis</p>
      </div>
    </Card>
  );
}
