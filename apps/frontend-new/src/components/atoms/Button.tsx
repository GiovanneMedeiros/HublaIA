'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-md hover:shadow-lg',
        secondary:
          'bg-bg-secondary text-neutral-gray border border-bg-tertiary hover:bg-bg-tertiary active:bg-primary-500 active:text-white',
        ghost: 'text-neutral-gray hover:bg-bg-secondary active:bg-bg-tertiary',
        danger: 'bg-status-red text-white hover:bg-red-600 active:bg-red-700',
        outline:
          'border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white active:bg-primary-600',
      },
      size: {
        xs: 'px-3 py-1.5 text-xs h-8',
        sm: 'px-4 py-2 text-sm h-9',
        md: 'px-6 py-2.5 text-base h-10',
        lg: 'px-8 py-3 text-lg h-12',
        xl: 'px-10 py-4 text-xl h-14',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading,
      disabled,
      icon,
      children,
      ...props
    },
    ref
  ) => (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={disabled || isLoading}
      ref={ref}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {children}
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {children}
        </span>
      )}
    </button>
  )
);

Button.displayName = 'Button';

export { Button, buttonVariants };
