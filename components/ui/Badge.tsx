interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className = 'bg-white/10 text-text-secondary' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}
