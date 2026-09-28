import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, User as UserIcon, Shield, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onNavigate: (route: string) => void;
  currentRoute: string;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentRoute, onOpenSearch }) => {
  const { totalItemsCount, setIsDrawerOpen } = useCart();
  const { wishlistIds } = useWishlist();
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Home', route: 'home' },
    { label: 'Boutique Catalog', route: 'shop' },
    { label: 'Collections', route: 'categories' },
    { label: 'Brand Story', route: 'about' },
    { label: 'Order Tracking', route: 'orders' },
    { label: 'Concierge', route: 'contact' },
  ];

  const handleNavClick = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#261E1E]/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#261E1E] hover:text-[#4A1525] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* ZONE 1: Single text element wordmark */}
          <div className="flex-shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="font-serif-luxury text-2xl sm:text-3xl font-medium tracking-[0.18em] text-[#4A1525] uppercase transition-colors hover:text-[#360D19] focus-visible:outline-none"
            >
              Aurelia Botanica
            </button>
          </div>

          {/* ZONE 2: Clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide text-[#3D3131]">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => handleNavClick(link.route)}
                  className={`transition-colors py-1 relative hover:text-[#4A1525] ${
                    isActive ? 'text-[#4A1525] font-semibold' : 'text-[#3D3131]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C5A059]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ZONE 3: 1-2 primary actions and shopping utilities */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#3D3131] hover:text-[#4A1525] transition-colors"
              aria-label="Search apothecary products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => handleNavClick('wishlist')}
              className="p-2 text-[#3D3131] hover:text-[#4A1525] transition-colors relative"
              aria-label={`Wishlist with ${wishlistIds.length} items`}
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#4A1525] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Drawer Toggle */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 text-[#3D3131] hover:text-[#4A1525] transition-colors relative"
              aria-label={`Shopping bag with ${totalItemsCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C5A059] text-[#261E1E] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Account / Admin Portal Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 p-2 text-[#3D3131] hover:text-[#4A1525] transition-colors"
                aria-label="User account actions"
              >
                <UserIcon className="w-5 h-5" />
                {isAuthenticated && (
                  <span className="hidden xl:inline text-xs font-medium text-[#261E1E]">
                    {currentUser?.name.split(' ')[0]}
                  </span>
                )}
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#261E1E]/10 rounded-lg shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-[#261E1E]/10">
                        <p className="text-xs text-zinc-500">Signed in as</p>
                        <p className="text-sm font-semibold text-[#261E1E] truncate">{currentUser?.email}</p>
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() => handleNavClick('admin')}
                          className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#4A1525] hover:bg-[#F8EBEF] flex items-center gap-2"
                        >
                          <Shield className="w-4 h-4 text-[#C5A059]" />
                          <span>Admin Control Suite</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleNavClick('account')}
                        className="w-full text-left px-4 py-2 text-xs text-[#261E1E] hover:bg-[#FBF9F5]"
                      >
                        My Account & Addresses
                      </button>

                      <button
                        onClick={() => handleNavClick('orders')}
                        className="w-full text-left px-4 py-2 text-xs text-[#261E1E] hover:bg-[#FBF9F5]"
                      >
                        My Orders & Timeline
                      </button>

                      <button
                        onClick={() => handleNavClick('wishlist')}
                        className="w-full text-left px-4 py-2 text-xs text-[#261E1E] hover:bg-[#FBF9F5]"
                      >
                        Wishlist ({wishlistIds.length})
                      </button>

                      <div className="border-t border-[#261E1E]/10 my-1" />

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-700 hover:bg-rose-50"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleNavClick('login')}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#4A1525] hover:bg-[#F8EBEF]"
                      >
                        Sign In / Register
                      </button>
                      <button
                        onClick={() => handleNavClick('orders')}
                        className="w-full text-left px-4 py-2 text-xs text-[#261E1E] hover:bg-[#FBF9F5]"
                      >
                        Track COD Order
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Quick Admin Button for Instant Evaluation */}
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wider text-white bg-[#4A1525] hover:bg-[#360D19] rounded-md transition-colors shadow-sm"
              >
                <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Admin Suite</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#261E1E]/10 bg-[#FBF9F5] px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.route}
              onClick={() => handleNavClick(link.route)}
              className={`block w-full text-left py-2 text-base font-medium ${
                currentRoute === link.route ? 'text-[#4A1525] font-bold' : 'text-[#3D3131]'
              }`}
            >
              {link.label}
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className="flex items-center gap-2 w-full text-left py-2 text-base font-semibold text-[#4A1525]"
            >
              <Shield className="w-4 h-4 text-[#C5A059]" />
              Admin Suite
            </button>
          )}
        </div>
      )}
    </header>
  );
};
