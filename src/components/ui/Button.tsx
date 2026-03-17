'use client';

import React, { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'submit' | 'button' | 'reset';
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}: ButtonProps) => {
  /* Squircle radius + One UI motion (cubic-bezier 0.22, 0.25, 0, 1) */
  const base =
    'inline-flex items-center justify-center font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded-[var(--radius-md)] transition-all duration-300 transition-samsung';

  const variants = {
    primary:
      'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] active:scale-[0.98] shadow-[var(--shadow-sm)]',
    secondary:
      'bg-[var(--athens-gray)] text-[var(--shark)] hover:bg-[var(--fill)] border border-[var(--border-light)]',
    outline:
      'border-2 border-[var(--primary)] text-[var(--primary)] bg-transparent hover:bg-[var(--primary)] hover:text-white',
    ghost:
      'text-[var(--shark)] hover:bg-[var(--athens-gray)]',
    destructive:
      'bg-[var(--destructive)] text-white hover:bg-[var(--destructive-hover)] active:scale-[0.98] shadow-[var(--shadow-sm)] focus-visible:ring-[var(--destructive)]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-[var(--radius-sm)]',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg rounded-[var(--radius-lg)]',
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      className={classes}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
