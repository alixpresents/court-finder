import { AlertTriangle, Clock, AlertCircle, Info } from 'lucide-react';
import type { FinancementSource, Project, Aide } from '@/lib/types';
import { daysUntil, formatDate } from '@/lib/dates';

interface Alert {
  type: 'warning' | 'error' | 'info';
  message: string;
}

interface AlertsPanelProps {
  sources: FinancementSource[];
  project: Project;
  aides: Aide[];
  budget: number;
}

export default function AlertsPanel({ sources, project, aides, budget }: AlertsPanelProps) {
  const alerts: Alert[] = [];
  const total = sources.reduce((s, src) => s + src.montant, 0);

  // Over budget
  if (total > budget && budget > 0) {
    alerts.push({
      type: 'error',
      message: `Ton plan de financement dépasse ton budget de ${new Intl.NumberFormat('fr-FR').format(total - budget)} €. Ajuste les montants.`,
    });
  }

  // Check each aide source
  for (const source of sources) {
    if (!source.aideId) continue;
    const aide = aides.find((a) => a.id === source.aideId);
    if (!aide) continue;

    // Deadline passed
    const days = daysUntil(aide.deadline);
    if (days < 0) {
      const nextSession = aide.session ?? 'prochaine session à vérifier';
      alerts.push({
        type: 'warning',
        message: `La deadline ${aide.nom} est passée (${formatDate(aide.deadline)}). ${nextSession}.`,
      });
    }

    // Beaumarchais + production company
    if (
      aide.id === 'beaumarchais' &&
      project.productionNom
    ) {
      alerts.push({
        type: 'warning',
        message: `Beaumarchais est réservé aux projets sans producteur confirmé, or tu as renseigné "${project.productionNom}".`,
      });
    }

    // Montant over max
    if (source.montant > aide.montantMax) {
      alerts.push({
        type: 'info',
        message: `Le montant pour "${aide.nom}" dépasse le maximum de ${new Intl.NumberFormat('fr-FR').format(aide.montantMax)} €.`,
      });
    }
  }

  // Auto-production advice
  if (project.autoProduction) {
    const blockedAides = aides.filter((a) => a.requiresProducer);
    if (blockedAides.length > 0) {
      const potentiel = blockedAides.reduce((sum, a) => sum + a.montantMax, 0);
      alerts.push({
        type: 'info',
        message: `Certaines aides majeures nécessitent un producteur. Envisage un rapprochement avec une société de production pour débloquer ${blockedAides.length} aides supplémentaires représentant jusqu'à ${new Intl.NumberFormat('fr-FR').format(potentiel)} €.`,
      });
    }
  }

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert, i) => {
        const Icon = alert.type === 'error' ? AlertCircle : alert.type === 'warning' ? AlertTriangle : Info;
        const colors =
          alert.type === 'error'
            ? 'border-red-500/20 bg-red-500/5 text-red-400'
            : alert.type === 'warning'
              ? 'border-amber-500/20 bg-amber-500/5 text-amber-400'
              : 'border-blue-500/20 bg-blue-500/5 text-blue-400';

        return (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${colors}`}
          >
            <Icon size={16} className="shrink-0 mt-0.5" />
            <p className="text-sm">{alert.message}</p>
          </div>
        );
      })}
    </div>
  );
}
