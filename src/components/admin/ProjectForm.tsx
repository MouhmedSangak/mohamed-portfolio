// ============================================
// Project Form Component
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
  Link,
  Globe,
  Github,
  Lock,
  Eye,
  EyeOff,
  GripVertical,
} from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useToastActions } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Dropdown';
import { Toggle, Checkbox } from '@/components/ui/Toggle';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MarkdownEditor } from '@/components/forms/MarkdownEditor';
import { generateSlug } from '@/lib/utils/sanitize';
import { cn } from '@/lib/utils/cn';
import type { Project } from '@/types/database';

interface ProjectFormProps {
  project?: Project;
  mode: 'create' | 'edit';
}

interface FormData {
  slug: string;
  title_ar: string;
  title_en: string;
  title_de: string;
  description_ar: string;
  description_en: string;
  description_de: string;
  content_ar: string;
  content_en: string;
  content_de: string;
  role_ar: string;
  role_en: string;
  role_de: string;
  highlights_ar: string[];
  highlights_en: string[];
  highlights_de: string[];
  technologies: string[];
  thumbnail_url: string;
  images: string[];
  project_url: string;
  github_url: string;
  is_public_link: boolean;
  is_private: boolean;
  is_featured: boolean;
  is_visible: boolean;
  status: 'draft' | 'published' | 'archived';
  display_order: number;
}

const initialFormData: FormData = {
  slug: '',
  title_ar: '',
  title_en: '',
  title_de: '',
  description_ar: '',
  description_en: '',
  description_de: '',
  content_ar: '',
  content_en: '',
  content_de: '',
  role_ar: '',
  role_en: '',
  role_de: '',
  highlights_ar: [],
  highlights_en: [],
  highlights_de: [],
  technologies: [],
  thumbnail_url: '',
  images: [],
  project_url: '',
  github_url: '',
  is_public_link: false,
  is_private: false,
  is_featured: false,
  is_visible: true,
  status: 'draft',
  display_order: 0,
};

