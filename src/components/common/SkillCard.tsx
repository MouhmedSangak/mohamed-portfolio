// ============================================
// Skill Card Component
// ============================================

'use client';

import { motion } from 'framer-motion';
import { 
  Code, 
  Database, 
  Globe, 
  Bot,
  Lightbulb,
  Users,
  Briefcase,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useLocale } from '@/lib/hooks/useLocale';
import type { Skill } from '@/types/database';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code,
  database: Database,
  globe: Globe,
  bot: Bot,
  lightbulb: Lightbulb,
  users: Users,
  briefcase: Briefcase,
  zap: Zap,
};

const categoryGradients: Record<string, string> = {
  programming: 'from-blue-500 to-cyan-500',
  technical: 'from-purple-500 to-pink-500',
  soft: 'from-amber-500 to-orange-500',
};

interface SkillCardProps {
  skill: Skill;
  variant?: 'default' | 'compact' | 'detailed';
  showProgress?: boolean;
  index?: number;
}

export function SkillCard({ 
  skill, 
  variant = 'default',
  showProgress = true,
  index = 0 
}: SkillCardProps) {
  const { locale } = useLocale();

  const getLocalizedField = (field: string) => {
    const key = `${field}_${locale}` as keyof Skill;
    return (skill[key] as string) || (skill[`${field}_en` as keyof Skill] as string) || '';
  };

  const name = getLocalizedField('name');
  const description = getLocalizedField('description');
  const Icon = iconMap[skill.icon || 'code'] || Code;
  const gradient = categoryGradients[skill.category] || categoryGradients.technical;

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-100 dark:bg-dark-800"
      >
        <div className={cn(
          'w-6 h-6 rounded flex items-center justify-center bg-gradient-to-br',
          gradient
        )}>
          <Icon className="h-3 w-3 text-white" />
        </div>
        <span className="text-sm font-medium text-foreground">{name}</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className={cn(
        'relative p-5 rounded-xl',
        'bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700',
        'hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-500/50',
        'transition-all duration-300'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          className={cn(
            'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-lg',
            gradient
          )}
        >
          <Icon className="h-6 w-6 text-white" />
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground mb-1">{name}</h4>
          
          {showProgress && (
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>{skill.category}</span>
                <span>{skill.proficiency}%</span>
              </div>
              <div className="h-2 bg-dark-200 dark:bg-dark-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.proficiency}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                  className={cn('h-full rounded-full bg-gradient-to-r', gradient)}
                />
              </div>
            </div>
          )}

          {description && variant === 'detailed' && (
            <p className="text-sm text-muted-foreground mt-2">
              {description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}