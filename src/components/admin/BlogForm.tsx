// ============================================
// Blog Post Form Component
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Calendar,
  Clock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useToastActions } from '@/components/ui/Toast';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Dropdown';
import { Toggle } from '@/components/ui/Toggle';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MarkdownEditor } from '@/components/forms/MarkdownEditor';
import { generateSlug } from '@/lib/utils/sanitize';
import { cn } from '@/lib/utils/cn';
import type { BlogPost } from '@/types/database';

interface BlogFormProps {
  post?: BlogPost;
  mode: 'create' | 'edit';
}

interface FormData {
  slug: string;
  title_ar: string;
  title_en: string;
  title_de: string;
  excerpt_ar: string;
  excerpt_en: string;
  excerpt_de: string;
  content_ar: string;
  content_en: string;
  content_de: string;
  cover_image_url: string;
  tags: string[];
  reading_time_minutes: number;
  is_featured: boolean;
  is_visible: boolean;
  status: 'draft' | 'published' | 'archived';
}

const initialFormData: FormData = {
  slug: '',
  title_ar: '',
  title_en: '',
  title_de: '',
  excerpt_ar: '',
  excerpt_en: '',
  excerpt_de: '',
  content_ar: '',
  content_en: '',
  content_de: '',
  cover_image_url: '',
  tags: [],
  reading_time_minutes: 5,
  is_featured: false,
  is_visible: true,
  status: 'draft',
};

