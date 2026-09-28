import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ShieldCheck, Truck, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A059] block">
          Our Maison Ethos
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-[#261E1E]">
          The Art of Slow Botanical Alchemy
        </h1>
        <p className="text-sm text-zinc-500 max-w-xl mx-auto leading-relaxed">
          Founded in Grasse, France, Aurelia Botanica marries multi-generational organic horticulture with contemporary cellular lipid science.
        </p>
      </div>

      <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-lg bg-[#360D19]">
        <img
          src="/src/assets/images/hero_aurelia_botanica_1790592653863.jpg"
          alt="Aurelia Botanica Atelier"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-6 text-sm text-[#3D3131] leading-relaxed">
        <h2 className="font-serif-luxury text-2xl font-bold text-[#261E1E]">Old-World Trust: Why We Choose Cash on Delivery</h2>
        <p>
          In an age overwhelmed by impersonal digital gateways, data brokers, and recurring credit card subscriptions, Aurelia Botanica returns to the timeless elegance of reciprocal trust. We hand-deliver our artisanal consignments directly to your doorstep and request payment only once you hold the parcel in your hands.
        </p>
        <p>
          Each amber bottle is sealed with natural beeswax and embossed with our atelier coat of arms. When our white-glove courier arrives, you are invited to inspect outer carton seals before remitting cash payment.
        </p>

        <h2 className="font-serif-luxury text-2xl font-bold text-[#261E1E]">Micro-Batch Extraction</h2>
        <p>
          Our harvests are limited by seasonal cycles. We never mass-manufacture or blend synthetic stabilisers. If a particular floral season yields fewer Damascena blossoms, we formulate smaller quantities rather than compromising purity.
        </p>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been received by our concierge.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A059] block">
          Concierge & Support
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#261E1E]">
          Atelier Communications
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-lg mx-auto leading-relaxed">
          Questions regarding botanical formulations, ritual recommendations, or Cash on Delivery order deliveries? Our team is at your disposal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 bg-white border border-[#261E1E]/10 rounded-xl shadow-xs space-y-4 text-xs">
            <h3 className="font-serif-luxury text-lg font-bold text-[#261E1E]">Atelier Contact</h3>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#4A1525] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-[#261E1E]">Electronic Mail</span>
                <span className="text-zinc-600">concierge@aureliabotanica.com</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#4A1525] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-[#261E1E]">Telephone Concierge</span>
                <span className="text-zinc-600">+1 (800) 892-AURELIA</span>
                <span className="text-[10px] text-zinc-400 block">Mon - Fri: 9:00 AM - 6:00 PM CET</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#4A1525] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-[#261E1E]">Grasse Botanical Laboratory</span>
                <span className="text-zinc-600">14 Rue des Parfumeurs, 06130 Grasse, France</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-[#F8EBEF] border border-[#C77D8D]/30 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#4A1525]">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>COD Doorstep Support</span>
            </div>
            <p className="text-zinc-600 leading-relaxed text-[11px]">
              If you have specific instructions for your Cash on Delivery courier or need to reschedule a handover appointment, please include your order reference number.
            </p>
          </div>
        </div>

        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-[#261E1E]/10 shadow-xs">
          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#4A1525] mx-auto" />
              <h3 className="font-serif-luxury text-xl font-bold text-[#261E1E]">Inquiry Registered</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Thank you, {name}. A member of our concierge team will respond within one business day.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 border border-[#261E1E]/20 text-xs font-semibold rounded hover:bg-[#FBF9F5]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-[#261E1E] block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Elena Vance"
                    className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/15 rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#261E1E] block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="elena@example.com"
                    className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/15 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#261E1E] block mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/15 rounded"
                >
                  <option value="Product Inquiry">Product Inquiry & Ritual Guidance</option>
                  <option value="COD Delivery Question">Cash on Delivery Handover Question</option>
                  <option value="Order Tracking">Existing Order Tracking</option>
                  <option value="Concierge">Bespoke Concierge Request</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#261E1E] block mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How may our atelier assist you today?"
                  className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/15 rounded"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#4A1525] hover:bg-[#360D19] text-white font-semibold rounded text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>Transmit Inquiry</span>
                <Send className="w-3.5 h-3.5 text-[#C5A059]" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const ShippingPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 text-xs sm:text-sm text-[#3D3131] leading-relaxed">
      <div className="border-b border-[#261E1E]/10 pb-4">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
          Logistical Protocols
        </span>
        <h1 className="font-serif-luxury text-3xl font-bold text-[#261E1E]">Shipping & Cash on Delivery Policy</h1>
      </div>

      <div className="p-4 bg-[#F8EBEF] border border-[#C77D8D]/30 rounded-xl space-y-2">
        <h3 className="font-bold text-[#4A1525] text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
          <span>Strict Cash on Delivery (COD) Only Policy</span>
        </h3>
        <p className="text-xs text-[#261E1E]">
          Aurelia Botanica operates exclusively on a Cash on Delivery model. No credit card, debit card, or electronic wallet payments are taken online. Payment is collected in cash at the moment of parcel handover.
        </p>
      </div>

      <h2 className="font-serif-luxury text-xl font-bold text-[#261E1E]">1. Dispatch Timeline</h2>
      <p>
        Orders placed before 2:00 PM CET are processed on the same business day. Due to small-batch freshness seals, all items are inspected and individually stamped with harvest batch identifiers prior to dispatch. Standard express transit takes 2 to 3 business days.
      </p>

      <h2 className="font-serif-luxury text-xl font-bold text-[#261E1E]">2. Complimentary Delivery Threshold</h2>
      <p>
        All orders of $100 or greater qualify for complimentary insured white-glove delivery. For orders below $100, a flat shipping fee of $15 is added to your Cash on Delivery total amount.
      </p>

      <h2 className="font-serif-luxury text-xl font-bold text-[#261E1E]">3. Doorstep Handover Procedure</h2>
      <p>
        Prior to arrival, our courier will contact you via the telephone number provided at checkout. Please ensure you or an authorized representative have the exact cash amount ready. You are entitled to inspect the outer wax seals before remitting payment.
      </p>
    </div>
  );
};

export const RefundPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 text-xs sm:text-sm text-[#3D3131] leading-relaxed">
      <div className="border-b border-[#261E1E]/10 pb-4">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
          Consumer Protection
        </span>
        <h1 className="font-serif-luxury text-3xl font-bold text-[#261E1E]">Return & Refund Policy</h1>
      </div>

      <h2 className="font-serif-luxury text-xl font-bold text-[#261E1E]">1. 14-Day Atelier Guarantee</h2>
      <p>
        Because our products are crafted without chemical preservatives, unopened and sealed bottles may be returned within 14 calendar days of delivery.
      </p>

      <h2 className="font-serif-luxury text-xl font-bold text-[#261E1E]">2. Refunds for Cash on Delivery Orders</h2>
      <p>
        Because your payment was made in cash upon delivery, approved returns are refunded via direct bank transfer or store consignment credit. Once the returned item is inspected at our Grasse or regional atelier, your refund is processed within 3 business days.
      </p>

      <h2 className="font-serif-luxury text-xl font-bold text-[#261E1E]">3. Damaged or Compromised Seals</h2>
      <p>
        If your package arrives with damaged wax seals or compromised glass containers, you may decline the delivery outright with the courier without paying. Alternatively, submit a return request through your Order Tracking portal.
      </p>
    </div>
  );
};
