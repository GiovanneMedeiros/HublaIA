'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card } from '@/components/atoms';
import { cn } from '@/lib/cn';

interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface AnalyticsChartProps {
  title?: string;
  data: ChartDataPoint[];
  type?: 'line' | 'bar' | 'pie';
  dataKey?: string;
  color?: string;
  className?: string;
}

const COLORS = ['#4F46E5', '#7C3AED', '#3B82F6', '#F59E0B', '#10B981', '#EF4444'];

const AnalyticsChart = React.forwardRef<HTMLDivElement, AnalyticsChartProps>(
  (
    {
      title,
      data,
      type = 'line',
      dataKey = 'value',
      color = '#4F46E5',
      className,
    },
    ref
  ) => {
    const renderChart = (): React.ReactElement => {
      if (type === 'line') {
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            <XAxis dataKey="name" stroke="#CBD5E1" />
            <YAxis stroke="#CBD5E1" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid #1F2937',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#FFFFFF' }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );
      }

      if (type === 'bar') {
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            <XAxis dataKey="name" stroke="#CBD5E1" />
            <YAxis stroke="#CBD5E1" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid #1F2937',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#FFFFFF' }}
            />
            <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
          </BarChart>
        );
      }

      return (
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid #1F2937',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#FFFFFF' }}
          />
        </PieChart>
      );
    };

    return (
      <Card ref={ref} className={cn('p-6', className)}>
        {title && <h3 className="text-lg font-semibold text-neutral-white mb-4">{title}</h3>}
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      </Card>
    );
  }
);

AnalyticsChart.displayName = 'AnalyticsChart';

export { AnalyticsChart };
