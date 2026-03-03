import type { LucideIcon } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  children: React.ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-accent text-text-on-accent hover:brightness-110 font-medium',
  secondary: 'bg-surface-hover text-text-primary border border-border hover:border-border-hover',
  ghost: 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
  danger: 'bg-red-500/10 text-red-400 hover:bg-red-500/20',
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-sm gap-2',
};

const ICON_SIZES: Record<Size, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={ICON_SIZES[size]} />}
      {children}
    </button>
  );
}
