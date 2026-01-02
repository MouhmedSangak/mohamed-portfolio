// ============================================
// Admin Projects List Page
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Plus,
  FolderOpen,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Star,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useToastActions } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Column, Action } from '@/components/admin/DataTable';
import { ConfirmModal } from '@/components/ui/Modal';
import type { Project } from '@/types/database';

export default function ProjectsPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();
  const toast = useToastActions();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('display_order');

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [supabase, toast]);

  // Delete project
  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setProjects((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success('Project deleted');
      setDeleteId(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle visibility
  const toggleVisibility = async (project: Project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_visible: !project.is_visible })
        .eq('id', project.id);

      if (error) throw error;

      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, is_visible: !p.is_visible } : p
        )
      );
      toast.success('Visibility updated');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update');
    }
  };

  // Toggle featured
  const toggleFeatured = async (project: Project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_featured: !project.is_featured })
        .eq('id', project.id);

      if (error) throw error;

      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, is_featured: !p.is_featured } : p
        )
      );
      toast.success('Featured status updated');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update');
    }
  };

  const columns: Column<Project>[] = [
    {
      key: 'title_en',
      label: 'Project',
      sortable: true,
      render: (project) => (
        <div className="flex items-center gap-3">
          {project.thumbnail_url ? (
            <img
              src={project.thumbnail_url}
              alt={project.title_en}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-dark-700 flex items-center justify-center">
              <FolderOpen className="h-5 w-5 text-dark-400" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">{project.title_en}</span>
              {project.is_featured && (
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              )}
              {project.is_private && (
                <Lock className="h-4 w-4 text-dark-400" />
              )}
            </div>
            <span className="text-sm text-dark-400">{project.slug}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (project) => {
        const variants: Record<string, 'success' | 'warning' | 'secondary'> = {
          published: 'success',
          draft: 'warning',
          archived: 'secondary',
        };
        return (
          <Badge variant={variants[project.status]}>
            {project.status}
          </Badge>
        );
      },
    },
    {
      key: 'is_visible',
      label: 'Visible',
      render: (project) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleVisibility(project);
          }}
          className="p-1 rounded hover:bg-dark-700 transition-colors"
        >
          {project.is_visible ? (
            <Eye className="h-5 w-5 text-green-400" />
          ) : (
            <EyeOff className="h-5 w-5 text-dark-400" />
          )}
        </button>
      ),
    },
    {
      key: 'technologies',
      label: 'Technologies',
      render: (project) => {
        const techs = (project.technologies as string[]) || [];
        return (
          <div className="flex flex-wrap gap-1">
            {techs.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="secondary" size="sm">
                {tech}
              </Badge>
            ))}
            {techs.length > 3 && (
              <Badge variant="secondary" size="sm">
                +{techs.length - 3}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      key: 'display_order',
      label: 'Order',
      sortable: true,
      width: '80px',
      render: (project) => (
        <span className="text-dark-400">{project.display_order}</span>
      ),
    },
  ];

  const actions: Action<Project>[] = [
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (project) => router.push(`/admin/projects/${project.id}`),
    },
    {
      label: 'View on Site',
      icon: <ExternalLink className="h-4 w-4" />,
      onClick: (project) => window.open(`/en/projects/${project.slug}`, '_blank'),
      show: (project) => project.status === 'published',
    },
    {
      label: project => project.is_featured ? 'Remove Featured' : 'Make Featured',
      icon: <Star className="h-4 w-4" />,
      onClick: toggleFeatured,
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (project) => setDeleteId(project.id),
      danger: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-dark-400">
            Manage your portfolio projects
          </p>
        </div>
        <Button
          onClick={() => router.push('/admin/projects/new')}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          New Project
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={projects}
        columns={columns}
        actions={actions}
        keyField="id"
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search projects..."
        emptyMessage="No projects yet"
        emptyIcon={<FolderOpen className="h-12 w-12" />}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}