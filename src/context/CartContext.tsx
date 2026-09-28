import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Coupon } from '../types';
import { couponService } from '../services/api';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => boolean;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const STORAGE_KEY = 'aurelia_cart_items';
const COUPON_KEY = 'aurelia_cart_coupon';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem(COUPON_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem(COUPON_KEY, JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem(COUPON_KEY);
    }
  }, [appliedCoupon]);

  const addItem = (product: Product, quantity: number = 1): boolean => {
    if (product.stockQuantity <= 0) {
      showToast(`${product.name} is currently out of stock.`, 'error');
      return false;
    }

    let success = false;
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stockQuantity) {
          showToast(`Only ${product.stockQuantity} items in stock.`, 'error');
          return prev;
        }
        success = true;
        return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: newQty } : i));
      } else {
        if (quantity > product.stockQuantity) {
          showToast(`Only ${product.stockQuantity} items in stock.`, 'error');
          return prev;
        }
        success = true;
        return [...prev, { product, quantity }];
      }
    });

    if (success) {
      showToast(`Added '${product.name}' to bag.`, 'success');
      setIsDrawerOpen(true);
    }
    return success;
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          if (quantity > item.product.stockQuantity) {
            showToast(`Maximum available stock is ${item.product.stockQuantity}.`, 'info');
            return { ...item, quantity: item.product.stockQuantity };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
    showToast('Item removed from shopping bag.', 'info');
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const totalItemsCount = items.reduce((acc, i) => acc + i.quantity, 0);

  const subtotal = items.reduce((acc, i) => {
    const price = i.product.discountPrice || i.product.price;
    return acc + price * i.quantity;
  }, 0);

  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrderValue) {
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      discount = (subtotal * appliedCoupon.discountValue) / 100;
      if (appliedCoupon.maxDiscountAmount) {
        discount = Math.min(discount, appliedCoupon.maxDiscountAmount);
      }
    } else {
      discount = Math.min(appliedCoupon.discountValue, subtotal);
    }
  }

  // Free shipping above $100
  const shippingFee = items.length === 0 ? 0 : subtotal >= 100 ? 0 : 15;
  const total = Math.max(0, subtotal - discount + shippingFee);

  const applyCoupon = async (code: string): Promise<boolean> => {
    try {
      const res = await couponService.validate(code, subtotal);
      setAppliedCoupon(res.coupon);
      showToast(`Coupon '${res.coupon.code}' applied: -$${res.discountAmount.toFixed(2)} savings!`, 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Invalid coupon', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItemsCount,
        subtotal: Math.round(subtotal * 100) / 100,
        discount: Math.round(discount * 100) / 100,
        shippingFee,
        total: Math.round(total * 100) / 100,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
