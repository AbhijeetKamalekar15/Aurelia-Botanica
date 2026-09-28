import React, { useState, useEffect } from 'react';
import { Plus, Tag, Edit3, Trash2, X, Check } from 'lucide-react';
import { Coupon } from '../../types';
import { couponService } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minOrderValue: 50,
    maxDiscountAmount: undefined,
    usageLimit: 1000,
    active: true,
  });

  const { showToast } = useToast();

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await couponService.getAllForAdmin();
      setCoupons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setFormData({
      code: 'PROMO' + Math.floor(10 + Math.random() * 90),
      description: '',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      minOrderValue: 100,
      usageLimit: 500,
      active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setFormData({ ...c });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code?.trim()) {
      showToast('Please specify a promotional code.', 'error');
      return;
    }
    try {
      if (editingCoupon) {
        await couponService.updateCoupon(editingCoupon.id, formData);
        showToast('Coupon updated.', 'success');
      } else {
        await couponService.createCoupon(formData);
        showToast('New coupon created.', 'success');
      }
      setModalOpen(false);
      loadCoupons();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you wish to delete this coupon?')) return;
    try {
      await couponService.deleteCoupon(id);
      showToast('Coupon deleted.', 'info');
      loadCoupons();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-[#261E1E]">Promotions & Concessions</h2>
          <p className="text-xs text-zinc-500">Configure promotional vouchers for Cash on Delivery checkout deductions.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#4A1525] hover:bg-[#360D19] text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4 text-[#C5A059]" />
          <span>New Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="p-5 bg-white border border-[#261E1E]/8 rounded-xl shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-bold bg-[#F8EBEF] text-[#4A1525] px-2.5 py-1 rounded tracking-wider">
                  {c.code}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    c.active ? 'text-emerald-700' : 'text-zinc-400'
                  }`}
                >
                  {c.active ? 'Active' : 'Disabled'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#261E1E]">
                {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% Off` : `$${c.discountValue} Flat Discount`}
              </h3>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{c.description}</p>
            </div>

            <div className="pt-3 border-t border-[#261E1E]/5 text-xs text-zinc-600 space-y-1">
              <div className="flex justify-between">
                <span>Min Order Value:</span>
                <span className="font-bold tabular-nums">${c.minOrderValue}</span>
              </div>
              <div className="flex justify-between">
                <span>Redemptions:</span>
                <span className="font-bold tabular-nums">
                  {c.timesUsed} / {c.usageLimit}
                </span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="p-1.5 text-zinc-500 hover:text-[#4A1525]"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 text-zinc-500 hover:text-rose-600"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
                  {editingCoupon ? 'Edit Voucher' : 'Create New Voucher'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="p-1 text-zinc-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-[#261E1E] block mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. WELCOME10"
                    className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded uppercase font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#261E1E] block mb-1">Description</label>
                  <input
                    type="text"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="10% off for first-time patrons"
                    className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#261E1E] block mb-1">Discount Type</label>
                    <select
                      value={formData.discountType}
                      onChange={(e: any) => setFormData({ ...formData, discountType: e.target.value })}
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-[#261E1E] block mb-1">Value *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#261E1E] block mb-1">Min Order Value ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.minOrderValue}
                      onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#261E1E] block mb-1">Usage Limit</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="accent-[#4A1525]"
                  />
                  <span>Active & Redeemable at COD Checkout</span>
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
                    className="px-5 py-2 font-semibold bg-[#4A1525] text-white rounded hover:bg-[#360D19]"
                  >
                    Save Coupon
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
