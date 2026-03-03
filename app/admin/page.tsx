'use client';

import { useMemo } from 'react';
import { Award, Trophy, AlertTriangle, Plus } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import Card from '@/components/ui/Card';
import FreshnessCard from '@/components/admin/FreshnessCard';
import AdminAlerts from '@/components/admin/AdminAlerts';
import { daysUntil } from '@/lib/dates';

export default function AdminDashboardPage() {
  const { mergedAides, mergedFestivals, history } = useAdmin();

  const stats = useMemo(() => {
    const expiredAides = mergedAides.filter((a) => daysUntil(a.deadline) < 0).length;
    const expiredFestivals = mergedFestivals.filter((f) => daysUntil(f.deadline) < 0).length;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const addedThisMonth = history.filter((h) => h.action === 'create' && h.timestamp >= monthStart).length;

    const totalItems = mergedAides.length + mergedFestivals.length;
    const activeItems = totalItems - expiredAides - expiredFestivals;
    const freshnessScore = totalItems > 0 ? Math.round((activeItems / totalItems) * 100) : 100;

    const aidesNoDeadline = mergedAides.filter((a) => !a.deadline).length;
    const festivalsNoDeadline = mergedFestivals.filter((f) => !f.deadline).length;

    return {
      totalAides: mergedAides.length,
      totalFestivals: mergedFestivals.length,
      expiredDeadlines: expiredAides + expiredFestivals,
      addedThisMonth,
      freshnessScore,
      aidesNoDeadline,
      festivalsNoDeadline,
    };
  }, [mergedAides, mergedFestivals, history]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-bold text-text-primary">Espace Admin</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Tableau de bord de maintenance des données.
        </p>
      </div>

      {/* Top row: Freshness + Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <FreshnessCard score={stats.freshnessScore} label="Données à jour" />

        <Card className="p-5 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <Award size={15} className="text-accent" />
            <span className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">Aides</span>
          </div>
          <p className="font-mono text-2xl font-bold text-text-primary">{stats.totalAides}</p>
        </Card>

        <Card className="p-5 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={15} className="text-festival" />
            <span className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">Festivals</span>
          </div>
          <p className="font-mono text-2xl font-bold text-text-primary">{stats.totalFestivals}</p>
        </Card>

        <Card className="p-5 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={15} className="text-red-400" />
            <span className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">Expirées</span>
          </div>
          <p className="font-mono text-2xl font-bold text-text-primary">{stats.expiredDeadlines}</p>
        </Card>

        <Card className="p-5 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <Plus size={15} className="text-accent-purple" />
            <span className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">Ce mois</span>
          </div>
          <p className="font-mono text-2xl font-bold text-text-primary">{stats.addedThisMonth}</p>
        </Card>
      </div>

      {/* Alerts */}
      <AdminAlerts aides={mergedAides} festivals={mergedFestivals} />

      {/* Todo */}
      <Card className="p-5">
        <h3 className="mb-3 text-sm font-semibold text-text-primary">Todo hebdo</h3>
        <ul className="space-y-2">
          {stats.expiredDeadlines > 0 && (
            <li className="flex items-center gap-2 text-sm text-text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
              {stats.expiredDeadlines} deadline{stats.expiredDeadlines > 1 ? 's' : ''} expirée{stats.expiredDeadlines > 1 ? 's' : ''} à mettre à jour
            </li>
          )}
          {stats.aidesNoDeadline > 0 && (
            <li className="flex items-center gap-2 text-sm text-text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
              {stats.aidesNoDeadline} aide{stats.aidesNoDeadline > 1 ? 's' : ''} sans deadline
            </li>
          )}
          {stats.festivalsNoDeadline > 0 && (
            <li className="flex items-center gap-2 text-sm text-text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
              {stats.festivalsNoDeadline} festival{stats.festivalsNoDeadline > 1 ? 's' : ''} sans deadline
            </li>
          )}
          {stats.expiredDeadlines === 0 && stats.aidesNoDeadline === 0 && stats.festivalsNoDeadline === 0 && (
            <li className="text-sm text-accent">Tout est à jour !</li>
          )}
        </ul>
      </Card>
    </div>
  );
}
