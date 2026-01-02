// ============================================
// Projects Section Component
// ============================================

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, FolderOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { useLocale } from '@/lib/hooks/useLocale';
import { Button } from '@/components/ui/Button';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/layout/PageTransition';
import { ProjectCard } from '@/components/common/ProjectCard';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Project } from '@/types/database';

interface ProjectsSectionProps {
  limit?: number;
  showViewAll?: boolean;
  featuredOnly?: boolean;
}

export function ProjectsSection({ 
  limit = 4, 
  showViewAll = true,
  featuredOnly = true 
}: ProjectsSectionProps) {
  const t = useTranslations('projects');
  const { locale, isRTL } = useLocale();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    const fetchProjects = async () => {
      let query = supabase
        .from('projects')
        .select('*')
        .eq('is_visible', true)
        .eq('status', 'published')
        .order('display_order');
      
      if (featuredOnly) {
        query = query.eq('is_featured', true);
      }
      
      if (limit) {
        query = query.limit(limit);
      }

      const { data } = await query;
      
      if (data) setProjects(data);
      setIsLoading(false);
    };

    fetchProjects();
  }, [supabase, limit, featuredOnly]);

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-500/5 to-transparent" />

      <div className="container-custom relative">
        {/* Section Header */}
        <AnimatedSection className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {t('title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {t('subtitle')}
            </p>
          </div>
          
          {showViewAll && (
            <Link href={`/${locale}/projects`}>
              <Button 
                variant="outline" 
                rightIcon={<ArrowRight className={cn('h-4 w-4', isRTL && 'rotate-180')} />}
              >
                {t('viewAll')}
              </Button>
            </Link>
          )}
        </AnimatedSection>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-dark-100 dark:bg-dark-800 animate-pulse"
              />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <StaggerItem key={project.id}>
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <div className="text-center py-16">
            <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">{t('noProjects')}</p>
          </div>
        )}
      </div>
    </section>
  );
}