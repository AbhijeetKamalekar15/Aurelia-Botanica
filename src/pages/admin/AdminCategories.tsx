import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Layers } from 'lucide-react';
import { Category } from '../../types';
import { categoryService } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    description: '',
    imageUrl: '/src/assets/images/product_rose_face_elixir_1790592668403.jpg',
    active: true,
  });

  const { showToast } = useToast();

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAllForAdmin();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      imageUrl: '/src/assets/images/product_rose_face_elixir_1790592668403.jpg',
      active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setFormData({ ...c });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      showToast('Please provide a category name.', 'error');
      return;
    }
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, formData);
        showToast('Category updated.', 'success');
      } else {
        await categoryService.createCategory(formData);
        showToast('Category created.', 'success');
      }
      setModalOpen(false);
      loadCategories();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoryService.deleteCategory(id);
      showToast('Category deleted.', 'info');
      loadCategories();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-[#261E1E]">Product Disciplines & Categories</h2>
          <p className="text-xs text-zinc-500">Organize and display formulations across the storefront.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#4A1525] hover:bg-[#360D19] text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4 text-[#C5A059]" />
          <span>New Discipline</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl border border-[#261E1E]/8 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div className="aspect-[16/9] bg-[#F6F2EB] relative overflow-hidden">
              <img
                src={c.imageUrl}
                alt={c.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-white/90 text-[#4A1525] shadow-xs">
                {c.productCount || 0} Products
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-serif-luxury text-base font-bold text-[#261E1E]">{c.name}</h3>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{c.description}</p>
              </div>

              <div className="pt-3 border-t border-[#261E1E]/5 flex items-center justify-between text-xs">
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider ${
                    c.active ? 'text-emerald-700' : 'text-zinc-400'
                  }`}
                >
                  {c.active ? 'Active' : 'Disabled'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1 text-zinc-500 hover:text-[#4A1525]"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1 text-zinc-500 hover:text-rose-600"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#261E1E]/10">
                <h3 className="font-serif-luxury text-xl font-bold text-[#261E1E]">
                  {editingCategory ? 'Edit Category' : 'Create Category'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="p-1 text-zinc-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-[#261E1E] block mb-1">Discipline Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rare Resins"
                    className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#261E1E] block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Category storytelling..."
                    className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#261E1E] block mb-1">Image URL</label>
                  <input
                    type="text"
                    value={formData.imageUrl || ''}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded text-[11px]"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="accent-[#4A1525]"
                  />
                  <span>Active & Visible in Boutique Navigation</span>
                </label>

                <div className="flex justify-end gap-3 pt-3 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 font-semibold text-zinc-600 hover:bg-zinc-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-semibold bg-[#4A1525] hover:bg-[#360D19] text-white rounded"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
