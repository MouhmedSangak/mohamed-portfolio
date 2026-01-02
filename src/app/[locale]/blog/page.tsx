// ============================================
// Blog List Page
// ============================================

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BookOpen } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { BlogCard } from '@/components/common/BlogCard';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/layout/PageTransition';
import type { BlogPost } from '@/types/database';

interface BlogPageProps {
  params: { locale: string };
}

async function getBlogPosts() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_visible', true)
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  
  return data || [];
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'blog' });
  
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const posts = await getBlogPosts();
  const t = await getTranslations({ locale: params.locale, namespace: 'blog' });
  const isRTL = params.locale === 'ar';

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        {/* Header */}
        <AnimatedSection className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </AnimatedSection>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <StaggerItem key={post.id}>
                <BlogCard post={post} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <AnimatedSection className="text-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">{t('noPosts')}</p>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}