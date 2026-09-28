import React, { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, MessageSquare } from 'lucide-react';
import { Review } from '../../types';
import { reviewService } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewService.getAllForAdmin();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleToggleApproval = async (id: string) => {
    try {
      const updated = await reviewService.toggleApproval(id);
      setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
      showToast(`Review ${updated.approved ? 'approved' : 'hidden'}.`, 'info');
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this review?')) return;
    try {
      await reviewService.deleteReview(id);
      showToast('Review deleted.', 'info');
      loadReviews();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete review', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif-luxury text-2xl font-bold text-[#261E1E]">Review Moderation</h2>
        <p className="text-xs text-zinc-500">Curate and verify customer feedback submitted across products.</p>
      </div>

      <div className="bg-white rounded-xl border border-[#261E1E]/8 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF9F5] text-zinc-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Patron</th>
                <th className="py-3 px-4 font-semibold">Rating</th>
                <th className="py-3 px-4 font-semibold">Title & Feedback</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#261E1E]/5">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-[#FBF9F5]/70 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#261E1E] block">{r.userName}</span>
                    <span className="text-[10px] text-zinc-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex text-amber-600">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-current' : 'text-zinc-200'}`}
                        />
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-4 max-w-md">
                    <span className="font-bold text-[#261E1E] block">{r.title}</span>
                    <p className="text-zinc-600 text-xs mt-0.5 leading-relaxed">{r.comment}</p>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        r.approved ? 'bg-emerald-50 text-emerald-800' : 'bg-zinc-100 text-zinc-500'
                      }`}
                    >
                      {r.approved ? 'Approved & Visible' : 'Hidden'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleApproval(r.id)}
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          r.approved
                            ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {r.approved ? 'Hide' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1 text-zinc-400 hover:text-rose-600"
                        title="Delete review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
