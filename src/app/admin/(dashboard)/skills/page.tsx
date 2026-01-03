// src/app/admin/(dashboard)/skills/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient, createUntypedClient } from '@/lib/supabase/client';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
  X,
  GripVertical,
  Code,
  Palette,
  Users,
  Briefcase,
} from 'lucide-react';

// تعريف نوع المهارة مباشرة لتجنب مشاكل الأنواع
interface Skill {
  id: string;
  name_ar: string;
  name_en: string;
  name_de: string | null;
  description_ar: string | null;
  description_en: string | null;
  description_de: string | null;
  category: string;
  icon: string | null;
  proficiency: number;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

const categoryConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  programming: { label: 'برمجة', icon: Code, color: 'bg-blue-500' },
  technical: { label: 'تقني', icon: Briefcase, color: 'bg-purple-500' },
  soft: { label: 'مهارات شخصية', icon: Users, color: 'bg-green-500' },
  design: { label: 'تصميم', icon: Palette, color: 'bg-pink-500' },
};

const defaultSkill: Partial<Skill> = {
  name_ar: '',
  name_en: '',
  name_de: '',
  description_ar: '',
  description_en: '',
  description_de: '',
  category: 'programming',
  icon: 'code',
  proficiency: 80,
  is_visible: true,
  display_order: 0,
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();
  const untypedSupabase = createUntypedClient();

  // Fetch skills
  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('skills')
        .select('*')
        .order('display_order', { ascending: true });

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      if (searchQuery) {
        query = query.or(`name_ar.ilike.%${searchQuery}%,name_en.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSkills((data as Skill[]) || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase, categoryFilter, searchQuery]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  // Open modal for new skill
  const openNewModal = () => {
    setEditingSkill({ ...defaultSkill });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const openEditModal = (skill: Skill) => {
    setEditingSkill({
      id: skill.id,
      name_ar: skill.name_ar,
      name_en: skill.name_en,
      name_de: skill.name_de || '',
      description_ar: skill.description_ar || '',
      description_en: skill.description_en || '',
      description_de: skill.description_de || '',
      category: skill.category,
      icon: skill.icon || '',
      proficiency: skill.proficiency,
      is_visible: skill.is_visible,
      display_order: skill.display_order,
    });
    setIsModalOpen(true);
  };

  // Save skill
  const saveSkill = async () => {
    if (!editingSkill) return;

    setSaving(true);
    try {
      const skillData = {
        name_ar: editingSkill.name_ar,
        name_en: editingSkill.name_en,
        name_de: editingSkill.name_de || null,
        description_ar: editingSkill.description_ar || null,
        description_en: editingSkill.description_en || null,
        description_de: editingSkill.description_de || null,
        category: editingSkill.category,
        icon: editingSkill.icon || null,
        proficiency: editingSkill.proficiency,
        is_visible: editingSkill.is_visible,
        display_order: editingSkill.display_order,
      };

      if (editingSkill.id) {
        // Update
        const { error } = await untypedSupabase
          .from('skills')
          .update(skillData)
          .eq('id', editingSkill.id);

        if (error) throw error;
      } else {
        // Insert
        const { error } = await untypedSupabase
          .from('skills')
          .insert(skillData);

        if (error) throw error;
      }

      setIsModalOpen(false);
      setEditingSkill(null);
      fetchSkills();
    } catch (error) {
      console.error('Error saving skill:', error);
    } finally {
      setSaving(false);
    }
  };

  // Toggle visibility
  const toggleVisibility = async (skill: Skill) => {
    try {
      const { error } = await untypedSupabase
        .from('skills')
        .update({ is_visible: !skill.is_visible })
        .eq('id', skill.id);

      if (error) throw error;

      setSkills(prev =>
        prev.map(s =>
          s.id === skill.id ? { ...s, is_visible: !s.is_visible } : s
        )
      );
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  // Delete skill
  const deleteSkill = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المهارة؟')) return;

    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSkills(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            المهارات
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            إدارة مهاراتك وخبراتك
          </p>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          إضافة مهارة
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="بحث في المهارات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">جميع الفئات</option>
          {Object.entries(categoryConfig).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>

        <button
          onClick={fetchSkills}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            لا توجد مهارات بعد
          </p>
          <button
            onClick={openNewModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-5 h-5" />
            إضافة أول مهارة
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => {
            const category = categoryConfig[skill.category] || categoryConfig.programming;
            const CategoryIcon = category.icon;
            
            return (
              <div
                key={skill.id}
                className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 ${
                  !skill.is_visible ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.color} bg-opacity-10`}>
                      <CategoryIcon className={`w-5 h-5 text-${category.color.replace('bg-', '')}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {skill.name_ar}
                      </h3>
                      <p className="text-sm text-gray-500">{skill.name_en}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleVisibility(skill)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      {skill.is_visible ? (
                        <Eye className="w-4 h-4 text-gray-500" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => openEditModal(skill)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => deleteSkill(skill.id)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-500">الإتقان</span>
                    <span className="font-medium text-gray-900 dark:text-white">{skill.proficiency}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${category.color} transition-all duration-300`}
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className={`px-2 py-1 rounded-full ${category.color} bg-opacity-10 text-gray-700 dark:text-gray-300`}>
                    {category.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && editingSkill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingSkill.id ? 'تعديل مهارة' : 'إضافة مهارة جديدة'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Names */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الاسم (عربي) *
                  </label>
                  <input
                    type="text"
                    value={editingSkill.name_ar || ''}
                    onChange={(e) => setEditingSkill({ ...editingSkill, name_ar: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الاسم (إنجليزي) *
                  </label>
                  <input
                    type="text"
                    value={editingSkill.name_en || ''}
                    onChange={(e) => setEditingSkill({ ...editingSkill, name_en: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الاسم (ألماني)
                  </label>
                  <input
                    type="text"
                    value={editingSkill.name_de || ''}
                    onChange={(e) => setEditingSkill({ ...editingSkill, name_de: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
                  />
                </div>
              </div>

              {/* Category & Icon */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الفئة
                  </label>
                  <select
                    value={editingSkill.category || 'programming'}
                    onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
                  >
                    {Object.entries(categoryConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الأيقونة
                  </label>
                  <input
                    type="text"
                    value={editingSkill.icon || ''}
                    onChange={(e) => setEditingSkill({ ...editingSkill, icon: e.target.value })}
                    placeholder="code, database, globe..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
                  />
                </div>
              </div>

              {/* Proficiency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  مستوى الإتقان: {editingSkill.proficiency}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editingSkill.proficiency || 80}
                  onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Visibility */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_visible"
                  checked={editingSkill.is_visible ?? true}
                  onChange={(e) => setEditingSkill({ ...editingSkill, is_visible: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <label htmlFor="is_visible" className="text-sm text-gray-700 dark:text-gray-300">
                  مرئي للزوار
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={saveSkill}
                disabled={saving || !editingSkill.name_ar || !editingSkill.name_en}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
