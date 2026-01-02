// ============================================
// Blog Post Detail Page
// ============================================

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getTranslations } from 'next-intl/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AnimatedSection } from '@/components/layout/PageTransition';
import { BlogCard } from '@/components/common/BlogCard';
import { formatShortDate } from '@/lib/utils/formatDate';
import type { Locale } from '@/i18n/config';
import type { BlogPost } from '@/types/database';

interface BlogPostPageProps {
  params: { locale: string; slug: string };
}

async function getPost(slug: string): Promise<BlogPost | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('is_visible', true)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return data as BlogPost;
}

async function getRelatedPosts(currentId: string): Promise<BlogPost[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .eq('is_visible', true)
    .neq('id', currentId)
    .limit(3);
  
  if (error || !data) {
    return [];
  }
  
  return data as BlogPost[];
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  if (!post) {
    return { 
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }

  const locale = params.locale as Locale;
  
  // استخدام Type assertion لتجنب خطأ TypeScript
  const titleKey = `title_${locale}` as keyof BlogPost;
  const excerptKey = `excerpt_${locale}` as keyof BlogPost;
  
  const title = (post[titleKey] as string) || post.title_en;
  const description = (post[excerptKey] as string) || post.excerpt_en || '';

  return {
    title,
    description,
    openGraph: {
      type: 'article',
      publishedTime: post.published_at || undefined,
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug);
  
  if (!post) {
    notFound();
  }

  const t = await getTranslations({ locale: params.locale, namespace: 'blog' });
  const locale = params.locale as Locale;
  const isRTL = locale === 'ar';

  // استخدام Type assertion
  const titleKey = `title_${locale}` as keyof BlogPost;
  const excerptKey = `excerpt_${locale}` as keyof BlogPost;
  const contentKey = `content_${locale}` as keyof BlogPost;

  const title = (post[titleKey] as string) || post.title_en;
  const excerpt = (post[excerptKey] as string) || post.excerpt_en;
  const content = (post[contentKey] as string) || post.content_en;
  const tags = (post.tags as string[]) || [];

  const relatedPosts = await getRelatedPosts(post.id);

  return (
    <article className="pt-24 pb-16">
      <div className="container-custom">
        {/* Back Button */}
        <AnimatedSection>
          <Link href={`/${locale}/blog`}>
            <Button variant="ghost" size="sm" className="mb-8">
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180 ml-2' : 'mr-2'}`} />
              {t('backToBlog')}
            </Button>
          </Link>
        </AnimatedSection>

        {/* Header */}
        <AnimatedSection delay={0.1} className="max-w-4xl mx-auto text-center mb-12">
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {tags.map((tag) => (
                <Badge key={tag} variant="primary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {title}
          </h1>

          {excerpt && (
            <p className="text-xl text-muted-foreground mb-8">
              {excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            {post.published_at && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatShortDate(post.published_at, locale)}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.reading_time_minutes} {t('readTime')}</span>
            </div>
          </div>
        </AnimatedSection>

        {/* Cover Image */}
        {post.cover_image_url && (
          <AnimatedSection delay={0.2} className="max-w-5xl mx-auto mb-12">
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <Image
                src={post.cover_image_url}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </AnimatedSection>
        )}

        {/* Content */}
        <AnimatedSection delay={0.3} className="max-w-3xl mx-auto">
          {content && (
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary-500 prose-img:rounded-xl">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          )}
        </AnimatedSection>

        {/* Tags Footer */}
        {tags.length > 0 && (
          <AnimatedSection delay={0.4} className="max-w-3xl mx-auto mt-12 pt-8 border-t border-dark-200 dark:border-dark-700">
            <div className="flex items-center gap-3">
              <Tag className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t('tags')}:</span>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <AnimatedSection delay={0.5} className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              {isRTL ? 'مقالات ذات صلة' : 'Related Articles'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </AnimatedSection>
        )}
      </div>
    </article>
  );
}