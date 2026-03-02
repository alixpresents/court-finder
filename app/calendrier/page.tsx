'use client';

import { useState, useMemo } from 'react';
import { addMonths } from '@/lib/dates';
import { aides } from '@/data/aides';
import { festivals } from '@/data/festivals';
import { useProject } from '@/context/ProjectContext';
import { useSubmissions } from '@/context/SubmissionsContext';
import CalendarControls from '@/components/calendar/CalendarControls';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import type { CalendarEvent } from '@/lib/types';

export default function CalendrierPage() {
  const { activeProject } = useProject();
  const { submissions } = useSubmissions();
  const [current, setCurrent] = useState(new Date());

  const year = current.getFullYear();
  const month = current.getMonth();

  const filteredSubmissions = useMemo(
    () => activeProject ? submissions.filter((s) => s.projectId === activeProject.id) : submissions,
    [submissions, activeProject],
  );

  const events: CalendarEvent[] = useMemo(() => {
    const all: CalendarEvent[] = [];
    aides.forEach((a) => {
      all.push({ id: `aide-${a.id}`, title: a.nom, date: a.deadline, type: 'aide', targetId: a.id });
    });
    festivals.forEach((f) => {
      all.push({ id: `fest-${f.id}`, title: f.nom, date: f.deadline, type: 'festival', targetId: f.id });
    });
    filteredSubmissions.forEach((s) => {
      all.push({ id: `sub-${s.id}`, title: s.targetNom, date: s.deadline, type: 'soumission', targetId: s.targetId });
    });
    return all;
  }, [filteredSubmissions]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-bold text-text-primary">Calendrier</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Toutes les deadlines en un coup d&apos;oeil.
        </p>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-accent" />
            <span className="text-xs text-text-muted">Aides</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-festival" />
            <span className="text-xs text-text-muted">Festivals</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-400" />
            <span className="text-xs text-text-muted">Soumissions</span>
          </div>
        </div>
      </div>

      <CalendarControls
        year={year}
        month={month}
        onPrev={() => setCurrent(addMonths(current, -1))}
        onNext={() => setCurrent(addMonths(current, 1))}
        onToday={() => setCurrent(new Date())}
      />

      <CalendarGrid year={year} month={month} events={events} />
    </div>
  );
}
