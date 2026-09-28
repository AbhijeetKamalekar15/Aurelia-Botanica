import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Boxes,
  Tag,
  Users,
  MessageSquare,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Shield,
  Bell,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type AdminView =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'orders'
  | 'inventory'
  | 'coupons'
  | 'customers'
  | 'reviews'
  | 'settings';

interface AdminLayoutProps {
  currentView: AdminView;
  onNavigateView: (view: AdminView) => void;
  onExitToStore: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentView,
  onNavigateView,
  onExitToStore,
  children,
}) => {
  const { currentUser, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard & Metrics', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders & Fulfillment', icon: ShoppingBag },
    { id: 'products', label: 'Product Catalog', icon: Package },
    { id: 'inventory', label: 'Inventory & Stock Alerts', icon: Boxes },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'coupons', label: 'Coupons & Discounts', icon: Tag },
    { id: 'customers', label: 'Patron Accounts', icon: Users },
    { id: 'reviews', label: 'Reviews Moderation', icon: MessageSquare },
    { id: 'settings', label: 'Store Settings (COD)', icon: Settings },
  ];

  const handleSelectView = (view: AdminView) => {
    onNavigateView(view);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F6F2EB] flex flex-col md:flex-row text-[#261E1E]">
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#261E1E] text-white shrink-0 border-r border-zinc-800">
        {/* Brand Lockup */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <span className="font-serif-luxury text-xl font-bold tracking-[0.15em] text-[#C5A059] uppercase block">
              Aurelia
            </span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">
              Administration Console
            </span>
          </div>
          <Shield className="w-5 h-5 text-[#C5A059]" />
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectView(item.id as AdminView)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-[#4A1525] text-white font-semibold shadow-xs'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5A059]' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Admin actions */}
        <div className="p-4 border-t border-zinc-800 space-y-2">
          <button
            onClick={onExitToStore}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800/80 rounded transition-colors"
          >
            <span>View Public Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div onClick={() => setMobileSidebarOpen(false)} className="fixed inset-0 bg-black/60" />
          <div className="relative w-64 bg-[#261E1E] text-white flex flex-col h-full z-10">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <span className="font-serif-luxury text-lg font-bold text-[#C5A059] uppercase">
                Aurelia Admin
              </span>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-1 text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectView(item.id as AdminView)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-medium text-left ${
                      isActive ? 'bg-[#4A1525] text-white font-semibold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="p-4 border-t border-zinc-800 space-y-2">
              <button
                onClick={onExitToStore}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-zinc-300"
              >
                <span>View Storefront</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Top Header */}
        <header className="h-16 bg-white border-b border-[#261E1E]/10 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 md:hidden text-zinc-600 hover:text-black"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-mono">Panel:</span>
              <span className="text-xs font-bold text-[#4A1525] uppercase tracking-wider">
                {navigationItems.find((n) => n.id === currentView)?.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#F8EBEF] text-[#4A1525] rounded text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>COD Fulfillment Engine Active</span>
            </div>

            <button
              onClick={onExitToStore}
              className="px-3 py-1.5 bg-[#FBF9F5] border border-[#261E1E]/15 hover:border-[#4A1525] rounded text-xs font-semibold text-[#261E1E] transition-colors flex items-center gap-1.5"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3 h-3 text-[#4A1525]" />
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 text-xs">
              <div className="w-8 h-8 rounded-full bg-[#4A1525] text-white flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div className="hidden lg:block text-left">
                <span className="font-semibold text-[#261E1E] block leading-tight">
                  {currentUser?.name || 'Administrator'}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">ROLE_ADMIN</span>
              </div>
            </div>
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
