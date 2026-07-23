'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import { Card } from '@/components/atoms';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onClick?: () => void;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      title,
      value,
      subtitle,
      icon,
      trend,
      trendValue,
      onClick,
      ...props
    },
    ref
  ) => (
    <Card
      ref={ref}
      className="p-6 cursor-pointer hover:border-primary-500/50 transition-all hover:shadow-lg"
      onClick={onClick}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-gray">{title}</p>
          <p className="mt-2 text-3xl font-bold text-neutral-white">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-neutral-gray">{subtitle}</p>
          )}
          {trend && trendValue && (
            <p
              className={cn(
                'mt-2 text-xs font-medium',
                trend === 'up' && 'text-status-green',
                trend === 'down' && 'text-status-red',
                trend === 'neutral' && 'text-neutral-gray'
              )}
            >
              {trend === 'up' && '↑'} {trend === 'down' && '↓'} {trendValue}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-neutral-gray">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
);

StatCard.displayName = 'StatCard';

export { StatCard };
