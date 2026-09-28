import React, { useState, useEffect } from 'react';
import { Package, Clock, ShieldCheck, CheckCircle2, AlertCircle, RotateCcw, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { orderService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface OrdersPageProps {
  onContinueShopping: () => void;
  selectedOrderId?: string;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onContinueShopping, selectedOrderId }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(selectedOrderId || null);

  // Cancellation and Return modal state
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('Change of plans');
  const [returnModalOrder, setReturnModalOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState('Product damaged during transit');

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const userId = currentUser?.id || 'usr-customer';
        const userOrders = await orderService.getUserOrders(userId);
        setOrders(userOrders);
        if (selectedOrderId) {
          setExpandedOrderId(selectedOrderId);
        } else if (userOrders.length > 0) {
          setExpandedOrderId(userOrders[0].id);
        }
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [currentUser, selectedOrderId]);

  const handleCancelOrder = async () => {
    if (!cancelModalOrder || !currentUser) return;
    try {
      const updated = await orderService.cancelOrderByCustomer(
        cancelModalOrder.id,
        currentUser.id,
        cancelReason
      );
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setCancelModalOrder(null);
      showToast('Order has been cancelled and inventory restored.', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel order', 'error');
    }
  };

  const handleRequestReturn = async () => {
    if (!returnModalOrder || !currentUser) return;
    try {
      const updated = await orderService.requestReturn(
        returnModalOrder.id,
        currentUser.id,
        returnReason
      );
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setReturnModalOrder(null);
      showToast('Return request submitted for boutique review.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to request return', 'error');
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded text-xs font-semibold">Delivered</span>;
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return <span className="text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded text-xs font-semibold">In Transit</span>;
      case 'PROCESSING':
      case 'CONFIRMED':
        return <span className="text-amber-800 bg-amber-50 px-2.5 py-1 rounded text-xs font-semibold">Preparing</span>;
      case 'CANCELLED':
        return <span className="text-rose-800 bg-rose-50 px-2.5 py-1 rounded text-xs font-semibold">Cancelled</span>;
      case 'RETURN_REQUESTED':
      case 'RETURNED':
        return <span className="text-purple-800 bg-purple-50 px-2.5 py-1 rounded text-xs font-semibold">Return Active</span>;
      default:
        return <span className="text-zinc-800 bg-zinc-100 px-2.5 py-1 rounded text-xs font-semibold">Pending Confirmation</span>;
    }
  };

  const statusPipeline: OrderStatus[] = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      <div className="border-b border-[#261E1E]/10 pb-4">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
          Apothecary Consignments
        </span>
        <h1 className="font-serif-luxury text-3xl font-bold text-[#261E1E]">Order Tracking & History</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Real-time visibility for all your Cash on Delivery shipments.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-44 bg-zinc-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-[#261E1E]/10 space-y-4">
          <Package className="w-12 h-12 text-zinc-400 mx-auto" />
          <h3 className="font-serif-luxury text-xl font-bold text-[#261E1E]">No Orders Found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            You have not placed any Cash on Delivery orders with our atelier yet.
          </p>
          <button
            onClick={onContinueShopping}
            className="px-6 py-2.5 bg-[#4A1525] text-white text-xs font-semibold rounded hover:bg-[#360D19]"
          >
            Explore Collections
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const currentIndex = statusPipeline.indexOf(order.status);
            const canCancel = ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status);
            const canReturn = order.status === 'DELIVERED';

            return (
              <div
                key={order.id}
                className="bg-white border border-[#261E1E]/10 rounded-2xl shadow-xs overflow-hidden transition-all"
              >
                {/* Order Summary Bar */}
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#FBF9F5] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-[#261E1E]">
                        #{order.orderNumber}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <span className="text-xs text-zinc-500 block">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item(s)
                    </span>
                  </div>

                  <div className="flex items-center gap-6 sm:gap-8 justify-between sm:justify-end">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                        Payment (COD)
                      </span>
                      <span className="text-base font-bold text-[#4A1525] tabular-nums">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="p-2 text-zinc-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details and Timeline */}
                {isExpanded && (
                  <div className="p-6 border-t border-[#261E1E]/10 bg-[#FBF9F5]/40 space-y-8">
                    {/* Visual Status Progression Tracker */}
                    {order.status !== 'CANCELLED' && order.status !== 'RETURN_REQUESTED' && order.status !== 'RETURNED' && (
                      <div className="py-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-4">
                          Shipment Progression
                        </span>
                        <div className="grid grid-cols-6 gap-1 sm:gap-2">
                          {statusPipeline.map((st, idx) => {
                            const isPassed = currentIndex >= idx;
                            const isCurrent = currentIndex === idx;
                            return (
                              <div key={st} className="flex flex-col items-center text-center">
                                <div
                                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                    isPassed
                                      ? 'bg-[#4A1525] text-white shadow-xs'
                                      : 'bg-zinc-200 text-zinc-400'
                                  } ${isCurrent ? 'ring-4 ring-[#DDA5B0]' : ''}`}
                                >
                                  {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                                </div>
                                <span className="text-[10px] sm:text-[11px] mt-2 font-medium capitalize text-zinc-600 line-clamp-1">
                                  {st.replace(/_/g, ' ').toLowerCase()}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Timeline Log */}
                    <div className="space-y-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block">
                        Consignment Event Timeline
                      </span>
                      <div className="space-y-3 pl-2 border-l-2 border-[#4A1525]/30">
                        {order.statusHistory.map((hist, i) => (
                          <div key={i} className="relative pl-4 space-y-0.5">
                            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#4A1525]" />
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#261E1E]">
                                {hist.status.replace(/_/g, ' ')}
                              </span>
                              <span className="text-[10px] text-zinc-400">
                                {new Date(hist.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-600 leading-relaxed">{hist.note}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Item list */}
                    <div className="space-y-3 pt-4 border-t border-[#261E1E]/10">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block">
                        Ordered Items
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {order.items.map((item) => (
                          <div
                            key={item.productId}
                            className="p-3 bg-white border border-[#261E1E]/8 rounded-lg flex items-center gap-3"
                          >
                            <img
                              src={item.imageUrl || '/src/assets/images/product_rose_face_elixir_1790592668403.jpg'}
                              alt={item.productName}
                              className="w-12 h-12 rounded object-cover bg-[#F6F2EB] shrink-0"
                            />
                            <div className="flex-1 text-xs">
                              <h4 className="font-semibold text-[#261E1E] line-clamp-1">{item.productName}</h4>
                              <span className="text-zinc-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</span>
                            </div>
                            <span className="text-xs font-bold tabular-nums text-[#4A1525]">
                              ${item.total.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* COD & Address Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#261E1E]/10 text-xs">
                      <div className="p-3.5 bg-white border border-[#261E1E]/8 rounded-lg space-y-1">
                        <span className="font-bold text-[#4A1525] uppercase tracking-wider text-[10px] block">
                          Delivery Destination
                        </span>
                        <p className="font-semibold text-[#261E1E]">{order.customerName}</p>
                        <p className="text-zinc-600">{order.shippingAddress.houseFlat}, {order.shippingAddress.street}</p>
                        <p className="text-zinc-600">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                        <p className="text-zinc-500">Phone: {order.customerPhone}</p>
                      </div>

                      <div className="p-3.5 bg-[#F8EBEF] border border-[#C77D8D]/30 rounded-lg space-y-1">
                        <span className="font-bold text-[#4A1525] uppercase tracking-wider text-[10px] block flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>Cash on Delivery Settlement</span>
                        </span>
                        <p className="text-xs text-[#3D3131]">
                          Total Due: <strong className="text-[#4A1525]">${order.totalAmount.toFixed(2)}</strong>
                        </p>
                        <p className="text-[11px] text-zinc-600">
                          {order.status === 'DELIVERED'
                            ? 'Cash successfully collected by courier upon physical delivery.'
                            : 'To be paid in cash to the delivery representative upon parcel handover.'}
                        </p>
                      </div>
                    </div>

                    {/* Cancellation & Return Actions */}
                    <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
                      {canCancel && (
                        <button
                          onClick={() => setCancelModalOrder(order)}
                          className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold rounded transition-colors"
                        >
                          Cancel Order
                        </button>
                      )}
                      {canReturn && (
                        <button
                          onClick={() => setReturnModalOrder(order)}
                          className="px-4 py-2 border border-[#4A1525] text-[#4A1525] hover:bg-[#F8EBEF] text-xs font-semibold rounded transition-colors"
                        >
                          Request Return / Refund
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CANCEL ORDER MODAL */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setCancelModalOrder(null)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
              <h3 className="font-serif-luxury text-xl font-bold text-[#261E1E]">Cancel Order</h3>
              <p className="text-xs text-zinc-500">
                Are you sure you wish to cancel order #{cancelModalOrder.orderNumber}? Product inventory will be restored to our shelves.
              </p>

              <div>
                <label className="text-xs font-semibold text-[#261E1E] block mb-1">Reason for Cancellation</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/20 rounded p-2.5"
                >
                  <option value="Change of plans">Change of plans</option>
                  <option value="Found alternative formulation">Found alternative formulation</option>
                  <option value="Incorrect shipping address entered">Incorrect shipping address entered</option>
                  <option value="Prefer different delivery date">Prefer different delivery date</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  onClick={() => setCancelModalOrder(null)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="px-4 py-2 text-xs font-semibold bg-rose-700 hover:bg-rose-800 text-white rounded"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RETURN REQUEST MODAL */}
      {returnModalOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setReturnModalOrder(null)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
              <h3 className="font-serif-luxury text-xl font-bold text-[#261E1E]">Request Return</h3>
              <p className="text-xs text-zinc-500">
                For Cash on Delivery orders, refunds are coordinated directly with our concierge team after the package is inspected.
              </p>

              <div>
                <label className="text-xs font-semibold text-[#261E1E] block mb-1">Reason for Return</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/20 rounded p-2.5"
                >
                  <option value="Outer wax seal compromised during transit">Outer wax seal compromised during transit</option>
                  <option value="Bottle or vessel damaged">Bottle or vessel damaged</option>
                  <option value="Skin sensitivity to botanical notes">Skin sensitivity to botanical notes</option>
                  <option value="Incorrect remedy variant received">Incorrect remedy variant received</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  onClick={() => setReturnModalOrder(null)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestReturn}
                  className="px-4 py-2 text-xs font-semibold bg-[#4A1525] hover:bg-[#360D19] text-white rounded"
                >
                  Submit Return Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
