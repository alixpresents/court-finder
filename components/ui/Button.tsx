import type { LucideIcon } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: LucideIcon;
  children: React.ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-accent text-background hover:bg-accent-hover font-medium',
  secondary: 'bg-surface-hover text-text-primary border border-border hover:border-border-hover',
  ghost: 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
  danger: 'bg-red-500/10 text-red-400 hover:bg-red-500/20',
};

export default function Button({
  variant = 'primary',
  icon: Icon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors disabled:opacity-50 disabled:pointer-events-none ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
