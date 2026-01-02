// ============================================
// Admin Skills Management Page
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import {
  Plus,
  Lightbulb,
  Edit,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Save,
  X,
} from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useToastActions } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Dropdown';
import { Toggle } from '@/components/ui/Toggle';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils/cn';
import type { Skill } from '@/types/database';

const categories = [
  { value: 'programming', label: 'Programming' },
  { value: 'technical', label: 'Technical' },
  { value: 'soft', label: 'Soft Skills' },
];

const icons = [
  'code', 'database', 'globe', 'bot', 'lightbulb', 'users', 'briefcase', 'zap',
];

interface SkillFormData {
  name_ar: string;
  name_en: string;
  name_de: string;
  description_ar: string;
  description_en: string;
  description_de: string;
  category: string;
  icon: string;
  proficiency: number;
  is_visible: boolean;
}

const initialFormData: SkillFormData = {
  name_ar: '',
  name_en: '',
  name_de: '',
  description_ar: '',
  description_en: '',
  description_de: '',
  category: 'technical',
  icon: 'code',
  proficiency: 80,
  is_visible: true,
};

export default function SkillsPage() {
  const supabase = getSupabaseClient();
  const toast = useToastActions();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<SkillFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch skills
  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load skills');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Handle form open
  const openForm = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        name_ar: skill.name_ar,
        name_en: skill.name_en,
        name_de: skill.name_de || '',
        description_ar: skill.description_ar || '',
        description_en: skill.description_en || '',
        description_de: skill.description_de || '',
        category: skill.category,
        icon: skill.icon || 'code',
        proficiency: skill.proficiency,
        is_visible: skill.is_visible,
      });
    } else {
      setEditingSkill(null);
      setFormData(initialFormData);
    }
    setShowForm(true);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name_en.trim()) {
      toast.error('English name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingSkill) {
        const { error } = await supabase
          .from('skills')
          .update(formData)
          .eq('id', editingSkill.id);

        if (error) throw error;
        toast.success('Skill updated');
      } else {
        const maxOrder = Math.max(...skills.map((s) => s.display_order), 0);
        const { error } = await supabase
          .from('skills')
          .insert({ ...formData, display_order: maxOrder + 1 });

        if (error) throw error;
        toast.success('Skill created');
      }

      setShowForm(false);
      fetchSkills();
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.message || 'Failed to save skill');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setSkills((prev) => prev.filter((s) => s.id !== deleteId));
      toast.success('Skill deleted');
      setDeleteId(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete skill');
    }
  };

  // Handle reorder
  const handleReorder = async (newOrder: Skill[]) => {
    setSkills(newOrder);

    try {
      const updates = newOrder.map((skill, index) => ({
        id: skill.id,
        display_order: index,
      }));

      for (const update of updates) {
        await supabase
          .from('skills')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }
    } catch (error) {
      console.error('Reorder error:', error);
      toast.error('Failed to save order');
      fetchSkills(); // Revert on error
    }
  };

  // Toggle visibility
  const toggleVisibility = async (skill: Skill) => {
    try {
      const { error } = await supabase
        .from('skills')
        .update({ is_visible: !skill.is_visible })
        .eq('id', skill.id);

      if (error) throw error;

      setSkills((prev) =>
        prev.map((s) =>
          s.id === skill.id ? { ...s, is_visible: !s.is_visible } : s
        )
      );
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error('Failed to update');
    }
  };

  // Group by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || 'technical';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Skills</h1>
          <p className="text-dark-400">
            Manage your skills and expertise
          </p>
        </div>
        <Button
          onClick={() => openForm()}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Skill
        </Button>
      </div>

      {/* Skills by Category */}
      {isLoading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-dark-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category}>
              <h2 className="text-lg font-semibold text-white mb-4 capitalize">
                {category.replace('_', ' ')}
              </h2>
              <Reorder.Group
                axis="y"
                values={categorySkills}
                onReorder={(newOrder) => {
                  const otherSkills = skills.filter((s) => s.category !== category);
                  handleReorder([...otherSkills, ...newOrder]);
                }}
                className="space-y-2"
              >
                {categorySkills.map((skill) => (
                  <Reorder.Item
                    key={skill.id}
                    value={skill}
                    className="bg-dark-800 rounded-xl border border-dark-700 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <GripVertical className="h-5 w-5 text-dark-500 cursor-grab active:cursor-grabbing" />
                      
                      <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                        <Lightbulb className="h-5 w-5 text-primary-500" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">
                            {skill.name_en}
                          </span>
                          <span className="text-sm text-dark-400">
                            {skill.name_ar}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex-1 max-w-xs h-2 bg-dark-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                          <span className="text-sm text-dark-400">
                            {skill.proficiency}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleVisibility(skill)}
                          className="p-2 rounded-lg hover:bg-dark-700 transition-colors"
                        >
                          {skill.is_visible ? (
                            <Eye className="h-4 w-4 text-green-400" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-dark-400" />
                          )}
                        </button>
                        <button
                          onClick={() => openForm(skill)}
                          className="p-2 rounded-lg hover:bg-dark-700 transition-colors"
                        >
                          <Edit className="h-4 w-4 text-dark-400" />
                        </button>
                        <button
                          onClick={() => setDeleteId(skill.id)}
                          className="p-2 rounded-lg hover:bg-dark-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
          ))}

          {skills.length === 0 && (
            <div className="text-center py-16">
              <Lightbulb className="h-12 w-12 text-dark-500 mx-auto mb-4" />
              <p className="text-dark-400">No skills added yet</p>
            </div>
          )}
        </div>
      )}

      {/* Skill Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingSkill ? 'Edit Skill' : 'Add Skill'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Name (English)"
              value={formData.name_en}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name_en: e.target.value }))
              }
              required
            />
            <Input
              label="Name (Arabic)"
              value={formData.name_ar}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name_ar: e.target.value }))
              }
              dir="rtl"
              required
            />
          </div>

          <Input
            label="Name (German)"
            value={formData.name_de}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name_de: e.target.value }))
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              value={formData.category}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
              options={categories}
            />
            <Select
              value={formData.icon}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, icon: value }))
              }
              options={icons.map((i) => ({ value: i, label: i }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Proficiency: {formData.proficiency}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.proficiency}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  proficiency: parseInt(e.target.value),
                }))
              }
              className="w-full"
            />
          </div>

          <Toggle
            checked={formData.is_visible}
            onChange={(v) =>
              setFormData((prev) => ({ ...prev, is_visible: v }))
            }
            label="Visible"
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
              {editingSkill ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Skill"
        message="Are you sure you want to delete this skill?"
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}