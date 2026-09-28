import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Package,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { DashboardStats, Order, OrderStatus } from '../../types';
import { adminService, orderService } from '../../services/api';

interface AdminDashboardProps {
  onNavigateToOrders: () => void;
  onNavigateToInventory: () => void;
  onNavigateToProducts: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateToOrders,
  onNavigateToInventory,
  onNavigateToProducts,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [st, ords] = await Promise.all([
          adminService.getDashboardStats(),
          orderService.getAllForAdmin(),
        ]);
        setStats(st);
        setRecentOrders(ords.slice(0, 5));
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Gross Cash Collected',
      value: `$${stats.totalSales.toFixed(2)}`,
      subtext: 'Delivered COD orders',
      icon: DollarSign,
      color: 'text-emerald-700 bg-emerald-50',
    },
    {
      title: 'Total Consignments',
      value: stats.totalOrders.toString(),
      subtext: 'All-time COD orders',
      icon: ShoppingBag,
      color: 'text-[#4A1525] bg-[#F8EBEF]',
    },
    {
      title: 'Pending Fulfillment',
      value: stats.pendingOrders.toString(),
      subtext: 'Awaiting packing/dispatch',
      icon: Clock,
      color: 'text-amber-700 bg-amber-50',
    },
    {
      title: 'Low Stock Alerts',
      value: stats.lowStockProductsCount.toString(),
      subtext: 'Below minimum batch threshold',
      icon: AlertTriangle,
      color: 'text-rose-700 bg-rose-50',
      action: onNavigateToInventory,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#C5A059] block">
            Executive Summary
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#261E1E]">
            Atelier Operations & Fulfillment
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time status of small-batch shipments and cash collections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToProducts}
            className="px-4 py-2 bg-[#4A1525] text-white text-xs font-semibold rounded hover:bg-[#360D19] transition-colors"
          >
            + New Formulation
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={card.action}
              className={`p-5 bg-white rounded-xl border border-[#261E1E]/8 shadow-xs flex items-center justify-between transition-all ${
                card.action ? 'cursor-pointer hover:border-[#4A1525]' : ''
              }`}
            >
              <div>
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                  {card.title}
                </span>
                <span className="text-2xl font-bold text-[#261E1E] tabular-nums block">
                  {card.value}
                </span>
                <span className="text-[11px] text-zinc-500 mt-1 block">{card.subtext}</span>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Analytics Grid: Sales Chart + Order Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sales Over Time Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-[#261E1E]/8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#261E1E]/8">
            <div>
              <h3 className="font-serif-luxury text-base font-bold text-[#261E1E]">
                Cash Inflow Velocity (Monthly)
              </h3>
              <span className="text-xs text-zinc-500">Collected via verified Cash on Delivery handovers</span>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-700" />
          </div>

          {/* Simple Responsive SVG Chart */}
          <div className="h-60 w-full flex items-end justify-between gap-4 pt-8 px-2">
            {Object.entries(stats.monthlySales).map(([month, val]) => {
              const maxVal = 8000;
              const heightPct = Math.min(100, Math.max(15, (val / maxVal) * 100));
              return (
                <div key={month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-bold text-[#4A1525] tabular-nums">${val}</span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full max-w-[42px] bg-gradient-to-t from-[#4A1525] to-[#C77D8D] rounded-t-md transition-all duration-500 hover:brightness-110"
                  />
                  <span className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
                    {month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Status Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-[#261E1E]/8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#261E1E]/8">
            <h3 className="font-serif-luxury text-base font-bold text-[#261E1E]">
              Consignment Pipeline
            </h3>
            <span className="text-xs text-zinc-400 font-mono">Fulfillment Statuses</span>
          </div>

          <div className="space-y-3 text-xs">
            {Object.entries(stats.orderStatusDistribution).map(([status, count]) => {
              const pct = Math.round((count / Math.max(1, stats.totalOrders)) * 100);
              return (
                <div key={status} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-[#261E1E] capitalize">
                      {status.replace(/_/g, ' ').toLowerCase()}
                    </span>
                    <span className="font-bold tabular-nums text-zinc-700">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full rounded-full ${
                        status === 'DELIVERED'
                          ? 'bg-emerald-600'
                          : status === 'CANCELLED'
                          ? 'bg-rose-500'
                          : status === 'PENDING'
                          ? 'bg-amber-500'
                          : 'bg-[#4A1525]'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#261E1E]/8">
            <button
              onClick={onNavigateToOrders}
              className="w-full py-2 bg-[#FBF9F5] hover:bg-[#F8EBEF] text-[#4A1525] text-xs font-semibold rounded transition-colors text-center"
            >
              Manage All Consignments →
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-xl border border-[#261E1E]/8 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#261E1E]/8">
          <div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#261E1E]">Recent Consignments</h3>
            <p className="text-xs text-zinc-500">Latest customer orders scheduled for Cash on Delivery.</p>
          </div>
          <button
            onClick={onNavigateToOrders}
            className="text-xs text-[#4A1525] font-semibold hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF9F5] text-zinc-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Reference</th>
                <th className="py-2.5 px-4 font-semibold">Patron</th>
                <th className="py-2.5 px-4 font-semibold">Destination</th>
                <th className="py-2.5 px-4 font-semibold">Total (COD)</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#261E1E]/5">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#FBF9F5] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#261E1E]">{ord.orderNumber}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#261E1E] block">{ord.customerName}</span>
                    <span className="text-[10px] text-zinc-400">{ord.customerEmail}</span>
                  </td>
                  <td className="py-3 px-4 text-zinc-600 truncate max-w-xs">
                    {ord.shippingAddress.city}, {ord.shippingAddress.country}
                  </td>
                  <td className="py-3 px-4 font-bold tabular-nums text-[#4A1525]">
                    ${ord.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-zinc-100 text-zinc-800">
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-400">
                    {new Date(ord.createdAt).toLocaleDateString()}
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
