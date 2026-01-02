// ============================================
// Admin Users Manager Component
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Users,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Edit,
  Trash2,
  Mail,
  Calendar,
  Check,
  X,
  Key,
} from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useToastActions } from '@/components/ui/Toast';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Dropdown';
import { Toggle, Checkbox } from '@/components/ui/Toggle';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { formatShortDate } from '@/lib/utils/formatDate';
import { cn } from '@/lib/utils/cn';
import type { Admin, AdminPermissions } from '@/types/database';

interface AdminFormData {
  email: string;
  display_name: string;
  role: 'owner' | 'admin' | 'editor';
  permissions: AdminPermissions;
  is_active: boolean;
}

const defaultPermissions: AdminPermissions = {
  manage_projects: true,
  manage_blog: true,
  manage_skills: true,
  manage_inbox: true,
  manage_settings: false,
  manage_admins: false,
  view_analytics: true,
};

const initialFormData: AdminFormData = {
  email: '',
  display_name: '',
  role: 'editor',
  permissions: defaultPermissions,
  is_active: true,
};

const roleConfig = {
  owner: { label: 'Owner', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10' },
  admin: { label: 'Admin', icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  editor: { label: 'Editor', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-500/10' },
};

const permissionLabels: Record<keyof AdminPermissions, string> = {
  manage_projects: 'Manage Projects',
  manage_blog: 'Manage Blog',
  manage_skills: 'Manage Skills',
  manage_inbox: 'Manage Inbox',
  manage_settings: 'Manage Settings',
  manage_admins: 'Manage Admins',
  view_analytics: 'View Analytics',
};

export function AdminManager() {
  const supabase = getSupabaseClient();
  const toast = useToastActions();
  const { admin: currentAdmin, hasPermission } = useAuth();

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState<AdminFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const isOwner = currentAdmin?.role === 'owner';

  // Fetch admins
  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .order('created_at');

      if (error) throw error;
      setAdmins(data || []);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load admins');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Open form for editing
  const openForm = (admin?: Admin) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        email: admin.email,
        display_name: admin.display_name,
        role: admin.role,
        permissions: admin.permissions as AdminPermissions,
        is_active: admin.is_active,
      });
    } else {
      setEditingAdmin(null);
      setFormData(initialFormData);
    }
    setShowForm(true);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.display_name.trim()) {
      toast.error('Email and display name are required');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingAdmin) {
        // Update existing admin
        const { error } = await supabase
          .from('admins')
          .update({
            display_name: formData.display_name,
            role: formData.role,
            permissions: formData.permissions,
            is_active: formData.is_active,
          })
          .eq('id', editingAdmin.id);

        if (error) throw error;
        toast.success('Admin updated');
      } else {
        // Create new admin - Note: User must first sign up via Supabase Auth
        toast.info('To add a new admin:\n1. User must sign up first\n2. Then you can assign admin role');
        // In a real app, you'd have an invite system
      }

      setShowForm(false);
      fetchAdmins();
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.message || 'Failed to save admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteId) return;

    // Prevent deleting yourself
    if (deleteId === currentAdmin?.id) {
      toast.error("You can't delete yourself");
      setDeleteId(null);
      return;
    }

    try {
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setAdmins((prev) => prev.filter((a) => a.id !== deleteId));
      toast.success('Admin removed');
      setDeleteId(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete admin');
    }
  };

  // Toggle active status
  const toggleActive = async (admin: Admin) => {
    if (admin.id === currentAdmin?.id) {
      toast.error("You can't deactivate yourself");
      return;
    }

    try {
      const { error } = await supabase
        .from('admins')
        .update({ is_active: !admin.is_active })
        .eq('id', admin.id);

      if (error) throw error;

      setAdmins((prev) =>
        prev.map((a) =>
          a.id === admin.id ? { ...a, is_active: !a.is_active } : a
        )
      );
      toast.success('Status updated');
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error('Failed to update');
    }
  };

  if (!isOwner) {
    return (
      <div className="text-center py-16">
        <ShieldAlert className="h-16 w-16 text-dark-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
        <p className="text-dark-400">Only owners can manage admin users</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Users</h1>
          <p className="text-dark-400">
            Manage administrator accounts and permissions
          </p>
        </div>
        <Button
          onClick={() => openForm()}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Admin
        </Button>
      </div>

      {/* Admins List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-dark-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {admins.map((admin) => {
            const role = roleConfig[admin.role];
            const RoleIcon = role.icon;
            const isCurrentUser = admin.id === currentAdmin?.id;

            return (
              <motion.div
                key={admin.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'bg-dark-800 rounded-xl border border-dark-700 p-4',
                  !admin.is_active && 'opacity-60'
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center',
                    role.bg
                  )}>
                    <RoleIcon className={cn('h-6 w-6', role.color)} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">
                        {admin.display_name}
                      </span>
                      {isCurrentUser && (
                        <Badge variant="primary" size="sm">You</Badge>
                      )}
                      <Badge
                        variant={admin.is_active ? 'success' : 'secondary'}
                        size="sm"
                      >
                        {admin.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-dark-400">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {admin.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Joined {formatShortDate(admin.created_at, 'en')}
                      </span>
                    </div>
                  </div>

                  {/* Role Badge */}
                  <Badge className={cn(role.bg, role.color, 'border-0')}>
                    {role.label}
                  </Badge>

                  {/* Actions */}
                  {!isCurrentUser && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleActive(admin)}
                        className="p-2 rounded-lg hover:bg-dark-700 transition-colors"
                        title={admin.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {admin.is_active ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <X className="h-4 w-4 text-dark-400" />
                        )}
                      </button>
                      <button
                        onClick={() => openForm(admin)}
                        className="p-2 rounded-lg hover:bg-dark-700 transition-colors"
                      >
                        <Edit className="h-4 w-4 text-dark-400" />
                      </button>
                      {admin.role !== 'owner' && (
                        <button
                          onClick={() => setDeleteId(admin.id)}
                          className="p-2 rounded-lg hover:bg-dark-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Permissions */}
                <div className="mt-4 pt-4 border-t border-dark-700">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(admin.permissions as AdminPermissions).map(
                      ([key, value]) => (
                        <Badge
                          key={key}
                          variant={value ? 'success' : 'secondary'}
                          size="sm"
                        >
                          {value ? '✓' : '✗'} {permissionLabels[key as keyof AdminPermissions]}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {admins.length === 0 && (
            <div className="text-center py-16">
              <Users className="h-12 w-12 text-dark-500 mx-auto mb-4" />
              <p className="text-dark-400">No admin users found</p>
            </div>
          )}
        </div>
      )}

      {/* Admin Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingAdmin ? 'Edit Admin' : 'Add Admin'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              disabled={!!editingAdmin}
              required
            />
            <Input
              label="Display Name"
              value={formData.display_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, display_name: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Role
            </label>
            <Select
              value={formData.role}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  role: value as AdminFormData['role'],
                }))
              }
              options={[
                { value: 'editor', label: '🛡️ Editor - Basic access' },
                { value: 'admin', label: '🛡️ Admin - Extended access' },
                { value: 'owner', label: '⚠️ Owner - Full access' },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-3">
              Permissions
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              {Object.entries(permissionLabels).map(([key, label]) => (
                <Checkbox
                  key={key}
                  checked={formData.permissions[key as keyof AdminPermissions]}
                  onChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      permissions: {
                        ...prev.permissions,
                        [key]: checked,
                      },
                    }))
                  }
                  label={label}
                  disabled={formData.role === 'owner'}
                />
              ))}
            </div>
            {formData.role === 'owner' && (
              <p className="mt-2 text-sm text-amber-400">
                Owners have all permissions by default
              </p>
            )}
          </div>

          <Toggle
            checked={formData.is_active}
            onChange={(v) =>
              setFormData((prev) => ({ ...prev, is_active: v }))
            }
            label="Active"
            description="Allow this user to access admin panel"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingAdmin ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Remove Admin"
        message="Are you sure you want to remove this admin? They will lose access to the admin panel."
        confirmText="Remove"
        variant="danger"
      />
    </div>
  );
}