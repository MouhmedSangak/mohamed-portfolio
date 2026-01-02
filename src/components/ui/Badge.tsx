// ============================================
// Badge Component
// ============================================

import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variants = {
  default: 'bg-dark-200 dark:bg-dark-700 text-foreground',
  primary: 'bg-primary-500/10 text-primary-500 dark:bg-primary-500/20',
  secondary: 'bg-dark-200 dark:bg-dark-600 text-muted-foreground',
  success: 'bg-green-500/10 text-green-500 dark:bg-green-500/20',
  warning: 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400',
  danger: 'bg-red-500/10 text-red-500 dark:bg-red-500/20',
  info: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}