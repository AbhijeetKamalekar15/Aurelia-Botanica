import React, { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, Heart, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface CartPageProps {
  onContinueShopping: () => void;
  onProceedToCheckout: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onContinueShopping, onProceedToCheckout }) => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    discount,
    shippingFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { toggleWishlist } = useWishlist();
  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplying(true);
    await applyCoupon(couponInput.trim());
    setApplying(false);
    setCouponInput('');
  };

  const handleMoveToWishlist = (product: any) => {
    toggleWishlist(product);
    removeItem(product.id);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-[#F8EBEF] text-[#4A1525] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif-luxury text-3xl font-bold text-[#261E1E]">Your Shopping Bag is Empty</h1>
        <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
          Indulge in small-batch botanical facial oils, restorative cremes, and hand-poured ambient candles. All orders dispatched via Cash on Delivery.
        </p>
        <button
          onClick={onContinueShopping}
          className="px-8 py-3 bg-[#4A1525] hover:bg-[#360D19] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors shadow-sm inline-flex items-center gap-2"
        >
          <span>Explore Boutique</span>
          <ArrowRight className="w-4 h-4 text-[#C5A059]" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Page Title */}
      <div className="border-b border-[#261E1E]/10 pb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
            Order Review
          </span>
          <h1 className="font-serif-luxury text-3xl font-bold text-[#261E1E]">Your Shopping Bag</h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-zinc-400 hover:text-rose-600 transition-colors"
        >
          Clear Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {items.map(({ product, quantity }) => {
            const effectivePrice = product.discountPrice || product.price;
            return (
              <div
                key={product.id}
                className="p-4 sm:p-5 bg-white border border-[#261E1E]/8 rounded-xl shadow-xs flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.images[0] || '/src/assets/images/product_rose_face_elixir_1790592668403.jpg'}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-cover rounded-lg bg-[#F6F2EB] shrink-0"
                  />
                  <div>
                    <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">
                      {product.categoryName}
                    </span>
                    <h3 className="font-serif-luxury text-base font-semibold text-[#261E1E]">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1 tabular-nums">
                      <span className="text-sm font-bold text-[#4A1525]">${effectivePrice.toFixed(2)}</span>
                      {product.discountPrice && (
                        <span className="text-xs text-zinc-400 line-through">${product.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8 pt-3 sm:pt-0 border-t sm:border-0 border-[#261E1E]/5">
                  {/* Stepper */}
                  <div className="flex items-center border border-[#261E1E]/20 rounded-md bg-[#FBF9F5]">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="px-2.5 py-1.5 text-zinc-600 hover:text-[#4A1525]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold tabular-nums text-[#261E1E]">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="px-2.5 py-1.5 text-zinc-600 hover:text-[#4A1525]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right">
                    <span className="text-base font-bold tabular-nums text-[#261E1E] block">
                      ${(effectivePrice * quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMoveToWishlist(product)}
                      title="Move to Wishlist"
                      className="p-1.5 text-zinc-400 hover:text-[#4A1525] transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeItem(product.id)}
                      title="Remove Item"
                      className="p-1.5 text-zinc-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <button
            onClick={onContinueShopping}
            className="text-xs font-semibold text-[#4A1525] hover:underline inline-flex items-center gap-1.5 pt-2"
          >
            ← Continue shopping from the dispensary
          </button>
        </div>

        {/* Order Summary & COD Guarantee (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#261E1E]/10 shadow-sm space-y-5">
            <h2 className="font-serif-luxury text-xl font-bold text-[#261E1E] border-b border-[#261E1E]/10 pb-3">
              Order Summary
            </h2>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs text-[#3D3131]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold tabular-nums">${subtotal.toFixed(2)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-800 bg-emerald-50 p-2 rounded">
                  <div className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon ({appliedCoupon.code})</span>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-600 ml-1 hover:underline text-[10px]"
                    >
                      (remove)
                    </button>
                  </div>
                  <span className="font-semibold tabular-nums">-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping Charge</span>
                <span className="font-semibold tabular-nums">
                  {shippingFee === 0 ? <span className="text-emerald-700">FREE</span> : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>

              <div className="pt-3 border-t border-[#261E1E]/10 flex justify-between items-baseline text-sm font-bold text-[#261E1E]">
                <span>Total Due on Delivery</span>
                <span className="text-xl text-[#4A1525] tabular-nums">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon Application Form */}
            {!appliedCoupon && (
              <form onSubmit={handleApplyCoupon} className="pt-2">
                <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
                  Have a Promotional Code?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="e.g. WELCOME10"
                    className="flex-1 text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded px-3 py-2 uppercase font-mono focus:outline-none focus:border-[#4A1525]"
                  />
                  <button
                    type="submit"
                    disabled={applying || !couponInput.trim()}
                    className="px-4 py-2 bg-[#261E1E] hover:bg-[#4A1525] text-white text-xs font-semibold rounded transition-colors disabled:opacity-50"
                  >
                    {applying ? '...' : 'Apply'}
                  </button>
                </div>
                <span className="text-[10px] text-zinc-400 block mt-1">
                  Try WELCOME10 for 10% off or AURELIA50 for $50 off orders over $250.
                </span>
              </form>
            )}

            {/* Cash on Delivery Notice */}
            <div className="p-3.5 bg-[#F8EBEF] border border-[#C77D8D]/30 rounded-lg space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#4A1525]">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Strictly Cash on Delivery</span>
              </div>
              <p className="text-[11px] text-[#3D3131] leading-relaxed">
                Payment of <strong>${total.toFixed(2)}</strong> will be collected in cash upon physical delivery. You are welcome to inspect outer packaging integrity before paying.
              </p>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 bg-[#4A1525] hover:bg-[#360D19] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Proceed to COD Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#C5A059]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
