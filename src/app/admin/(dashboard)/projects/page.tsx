// src/app/admin/(dashboard)/projects/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient, createUntypedClient } from '@/lib/supabase/client';
import { Project } from '@/lib/supabase/types';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  ExternalLink,
  Github,
  MoreVertical,
  RefreshCw,
  GripVertical,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const router = useRouter();

  const supabase = createClient();
  const untypedSupabase = createUntypedClient();

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (searchQuery) {
        query = query.or(`title_ar.ilike.%${searchQuery}%,title_en.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProjects((data as Project[]) || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase, statusFilter, searchQuery]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Toggle visibility
  const toggleVisibility = async (project: Project) => {
    try {
      const { error } = await untypedSupabase
        .from('projects')
        .update({ is_visible: !project.is_visible })
        .eq('id', project.id);

      if (error) throw error;

      setProjects(prev =>
        prev.map(p =>
          p.id === project.id ? { ...p, is_visible: !p.is_visible } : p
        )
      );
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  // Toggle featured
  const toggleFeatured = async (project: Project) => {
    try {
      const { error } = await untypedSupabase
        .from('projects')
        .update({ is_featured: !project.is_featured })
        .eq('id', project.id);

      if (error) throw error;

      setProjects(prev =>
        prev.map(p =>
          p.id === project.id ? { ...p, is_featured: !p.is_featured } : p
        )
      );
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  // Delete project
  const deleteProject = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    };
    const labels = {
      published: 'منشور',
      draft: 'مسودة',
      archived: 'مؤرشف',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            المشاريع
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            إدارة مشاريعك ومعرض أعمالك
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          مشروع جديد
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="بحث في المشاريع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">جميع الحالات</option>
          <option value="published">منشور</option>
          <option value="draft">مسودة</option>
          <option value="archived">مؤرشف</option>
        </select>

        <button
          onClick={fetchProjects}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            لا توجد مشاريع بعد
          </p>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-5 h-5" />
            إنشاء أول مشروع
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-700">
                {project.thumbnail_url ? (
                  <Image
                    src={project.thumbnail_url}
                    alt={project.title_ar}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    لا توجد صورة
                  </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                  >
                    <Edit className="w-5 h-5 text-gray-700" />
                  </Link>
                  <button
                    onClick={() => toggleVisibility(project)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                  >
                    {project.is_visible ? (
                      <EyeOff className="w-5 h-5 text-gray-700" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-700" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>

                {/* Badges */}
                <div className="absolute top-2 right-2 flex gap-1">
                  {project.is_featured && (
                    <span className="p-1 bg-yellow-500 rounded-full">
                      <Star className="w-4 h-4 text-white" />
                    </span>
                  )}
                  {!project.is_visible && (
                    <span className="p-1 bg-gray-500 rounded-full">
                      <EyeOff className="w-4 h-4 text-white" />
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {project.title_ar}
                  </h3>
                  {getStatusBadge(project.status)}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                  {project.description_ar}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {(project.technologies as string[])?.slice(0, 3).map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {(project.technologies as string[])?.length > 3 && (
                    <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                      +{(project.technologies as string[]).length - 3}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {formatDistanceToNow(new Date(project.created_at), {
                      addSuffix: true,
                      locale: ar,
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    {project.project_url && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary-600"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary-600"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
