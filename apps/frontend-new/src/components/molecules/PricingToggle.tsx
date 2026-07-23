'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface PricingToggleProps {
  onToggle?: (isAnnual: boolean) => void;
  defaultAnnual?: boolean;
}

export const PricingToggle = React.forwardRef<HTMLDivElement, PricingToggleProps>(
  ({ onToggle, defaultAnnual = false }, ref) => {
    const [isAnnual, setIsAnnual] = useState(defaultAnnual);

    const handleToggle = () => {
      const newState = !isAnnual;
      setIsAnnual(newState);
      onToggle?.(newState);
    };

    return (
      <div ref={ref} className="flex flex-col items-center gap-4">
        {/* Toggle */}
        <div
          className="relative inline-flex items-center rounded-full bg-bg-tertiary p-1 cursor-pointer"
          onClick={handleToggle}
        >
          {/* Background slide */}
          <motion.div
            className="absolute inset-y-1 w-1/2 rounded-full bg-primary-500/20 border border-primary-500/30"
            initial={false}
            animate={{
              x: isAnnual ? '100%' : '0%',
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />

          {/* Monthly */}
          <button
            className={cn(
              'relative z-10 px-6 py-2 text-sm font-medium transition-colors duration-200',
              !isAnnual
                ? 'text-neutral-white'
                : 'text-neutral-gray hover:text-neutral-white'
            )}
            onClick={(e) => {
              e.stopPropagation();
              if (isAnnual) handleToggle();
            }}
          >
            Mensal
          </button>

          {/* Annual */}
          <button
            className={cn(
              'relative z-10 px-6 py-2 text-sm font-medium transition-colors duration-200',
              isAnnual
                ? 'text-neutral-white'
                : 'text-neutral-gray hover:text-neutral-white'
            )}
            onClick={(e) => {
              e.stopPropagation();
              if (!isAnnual) handleToggle();
            }}
          >
            Anual
          </button>
        </div>

        {/* Savings Badge */}
        <motion.div
          className="text-sm text-primary-300 font-medium"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isAnnual ? 1 : 0, scale: isAnnual ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
        >
          {isAnnual && (
            <>
              💰 Economize 2 meses
              <span className="ml-2 text-xs text-neutral-gray">
                (até 16% de economia)
              </span>
            </>
          )}
        </motion.div>
      </div>
    );
  }
);

PricingToggle.displayName = 'PricingToggle';
