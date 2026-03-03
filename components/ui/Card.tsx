interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: 'default' | 'elevated';
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function Card({ children, className = '', hover = false, variant = 'default', style, onClick }: CardProps) {
  const bg = variant === 'elevated' ? 'bg-elevated' : 'bg-surface';
  return (
    <div
      style={style}
      onClick={onClick}
      className={`rounded-lg border border-border ${bg} ${
        hover
          ? 'transition-all duration-200 hover:border-border-hover hover:bg-surface-hover hover:scale-[1.01] cursor-pointer'
          : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
