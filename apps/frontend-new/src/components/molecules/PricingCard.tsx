'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/atoms';
import { Button } from '@/components/atoms';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface PricingCardProps {
  name: string;
  description: string;
  price: number | string;
  period: 'monthly' | 'annual';
  badge?: string;
  features: string[];
  buttonText: string;
  buttonVariant?: 'primary' | 'secondary' | 'ghost';
  isHighlighted?: boolean;
  annualSavings?: string;
  onCtaClick?: () => void;
}

export const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  (
    {
      name,
      description,
      price,
      period,
      badge,
      features,
      buttonText,
      buttonVariant = 'secondary',
      isHighlighted = false,
      annualSavings,
      onCtaClick,
    },
    ref
  ) => (
    <motion.div
      ref={ref}
      className={cn(
        'relative h-full',
        isHighlighted && '-translate-y-4'
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Gradient Border Effect (subtle) */}
      {isHighlighted && (
        <div
          className="absolute inset-0 rounded-2xl p-px"
          style={{
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.3) 0%, rgba(124, 58, 237, 0.2) 100%)',
          }}
        >
          <div className="absolute inset-0 rounded-2xl bg-bg-primary" />
        </div>
      )}

      <Card
        className={cn(
          'relative h-full overflow-hidden rounded-2xl p-8 transition-all duration-300',
          isHighlighted
            ? 'border-primary-500/30 bg-gradient-to-br from-bg-secondary/95 to-bg-secondary/85 shadow-xl shadow-primary-500/10'
            : 'border-bg-tertiary bg-bg-secondary hover:border-bg-tertiary hover:shadow-lg'
        )}
      >
        {/* Badge */}
        {badge && (
          <motion.div
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-300 border border-primary-500/20"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            {badge}
          </motion.div>
        )}

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-neutral-white">{name}</h3>
          <p className="mt-2 text-sm text-neutral-gray">{description}</p>
        </div>

        {/* Pricing */}
        <div className="mb-6 space-y-2">
          <motion.div
            className="flex items-baseline gap-2"
            key={`${price}-${period}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {typeof price === 'number' ? (
              <>
                <span className="text-5xl font-bold text-neutral-white">
                  R$ {price.toLocaleString('pt-BR')}
                </span>
                <span className="text-neutral-gray">/{period === 'monthly' ? 'mês' : 'ano'}</span>
              </>
            ) : (
              <span className="text-3xl font-bold text-neutral-white">{price}</span>
            )}
          </motion.div>

          {/* Savings Badge */}
          {annualSavings && period === 'annual' && (
            <motion.p
              className="text-sm text-primary-300 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {annualSavings}
            </motion.p>
          )}
        </div>

        {/* CTA Button */}
        <motion.div
          className="mb-8 w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant={isHighlighted ? 'primary' : buttonVariant}
            size="lg"
            fullWidth
            onClick={onCtaClick}
            className={cn(
              'transition-all duration-300',
              isHighlighted && 'shadow-lg shadow-primary-500/30'
            )}
          >
            {buttonText}
          </Button>
        </motion.div>

        {/* Features List */}
        <div className="space-y-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary-500 mt-0.5" />
              <span className="text-sm text-neutral-gray">{feature}</span>
            </motion.div>
          ))}
        </div>

        {/* Hover Effect */}
        {!isHighlighted && (
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, transparent 100%)',
            }}
          />
        )}
      </Card>
    </motion.div>
  )
);

PricingCard.displayName = 'PricingCard';
