'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500/10 text-primary-400 border border-primary-500/20',
        blue: 'bg-status-blue/10 text-status-blue border border-status-blue/20',
        yellow: 'bg-status-yellow/10 text-status-yellow border border-status-yellow/20',
        green: 'bg-status-green/10 text-status-green border border-status-green/20',
        red: 'bg-status-red/10 text-status-red border border-status-red/20',
        gray: 'bg-status-gray/10 text-status-gray border border-status-gray/20',
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div className={cn(badgeVariants({ variant, size }), className)} ref={ref} {...props} />
  )
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
