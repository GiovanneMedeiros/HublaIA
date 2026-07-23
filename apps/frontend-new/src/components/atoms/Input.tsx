'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type = 'text', ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-gray mb-2">{label}</label>
      )}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray">{icon}</span>}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-lg border border-bg-tertiary bg-bg-secondary px-4 py-2 text-base text-neutral-white placeholder:text-neutral-gray/50 transition-colors duration-200',
            'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10',
            'disabled:cursor-not-allowed disabled:opacity-50',
            icon && 'pl-10',
            error && 'border-status-red focus:border-status-red focus:ring-status-red/10',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-status-red">{error}</p>}
    </div>
  )
);

Input.displayName = 'Input';

export { Input };
