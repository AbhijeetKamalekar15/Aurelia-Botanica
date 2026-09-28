/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider, useCart } from './context/CartContext';
import { Product, Order } from './types';

// Layout & Common Components
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { SearchModal } from './components/common/SearchModal';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { ShopPage } from './pages/customer/ShopPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrderConfirmationPage } from './pages/customer/OrderConfirmationPage';
import { OrdersPage } from './pages/customer/OrdersPage';
import { WishlistPage } from './pages/customer/WishlistPage';
import { AccountPage } from './pages/customer/AccountPage';
import { AuthPages } from './pages/customer/AuthPages';
import {
  AboutPage,
  ContactPage,
  ShippingPolicyPage,
  RefundPolicyPage,
} from './pages/customer/StaticPages';

// Admin Suite Pages
import { AdminLayout, AdminView } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminSettings } from './pages/admin/AdminSettings';

function MainAppContent() {
  const { isAdmin } = useAuth();
  const { setIsDrawerOpen } = useCart();

  // Navigation State
  const [route, setRoute] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [catalogCategory, setCatalogCategory] = useState<string>('all');
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [trackOrderId, setTrackOrderId] = useState<string | undefined>(undefined);

  // Admin View State
  const [adminView, setAdminView] = useState<AdminView>('dashboard');

  const handleNavigate = (newRoute: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setRoute(newRoute);
  };

  const handleSelectProduct = (prod: Product) => {
    setSelectedProduct(prod);
    setRoute('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: Order) => {
    setConfirmedOrder(order);
    setRoute('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackOrderFromConfirmation = (orderId: string) => {
    setTrackOrderId(orderId);
    setRoute('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSelect = (prod: Product) => {
    setSelectedProduct(prod);
    setRoute('product');
  };

  const handleViewAllSearchResults = (query: string) => {
    setCatalogSearch(query);
    setCatalogCategory('all');
    setRoute('shop');
  };

  // If in Admin Mode, render the Admin Shell
  if (route === 'admin') {
    return (
      <AdminLayout
        currentView={adminView}
        onNavigateView={setAdminView}
        onExitToStore={() => handleNavigate('home')}
      >
        {adminView === 'dashboard' && (
          <AdminDashboard
            onNavigateToOrders={() => setAdminView('orders')}
            onNavigateToInventory={() => setAdminView('inventory')}
            onNavigateToProducts={() => setAdminView('products')}
          />
        )}
        {adminView === 'products' && <AdminProducts />}
        {adminView === 'orders' && <AdminOrders />}
        {adminView === 'inventory' && <AdminInventory />}
        {adminView === 'categories' && <AdminCategories />}
        {adminView === 'coupons' && <AdminCoupons />}
        {adminView === 'customers' && <AdminCustomers />}
        {adminView === 'reviews' && <AdminReviews />}
        {adminView === 'settings' && <AdminSettings />}
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#261E1E]">
      {/* Top Announcement Bar with COD & Express shipping guarantees */}
      <AnnouncementBar />

      {/* Main 3-Zone Luxury Navbar */}
      <Navbar
        currentRoute={route}
        onNavigate={handleNavigate}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main Routed Page View */}
      <main className="flex-1">
        {route === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {(route === 'shop' || route === 'categories') && (
          <ShopPage
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            initialCategory={catalogCategory}
            initialSearch={catalogSearch}
          />
        )}

        {route === 'product' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => handleNavigate('shop')}
            onSelectProduct={handleSelectProduct}
            onProceedToCheckout={() => handleNavigate('checkout')}
          />
        )}

        {route === 'cart' && (
          <CartPage
            onContinueShopping={() => handleNavigate('shop')}
            onProceedToCheckout={() => handleNavigate('checkout')}
          />
        )}

        {route === 'checkout' && (
          <CheckoutPage
            onOrderSuccess={handleOrderSuccess}
            onBackToCart={() => handleNavigate('cart')}
          />
        )}

        {route === 'confirmation' && confirmedOrder && (
          <OrderConfirmationPage
            order={confirmedOrder}
            onContinueShopping={() => handleNavigate('shop')}
            onTrackOrder={handleTrackOrderFromConfirmation}
          />
        )}

        {route === 'orders' && (
          <OrdersPage
            onContinueShopping={() => handleNavigate('shop')}
            selectedOrderId={trackOrderId}
          />
        )}

        {route === 'wishlist' && (
          <WishlistPage
            onSelectProduct={handleSelectProduct}
            onExplore={() => handleNavigate('shop')}
          />
        )}

        {route === 'account' && (
          <AccountPage
            onNavigateToOrders={() => handleNavigate('orders')}
            onNavigateToWishlist={() => handleNavigate('wishlist')}
          />
        )}

        {route === 'login' && (
          <AuthPages
            initialMode="login"
            onSuccess={(adminLogged) => handleNavigate(adminLogged ? 'admin' : 'account')}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {route === 'register' && (
          <AuthPages
            initialMode="register"
            onSuccess={() => handleNavigate('account')}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {route === 'about' && <AboutPage />}
        {route === 'contact' && <ContactPage />}
        {route === 'shipping-policy' && <ShippingPolicyPage />}
        {route === 'refund-policy' && <RefundPolicyPage />}
      </main>

      {/* Main Luxury Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Slide-Over Shopping Bag Drawer */}
      <CartDrawer
        onCheckout={() => handleNavigate('checkout')}
        onContinueShopping={() => handleNavigate('shop')}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewFullDetails={(prod) => {
          setSelectedProduct(prod);
          handleNavigate('product');
        }}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectProduct={handleSearchSelect}
        onViewAllResults={handleViewAllSearchResults}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <MainAppContent />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
