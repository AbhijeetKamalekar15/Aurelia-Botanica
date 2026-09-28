import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit3, Trash2, Check, X, AlertTriangle, Eye } from 'lucide-react';
import { Product, Category } from '../../types';
import { productService, categoryService } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    shortDescription: '',
    description: '',
    price: 95,
    discountPrice: undefined,
    sku: '',
    categoryId: '',
    stockQuantity: 25,
    minStockThreshold: 5,
    tags: ['Boutique'],
    featured: false,
    newArrival: true,
    active: true,
    images: ['/src/assets/images/product_rose_face_elixir_1790592668403.jpg'],
  });

  const { showToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        productService.getAllForAdmin(),
        categoryService.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      shortDescription: '',
      description: '',
      price: 95,
      discountPrice: undefined,
      sku: 'AUR-SKU-' + Math.floor(1000 + Math.random() * 9000),
      categoryId: categories[0]?.id || 'cat-1',
      stockQuantity: 20,
      minStockThreshold: 5,
      tags: ['Bestseller'],
      featured: false,
      newArrival: true,
      active: true,
      images: ['/src/assets/images/product_rose_face_elixir_1790592668403.jpg'],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.sku?.trim()) {
      showToast('Please specify product name and SKU.', 'error');
      return;
    }

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formData);
        showToast('Product updated successfully.', 'success');
      } else {
        await productService.createProduct(formData);
        showToast('New product created.', 'success');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await productService.deleteProduct(id);
      showToast('Product deleted.', 'info');
      setDeleteConfirmId(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  };

  const handleQuickStockUpdate = async (id: string, delta: number) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    const newQty = Math.max(0, prod.stockQuantity + delta);
    await productService.updateStock(id, newQty);
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stockQuantity: newQty } : p)));
    showToast(`Stock updated for ${prod.name}`, 'info');
  };

  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== 'all' && p.categoryId !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-[#261E1E]">Product Catalog</h2>
          <p className="text-xs text-zinc-500">Manage formulations, pricing, inventory stock, and visibility.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#4A1525] hover:bg-[#360D19] text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4 text-[#C5A059]" />
          <span>Add Formulation</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-lg border border-[#261E1E]/8 text-xs">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU..."
            className="w-full bg-[#FBF9F5] border border-[#261E1E]/15 rounded px-3 py-2 pl-8 focus:outline-none focus:border-[#4A1525]"
          />
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#FBF9F5] border border-[#261E1E]/15 rounded px-3 py-2 text-xs focus:outline-none"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-[#261E1E]/8 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF9F5] text-zinc-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Formulation</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Price</th>
                <th className="py-3 px-4 font-semibold">Stock Quantity</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#261E1E]/5">
              {filteredProducts.map((p) => {
                const isLowStock = p.stockQuantity <= p.minStockThreshold;
                return (
                  <tr key={p.id} className="hover:bg-[#FBF9F5]/70 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={p.images[0] || '/src/assets/images/product_rose_face_elixir_1790592668403.jpg'}
                        alt={p.name}
                        className="w-12 h-12 rounded object-cover bg-[#F6F2EB] shrink-0"
                      />
                      <div>
                        <span className="font-semibold text-[#261E1E] block font-serif-luxury text-sm">
                          {p.name}
                        </span>
                        <span className="font-mono text-[10px] text-zinc-400">SKU: {p.sku}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-zinc-600">{p.categoryName}</td>

                    <td className="py-3 px-4 font-bold tabular-nums">
                      {p.discountPrice ? (
                        <div>
                          <span className="text-[#4A1525]">${p.discountPrice.toFixed(2)}</span>
                          <span className="text-[10px] text-zinc-400 line-through ml-1.5">
                            ${p.price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span>${p.price.toFixed(2)}</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuickStockUpdate(p.id, -1)}
                          className="w-5 h-5 bg-zinc-100 hover:bg-zinc-200 rounded flex items-center justify-center font-bold text-zinc-700"
                        >
                          -
                        </button>
                        <span
                          className={`font-bold tabular-nums px-2 py-0.5 rounded text-xs ${
                            p.stockQuantity === 0
                              ? 'bg-rose-100 text-rose-800'
                              : isLowStock
                              ? 'bg-amber-100 text-amber-800'
                              : 'text-[#261E1E]'
                          }`}
                        >
                          {p.stockQuantity}
                        </span>
                        <button
                          onClick={() => handleQuickStockUpdate(p.id, 1)}
                          className="w-5 h-5 bg-zinc-100 hover:bg-zinc-200 rounded flex items-center justify-center font-bold text-zinc-700"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          p.active ? 'bg-emerald-50 text-emerald-800' : 'bg-zinc-100 text-zinc-500'
                        }`}
                      >
                        {p.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-zinc-500 hover:text-[#4A1525] transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 text-zinc-500 hover:text-rose-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#261E1E]/10">
                <h3 className="font-serif-luxury text-xl font-bold text-[#261E1E]">
                  {editingProduct ? 'Edit Formulation' : 'New Atelier Formulation'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 text-zinc-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-[#261E1E] block mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Immortelle Botanical Elixir"
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#261E1E] block mb-1">SKU Reference *</label>
                    <input
                      type="text"
                      required
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-semibold text-[#261E1E] block mb-1">Category</label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-[#261E1E] block mb-1">Price ($) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#261E1E] block mb-1">Discount Price ($)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.discountPrice || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountPrice: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      placeholder="Optional"
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-[#261E1E] block mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#261E1E] block mb-1">Min Stock Threshold</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.minStockThreshold}
                      onChange={(e) => setFormData({ ...formData, minStockThreshold: Number(e.target.value) })}
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[#261E1E] block mb-1">Short Summary</label>
                  <input
                    type="text"
                    value={formData.shortDescription || ''}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Brief 1-sentence botanical descriptor..."
                    className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#261E1E] block mb-1">Full Description</label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="accent-[#4A1525]"
                    />
                    <span>Featured on Homepage</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.newArrival}
                      onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                      className="accent-[#4A1525]"
                    />
                    <span>New Arrival</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="accent-[#4A1525]"
                    />
                    <span>Active for Sale</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 font-semibold text-zinc-600 hover:bg-zinc-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 font-semibold bg-[#4A1525] hover:bg-[#360D19] text-white rounded"
                  >
                    Save Formulation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM DIALOG */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setDeleteConfirmId(null)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
              <h3 className="font-serif-luxury text-lg font-bold text-[#261E1E]">Confirm Deletion</h3>
              <p className="text-xs text-zinc-500">
                Are you sure you wish to permanently delete this formulation from the dispensary?
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 text-xs font-semibold bg-rose-700 hover:bg-rose-800 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
