import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  User as UserIcon,
  MapPin,
  FileText,
  Banknote,
  Check,
} from 'lucide-react';
import { Address, Order } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { orderService } from '../../services/api';

interface CheckoutPageProps {
  onOrderSuccess: (order: Order) => void;
  onBackToCart: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onOrderSuccess, onBackToCart }) => {
  const { items, subtotal, discount, shippingFee, total, appliedCoupon, clearCart } = useCart();
  const { currentUser, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Step 1: Customer Information
  const [customerName, setCustomerName] = useState(currentUser?.name || 'Elena Vance');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'customer@aurelia.com');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+1 (555) 018-8421');

  // Step 2: Shipping Address
  const defaultAddr = currentUser?.addresses?.find((a) => a.isDefault) || currentUser?.addresses?.[0];
  const [shippingAddress, setShippingAddress] = useState<Address>({
    id: defaultAddr?.id || 'addr-' + Date.now(),
    houseFlat: defaultAddr?.houseFlat || 'Apt 4B, The Pavilion',
    street: defaultAddr?.street || 'Rue de la Paix',
    landmark: defaultAddr?.landmark || 'Near Royal Gardens',
    city: defaultAddr?.city || 'Paris',
    state: defaultAddr?.state || 'Ile-de-France',
    pincode: defaultAddr?.pincode || '75001',
    country: defaultAddr?.country || 'France',
  });

  const [customerNotes, setCustomerNotes] = useState('');

  // Handle Step 1 submission
  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone) {
      showToast('Please provide your full contact details.', 'error');
      return;
    }
    setStep(2);
  };

  // Handle Step 2 submission
  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.houseFlat || !shippingAddress.street || !shippingAddress.city || !shippingAddress.pincode) {
      showToast('Please complete the mandatory address fields.', 'error');
      return;
    }
    setStep(3);
  };

  // Handle Final Order Placement (Step 4/5)
  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      const orderPayload = {
        userId: currentUser?.id || 'GUEST',
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        couponCode: appliedCoupon?.code,
        customerNotes,
      };

      const createdOrder = await orderService.createOrder(orderPayload);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4A1525', '#C5A059', '#DDA5B0'],
        });
      } catch (e) {
        // ignore if confetti fails
      }

      clearCart();
      showToast('Order confirmed! Prepared for Cash on Delivery.', 'success');
      onOrderSuccess(createdOrder);
    } catch (err: any) {
      showToast(err.message || 'Failed to place order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <h2 className="font-serif-luxury text-2xl font-bold">Your bag is empty</h2>
        <button
          onClick={onBackToCart}
          className="mt-4 px-6 py-2 bg-[#4A1525] text-white text-xs font-semibold rounded"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Title & Stepper Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
          Cash on Delivery Checkout
        </span>
        <h1 className="font-serif-luxury text-3xl font-bold text-[#261E1E]">Boutique Checkout</h1>
      </div>

      {/* Stepper Progress Indicator */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 pb-2 border-b border-[#261E1E]/10">
        {[
          { num: 1, label: 'Customer Info', icon: UserIcon },
          { num: 2, label: 'Delivery Address', icon: MapPin },
          { num: 3, label: 'Order Summary', icon: FileText },
          { num: 4, label: 'Payment (COD)', icon: Banknote },
        ].map((s) => {
          const isDone = step > s.num;
          const isCurrent = step === s.num;
          return (
            <div
              key={s.num}
              className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
                isCurrent
                  ? 'border-[#4A1525] text-[#4A1525] font-bold'
                  : isDone
                  ? 'border-[#C5A059] text-[#261E1E]'
                  : 'border-transparent text-zinc-400'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                  isCurrent
                    ? 'bg-[#4A1525] text-white'
                    : isDone
                    ? 'bg-[#C5A059] text-[#261E1E]'
                    : 'bg-zinc-200 text-zinc-600'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
              </div>
              <span className="hidden sm:inline text-xs">{s.label}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Active Step Panel (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-[#261E1E]/10 shadow-xs">
          {/* STEP 1: Customer Information */}
          {step === 1 && (
            <form onSubmit={handleStep1Next} className="space-y-5">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#261E1E]">1. Customer Information</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  We use this contact information for delivery verification and courier dispatch.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#261E1E] block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Elena Vance"
                  className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded-md p-3 focus:outline-none focus:border-[#4A1525]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#261E1E] block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="elena@example.com"
                    className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded-md p-3 focus:outline-none focus:border-[#4A1525]"
                  />
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">Delivery receipt will be sent here</span>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#261E1E] block mb-1">Mobile Telephone *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+1 (555) 018-8421"
                    className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded-md p-3 focus:outline-none focus:border-[#4A1525]"
                  />
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">For courier coordination prior to delivery</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-[#261E1E]/10">
                <button
                  type="button"
                  onClick={onBackToCart}
                  className="text-xs text-zinc-500 hover:text-[#4A1525] flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Cart</span>
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#4A1525] hover:bg-[#360D19] text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-2"
                >
                  <span>Continue to Shipping</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Shipping Address */}
          {step === 2 && (
            <form onSubmit={handleStep2Next} className="space-y-5">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#261E1E]">2. Shipping Address</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Ensure the physical address is accurate for our Cash on Delivery courier.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#261E1E] block mb-1">
                  House / Flat / Suite / Villa *
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress.houseFlat}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, houseFlat: e.target.value })}
                  placeholder="e.g. Apt 4B, The Pavilion"
                  className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded-md p-3 focus:outline-none focus:border-[#4A1525]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#261E1E] block mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  placeholder="e.g. Rue de la Paix / 5th Avenue"
                  className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded-md p-3 focus:outline-none focus:border-[#4A1525]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#261E1E] block mb-1">Landmark (Optional)</label>
                  <input
                    type="text"
                    value={shippingAddress.landmark || ''}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, landmark: e.target.value })}
                    placeholder="Near Royal Gardens"
                    className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded-md p-3 focus:outline-none focus:border-[#4A1525]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#261E1E] block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    placeholder="Paris"
                    className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded-md p-3 focus:outline-none focus:border-[#4A1525]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#261E1E] block mb-1">State / Province *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    placeholder="Ile-de-France"
                    className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded-md p-3 focus:outline-none focus:border-[#4A1525]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#261E1E] block mb-1">Postal Pincode *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.pincode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                    placeholder="75001"
                    className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded-md p-3 focus:outline-none focus:border-[#4A1525]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#261E1E] block mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                    placeholder="France"
                    className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded-md p-3 focus:outline-none focus:border-[#4A1525]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-[#261E1E]/10">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-zinc-500 hover:text-[#4A1525] flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Customer Info</span>
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#4A1525] hover:bg-[#360D19] text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-2"
                >
                  <span>Review Order Summary</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Order Summary Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#261E1E]">3. Review Order & Items</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Confirm recipient information and delivery address before choosing Cash on Delivery.
                </p>
              </div>

              {/* Recipient & Address summary box */}
              <div className="p-4 bg-[#FBF9F5] border border-[#261E1E]/10 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-[#4A1525] uppercase tracking-wider text-[10px] block mb-1">
                    Recipient
                  </span>
                  <p className="font-semibold text-[#261E1E]">{customerName}</p>
                  <p className="text-zinc-600">{customerEmail}</p>
                  <p className="text-zinc-600">{customerPhone}</p>
                </div>
                <div>
                  <span className="font-bold text-[#4A1525] uppercase tracking-wider text-[10px] block mb-1">
                    Destination
                  </span>
                  <p className="text-[#261E1E]">{shippingAddress.houseFlat}, {shippingAddress.street}</p>
                  {shippingAddress.landmark && <p className="text-zinc-500">Near: {shippingAddress.landmark}</p>}
                  <p className="text-zinc-600">{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}</p>
                  <p className="text-zinc-600">{shippingAddress.country}</p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-[#261E1E] block mb-1">
                  Delivery Instructions / Gate Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Please ring doorbell 4B. Cash is ready in exact amount."
                  className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded-md p-3 focus:outline-none focus:border-[#4A1525]"
                />
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-[#261E1E]/10">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-zinc-500 hover:text-[#4A1525] flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Address</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-3 bg-[#4A1525] hover:bg-[#360D19] text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-2"
                >
                  <span>Select Payment Method</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Payment Method (STRICTLY CASH ON DELIVERY ONLY) */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#261E1E]">4. Payment Method</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  In accordance with boutique policy, all transactions are settled exclusively upon physical delivery.
                </p>
              </div>

              {/* Strict COD Selected Card */}
              <div className="p-5 border-2 border-[#4A1525] bg-[#F8EBEF]/60 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-4 border-[#4A1525] bg-white flex items-center justify-center" />
                    <div>
                      <h4 className="font-serif-luxury text-lg font-bold text-[#4A1525]">
                        Cash on Delivery (COD)
                      </h4>
                      <span className="text-[11px] text-[#3D3131]">Pay when your order is delivered.</span>
                    </div>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-[#C5A059]" />
                </div>

                <div className="pt-2 text-xs text-[#3D3131] leading-relaxed border-t border-[#C77D8D]/30 space-y-2">
                  <p>
                    • <strong>Exact Amount Due:</strong> <span className="font-bold text-[#4A1525]">${total.toFixed(2)}</span>
                  </p>
                  <p>
                    • Our white-glove courier will present the package at your address. You may inspect the tamper-evident botanical wax seals prior to handing over the cash payment.
                  </p>
                  <p>
                    • An electronic physical receipt and invoice will be issued by the courier upon collection.
                  </p>
                </div>
              </div>

              {/* No Online Gateway Notice */}
              <div className="p-3 bg-[#FBF9F5] border border-[#261E1E]/10 rounded-md text-[11px] text-zinc-500">
                Notice: Aurelia Botanica does not accept online credit cards, debit cards, PayPal, or net banking. This guarantees absolute protection against online financial fraud.
              </div>

              {/* STEP 5: PLACE ORDER */}
              <div className="pt-4 flex items-center justify-between border-t border-[#261E1E]/10">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs text-zinc-500 hover:text-[#4A1525] flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Summary</span>
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handlePlaceOrder}
                  className="px-8 py-3.5 bg-[#4A1525] hover:bg-[#360D19] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-all shadow-lg flex items-center gap-2"
                >
                  {submitting ? (
                    <span>Confirming with Atelier...</span>
                  ) : (
                    <>
                      <span>Place Cash on Delivery Order (${total.toFixed(2)})</span>
                      <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Order Cart Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#261E1E]/10 shadow-xs space-y-5">
            <h3 className="font-serif-luxury text-lg font-bold text-[#261E1E] border-b border-[#261E1E]/10 pb-3">
              Items in this Shipment ({items.length})
            </h3>

            {/* Item list preview */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <img
                    src={item.product.images[0] || '/src/assets/images/product_rose_face_elixir_1790592668403.jpg'}
                    alt={item.product.name}
                    className="w-12 h-12 rounded object-cover bg-[#F6F2EB] shrink-0"
                  />
                  <div className="flex-1 text-xs">
                    <h4 className="font-semibold text-[#261E1E] line-clamp-1">{item.product.name}</h4>
                    <span className="text-zinc-500">Qty: {item.quantity}</span>
                  </div>
                  <span className="text-xs font-bold text-[#261E1E] tabular-nums">
                    ${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="space-y-2 text-xs text-[#3D3131] pt-3 border-t border-[#261E1E]/10">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-800">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span className="font-semibold tabular-nums">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-semibold tabular-nums">
                  {shippingFee === 0 ? <span className="text-emerald-700">FREE</span> : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-3 border-t border-[#261E1E]/10 flex justify-between items-baseline text-sm font-bold text-[#261E1E]">
                <span>Total Amount (Cash on Delivery)</span>
                <span className="text-xl text-[#4A1525] tabular-nums">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Delivery terms badge */}
            <div className="p-3 bg-[#F8EBEF] rounded-lg text-xs text-[#4A1525] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>Complimentary insured packaging & tamper seals included.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
