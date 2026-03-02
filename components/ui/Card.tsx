interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface ${
        hover ? 'transition-colors hover:border-border-hover hover:bg-surface-hover' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
