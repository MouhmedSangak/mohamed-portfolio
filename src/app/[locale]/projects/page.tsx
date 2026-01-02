// ============================================
// Projects Page
// ============================================

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ProjectsSection } from '@/components/sections/ProjectsSection';

interface ProjectsPageProps {
  params: { locale: string };
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'projects' });
  
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function ProjectsPage() {
  return (
    <div className="pt-20">
      <ProjectsSection limit={0} showViewAll={false} featuredOnly={false} />
    </div>
  );
}