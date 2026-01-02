// ============================================
// Project Card Component
// ============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ExternalLink, 
  Github, 
  Lock, 
  ArrowRight,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useLocale } from '@/lib/hooks/useLocale';
import { Badge } from '@/components/ui/Badge';
import { useTranslations } from 'next-intl';
import type { Project } from '@/types/database';

interface ProjectCardProps {
  project: Project;
  variant?: 'default' | 'compact' | 'featured';
}

export function ProjectCard({ project, variant = 'default' }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { locale, isRTL } = useLocale();
  const t = useTranslations('projects');

  const getLocalizedField = (field: string) => {
    const key = `${field}_${locale}` as keyof Project;
    return (project[key] as string) || (project[`${field}_en` as keyof Project] as string) || '';
  };

  const title = getLocalizedField('title');
  const description = getLocalizedField('description');
  const technologies = (project.technologies as string[]) || [];

  return (
    <Link href={`/${locale}/projects/${project.slug}`}>
      <motion.article
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -5 }}
        className={cn(
          'group relative rounded-2xl overflow-hidden',
          'bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700',
          'transition-all duration-300',
          'hover:shadow-2xl hover:shadow-primary-500/10 hover:border-primary-500/50',
          variant === 'featured' && 'md:col-span-2 md:row-span-2'
        )}
      >
        {/* Thumbnail */}
        <div className={cn(
          'relative overflow-hidden',
          variant === 'compact' ? 'h-40' : 'h-48 md:h-56'
        )}>
          {project.thumbnail_url ? (
            <Image
              src={project.thumbnail_url}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
              <span className="text-6xl opacity-50">💻</span>
            </div>
          )}

          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/50 to-transparent"
          />

          {/* Private Badge */}
          {project.is_private && (
            <div className="absolute top-4 end-4">
              <Badge variant="warning" className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                {t('private')}
              </Badge>
            </div>
          )}

          {/* Featured Badge */}
          {project.is_featured && (
            <div className="absolute top-4 start-4">
              <Badge variant="primary">⭐ Featured</Badge>
            </div>
          )}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            className="absolute bottom-4 inset-x-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              {project.project_url && project.is_public_link && (
                <motion.a
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </motion.a>
              )}
              {project.github_url && (
                <motion.a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <Github className="h-4 w-4" />
                </motion.a>
              )}
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary-500 text-white text-sm font-medium"
            >
              <Eye className="h-4 w-4" />
              <span>{t('viewProject')}</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary-500 transition-colors">
            {title}
          </h3>

          {description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {description}
            </p>
          )}

          {/* Technologies */}
          {technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {technologies.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="secondary" size="sm">
                  {tech}
                </Badge>
              ))}
              {technologies.length > 4 && (
                <Badge variant="secondary" size="sm">
                  +{technologies.length - 4}
                </Badge>
              )}
            </div>
          )}

          {/* Arrow indicator */}
          <motion.div
            initial={{ x: isRTL ? 10 : -10, opacity: 0 }}
            animate={{ 
              x: isHovered ? 0 : (isRTL ? 10 : -10), 
              opacity: isHovered ? 1 : 0 
            }}
            className={cn(
              'absolute bottom-5',
              isRTL ? 'left-5' : 'right-5'
            )}
          >
            <ArrowRight className={cn(
              'h-5 w-5 text-primary-500',
              isRTL && 'rotate-180'
            )} />
          </motion.div>
        </div>
      </motion.article>
    </Link>
  );
}