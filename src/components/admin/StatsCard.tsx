// ============================================
// Stats Card Component
// ============================================

'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  gradient: string;
  change?: number;
  highlight?: boolean;
  isLoading?: boolean;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  gradient,
  change,
  highlight,
  isLoading,
}: StatsCardProps) {
  const isPositiveChange = change !== undefined && change >= 0;

  if (isLoading) {
    return (
      <div className="bg-dark-800 rounded-xl border border-dark-700 p-4 animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-dark-700" />
          <div className="w-16 h-4 bg-dark-700 rounded" />
        </div>
        <div className="w-20 h-8 bg-dark-700 rounded mb-1" />
        <div className="w-24 h-3 bg-dark-700 rounded" />
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        'relative bg-dark-800 rounded-xl border border-dark-700 p-4 overflow-hidden',
        'hover:border-primary-500/50 transition-all duration-200',
        highlight && 'ring-2 ring-primary-500/50'
      )}
    >
      {/* Background Glow */}
      <div
        className={cn(
          'absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl opacity-20',
          `bg-gradient-to-br ${gradient}`
        )}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div
            className={cn(
              'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center',
              gradient
            )}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>

          {change !== undefined && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
                isPositiveChange
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-red-500/10 text-red-400'
              )}
            >
              {isPositiveChange ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>

        <div className="text-2xl font-bold text-white mb-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>

        <div className="text-sm text-dark-400">{title}</div>
      </div>
    </motion.div>
  );
}