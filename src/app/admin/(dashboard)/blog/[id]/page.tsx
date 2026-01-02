// ============================================
// Edit Blog Post Page
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import { BlogForm } from '@/components/admin/BlogForm';
import { PageLoader } from '@/components/ui/Spinner';
import type { BlogPost } from '@/types/database';

export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        if (!data) {
          router.push('/admin/blog');
          return;
        }

        setPost(data);
      } catch (error) {
        console.error('Fetch error:', error);
        router.push('/admin/blog');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [params.id, supabase, router]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!post) {
    return null;
  }

  return <BlogForm post={post} mode="edit" />;
}