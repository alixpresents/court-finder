'use client';

import { Plus, X } from 'lucide-react';

interface ArrayEditorProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export default function ArrayEditor({ label, values, onChange, placeholder = 'Ajouter...' }: ArrayEditorProps) {
  function update(index: number, value: string) {
    const next = [...values];
    next[index] = value;
    onChange(next);
  }

  function remove(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...values, '']);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-secondary">{label}</label>
      <div className="space-y-1.5">
        {values.map((val, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={val}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 rounded-lg border border-border bg-surface-hover px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-border-focus focus:ring-1 focus:ring-accent/25"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-tertiary hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 self-start rounded-md px-2 py-1 text-xs text-text-tertiary hover:text-accent hover:bg-accent/5 transition-colors"
      >
        <Plus size={13} /> Ajouter
      </button>
    </div>
  );
}
