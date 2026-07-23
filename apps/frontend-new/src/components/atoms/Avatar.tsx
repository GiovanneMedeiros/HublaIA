'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
}

const sizeClasses = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-2xl',
};

const statusColors = {
  online: 'bg-status-green',
  offline: 'bg-status-gray',
  away: 'bg-status-yellow',
  busy: 'bg-status-red',
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = 'Avatar', fallback = '?', size = 'md', status, ...props }, ref) => (
    <div className="relative inline-flex">
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-600 font-medium text-white overflow-hidden',
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <span>{fallback}</span>
        )}
      </div>
      {status && (
        <div
          className={cn(
            'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-bg-primary',
            statusColors[status]
          )}
        />
      )}
    </div>
  )
);

Avatar.displayName = 'Avatar';

export { Avatar };
