'use client';

interface MultiSelectProps {
  label: string;
  options: { value: string; label: string }[];
  values: string[];
  onChange: (values: string[]) => void;
}

export default function MultiSelect({ label, options, values, onChange }: MultiSelectProps) {
  function toggle(value: string) {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-secondary">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const selected = values.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`rounded px-3 py-1.5 text-xs font-medium border transition-colors ${
                selected
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-surface text-text-secondary hover:text-text-primary hover:border-border-hover'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
