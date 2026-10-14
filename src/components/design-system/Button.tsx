import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cobalt' | 'tomato' | 'outline' | 'quiet';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'cobalt',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  const variantClass =
    variant === 'cobalt'
      ? 'ca-button-cobalt'
      : variant === 'tomato'
      ? 'ca-button-tomato'
      : variant === 'outline'
      ? 'ca-button-outline'
      : 'ca-button-quiet';

  return (
    <button
      className={`ca-button ${variantClass} ${fullWidth ? 'ca-button-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
