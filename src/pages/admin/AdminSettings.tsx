import React, { useState } from 'react';
import { ShieldCheck, Truck, RotateCcw, Save } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AdminSettings: React.FC = () => {
  const { showToast } = useToast();
  const [storeName, setStoreName] = useState('Aurelia Botanica');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(100);
  const [standardShippingFee, setStandardShippingFee] = useState(15);
  const [codNotice, setCodNotice] = useState(
    'Payment is strictly collected upon physical delivery in cash.'
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Storefront logistics & COD settings updated.', 'success');
  };

  const handleResetStore = () => {
    if (confirm('Reset store data back to initial seed data?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="font-serif-luxury text-2xl font-bold text-[#261E1E]">Atelier Settings & COD Logistics</h2>
        <p className="text-xs text-zinc-500">Configure logistics, delivery thresholds, and payment enforcement.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-xl border border-[#261E1E]/8 shadow-xs space-y-6 text-xs">
        <div>
          <label className="font-semibold text-[#261E1E] block mb-1">Maison Name</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
          />
        </div>

        {/* Strict Cash on Delivery Policy Lock */}
        <div className="p-4 bg-[#F8EBEF] border border-[#C77D8D]/30 rounded-lg space-y-2">
          <div className="flex items-center gap-2 font-bold text-[#4A1525] text-xs">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>Strict Cash on Delivery Enforcement</span>
          </div>
          <p className="text-zinc-600 text-[11px] leading-relaxed">
            By system architecture and business requirement, online payment gateways (Stripe, Razorpay, PayPal, UPI) are permanently disabled. Customers only pay upon physical courier handover.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-[#261E1E] block mb-1">
              Free Shipping Threshold ($)
            </label>
            <input
              type="number"
              min="0"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
              className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
            />
            <span className="text-[10px] text-zinc-400 mt-1 block">Orders equal or above this get free shipping</span>
          </div>

          <div>
            <label className="font-semibold text-[#261E1E] block mb-1">
              Standard COD Courier Fee ($)
            </label>
            <input
              type="number"
              min="0"
              value={standardShippingFee}
              onChange={(e) => setStandardShippingFee(Number(e.target.value))}
              className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
            />
            <span className="text-[10px] text-zinc-400 mt-1 block">Applied to orders below threshold</span>
          </div>
        </div>

        <div>
          <label className="font-semibold text-[#261E1E] block mb-1">Checkout COD Guidance Notice</label>
          <textarea
            rows={2}
            value={codNotice}
            onChange={(e) => setCodNotice(e.target.value)}
            className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
          />
        </div>

        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetStore}
            className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold rounded flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Seed Data</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#4A1525] hover:bg-[#360D19] text-white text-xs font-semibold rounded flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
