// ============================================
// Settings Hook
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { SiteSettings } from '@/types/content';

const defaultSettings: SiteSettings = {
  siteTitle: { ar: 'محمد سيد سنجق', en: 'Mohamed Sayed Sangak', de: 'Mohamed Sayed Sangak' },
  siteDescription: { ar: '', en: '', de: '' },
  contactEmail: 'mahmedsangak07@gmail.com',
  enableBlog: true,
  enableContactForm: true,
  enableAttachments: true,
  animationsEnabled: true,
  animationIntensity: 'normal',
  darkModeDefault: true,
  maintenanceMode: false,
};

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase
          .from('settings')
          .select('key, value');

        if (data) {
          const settingsMap: Record<string, any> = {};
          data.forEach(({ key, value }) => {
            settingsMap[key] = value;
          });

          setSettings({
            siteTitle: settingsMap.site_title || defaultSettings.siteTitle,
            siteDescription: settingsMap.site_description || defaultSettings.siteDescription,
            contactEmail: settingsMap.contact_email || defaultSettings.contactEmail,
            enableBlog: settingsMap.enable_blog ?? defaultSettings.enableBlog,
            enableContactForm: settingsMap.enable_contact_form ?? defaultSettings.enableContactForm,
            enableAttachments: settingsMap.enable_attachments ?? defaultSettings.enableAttachments,
            animationsEnabled: settingsMap.animations_enabled ?? defaultSettings.animationsEnabled,
            animationIntensity: settingsMap.animation_intensity || defaultSettings.animationIntensity,
            darkModeDefault: settingsMap.dark_mode_default ?? defaultSettings.darkModeDefault,
            maintenanceMode: settingsMap.maintenance_mode ?? defaultSettings.maintenanceMode,
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [supabase]);

  return { settings, isLoading };
}