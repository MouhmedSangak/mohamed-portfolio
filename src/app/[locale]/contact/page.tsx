// ============================================
// Contact Page
// ============================================

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ContactSection } from '@/components/sections/ContactSection';

interface ContactPageProps {
  params: { locale: string };
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'contact' });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function ContactPage() {
  return (
    <div className="pt-20">
      <ContactSection showForm={true} />
    </div>
  );
}