import React from 'react';

export interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const Field: React.FC<FieldProps> = ({
  label,
  hint,
  error,
  children,
  className = '',
}) => {
  return (
    <div className={`ca-field ${className}`}>
      <label className="ca-label text-zinc-900">{label}</label>
      {children}
      {hint && !error && <span className="ca-caption text-zinc-500">{hint}</span>}
      {error && <span className="ca-caption text-[#dc2626] font-medium">{error}</span>}
    </div>
  );
};
