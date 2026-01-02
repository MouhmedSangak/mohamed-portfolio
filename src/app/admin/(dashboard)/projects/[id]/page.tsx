// ============================================
// Edit Project Page
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { PageLoader } from '@/components/ui/Spinner';
import type { Project } from '@/types/database';

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        if (!data) {
          router.push('/admin/projects');
          return;
        }

        setProject(data);
      } catch (error) {
        console.error('Fetch error:', error);
        router.push('/admin/projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [params.id, supabase, router]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!project) {
    return null;
  }

  return <ProjectForm project={project} mode="edit" />;
}