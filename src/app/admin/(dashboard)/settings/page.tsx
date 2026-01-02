// ============================================
// Admin Settings Page
// ============================================

'use client';

import { Settings } from 'lucide-react';
import { SettingsForm } from '@/components/admin/SettingsForm';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-dark-400">
          Configure your website settings
        </p>
      </div>

      {/* Settings Form */}
      <SettingsForm />
    </div>
  );
}