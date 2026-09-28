import React, { useState, useEffect } from 'react';
import { Search, Eye, Filter, CheckCircle2, Clock, AlertCircle, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { orderService } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Selected Order Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('CONFIRMED');
  const [statusNote, setStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const { showToast } = useToast();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAllForAdmin();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleOpenOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNote('');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
      const updated = await orderService.updateOrderStatus(
        selectedOrder.id,
        newStatus,
        statusNote.trim() || undefined
      );
      setSelectedOrder(updated);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      showToast(`Order status transitioned to ${newStatus}.`, 'success');
      setStatusNote('');
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return true;
  });

  const allStatuses: OrderStatus[] = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
    'RETURN_REQUESTED',
    'RETURNED',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-[#261E1E]">Consignment Fulfillment</h2>
          <p className="text-xs text-zinc-500">
            Manage dispatch states, courier tracking notes, and Cash on Delivery collections.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-lg border border-[#261E1E]/8 text-xs">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, patron name, or email..."
            className="w-full bg-[#FBF9F5] border border-[#261E1E]/15 rounded px-3 py-2 pl-8 focus:outline-none focus:border-[#4A1525]"
          />
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#FBF9F5] border border-[#261E1E]/15 rounded px-3 py-2 text-xs focus:outline-none"
        >
          <option value="all">All Statuses ({orders.length})</option>
          {allStatuses.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-[#261E1E]/8 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF9F5] text-zinc-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Order Ref</th>
                <th className="py-3 px-4 font-semibold">Patron Details</th>
                <th className="py-3 px-4 font-semibold">Destination</th>
                <th className="py-3 px-4 font-semibold">Items</th>
                <th className="py-3 px-4 font-semibold">Amount (COD)</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#261E1E]/5">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#FBF9F5]/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#261E1E]">#{ord.orderNumber}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#261E1E] block">{ord.customerName}</span>
                    <span className="text-[10px] text-zinc-500">{ord.customerPhone}</span>
                  </td>
                  <td className="py-3 px-4 text-zinc-600 truncate max-w-xs">
                    {ord.shippingAddress.city}, {ord.shippingAddress.country}
                  </td>
                  <td className="py-3 px-4 font-medium">{ord.items.length} item(s)</td>
                  <td className="py-3 px-4 font-bold tabular-nums text-[#4A1525]">
                    ${ord.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        ord.status === 'DELIVERED'
                          ? 'bg-emerald-50 text-emerald-800'
                          : ord.status === 'CANCELLED'
                          ? 'bg-rose-50 text-rose-800'
                          : ord.status === 'SHIPPED'
                          ? 'bg-indigo-50 text-indigo-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenOrderDetails(ord)}
                      className="px-3 py-1 bg-[#FBF9F5] hover:bg-[#F8EBEF] text-[#4A1525] font-semibold rounded border border-[#261E1E]/10 transition-colors flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Manage</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS & STATUS UPDATE MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setSelectedOrder(null)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#261E1E]/10">
                <div>
                  <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider block">
                    Fulfillment Dossier
                  </span>
                  <h3 className="font-serif-luxury text-xl font-bold text-[#261E1E]">
                    Consignment #{selectedOrder.orderNumber}
                  </h3>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-1 text-zinc-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Updater Card */}
              <form onSubmit={handleUpdateStatus} className="p-4 bg-[#F8EBEF] rounded-xl border border-[#C77D8D]/30 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A1525] block">
                  Update Consignment Status
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 block mb-1">New Status</label>
                    <select
                      value={newStatus}
                      onChange={(e: any) => setNewStatus(e.target.value)}
                      className="w-full text-xs bg-white border border-[#261E1E]/20 rounded p-2"
                    >
                      {allStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 block mb-1">Courier / Timeline Note</label>
                    <input
                      type="text"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="e.g. Dispatched with Courier #481"
                      className="w-full text-xs bg-white border border-[#261E1E]/20 rounded p-2"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={updatingStatus}
                    className="px-5 py-2 bg-[#4A1525] hover:bg-[#360D19] text-white text-xs font-semibold rounded transition-colors"
                  >
                    {updatingStatus ? 'Updating...' : 'Publish Status Transition'}
                  </button>
                </div>
              </form>

              {/* Items & Address details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                {/* Destination */}
                <div className="space-y-1 p-4 bg-[#FBF9F5] rounded-xl">
                  <span className="font-bold uppercase tracking-wider text-[#4A1525] text-[10px] block mb-1">
                    Patron & Destination
                  </span>
                  <p className="font-semibold text-[#261E1E]">{selectedOrder.customerName}</p>
                  <p className="text-zinc-600">{selectedOrder.customerEmail}</p>
                  <p className="text-zinc-600">Tel: {selectedOrder.customerPhone}</p>
                  <p className="pt-2 text-zinc-700">
                    {selectedOrder.shippingAddress.houseFlat}, {selectedOrder.shippingAddress.street}
                  </p>
                  <p className="text-zinc-700">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.pincode}
                  </p>
                  <p className="text-zinc-700">{selectedOrder.shippingAddress.country}</p>
                </div>

                {/* Financials */}
                <div className="space-y-2 p-4 bg-[#FBF9F5] rounded-xl">
                  <span className="font-bold uppercase tracking-wider text-[#4A1525] text-[10px] block mb-1">
                    Payment Collection (Cash on Delivery)
                  </span>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Subtotal:</span>
                    <span className="font-semibold tabular-nums">${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-800">
                      <span>Discount ({selectedOrder.couponCode}):</span>
                      <span className="font-semibold tabular-nums">-${selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Delivery Fee:</span>
                    <span className="font-semibold tabular-nums">
                      {selectedOrder.shippingFee === 0 ? 'FREE' : `$${selectedOrder.shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#261E1E]/10 flex justify-between font-bold text-sm text-[#4A1525]">
                    <span>Cash to Collect:</span>
                    <span className="tabular-nums">${selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <span className="font-bold uppercase tracking-wider text-zinc-500 text-[11px] block">
                  Consigned Formulations ({selectedOrder.items.length})
                </span>
                <div className="divide-y divide-[#261E1E]/5 max-h-48 overflow-y-auto">
                  {selectedOrder.items.map((it) => (
                    <div key={it.productId} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={it.imageUrl || '/src/assets/images/product_rose_face_elixir_1790592668403.jpg'}
                          alt={it.productName}
                          className="w-10 h-10 rounded object-cover bg-zinc-100"
                        />
                        <div>
                          <span className="font-semibold text-[#261E1E] block">{it.productName}</span>
                          <span className="text-[10px] text-zinc-400 font-mono">SKU: {it.sku}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-zinc-500 block">Qty: {it.quantity}</span>
                        <span className="font-bold tabular-nums text-[#4A1525]">${it.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
