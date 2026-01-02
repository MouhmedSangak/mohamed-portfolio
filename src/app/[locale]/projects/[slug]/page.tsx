// ============================================
// Project Detail Page
// ============================================

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github, Lock, Calendar, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getTranslations } from 'next-intl/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AnimatedSection } from '@/components/layout/PageTransition';
import { formatMonthYear } from '@/lib/utils/formatDate';
import type { Locale } from '@/i18n/config';
import type { Project } from '@/types/database';

interface ProjectPageProps {
  params: { locale: string; slug: string };
}

async function getProject(slug: string): Promise<Project | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('is_visible', true)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return data as Project;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getProject(params.slug);
  
  if (!project) {
    return { 
      title: 'Project Not Found',
      description: 'The requested project could not be found.'
    };
  }

  const locale = params.locale as Locale;
  
  // استخدام Type assertion لتجنب خطأ TypeScript
  const titleKey = `title_${locale}` as keyof Project;
  const descriptionKey = `description_${locale}` as keyof Project;
  
  const title = (project[titleKey] as string) || project.title_en;
  const description = (project[descriptionKey] as string) || project.description_en || '';

  return {
    title,
    description,
    openGraph: {
      images: project.thumbnail_url ? [project.thumbnail_url] : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProject(params.slug);
  
  if (!project) {
    notFound();
  }

  const t = await getTranslations({ locale: params.locale, namespace: 'projects' });
  const locale = params.locale as Locale;
  const isRTL = locale === 'ar';

  // استخدام Type assertion
  const titleKey = `title_${locale}` as keyof Project;
  const descriptionKey = `description_${locale}` as keyof Project;
  const contentKey = `content_${locale}` as keyof Project;
  const roleKey = `role_${locale}` as keyof Project;
  const highlightsKey = `highlights_${locale}` as keyof Project;

  const title = (project[titleKey] as string) || project.title_en;
  const description = (project[descriptionKey] as string) || project.description_en;
  const content = (project[contentKey] as string) || project.content_en;
  const role = (project[roleKey] as string) || project.role_en;
  const highlights = (project[highlightsKey] as string[]) || (project.highlights_en as string[]) || [];
  const technologies = (project.technologies as string[]) || [];

  return (
    <article className="pt-24 pb-16">
      <div className="container-custom">
        {/* Back Button */}
        <AnimatedSection>
          <Link href={`/${locale}/projects`}>
            <Button variant="ghost" size="sm" className="mb-8">
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180 ml-2' : 'mr-2'}`} />
              {isRTL ? 'العودة للمشاريع' : 'Back to Projects'}
            </Button>
          </Link>
        </AnimatedSection>

        {/* Header */}
        <AnimatedSection delay={0.1}>
          <div className="max-w-4xl">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {project.is_private && (
                <Badge variant="warning" className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  {t('private')}
                </Badge>
              )}
              {project.is_featured && (
                <Badge variant="primary">⭐ Featured</Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {title}
            </h1>

            {description && (
              <p className="text-lg text-muted-foreground mb-6">
                {description}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
              {role && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{t('role')}: {role}</span>
                </div>
              )}
              {(project.start_date || project.end_date) && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {project.start_date && formatMonthYear(project.start_date, locale)}
                    {project.end_date && ` - ${formatMonthYear(project.end_date, locale)}`}
                    {project.is_ongoing && ` - ${t('ongoing')}`}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-8">
              {project.project_url && project.is_public_link && (
                <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                  <Button leftIcon={<ExternalLink className="h-4 w-4" />}>
                    {t('liveDemo')}
                  </Button>
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" leftIcon={<Github className="h-4 w-4" />}>
                    {t('sourceCode')}
                  </Button>
                </a>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* Thumbnail */}
        {project.thumbnail_url && (
          <AnimatedSection delay={0.2} className="mb-12">
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <Image
                src={project.thumbnail_url}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </AnimatedSection>
        )}

        {/* Private Notice */}
        {project.is_private && (
          <AnimatedSection delay={0.25}>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {t('private')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('privateNote')}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <AnimatedSection delay={0.3} className="lg:col-span-2">
            {content && (
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </AnimatedSection>

          {/* Sidebar */}
          <AnimatedSection delay={0.4} className="space-y-8">
            {/* Technologies */}
            {technologies.length > 0 && (
              <div className="bg-dark-50 dark:bg-dark-800 rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4">
                  {t('technologies')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Highlights */}
            {highlights.length > 0 && (
              <div className="bg-dark-50 dark:bg-dark-800 rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4">
                  {t('highlights')}
                </h3>
                <ul className="space-y-2">
                  {highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary-500 mt-1">•</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </AnimatedSection>
        </div>
      </div>
    </article>
  );
}