export function BlogForm({ post, mode }: BlogFormProps) {
  const router = useRouter();
  const supabase = getSupabaseClient();
  const toast = useToastActions();
  const { admin } = useAuth();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [activeTab, setActiveTab] = useState<'en' | 'ar' | 'de'>('en');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Load existing post
  useEffect(() => {
    if (post) {
      setFormData({
        slug: post.slug,
        title_ar: post.title_ar,
        title_en: post.title_en,
        title_de: post.title_de || '',
        excerpt_ar: post.excerpt_ar || '',
        excerpt_en: post.excerpt_en || '',
        excerpt_de: post.excerpt_de || '',
        content_ar: post.content_ar || '',
        content_en: post.content_en || '',
        content_de: post.content_de || '',
        cover_image_url: post.cover_image_url || '',
        tags: (post.tags as string[]) || [],
        reading_time_minutes: post.reading_time_minutes,
        is_featured: post.is_featured,
        is_visible: post.is_visible,
        status: post.status,
      });
    }
  }, [post]);

  // Auto-generate slug from English title
  useEffect(() => {
    if (mode === 'create' && formData.title_en && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(formData.title_en),
      }));
    }
  }, [formData.title_en, mode, formData.slug]);

  // Calculate reading time from content
  useEffect(() => {
    const content = formData.content_en || formData.content_ar;
    if (content) {
      const words = content.split(/\s+/).length;
      const minutes = Math.ceil(words / 200); // Average reading speed
      setFormData((prev) => ({
        ...prev,
        reading_time_minutes: Math.max(1, minutes),
      }));
    }
  }, [formData.content_en, formData.content_ar]);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle toggle change
  const handleToggle = (name: keyof FormData, value: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  // Remove tag
  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formPayload = new FormData();
      formPayload.append('file', file);
      formPayload.append('bucket', 'blog');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formPayload,
      });

      if (!response.ok) throw new Error('Upload failed');

      const { url } = await response.json();
      setFormData((prev) => ({ ...prev, cover_image_url: url }));
      toast.success('Image uploaded');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title_en.trim()) {
      toast.error('English title is required');
      return;
    }
    if (!formData.slug.trim()) {
      toast.error('Slug is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        tags: JSON.stringify(formData.tags),
        author_id: admin?.id,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
      };

      let error;

      if (mode === 'create') {
        const { error: insertError } = await supabase
          .from('blog_posts')
          .insert(payload);
        error = insertError;
      } else {
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update(payload)
          .eq('id', post!.id);
        error = updateError;
      }

      if (error) throw error;

      toast.success(mode === 'create' ? 'Post created' : 'Post updated');
      router.push('/admin/blog');
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.message || 'Failed to save post');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Publish post
  const handlePublish = async () => {
    setFormData((prev) => ({ ...prev, status: 'published' }));
    // Will be saved on form submit
  };

  const languageTabs = [
    { key: 'en', label: 'English', flag: '🇬🇧' },
    { key: 'ar', label: 'العربية', flag: '🇪🇬' },
    { key: 'de', label: 'Deutsch', flag: '🇩🇪' },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {mode === 'create' ? 'New Blog Post' : 'Edit Blog Post'}
          </h1>
          <p className="text-dark-400">
            {mode === 'create'
              ? 'Write a new article'
              : 'Update your article'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/admin/blog')}
          >
            Cancel
          </Button>
          {formData.status === 'draft' && (
            <Button
              type="submit"
              variant="outline"
              onClick={() => setFormData((prev) => ({ ...prev, status: 'draft' }))}
            >
              Save Draft
            </Button>
          )}
          <Button
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<Save className="h-4 w-4" />}
            onClick={() => {
              if (formData.status === 'draft') {
                setFormData((prev) => ({ ...prev, status: 'published' }));
              }
            }}
          >
            {formData.status === 'published' ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card variant="bordered" className="bg-dark-900 border-dark-700">
            <h2 className="text-lg font-semibold text-white mb-4">Article Details</h2>
            
            <div className="space-y-4">
              <Input
                name="slug"
                label="Slug (URL)"
                value={formData.slug}
                onChange={handleChange}
                placeholder="my-article-title"
                hint="Used in the URL: /blog/your-slug"
                required
              />

              {/* Language Tabs */}
              <div className="flex items-center gap-1 p-1 bg-dark-800 rounded-lg w-fit">
                {languageTabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                      activeTab === tab.key
                        ? 'bg-primary-500 text-white'
                        : 'text-dark-300 hover:text-white hover:bg-dark-700'
                    )}
                  >
                    <span>{tab.flag}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Title */}
              <Input
                name={`title_${activeTab}`}
                label={`Title (${activeTab.toUpperCase()})`}
                value={formData[`title_${activeTab}` as keyof FormData] as string}
                onChange={handleChange}
                placeholder="Article title"
                required={activeTab === 'en'}
                dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
              />

              {/* Excerpt */}
              <Textarea
                name={`excerpt_${activeTab}`}
                label={`Excerpt (${activeTab.toUpperCase()})`}
                value={formData[`excerpt_${activeTab}` as keyof FormData] as string}
                onChange={handleChange}
                placeholder="Brief summary of the article"
                hint="This will appear in blog cards"
                dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </Card>

          {/* Content */}
          <Card variant="bordered" className="bg-dark-900 border-dark-700">
            <h2 className="text-lg font-semibold text-white mb-4">
              Content ({activeTab.toUpperCase()})
            </h2>
            <MarkdownEditor
              value={formData[`content_${activeTab}` as keyof FormData] as string}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  [`content_${activeTab}`]: value,
                }))
              }
              placeholder="Write your article content here..."
              minHeight="400px"
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card variant="bordered" className="bg-dark-900 border-dark-700">
            <h2 className="text-lg font-semibold text-white mb-4">Publish</h2>
            <Select
              value={formData.status}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  status: value as FormData['status'],
                }))
              }
              options={[
                { value: 'draft', label: '📝 Draft' },
                { value: 'published', label: '✅ Published' },
                { value: 'archived', label: '📦 Archived' },
              ]}
            />
            
            <div className="mt-4 space-y-3">
              <Toggle
                checked={formData.is_visible}
                onChange={(v) => handleToggle('is_visible', v)}
                label="Visible"
                description="Show on blog page"
              />
              <Toggle
                checked={formData.is_featured}
                onChange={(v) => handleToggle('is_featured', v)}
                label="Featured"
                description="Highlight this post"
              />
            </div>

            <div className="mt-4 pt-4 border-t border-dark-700">
              <div className="flex items-center gap-2 text-sm text-dark-400">
                <Clock className="h-4 w-4" />
                <span>{formData.reading_time_minutes} min read</span>
              </div>
            </div>
          </Card>

          {/* Cover Image */}
          <Card variant="bordered" className="bg-dark-900 border-dark-700">
            <h2 className="text-lg font-semibold text-white mb-4">Cover Image</h2>
            {formData.cover_image_url ? (
              <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                <img
                  src={formData.cover_image_url}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, cover_image_url: '' }))
                  }
                  className="absolute top-2 right-2 p-1 bg-dark-900/80 rounded-lg hover:bg-dark-800"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-dark-600 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                <Upload className="h-8 w-8 text-dark-400 mb-2" />
                <span className="text-sm text-dark-400">Upload cover image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </Card>

          {/* Tags */}
          <Card variant="bordered" className="bg-dark-900 border-dark-700">
            <h2 className="text-lg font-semibold text-white mb-4">Tags</h2>
            <div className="flex gap-2 mb-4">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1 pr-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="p-0.5 hover:bg-dark-600 rounded"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {formData.tags.length === 0 && (
                <span className="text-sm text-dark-500">No tags added</span>
              )}
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}