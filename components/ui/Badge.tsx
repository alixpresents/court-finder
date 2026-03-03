interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export default function Badge({ children, className = 'bg-white/10 text-text-secondary', size = 'sm' }: BadgeProps) {
  const sizeClasses = size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-xs';
  return (
    <span className={`inline-flex items-center rounded font-medium ${sizeClasses} ${className}`}>
      {children}
    </span>
  );
}
