'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      className={cn(
        'rounded-lg',
        variant === 'default' && 'bg-bg-secondary border border-bg-tertiary',
        variant === 'glass' &&
          'bg-white/5 backdrop-blur-md border border-white/10 shadow-glass',
        variant === 'gradient' &&
          'bg-gradient-to-br from-bg-secondary to-bg-tertiary border border-bg-tertiary',
        className
      )}
      ref={ref}
      {...props}
    />
  )
);

Card.displayName = 'Card';

export { Card };
