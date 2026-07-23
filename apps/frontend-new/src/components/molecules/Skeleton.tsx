'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, count = 1, ...props }, ref) => (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          ref={ref}
          className={cn(
            'rounded-lg bg-gradient-to-r from-bg-tertiary via-bg-secondary to-bg-tertiary animate-shimmer',
            className
          )}
          {...props}
        />
      ))}
    </>
  )
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
