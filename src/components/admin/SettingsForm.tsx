// ============================================
// Settings Form Component
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  Globe,
  Mail,
  Palette,
  Bell,
  Shield,
  Zap,
} from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useToastActions } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Toggle } from '@/components/ui/Toggle';
import { Select } from '@/components/ui/Dropdown';
import { Card } from '@/components/ui/Card';

interface Settings {
  site_title: { ar: string; en: string; de: string };
  site_description: { ar: string; en: string; de: string };
  contact_email: string;
  enable_blog: boolean;
  enable_contact_form: boolean;
  enable_attachments: boolean;
  animations_enabled: boolean;
  animation_intensity: 'low' | 'normal' | 'high';
  dark_mode_default: boolean;
  maintenance_mode: boolean;
}

const defaultSettings: Settings = {
  site_title: { ar: 'محمد سيد سنجق', en: 'Mohamed Sayed Sangak', de: 'Mohamed Sayed Sangak' },
  site_description: { ar: '', en: '', de: '' },
  contact_email: 'mahmedsangak07@gmail.com',
  enable_blog: true,
  enable_contact_form: true,
  enable_attachments: true,
  animations_enabled: true,
  animation_intensity: 'normal',
  dark_mode_default: true,
  maintenance_mode: false,
};

export function SettingsForm() {
  const supabase = getSupabaseClient();
  const toast = useToastActions();

  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('key, value');

        if (error) throw error;

        if (data) {
          const settingsMap: Record<string, any> = {};
          data.forEach(({ key, value }) => {
            settingsMap[key] = value;
          });

          setSettings({
            site_title: settingsMap.site_title || defaultSettings.site_title,
            site_description: settingsMap.site_description || defaultSettings.site_description,
            contact_email: settingsMap.contact_email || defaultSettings.contact_email,
            enable_blog: settingsMap.enable_blog ?? defaultSettings.enable_blog,
            enable_contact_form: settingsMap.enable_contact_form ?? defaultSettings.enable_contact_form,
            enable_attachments: settingsMap.enable_attachments ?? defaultSettings.enable_attachments,
            animations_enabled: settingsMap.animations_enabled ?? defaultSettings.animations_enabled,
            animation_intensity: settingsMap.animation_intensity || defaultSettings.animation_intensity,
            dark_mode_default: settingsMap.dark_mode_default ?? defaultSettings.dark_mode_default,
            maintenance_mode: settingsMap.maintenance_mode ?? defaultSettings.maintenance_mode,
          });
        }
      } catch (error) {
        console.error('Fetch settings error:', error);
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [supabase, toast]);

  // Save settings
  const handleSave = async () => {
    setIsSaving(true);

    try {
      const settingsToSave = [
        { key: 'site_title', value: settings.site_title, category: 'general' },
        { key: 'site_description', value: settings.site_description, category: 'general' },
        { key: 'contact_email', value: settings.contact_email, category: 'contact' },
        { key: 'enable_blog', value: settings.enable_blog, category: 'features' },
        { key: 'enable_contact_form', value: settings.enable_contact_form, category: 'features' },
        { key: 'enable_attachments', value: settings.enable_attachments, category: 'features' },
        { key: 'animations_enabled', value: settings.animations_enabled, category: 'appearance' },
        { key: 'animation_intensity', value: settings.animation_intensity, category: 'appearance' },
        { key: 'dark_mode_default', value: settings.dark_mode_default, category: 'appearance' },
        { key: 'maintenance_mode', value: settings.maintenance_mode, category: 'general' },
      ];

      for (const setting of settingsToSave) {
        const { error } = await supabase
          .from('settings')
          .upsert(setting, { onConflict: 'key' });

        if (error) throw error;
      }

      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Save settings error:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-48 bg-dark-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card variant="bordered" className="bg-dark-900 border-dark-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Globe className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">General</h2>
            <p className="text-sm text-dark-400">Basic site configuration</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Input
              label="Site Title (English)"
              value={settings.site_title.en}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  site_title: { ...prev.site_title, en: e.target.value },
                }))
              }
            />
            <Input
              label="Site Title (Arabic)"
              value={settings.site_title.ar}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  site_title: { ...prev.site_title, ar: e.target.value },
                }))
              }
              dir="rtl"
            />
            <Input
              label="Site Title (German)"
              value={settings.site_title.de}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  site_title: { ...prev.site_title, de: e.target.value },
                }))
              }
            />
          </div>

          <Toggle
            checked={settings.maintenance_mode}
            onChange={(v) =>
              setSettings((prev) => ({ ...prev, maintenance_mode: v }))
            }
            label="Maintenance Mode"
            description="Show maintenance page to visitors"
          />
        </div>
      </Card>

      {/* Contact Settings */}
      <Card variant="bordered" className="bg-dark-900 border-dark-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Mail className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Contact</h2>
            <p className="text-sm text-dark-400">Contact form settings</p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Contact Email"
            type="email"
            value={settings.contact_email}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, contact_email: e.target.value }))
            }
          />

          <Toggle
            checked={settings.enable_contact_form}
            onChange={(v) =>
              setSettings((prev) => ({ ...prev, enable_contact_form: v }))
            }
            label="Enable Contact Form"
            description="Allow visitors to send messages"
          />

          <Toggle
            checked={settings.enable_attachments}
            onChange={(v) =>
              setSettings((prev) => ({ ...prev, enable_attachments: v }))
            }
            label="Enable Attachments"
            description="Allow file uploads in contact form"
          />
        </div>
      </Card>

      {/* Features */}
      <Card variant="bordered" className="bg-dark-900 border-dark-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Zap className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Features</h2>
            <p className="text-sm text-dark-400">Enable or disable features</p>
          </div>
        </div>

        <div className="space-y-4">
          <Toggle
            checked={settings.enable_blog}
            onChange={(v) =>
              setSettings((prev) => ({ ...prev, enable_blog: v }))
            }
            label="Enable Blog"
            description="Show blog section on the website"
          />
        </div>
      </Card>

      {/* Appearance */}
      <Card variant="bordered" className="bg-dark-900 border-dark-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Palette className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Appearance</h2>
            <p className="text-sm text-dark-400">Visual customization</p>
          </div>
        </div>

        <div className="space-y-4">
          <Toggle
            checked={settings.dark_mode_default}
            onChange={(v) =>
              setSettings((prev) => ({ ...prev, dark_mode_default: v }))
            }
            label="Dark Mode Default"
            description="Use dark mode as default theme"
          />

          <Toggle
            checked={settings.animations_enabled}
            onChange={(v) =>
              setSettings((prev) => ({ ...prev, animations_enabled: v }))
            }
            label="Enable Animations"
            description="Show page transitions and micro-interactions"
          />

          {settings.animations_enabled && (
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Animation Intensity
              </label>
              <Select
                value={settings.animation_intensity}
                onChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    animation_intensity: value as Settings['animation_intensity'],
                  }))
                }
                options={[
                  { value: 'low', label: 'Low - Subtle animations' },
                  { value: 'normal', label: 'Normal - Balanced' },
                  { value: 'high', label: 'High - More dramatic' },
                ]}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          isLoading={isSaving}
          leftIcon={<Save className="h-4 w-4" />}
          size="lg"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
}