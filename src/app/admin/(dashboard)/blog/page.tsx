// ============================================
// Admin Blog Posts List Page
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  BookOpen,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Star,
  ExternalLink,
} from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useToastActions } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Column, Action } from '@/components/admin/DataTable';
import { ConfirmModal } from '@/components/ui/Modal';
import { formatShortDate } from '@/lib/utils/formatDate';
import type { BlogPost } from '@/types/database';

export default function BlogPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();
  const toast = useToastActions();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts((data || []) as BlogPost[]);
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to load blog posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [supabase, toast]);

  // Delete post
  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setPosts((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success('Post deleted');
      setDeleteId(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle visibility
  const toggleVisibility = async (post: BlogPost) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ is_visible: !post.is_visible } as any)
        .eq('id', post.id);

      if (error) throw error;

      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, is_visible: !p.is_visible } : p
        )
      );
      toast.success('Visibility updated');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update');
    }
  };

  // Toggle featured
  const toggleFeatured = async (post: BlogPost) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ is_featured: !post.is_featured } as any)
        .eq('id', post.id);

      if (error) throw error;

      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, is_featured: !p.is_featured } : p
        )
      );
      toast.success('Featured status updated');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update');
    }
  };

  const columns: Column<BlogPost>[] = [
    {
      key: 'title_en',
      label: 'Post',
      sortable: true,
      render: (post: BlogPost) => (
        <div className="flex items-center gap-3">
          {post.cover_image_url ? (
            <img
              src={post.cover_image_url}
              alt={post.title_en}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-dark-700 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-dark-400" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">{post.title_en}</span>
              {post.is_featured && (
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              )}
            </div>
            <span className="text-sm text-dark-400">{post.slug}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (post: BlogPost) => {
        const variants: Record<string, 'success' | 'warning' | 'secondary'> = {
          published: 'success',
          draft: 'warning',
          archived: 'secondary',
        };
        return (
          <Badge variant={variants[post.status] || 'secondary'}>
            {post.status}
          </Badge>
        );
      },
    },
    {
      key: 'is_visible',
      label: 'Visible',
      render: (post: BlogPost) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleVisibility(post);
          }}
          className="p-1 rounded hover:bg-dark-700 transition-colors"
        >
          {post.is_visible ? (
            <Eye className="h-5 w-5 text-green-400" />
          ) : (
            <EyeOff className="h-5 w-5 text-dark-400" />
          )}
        </button>
      ),
    },
    {
      key: 'tags',
      label: 'Tags',
      render: (post: BlogPost) => {
        const tags = (post.tags as string[]) || [];
        return (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" size="sm">
                {tag}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge variant="secondary" size="sm">
                +{tags.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      key: 'published_at',
      label: 'Published',
      sortable: true,
      render: (post: BlogPost) => (
        <span className="text-dark-400 text-sm">
          {post.published_at
            ? formatShortDate(post.published_at, 'en')
            : '-'}
        </span>
      ),
    },
    {
      key: 'reading_time_minutes',
      label: 'Read Time',
      render: (post: BlogPost) => (
        <span className="text-dark-400">{post.reading_time_minutes} min</span>
      ),
    },
  ];

  const actions: Action<BlogPost>[] = [
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (post: BlogPost) => router.push(`/admin/blog/${post.id}`),
    },
    {
      label: 'View on Site',
      icon: <ExternalLink className="h-4 w-4" />,
      onClick: (post: BlogPost) => window.open(`/en/blog/${post.slug}`, '_blank'),
      show: (post: BlogPost) => post.status === 'published',
    },
    {
      label: 'Toggle Featured',
      icon: <Star className="h-4 w-4" />,
      onClick: (post: BlogPost) => toggleFeatured(post),
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (post: BlogPost) => setDeleteId(post.id),
      danger: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-dark-400">
            Manage your blog articles
          </p>
        </div>
        <Button
          onClick={() => router.push('/admin/blog/new')}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          New Post
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={posts}
        columns={columns}
        actions={actions}
        keyField="id"
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search posts..."
        emptyMessage="No blog posts yet"
        emptyIcon={<BookOpen className="h-12 w-12" />}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
