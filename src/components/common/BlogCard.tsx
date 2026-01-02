// ============================================
// Blog Card Component
// ============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useLocale } from '@/lib/hooks/useLocale';
import { Badge } from '@/components/ui/Badge';
import { formatShortDate } from '@/lib/utils/formatDate';
import { useTranslations } from 'next-intl';
import type { BlogPost } from '@/types/database';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'compact' | 'horizontal';
}

export function BlogCard({ post, variant = 'default' }: BlogCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { locale, isRTL } = useLocale();
  const t = useTranslations('blog');

  const getLocalizedField = (field: string) => {
    const key = `${field}_${locale}` as keyof BlogPost;
    return (post[key] as string) || (post[`${field}_en` as keyof BlogPost] as string) || '';
  };

  const title = getLocalizedField('title');
  const excerpt = getLocalizedField('excerpt');
  const tags = (post.tags as string[]) || [];

  if (variant === 'horizontal') {
    return (
      <Link href={`/${locale}/blog/${post.slug}`}>
        <motion.article
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ x: isRTL ? -5 : 5 }}
          className={cn(
            'group flex gap-4 p-4 rounded-xl',
            'bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700',
            'hover:border-primary-500/50 transition-all duration-300'
          )}
        >
          {/* Thumbnail */}
          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            {post.cover_image_url ? (
              <Image
                src={post.cover_image_url}
                alt={title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary-500 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {excerpt}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.reading_time_minutes} {t('readTime')}
              </span>
            </div>
          </div>
        </motion.article>
      </Link>
    );
  }

  return (
    <Link href={`/${locale}/blog/${post.slug}`}>
      <motion.article
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -5 }}
        className={cn(
          'group relative rounded-2xl overflow-hidden h-full',
          'bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700',
          'transition-all duration-300',
          'hover:shadow-2xl hover:shadow-primary-500/10 hover:border-primary-500/50'
        )}
      >
        {/* Cover Image */}
        <div className="relative h-48 overflow-hidden">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
              <span className="text-6xl opacity-50">📝</span>
            </div>
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 via-transparent to-transparent" />

          {/* Featured Badge */}
          {post.is_featured && (
            <div className="absolute top-4 start-4">
              <Badge variant="primary">⭐ Featured</Badge>
            </div>
          )}

          {/* Reading Time */}
          <div className="absolute bottom-4 start-4 flex items-center gap-1 text-white text-sm">
            <Clock className="h-4 w-4" />
            <span>{post.reading_time_minutes} {t('readTime')}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
            {title}
          </h3>

          {excerpt && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            {post.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatShortDate(post.published_at, locale)}
              </span>
            )}

            <motion.span
              initial={{ x: isRTL ? 10 : -10, opacity: 0 }}
              animate={{ 
                x: isHovered ? 0 : (isRTL ? 10 : -10), 
                opacity: isHovered ? 1 : 0 
              }}
              className="flex items-center gap-1 text-primary-500 font-medium"
            >
              {t('readMore')}
              <ArrowRight className={cn('h-4 w-4', isRTL && 'rotate-180')} />
            </motion.span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}