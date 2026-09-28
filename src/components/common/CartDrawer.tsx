import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface CartDrawerProps {
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout, onContinueShopping }) => {
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeItem,
    subtotal,
    discount,
    shippingFee,
    total,
    appliedCoupon,
  } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FBF9F5] shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#261E1E]/10 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#4A1525]" />
              <h2 className="font-serif-luxury text-xl font-semibold text-[#261E1E]">Shopping Bag</h2>
              <span className="text-xs text-zinc-500 font-medium">({items.length} items)</span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-[#261E1E] transition-colors rounded-md"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F6F2EB] flex items-center justify-center text-[#4A1525]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg font-medium text-[#261E1E]">Your Bag is Empty</h3>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                    Explore our botanical remedies, restorative face oils, and hand-poured candles.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onContinueShopping();
                  }}
                  className="px-6 py-2.5 bg-[#4A1525] text-white text-xs font-semibold rounded hover:bg-[#360D19] transition-colors shadow-sm"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => {
                const effectivePrice = item.product.discountPrice || item.product.price;
                return (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3 bg-white border border-[#261E1E]/8 rounded-lg"
                  >
                    <img
                      src={item.product.images[0] || '/src/assets/images/product_rose_face_elixir_1790592668403.jpg'}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 object-cover rounded bg-[#F6F2EB] shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-serif-luxury text-sm font-semibold text-[#261E1E] line-clamp-1">
                            {item.product.name}
                          </h4>
                          <span className="text-[11px] text-zinc-500">{item.product.categoryName}</span>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-zinc-400 hover:text-rose-600 transition-colors p-1"
                          aria-label={`Remove ${item.product.name} from bag`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#261E1E]/5">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-[#261E1E]/20 rounded bg-[#FBF9F5]">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:text-[#4A1525] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold tabular-nums text-[#261E1E]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:text-[#4A1525] transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-sm font-bold tabular-nums text-[#4A1525]">
                          ${(effectivePrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer with Calculations & COD Guarantee */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-[#261E1E]/10 space-y-4">
              {/* COD Explanatory Box */}
              <div className="p-3 bg-[#F8EBEF] border border-[#C77D8D]/30 rounded-md flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#4A1525] shrink-0 mt-0.5" />
                <div className="text-[11px] text-[#3D3131] leading-relaxed">
                  <span className="font-semibold text-[#4A1525] block">Cash on Delivery (COD)</span>
                  Pay in cash when our courier arrives with your package. No online prepayments required.
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-1.5 text-xs text-[#3D3131]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span className="font-semibold tabular-nums">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-semibold tabular-nums">
                    {shippingFee === 0 ? <span className="text-emerald-700">FREE</span> : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#261E1E]/10 text-sm font-bold text-[#261E1E]">
                  <span>Total Amount Due on Delivery</span>
                  <span className="text-base text-[#4A1525] tabular-nums">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onCheckout();
                }}
                className="w-full py-3 bg-[#4A1525] hover:bg-[#360D19] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Proceed to COD Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#C5A059]" />
              </button>

              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onContinueShopping();
                }}
                className="w-full text-center text-xs text-zinc-500 hover:text-[#4A1525] transition-colors py-1"
              >
                Continue Browsing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
