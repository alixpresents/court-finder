interface BudgetBarProps {
  covered: number;
  budget: number;
}

export default function BudgetBar({ covered, budget }: BudgetBarProps) {
  const pct = budget > 0 ? Math.min((covered / budget) * 100, 100) : 0;
  const remaining = Math.max(budget - covered, 0);
  const over = covered > budget;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-secondary">Budget couvert</span>
        <span className="font-medium text-text-primary tabular-nums">
          {new Intl.NumberFormat('fr-FR').format(covered)} / {new Intl.NumberFormat('fr-FR').format(budget)} €
        </span>
      </div>
      <div className="h-3 rounded-full bg-surface-hover overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            over ? 'bg-red-400' : 'bg-accent'
          }`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className={over ? 'text-red-400 font-medium' : 'text-text-muted'}>
          {over
            ? `Dépassement : +${new Intl.NumberFormat('fr-FR').format(covered - budget)} €`
            : `Reste à trouver : ${new Intl.NumberFormat('fr-FR').format(remaining)} €`}
        </span>
        <span className="text-text-muted tabular-nums">{Math.round(pct)}%</span>
      </div>
    </div>
  );
}
