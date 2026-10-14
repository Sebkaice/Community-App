import React from 'react';

export interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  accent?: 'none' | 'cobalt' | 'sun';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  accent = 'none',
  className = '',
}) => {
  const accentClass =
    accent === 'cobalt'
      ? 'ca-stat-card-accent-cobalt'
      : accent === 'sun'
      ? 'ca-stat-card-accent-sun'
      : '';

  return (
    <div className={`ca-stat-card ${accentClass} ${className}`}>
      <span className="ca-label ca-stat-label text-[13px]">{label}</span>
      <div className="ca-stat my-0.5">{value}</div>
      {subtext && (
        <span
          className={`ca-caption ${
            accent === 'cobalt'
              ? 'text-white/80'
              : accent === 'sun'
              ? 'text-zinc-900/80'
              : 'text-zinc-500'
          }`}
        >
          {subtext}
        </span>
      )}
    </div>
  );
};
