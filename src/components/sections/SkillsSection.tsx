// ============================================
// Skills Section Component
// ============================================

'use client';

import { useEffect, useState } from 'react';
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
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { useLocale } from '@/lib/hooks/useLocale';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/layout/PageTransition';
import { getSupabaseClient } from '@/lib/supabase/client';
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

const categoryColors: Record<string, string> = {
  programming: 'from-blue-500 to-cyan-500',
  technical: 'from-purple-500 to-pink-500',
  soft: 'from-amber-500 to-orange-500',
};

export function SkillsSection() {
  const t = useTranslations('skills');
  const { locale, isRTL } = useLocale();
  const [skills, setSkills] = useState<Skill[]>([]);
  const supabase = getSupabaseClient();

  useEffect(() => {
    const fetchSkills = async () => {
      const { data } = await supabase
        .from('skills')
        .select('*')
        .eq('is_visible', true)
        .order('display_order');
      
      if (data) setSkills(data);
    };

    fetchSkills();
  }, [supabase]);

  const getLocalizedField = (skill: Skill, field: string) => {
    const key = `${field}_${locale}` as keyof Skill;
    return (skill[key] as string) || (skill[`${field}_en` as keyof Skill] as string) || '';
  };

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'technical';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section id="skills" className="section-padding relative overflow-hidden bg-dark-50 dark:bg-dark-900/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-dots-pattern opacity-50" />

      <div className="container-custom relative">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </AnimatedSection>

        {/* Skills by Category */}
        <div className="space-y-12">
          {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => (
            <AnimatedSection key={category} delay={categoryIndex * 0.2}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={cn(
                  'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center',
                  categoryColors[category] || categoryColors.technical
                )}>
                  {category === 'programming' && <Code className="h-5 w-5 text-white" />}
                  {category === 'technical' && <Database className="h-5 w-5 text-white" />}
                  {category === 'soft' && <Users className="h-5 w-5 text-white" />}
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {t(`categories.${category}`)}
                </h3>
              </div>

              {/* Skills Grid */}
              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categorySkills.map((skill) => {
                  const Icon = iconMap[skill.icon || 'code'] || Code;
                  
                  return (
                    <StaggerItem key={skill.id}>
                      <Card
                        variant="bordered"
                        hover
                        padding="md"
                        className="h-full group"
                      >
                        <div className="flex items-start gap-4">
                          <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            className={cn(
                              'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0',
                              'shadow-lg',
                              categoryColors[category] || categoryColors.technical
                            )}
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </motion.div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground mb-1 truncate">
                              {getLocalizedField(skill, 'name')}
                            </h4>
                            
                            {/* Progress Bar */}
                            <div className="relative h-2 bg-dark-200 dark:bg-dark-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.proficiency}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className={cn(
                                  'absolute inset-y-0 start-0 rounded-full bg-gradient-to-r',
                                  categoryColors[category] || categoryColors.technical
                                )}
                              />
                            </div>
                            
                            <p className="text-xs text-muted-foreground mt-1">
                              {skill.proficiency}%
                            </p>
                          </div>
                        </div>

                        {/* Description */}
                        {getLocalizedField(skill, 'description') && (
                          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                            {getLocalizedField(skill, 'description')}
                          </p>
                        )}
                      </Card>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </AnimatedSection>
          ))}
        </div>

        {/* Empty State */}
        {skills.length === 0 && (
          <div className="text-center py-12">
            <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {isRTL ? 'جارٍ تحميل المهارات...' : 'Loading skills...'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}