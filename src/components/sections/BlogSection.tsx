// ============================================
// Blog Section Component
// ============================================

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { useLocale } from '@/lib/hooks/useLocale';
import { Button } from '@/components/ui/Button';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/layout/PageTransition';
import { BlogCard } from '@/components/common/BlogCard';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { BlogPost } from '@/types/database';

interface BlogSectionProps {
  limit?: number;
  showViewAll?: boolean;
}

export function BlogSection({ limit = 3, showViewAll = true }: BlogSectionProps) {
  const t = useTranslations('blog');
  const { locale, isRTL } = useLocale();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_visible', true)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);
      
      if (data) setPosts(data);
      setIsLoading(false);
    };

    fetchPosts();
  }, [supabase, limit]);

  // Don't render if no posts
  if (!isLoading && posts.length === 0) return null;

  return (
    <section id="blog" className="section-padding relative overflow-hidden bg-dark-50 dark:bg-dark-900/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

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
            <Link href={`/${locale}/blog`}>
              <Button 
                variant="outline" 
                rightIcon={<ArrowRight className={cn('h-4 w-4', isRTL && 'rotate-180')} />}
              >
                {t('readMore')}
              </Button>
            </Link>
          )}
        </AnimatedSection>

        {/* Blog Posts Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-72 rounded-2xl bg-dark-100 dark:bg-dark-800 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <StaggerItem key={post.id}>
                <BlogCard post={post} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}