export function ProjectForm({ project, mode }: ProjectFormProps) {
  const router = useRouter();
  const supabase = getSupabaseClient();
  const toast = useToastActions();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [activeTab, setActiveTab] = useState<'en' | 'ar' | 'de'>('en');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTech, setNewTech] = useState('');
  const [newHighlight, setNewHighlight] = useState('');

  // Load existing project
  useEffect(() => {
    if (project) {
      setFormData({
        slug: project.slug,
        title_ar: project.title_ar,
        title_en: project.title_en,
        title_de: project.title_de || '',
        description_ar: project.description_ar || '',
        description_en: project.description_en || '',
        description_de: project.description_de || '',
        content_ar: project.content_ar || '',
        content_en: project.content_en || '',
        content_de: project.content_de || '',
        role_ar: project.role_ar || '',
        role_en: project.role_en || '',
        role_de: project.role_de || '',
        highlights_ar: (project.highlights_ar as string[]) || [],
        highlights_en: (project.highlights_en as string[]) || [],
        highlights_de: (project.highlights_de as string[]) || [],
        technologies: (project.technologies as string[]) || [],
        thumbnail_url: project.thumbnail_url || '',
        images: (project.images as string[]) || [],
        project_url: project.project_url || '',
        github_url: project.github_url || '',
        is_public_link: project.is_public_link,
        is_private: project.is_private,
        is_featured: project.is_featured,
        is_visible: project.is_visible,
        status: project.status,
        display_order: project.display_order,
      });
    }
  }, [project]);

  // Auto-generate slug from English title
  useEffect(() => {
    if (mode === 'create' && formData.title_en && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(formData.title_en),
      }));
    }
  }, [formData.title_en, mode, formData.slug]);

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

  // Add technology
  const addTechnology = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()],
      }));
      setNewTech('');
    }
  };

  // Remove technology
  const removeTechnology = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  // Add highlight
  const addHighlight = (lang: 'ar' | 'en' | 'de') => {
    if (newHighlight.trim()) {
      const key = `highlights_${lang}` as keyof FormData;
      const highlights = formData[key] as string[];
      if (!highlights.includes(newHighlight.trim())) {
        setFormData((prev) => ({
          ...prev,
          [key]: [...highlights, newHighlight.trim()],
        }));
      }
      setNewHighlight('');
    }
  };

  // Remove highlight
  const removeHighlight = (lang: 'ar' | 'en' | 'de', index: number) => {
    const key = `highlights_${lang}` as keyof FormData;
    const highlights = formData[key] as string[];
    setFormData((prev) => ({
      ...prev,
      [key]: highlights.filter((_, i) => i !== index),
    }));
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formPayload = new FormData();
      formPayload.append('file', file);
      formPayload.append('bucket', 'projects');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formPayload,
      });

      if (!response.ok) throw new Error('Upload failed');

      const { url } = await response.json();
      setFormData((prev) => ({ ...prev, thumbnail_url: url }));
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
        highlights_ar: JSON.stringify(formData.highlights_ar),
        highlights_en: JSON.stringify(formData.highlights_en),
        highlights_de: JSON.stringify(formData.highlights_de),
        technologies: JSON.stringify(formData.technologies),
        images: JSON.stringify(formData.images),
      };

      let error;

      if (mode === 'create') {
        const { error: insertError } = await supabase
          .from('projects')
          .insert(payload);
        error = insertError;
      } else {
        const { error: updateError } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', project!.id);
        error = updateError;
      }

      if (error) throw error;

      toast.success(mode === 'create' ? 'Project created' : 'Project updated');
      router.push('/admin/projects');
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.message || 'Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
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
            {mode === 'create' ? 'New Project' : 'Edit Project'}
          </h1>
          <p className="text-dark-400">
            {mode === 'create'
              ? 'Add a new project to your portfolio'
              : 'Update project information'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/admin/projects')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<Save className="h-4 w-4" />}
          >
            {mode === 'create' ? 'Create Project' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card variant="bordered" className="bg-dark-900 border-dark-700">
            <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <Input
                name="slug"
                label="Slug (URL)"
                value={formData.slug}
                onChange={handleChange}
                placeholder="project-name"
                hint="Used in the URL: /projects/your-slug"
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
                placeholder="Project title"
                required={activeTab === 'en'}
                dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
              />

              {/* Description */}
              <Textarea
                name={`description_${activeTab}`}
                label={`Short Description (${activeTab.toUpperCase()})`}
                value={formData[`description_${activeTab}` as keyof FormData] as string}
                onChange={handleChange}
                placeholder="Brief project description"
                dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
              />

              {/* Role */}
              <Input
                name={`role_${activeTab}`}
                label={`Your Role (${activeTab.toUpperCase()})`}
                value={formData[`role_${activeTab}` as keyof FormData] as string}
                onChange={handleChange}
                placeholder="e.g., Lead Developer"
                dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
              />

              {/* Highlights */}
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Highlights ({activeTab.toUpperCase()})
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    placeholder="Add a highlight"
                    dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addHighlight(activeTab);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => addHighlight(activeTab)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {(formData[`highlights_${activeTab}` as keyof FormData] as string[]).map(
                    (highlight, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-dark-800 rounded-lg"
                      >
                        <GripVertical className="h-4 w-4 text-dark-500" />
                        <span className="flex-1 text-sm text-dark-200">{highlight}</span>
                        <button
                          type="button"
                          onClick={() => removeHighlight(activeTab, index)}
                          className="p-1 hover:bg-dark-700 rounded"
                        >
                          <X className="h-4 w-4 text-dark-400" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Content */}
          <Card variant="bordered" className="bg-dark-900 border-dark-700">
            <h2 className="text-lg font-semibold text-white mb-4">
              Detailed Content ({activeTab.toUpperCase()})
            </h2>
            <MarkdownEditor
              value={formData[`content_${activeTab}` as keyof FormData] as string}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  [`content_${activeTab}`]: value,
                }))
              }
              placeholder="Write detailed project description..."
              minHeight="300px"
            />
          </Card>

          {/* Technologies */}
          <Card variant="bordered" className="bg-dark-900 border-dark-700">
            <h2 className="text-lg font-semibold text-white mb-4">Technologies</h2>
            <div className="flex gap-2 mb-4">
              <Input
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="Add technology"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTechnology();
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={addTechnology}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="flex items-center gap-1 pr-1"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    className="p-0.5 hover:bg-dark-600 rounded"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card variant="bordered" className="bg-dark-900 border-dark-700">
            <h2 className="text-lg font-semibold text-white mb-4">Status</h2>
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
                description="Show on website"
              />
              <Toggle
                checked={formData.is_featured}
                onChange={(v) => handleToggle('is_featured', v)}
                label="Featured"
                description="Show in featured section"
              />
              <Toggle
                checked={formData.is_private}
                onChange={(v) => handleToggle('is_private', v)}
                label="Private Project"
                description="Mark as confidential"
              />
            </div>
          </Card>

          {/* Thumbnail */}
          <Card variant="bordered" className="bg-dark-900 border-dark-700">
            <h2 className="text-lg font-semibold text-white mb-4">Thumbnail</h2>
            {formData.thumbnail_url ? (
              <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                <img
                  src={formData.thumbnail_url}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, thumbnail_url: '' }))
                  }
                  className="absolute top-2 right-2 p-1 bg-dark-900/80 rounded-lg hover:bg-dark-800"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-dark-600 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                <Upload className="h-8 w-8 text-dark-400 mb-2" />
                <span className="text-sm text-dark-400">Upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </Card>

          {/* Links */}
          <Card variant="bordered" className="bg-dark-900 border-dark-700">
            <h2 className="text-lg font-semibold text-white mb-4">Links</h2>
            <div className="space-y-4">
              <Input
                name="project_url"
                label="Project URL"
                value={formData.project_url}
                onChange={handleChange}
                placeholder="https://..."
                leftIcon={<Globe className="h-4 w-4" />}
              />
              <Toggle
                checked={formData.is_public_link}
                onChange={(v) => handleToggle('is_public_link', v)}
                label="Public Link"
                description="Allow visitors to see this link"
              />
              <Input
                name="github_url"
                label="GitHub URL"
                value={formData.github_url}
                onChange={handleChange}
                placeholder="https://github.com/..."
                leftIcon={<Github className="h-4 w-4" />}
              />
            </div>
          </Card>

          {/* Display Order */}
          <Card variant="bordered" className="bg-dark-900 border-dark-700">
            <h2 className="text-lg font-semibold text-white mb-4">Display Order</h2>
            <Input
              name="display_order"
              type="number"
              value={formData.display_order.toString()}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  display_order: parseInt(e.target.value) || 0,
                }))
              }
              hint="Lower numbers appear first"
            />
          </Card>
        </div>
      </div>
    </form>
  );
}