import React, { useEffect, useState } from 'react';
import { api, ApiContentItem } from '../../services/api';
import {
  Layers,
  Plus,
  Trash2,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Edit2,
  X,
  Check,
} from 'lucide-react';

export const AdminContentPage: React.FC = () => {
  const [content, setContent] = useState<ApiContentItem[]>([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ApiContentItem | null>(null);

  // New Content Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    id: '',
    type: 'activity' as const,
    title: '',
    description: '',
    category: 'focus',
    categoryName: 'Visual Focus',
    ageRange: '4-7 yrs',
    difficulty: 'Gentle',
    duration: '5 mins',
    status: 'published' as const,
    orderIndex: 10,
  });

  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.admin.getContent(typeFilter || undefined, statusFilter || undefined);
      setContent(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load content catalogue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [typeFilter, statusFilter]);

  const handleTogglePublish = async (item: ApiContentItem) => {
    const nextStatus = item.status === 'published' ? 'draft' : 'published';
    try {
      await api.admin.updateContent(item.id, { status: nextStatus });
      setSuccess(`Content status changed to ${nextStatus}.`);
      fetchContent();
    } catch (err: any) {
      setError(err.message || 'Failed to update content status.');
    }
  };

  const handleDeleteItem = (item: ApiContentItem) => {
    setItemToDelete(item);
  };

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;
    const item = itemToDelete;
    setItemToDelete(null);
    try {
      await api.admin.deleteContent(item.id);
      setSuccess('Content item deleted.');
      fetchContent();
    } catch (err: any) {
      setError(err.message || 'Failed to delete content.');
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.admin.createContent(newItem);
      setShowAddModal(false);
      setSuccess('New content item created successfully.');
      fetchContent();
      setNewItem({
        id: '',
        type: 'activity',
        title: '',
        description: '',
        category: 'focus',
        categoryName: 'Visual Focus',
        ageRange: '4-7 yrs',
        difficulty: 'Gentle',
        duration: '5 mins',
        status: 'published',
        orderIndex: 10,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create content item.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#263831]">Content Management</h1>
          <p className="text-xs text-[#728078] mt-1 font-medium">
            Manage activities, stories, life skills, resources, and publishing states
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#568469] hover:bg-[#456C55] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Content</span>
          </button>
          <button
            onClick={fetchContent}
            disabled={loading}
            className="p-2 rounded-2xl bg-[#FFFDF8] border border-[#EAE7DF] text-[#568469] hover:bg-[#E2EBD9] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-[#F4DDD3]/60 border border-[#F4DDD3] flex items-center gap-3 text-xs text-[#8A3B29]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-[#E2EBD9] border border-[#d5e2cb] text-xs text-[#263831] flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="text-[11px] font-bold text-[#568469] hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-[#FFFDF8] p-4 rounded-3xl border border-[#EAE7DF] flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#F8F6F0] border border-[#EAE7DF] rounded-2xl py-2 px-3 text-xs text-[#263831] focus:outline-none focus:border-[#568469]"
          >
            <option value="">All Types</option>
            <option value="activity">Activities & Puzzles</option>
            <option value="story">Social Stories</option>
            <option value="life_skill">Life Skills Routines</option>
            <option value="sensory">Sensory Break</option>
            <option value="resource">Caregiver Resource</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F8F6F0] border border-[#EAE7DF] rounded-2xl py-2 px-3 text-xs text-[#263831] focus:outline-none focus:border-[#568469]"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <span className="text-xs text-[#728078] font-bold">{content.length} Items Total</span>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {content.map((item) => (
          <div
            key={item.id}
            className="bg-[#FFFDF8] p-5 rounded-3xl border border-[#EAE7DF] shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#E2EBD9] text-[#568469] text-[10px] font-black uppercase tracking-wider">
                  {item.type}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    item.status === 'published' ? 'bg-[#E2EBD9] text-[#568469]' : 'bg-[#F0EBDD] text-[#728078]'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <h3 className="font-bold text-sm text-[#263831] mb-1">{item.title}</h3>
              <p className="text-xs text-[#728078] line-clamp-2 leading-relaxed mb-3">
                {item.description}
              </p>

              <div className="flex items-center gap-3 text-[11px] text-[#728078] font-medium">
                <span>{item.categoryName}</span>
                <span>•</span>
                <span>{item.duration}</span>
                <span>•</span>
                <span>{item.difficulty}</span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#EAE7DF] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#728078] truncate max-w-[120px]">
                {item.id}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleTogglePublish(item)}
                  title={item.status === 'published' ? 'Move to Draft' : 'Publish'}
                  className="p-1.5 rounded-xl bg-[#F8F6F0] hover:bg-[#E2EBD9] text-[#568469] transition-colors cursor-pointer"
                >
                  {item.status === 'published' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleDeleteItem(item)}
                  title="Delete"
                  className="p-1.5 rounded-xl bg-[#F8F6F0] hover:bg-[#F4DDD3] text-[#8A3B29] transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Content Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#263831]/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#FFFDF8] rounded-[2rem] p-6 md:p-8 shadow-xl border border-[#EAE7DF] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#263831]">Add New Content Item</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-xl text-[#728078] hover:bg-[#F8F6F0]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#728078] mb-1 uppercase tracking-wider">
                  Item ID (unique slug)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. act-sensory-lights"
                  value={newItem.id}
                  onChange={(e) => setNewItem({ ...newItem, id: e.target.value })}
                  className="w-full bg-[#F8F6F0] border border-[#EAE7DF] rounded-xl py-2 px-3 text-[#263831]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#728078] mb-1 uppercase tracking-wider">
                    Content Type
                  </label>
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem({ ...newItem, type: e.target.value as any })}
                    className="w-full bg-[#F8F6F0] border border-[#EAE7DF] rounded-xl py-2 px-3 text-[#263831]"
                  >
                    <option value="activity">Activity</option>
                    <option value="story">Story</option>
                    <option value="life_skill">Life Skill</option>
                    <option value="sensory">Sensory</option>
                    <option value="resource">Resource</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#728078] mb-1 uppercase tracking-wider">
                    Category Key
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. focus, social"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full bg-[#F8F6F0] border border-[#EAE7DF] rounded-xl py-2 px-3 text-[#263831]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#728078] mb-1 uppercase tracking-wider">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Calming Rain Chimes"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full bg-[#F8F6F0] border border-[#EAE7DF] rounded-xl py-2 px-3 text-[#263831]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#728078] mb-1 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="A soothing auditory activity..."
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full bg-[#F8F6F0] border border-[#EAE7DF] rounded-xl py-2 px-3 text-[#263831]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#728078] mb-1 uppercase tracking-wider">
                    Age Range
                  </label>
                  <input
                    type="text"
                    value={newItem.ageRange}
                    onChange={(e) => setNewItem({ ...newItem, ageRange: e.target.value })}
                    className="w-full bg-[#F8F6F0] border border-[#EAE7DF] rounded-xl py-2 px-3 text-[#263831]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#728078] mb-1 uppercase tracking-wider">
                    Difficulty
                  </label>
                  <input
                    type="text"
                    value={newItem.difficulty}
                    onChange={(e) => setNewItem({ ...newItem, difficulty: e.target.value })}
                    className="w-full bg-[#F8F6F0] border border-[#EAE7DF] rounded-xl py-2 px-3 text-[#263831]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#728078] mb-1 uppercase tracking-wider">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={newItem.duration}
                    onChange={(e) => setNewItem({ ...newItem, duration: e.target.value })}
                    className="w-full bg-[#F8F6F0] border border-[#EAE7DF] rounded-xl py-2 px-3 text-[#263831]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#F8F6F0] text-[#728078] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#568469] hover:bg-[#456C55] text-white font-bold"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Accessible In-App Delete Content Confirmation Modal */}
      {itemToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#263831]/40 backdrop-blur-2xs flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md bg-[#FFFDF8] rounded-[2rem] p-6 shadow-xl border border-[#EAE7DF] space-y-4">
            <h3 className="text-base font-bold text-[#263831]">Delete Content Item</h3>
            <p className="text-xs text-[#728078] leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-[#263831]">"{itemToDelete.title}"</strong>? This will remove it from the learning catalogue.
            </p>
            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl bg-[#F8F6F0] hover:bg-[#EAE7DF] text-[#728078] text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteItem}
                className="px-5 py-2 rounded-xl bg-[#B25D48] hover:bg-[#994734] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
