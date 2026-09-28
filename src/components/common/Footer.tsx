import React, { useState } from 'react';
import { Shield, Sparkles, Truck, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    showToast('Thank you for subscribing to Aurelia Gazette.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-[#261E1E] text-[#FBF9F5] border-t border-[#3D3131]">
      {/* Reassurance banner */}
      <div className="border-b border-[#3D3131]/60 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-[#4A1525] flex items-center justify-center shrink-0 border border-[#C5A059]/40">
              <Shield className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h4 className="font-serif-luxury text-lg font-medium text-white">Cash on Delivery Exclusively</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Complete peace of mind. Pay safely in cash directly to our white-glove courier after inspecting your package.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-[#4A1525] flex items-center justify-center shrink-0 border border-[#C5A059]/40">
              <Truck className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h4 className="font-serif-luxury text-lg font-medium text-white">Complimentary Delivery</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Enjoy waived delivery fees on all orders exceeding $100. Dispatched in insulated luxury packaging.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-[#4A1525] flex items-center justify-center shrink-0 border border-[#C5A059]/40">
              <Sparkles className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h4 className="font-serif-luxury text-lg font-medium text-white">Handcrafted Botanical Batches</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Micro-batch alchemy with cold-pressed unrefined botanicals, non-comedogenic lipids, and natural floral waxes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Wordmark & Mission */}
          <div className="md:col-span-2 space-y-4">
            <span className="font-serif-luxury text-2xl font-medium tracking-[0.2em] text-[#C5A059] uppercase block">
              Aurelia Botanica
            </span>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              Haute apothecary and botanical skincare formulated in small French batches. Dedicated to transparent craftsmanship and trustworthy Cash on Delivery convenience.
            </p>
            <div className="pt-2">
              <span className="text-xs text-[#C5A059] font-medium tracking-wider uppercase block mb-1">
                Atelier Concierge
              </span>
              <p className="text-xs text-zinc-300">concierge@aureliabotanica.com · +1 (800) 892-AURELIA</p>
            </div>
          </div>

          {/* Boutique Navigation */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-4">The Collections</h5>
            <ul className="space-y-2.5 text-xs text-zinc-300">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Face Elixirs & Serums
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Restorative Cremes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Artisanal Candles
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Haute Body Care
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  New Botanical Arrivals
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-4">Customer Care</h5>
            <ul className="space-y-2.5 text-xs text-zinc-300">
              <li>
                <button onClick={() => onNavigate('orders')} className="hover:text-white transition-colors">
                  Track COD Order
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shipping-policy')} className="hover:text-white transition-colors">
                  Shipping & COD Guidelines
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('refund-policy')} className="hover:text-white transition-colors">
                  Return & Inspection Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-4">The Botanical Gazette</h5>
            <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
              Receive private invitations to harvest releases, seasonal formula debuts, and complimentary sample offerings.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-[#1A1414] border border-[#3D3131] rounded-md px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#C5A059]"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#4A1525] hover:bg-[#5C1D2E] text-white rounded text-xs flex items-center justify-center transition-colors"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[10px] text-zinc-500 block">We respect your privacy. Unsubscribe at any time.</span>
            </form>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 pt-8 border-t border-[#3D3131]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} Aurelia Botanica. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Payment Method: Strictly Cash on Delivery</span>
            <button onClick={() => onNavigate('admin')} className="text-zinc-400 hover:text-[#C5A059] transition-colors">
              Administration Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
