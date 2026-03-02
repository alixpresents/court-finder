interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
}

export default function Card({ children, className = '', hover = false, style }: CardProps) {
  return (
    <div
      style={style}
      className={`rounded-xl border border-border bg-surface ${
        hover
          ? 'transition-all duration-200 hover:border-border-hover hover:bg-surface-hover hover:scale-[1.02]'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
