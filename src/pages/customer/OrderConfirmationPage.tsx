import React from 'react';
import { CheckCircle2, ShieldCheck, Truck, Package, ArrowRight, Printer } from 'lucide-react';
import { Order } from '../../types';

interface OrderConfirmationPageProps {
  order: Order;
  onContinueShopping: () => void;
  onTrackOrder: (orderId: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onContinueShopping,
  onTrackOrder,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Top Celebration Card */}
      <div className="text-center space-y-4 bg-white p-8 sm:p-12 rounded-2xl border border-[#261E1E]/10 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#F8EBEF] text-[#4A1525] flex items-center justify-center mx-auto border-2 border-[#C5A059]/40">
          <CheckCircle2 className="w-10 h-10 text-[#4A1525]" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A059] block">
          Order Confirmed
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#261E1E]">
          Thank You, {order.customerName}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 max-w-lg mx-auto leading-relaxed">
          Your bespoke botanical order <strong>#{order.orderNumber}</strong> has been registered with our atelier and is being carefully hand-packed with wax seals.
        </p>

        {/* Highlighted Cash on Delivery Reminder */}
        <div className="max-w-md mx-auto p-4 bg-[#F8EBEF] border border-[#C77D8D]/40 rounded-xl text-left flex items-start gap-3 mt-6">
          <ShieldCheck className="w-5 h-5 text-[#4A1525] shrink-0 mt-0.5" />
          <div className="text-xs text-[#3D3131] leading-relaxed">
            <span className="font-bold text-[#4A1525] block">Payment Method: Cash on Delivery (COD)</span>
            Please keep <strong>${order.totalAmount.toFixed(2)}</strong> ready in cash. Payment will be collected directly upon doorstep handover.
          </div>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#261E1E]/10 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#261E1E]/10 text-xs">
          <div>
            <span className="text-zinc-500">Order Reference:</span>
            <span className="font-bold text-[#261E1E] ml-1.5 font-mono">{order.orderNumber}</span>
          </div>
          <div>
            <span className="text-zinc-500">Order Placed:</span>
            <span className="font-semibold text-[#261E1E] ml-1.5">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div>
            <span className="text-zinc-500">Estimated Delivery:</span>
            <span className="font-semibold text-emerald-800 ml-1.5">2 - 3 Business Days</span>
          </div>
        </div>

        {/* Itemized Products */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#261E1E]">Items in this Dispatch</h3>
          <div className="divide-y divide-[#261E1E]/8">
            {order.items.map((item) => (
              <div key={item.productId} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.imageUrl || '/src/assets/images/product_rose_face_elixir_1790592668403.jpg'}
                    alt={item.productName}
                    className="w-14 h-14 rounded object-cover bg-[#F6F2EB] shrink-0"
                  />
                  <div>
                    <h4 className="font-serif-luxury text-sm font-semibold text-[#261E1E]">{item.productName}</h4>
                    <span className="text-xs text-zinc-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</span>
                  </div>
                </div>
                <span className="text-sm font-bold tabular-nums text-[#261E1E]">
                  ${item.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Address and Financial Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#261E1E]/10 text-xs">
          {/* Shipping Address */}
          <div className="space-y-2">
            <span className="font-bold uppercase tracking-wider text-[#4A1525] text-[10px] block">
              Delivery Destination
            </span>
            <p className="font-semibold text-[#261E1E]">{order.customerName}</p>
            <p className="text-zinc-600">{order.shippingAddress.houseFlat}, {order.shippingAddress.street}</p>
            {order.shippingAddress.landmark && <p className="text-zinc-500">Near {order.shippingAddress.landmark}</p>}
            <p className="text-zinc-600">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
            <p className="text-zinc-600">{order.shippingAddress.country}</p>
            <p className="text-zinc-500 pt-1">Phone: {order.customerPhone}</p>
          </div>

          {/* Totals */}
          <div className="space-y-2 bg-[#FBF9F5] p-4 rounded-lg">
            <div className="flex justify-between">
              <span className="text-zinc-600">Subtotal</span>
              <span className="font-semibold tabular-nums">${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-800">
                <span>Promotional Discount ({order.couponCode})</span>
                <span className="font-semibold tabular-nums">-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-zinc-600">Express Delivery</span>
              <span className="font-semibold tabular-nums">
                {order.shippingFee === 0 ? <span className="text-emerald-700">FREE</span> : `$${order.shippingFee.toFixed(2)}`}
              </span>
            </div>
            <div className="pt-2 border-t border-[#261E1E]/10 flex justify-between items-baseline font-bold text-[#261E1E]">
              <span className="text-xs">Amount Due on Delivery</span>
              <span className="text-lg text-[#4A1525] tabular-nums">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <button
          onClick={() => window.print()}
          className="px-5 py-2.5 bg-white border border-[#261E1E]/20 text-xs font-semibold text-[#261E1E] rounded hover:bg-[#FBF9F5] transition-colors flex items-center gap-2"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Receipt</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onTrackOrder(order.id)}
            className="px-6 py-2.5 bg-[#4A1525] hover:bg-[#360D19] text-white text-xs font-semibold rounded transition-colors flex items-center gap-2"
          >
            <Package className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Track Order Timeline</span>
          </button>
          <button
            onClick={onContinueShopping}
            className="px-6 py-2.5 bg-white border border-[#261E1E]/20 text-xs font-semibold text-[#261E1E] rounded hover:bg-[#FBF9F5] transition-colors flex items-center gap-2"
          >
            <span>Continue Browsing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
