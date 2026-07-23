'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export interface ComparisonItem {
  label: string;
  starter: string | boolean;
  professional: string | boolean;
  enterprise: string | boolean;
}

export interface ComparisonTableProps {
  items: ComparisonItem[];
}

const renderValue = (value: string | boolean | null | undefined) => {
  if (typeof value === 'boolean') {
    return value ? (
      <CheckCircle className="h-5 w-5 text-primary-500 mx-auto" />
    ) : (
      <span className="text-neutral-gray">—</span>
    );
  }
  return <span className="text-sm text-neutral-gray">{value}</span>;
};

export const ComparisonTable = React.forwardRef<HTMLDivElement, ComparisonTableProps>(
  ({ items }, ref) => (
    <div ref={ref} className="w-full overflow-x-auto">
      <motion.div
        className="min-w-full"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        {/* Desktop Table */}
        <table className="hidden md:table w-full">
          <thead>
            <tr className="border-b border-bg-tertiary">
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-neutral-white">Recursos</span>
              </th>
              <th className="px-6 py-4 text-center">
                <span className="text-sm font-semibold text-neutral-white">Starter</span>
              </th>
              <th className="px-6 py-4 text-center">
                <span className="text-sm font-semibold text-primary-400">Professional</span>
              </th>
              <th className="px-6 py-4 text-center">
                <span className="text-sm font-semibold text-neutral-white">Enterprise</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-tertiary/50">
            {items.map((item, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="hover:bg-bg-tertiary/20 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="text-sm text-neutral-white font-medium">{item.label}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  {renderValue(item.starter)}
                </td>
                <td className="px-6 py-4 text-center">
                  {renderValue(item.professional)}
                </td>
                <td className="px-6 py-4 text-center">
                  {renderValue(item.enterprise)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={index}
              className="border border-bg-tertiary rounded-lg p-4 space-y-3"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <div className="font-medium text-neutral-white">{item.label}</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-neutral-gray mb-1">Starter</div>
                  <div>{renderValue(item.starter)}</div>
                </div>
                <div className="text-center">
                  <div className="text-primary-400 mb-1 font-medium">Prof.</div>
                  <div>{renderValue(item.professional)}</div>
                </div>
                <div className="text-center">
                  <div className="text-neutral-gray mb-1">Enterprise</div>
                  <div>{renderValue(item.enterprise)}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
);

ComparisonTable.displayName = 'ComparisonTable';
