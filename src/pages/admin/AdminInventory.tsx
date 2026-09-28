import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Package, Search, Plus, Minus, ArrowUpDown } from 'lucide-react';
import { Product } from '../../types';
import { productService } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminInventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const { showToast } = useToast();

  const loadInventory = async () => {
    setLoading(true);
    try {
      const data = await productService.getAllForAdmin();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleStockUpdate = async (id: string, newQty: number) => {
    const qty = Math.max(0, newQty);
    await productService.updateStock(id, qty);
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stockQuantity: qty } : p)));
    showToast('Stock inventory updated.', 'info');
  };

  const lowStockCount = products.filter(
    (p) => p.stockQuantity <= p.minStockThreshold && p.stockQuantity > 0
  ).length;
  const outOfStockCount = products.filter((p) => p.stockQuantity === 0).length;

  const filtered = products.filter((p) => {
    if (stockFilter === 'low') {
      if (p.stockQuantity > p.minStockThreshold || p.stockQuantity === 0) return false;
    }
    if (stockFilter === 'out') {
      if (p.stockQuantity !== 0) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif-luxury text-2xl font-bold text-[#261E1E]">Atelier Inventory Matrix</h2>
        <p className="text-xs text-zinc-500">Monitor batch stocks and manage low-inventory replenishment alerts.</p>
      </div>

      {/* Alert Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div
          onClick={() => setStockFilter('all')}
          className={`p-4 rounded-xl border cursor-pointer transition-colors ${
            stockFilter === 'all' ? 'border-[#4A1525] bg-white shadow-xs' : 'border-[#261E1E]/10 bg-white'
          }`}
        >
          <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Total Dispensary Items</span>
          <span className="text-2xl font-bold text-[#261E1E] tabular-nums mt-1 block">{products.length}</span>
        </div>

        <div
          onClick={() => setStockFilter('low')}
          className={`p-4 rounded-xl border cursor-pointer transition-colors ${
            stockFilter === 'low' ? 'border-amber-600 bg-amber-50/50 shadow-xs' : 'border-amber-200 bg-amber-50/20'
          }`}
        >
          <div className="flex items-center gap-1.5 text-amber-800">
            <AlertTriangle className="w-4 h-4" />
            <span className="uppercase tracking-wider text-[10px] font-bold">Low Stock Warning</span>
          </div>
          <span className="text-2xl font-bold text-amber-900 tabular-nums mt-1 block">{lowStockCount} items</span>
        </div>

        <div
          onClick={() => setStockFilter('out')}
          className={`p-4 rounded-xl border cursor-pointer transition-colors ${
            stockFilter === 'out' ? 'border-rose-600 bg-rose-50/50 shadow-xs' : 'border-rose-200 bg-rose-50/20'
          }`}
        >
          <div className="flex items-center gap-1.5 text-rose-800">
            <Package className="w-4 h-4" />
            <span className="uppercase tracking-wider text-[10px] font-bold">Sold Out / Depleted</span>
          </div>
          <span className="text-2xl font-bold text-rose-900 tabular-nums mt-1 block">{outOfStockCount} items</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex gap-3 bg-white p-3 rounded-lg border border-[#261E1E]/8 text-xs">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by formulation or SKU..."
            className="w-full bg-[#FBF9F5] border border-[#261E1E]/15 rounded px-3 py-2 pl-8 focus:outline-none focus:border-[#4A1525]"
          />
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-[#261E1E]/8 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF9F5] text-zinc-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Formulation</th>
                <th className="py-3 px-4 font-semibold">SKU</th>
                <th className="py-3 px-4 font-semibold">Threshold</th>
                <th className="py-3 px-4 font-semibold">Current Stock</th>
                <th className="py-3 px-4 font-semibold">Inventory Status</th>
                <th className="py-3 px-4 font-semibold text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#261E1E]/5">
              {filtered.map((p) => {
                const isOut = p.stockQuantity === 0;
                const isLow = p.stockQuantity <= p.minStockThreshold && !isOut;

                return (
                  <tr key={p.id} className="hover:bg-[#FBF9F5]/70 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={p.images[0] || '/src/assets/images/product_rose_face_elixir_1790592668403.jpg'}
                        alt={p.name}
                        className="w-10 h-10 rounded object-cover bg-zinc-100 shrink-0"
                      />
                      <span className="font-semibold text-[#261E1E] font-serif-luxury text-sm">{p.name}</span>
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-500">{p.sku}</td>

                    <td className="py-3 px-4 text-zinc-500 font-mono">{p.minStockThreshold} units</td>

                    <td className="py-3 px-4">
                      <span className="text-sm font-bold tabular-nums text-[#261E1E]">{p.stockQuantity}</span>
                    </td>

                    <td className="py-3 px-4">
                      {isOut ? (
                        <span className="text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          Low Stock Alert
                        </span>
                      ) : (
                        <span className="text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          In Stock
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleStockUpdate(p.id, p.stockQuantity - 5)}
                          className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 rounded font-semibold text-zinc-700"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleStockUpdate(p.id, p.stockQuantity - 1)}
                          className="w-6 h-6 bg-zinc-100 hover:bg-zinc-200 rounded flex items-center justify-center font-bold text-zinc-700"
                        >
                          -
                        </button>
                        <button
                          onClick={() => handleStockUpdate(p.id, p.stockQuantity + 1)}
                          className="w-6 h-6 bg-zinc-100 hover:bg-zinc-200 rounded flex items-center justify-center font-bold text-zinc-700"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleStockUpdate(p.id, p.stockQuantity + 10)}
                          className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 rounded font-semibold text-zinc-700"
                        >
                          +10
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
    </div>
  );
};
