// ============================================
// Skills Page
// ============================================

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SkillsSection } from '@/components/sections/SkillsSection';

interface SkillsPageProps {
  params: { locale: string };
}

export async function generateMetadata({ params }: SkillsPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'skills' });
  
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function SkillsPage() {
  return (
    <div className="pt-20">
      <SkillsSection />
    </div>
  );
}