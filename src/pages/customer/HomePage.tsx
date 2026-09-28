import React, { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Truck, Droplets, Award, Star } from 'lucide-react';
import { Product, Category } from '../../types';
import { productService, categoryService } from '../../services/api';
import { ProductCard } from '../../components/common/ProductCard';

interface HomePageProps {
  onNavigate: (route: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectProduct, onQuickView }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prods, cats] = await Promise.all([
          productService.getFeatured(),
          categoryService.getCategories(),
        ]);
        setFeaturedProducts(prods);
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load home page data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO CAMPAIGN SECTION */}
      <section className="relative overflow-hidden bg-[#261E1E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 z-10">
              <div className="flex items-center gap-2 text-[#C5A059] text-xs font-semibold uppercase tracking-[0.25em]">
                <Sparkles className="w-4 h-4" />
                <span>Harvest Edition 2026</span>
                <span aria-hidden="true">·</span>
                <span>Small Batch Apothecary</span>
              </div>

              <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] text-[#FBF9F5] tracking-tight">
                Botanical Alchemy for the <br />
                <span className="italic font-light text-[#DDA5B0]">Discerning Senses.</span>
              </h1>

              <p className="text-sm sm:text-base text-zinc-300 max-w-xl leading-relaxed">
                Formulated from cold-pressed rare essences, French Damask roses, and restorative cellular lipids. Delivered with utmost discretion via our exclusive <strong>Cash on Delivery</strong> service.
              </p>

              {/* Value trust callout */}
              <div className="flex items-center gap-3 pt-2 text-xs text-zinc-300">
                <div className="flex items-center gap-1.5 bg-[#4A1525]/80 px-3 py-1.5 rounded border border-[#C5A059]/30">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>100% Cash on Delivery · Inspect at Doorstep</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded">
                  <Truck className="w-4 h-4 text-[#C5A059]" />
                  <span>Complimentary Shipping over $100</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => onNavigate('shop')}
                  className="px-7 py-3.5 bg-[#C5A059] hover:bg-[#E6CA85] text-[#261E1E] text-xs font-semibold uppercase tracking-wider rounded transition-all shadow-lg hover:shadow-xl flex items-center gap-2.5"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('categories')}
                  className="px-7 py-3.5 bg-transparent hover:bg-white/10 text-white border border-white/20 text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  Discover Rituals
                </button>
              </div>
            </div>

            {/* Right Hero Imagery */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#360D19]">
                  <img
                    src="/src/assets/images/hero_aurelia_botanica_1790592653863.jpg"
                    alt="Aurelia Botanica Skincare on Travertine"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
                {/* Floating Certificate Note */}
                <div className="absolute -bottom-6 -left-6 bg-[#FAF6F0] text-[#261E1E] p-4 rounded-lg shadow-xl border border-[#C5A059]/30 hidden sm:block max-w-xs">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4A1525]">
                    <Award className="w-4 h-4 text-[#C5A059]" />
                    <span>Pure Organic Integrity</span>
                  </div>
                  <p className="text-[11px] text-zinc-600 mt-1 leading-snug">
                    Zero synthetic parabens, phthalates, or fillers. 100% cruelty-free formulation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 bg-white border border-[#261E1E]/8 rounded-xl shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#F8EBEF] flex items-center justify-center shrink-0 text-[#4A1525]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-base font-semibold text-[#261E1E]">Cash on Delivery</h3>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Zero advance card charges. Verify your seals upon delivery and pay cash directly.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#F8EBEF] flex items-center justify-center shrink-0 text-[#4A1525]">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-base font-semibold text-[#261E1E]">Cold-Pressed Potency</h3>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Extracted under controlled low temperatures to preserve delicate bio-actives.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#F8EBEF] flex items-center justify-center shrink-0 text-[#4A1525]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-base font-semibold text-[#261E1E]">Express Courier</h3>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Free insulated delivery on all orders over $100. Dispatched within 24 hours.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#F8EBEF] flex items-center justify-center shrink-0 text-[#4A1525]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-base font-semibold text-[#261E1E]">Complimentary Samples</h3>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Every COD order includes two deluxe travel botanical samples of your choice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED BOTANICAL COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 pb-4 border-b border-[#261E1E]/10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
              Curated Harvest
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#261E1E]">
              Featured Botanical Formulations
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="mt-3 sm:mt-0 text-xs font-semibold text-[#4A1525] hover:text-[#360D19] transition-colors inline-flex items-center gap-1.5"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-lg bg-zinc-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProducts.slice(0, 6).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. CATEGORY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059] block mb-2">
            The Realms of Formulation
          </span>
          <h2 className="font-serif-luxury text-3xl font-bold text-[#261E1E]">
            Shop by Botanical Discipline
          </h2>
          <p className="text-xs text-zinc-500 mt-2">
            Explore dedicated botanical categories created for restorative face care, ambient atmosphere, and silk body treatments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop')}
              className="group relative rounded-xl overflow-hidden shadow-md cursor-pointer aspect-[3/4] bg-[#261E1E]"
            >
              <img
                src={cat.imageUrl}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[11px] text-[#C5A059] uppercase tracking-wider font-semibold">
                  {cat.productCount || 4} Remedies
                </span>
                <h3 className="font-serif-luxury text-xl font-bold mt-1 text-white group-hover:text-[#DDA5B0] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-zinc-300 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white/90">
                  <span>Explore category</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BRAND CRAFTSMANSHIP STORY */}
      <section className="bg-[#F6F2EB] py-16 sm:py-20 border-y border-[#261E1E]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059] block">
                Heritage & Alchemy
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#261E1E] leading-tight">
                Crafted in Grasse, Preserved with Reverence.
              </h2>
              <p className="text-xs sm:text-sm text-[#3D3131] leading-relaxed">
                Founded on the belief that radiant epidermis requires patience, each Aurelia formulation begins in sunlit French valleys. We work hand-in-hand with multi-generational organic growers to harvest botanicals at twilight when their therapeutic volatile terpenes are most vibrant.
              </p>
              <p className="text-xs sm:text-sm text-[#3D3131] leading-relaxed">
                We reject opaque online payment gateways and forced digital checkouts. With our trusted <strong>Cash on Delivery</strong> system, you take custody of your package, inspect the artisanal seals, and remit payment only when you are completely satisfied.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('about')}
                  className="px-6 py-3 bg-[#4A1525] hover:bg-[#360D19] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  Read Our Full Ethos
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-md">
                <img
                  src="/src/assets/images/product_velvet_plum_creme_1790592680430.jpg"
                  alt="Velvet Plum Creme Detail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-md mt-6">
                <img
                  src="/src/assets/images/product_champagne_candle_1790592691479.jpg"
                  alt="Artisanal Soy Candle"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED PATRON TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059] block mb-2">
            Voices of Patrons
          </span>
          <h2 className="font-serif-luxury text-3xl font-bold text-[#261E1E]">
            Verified Customer Experiences
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-[#261E1E]/8 rounded-xl shadow-xs space-y-4">
            <div className="flex text-amber-600">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-[#261E1E] leading-relaxed italic">
              "The Aura Rose Elixir arrived within 48 hours. The courier waited patiently while I verified the bottle's intact glass seal before paying the cash amount. True old-world luxury and zero fraud worries."
            </p>
            <div className="pt-2 border-t border-[#261E1E]/5 flex items-center justify-between text-xs">
              <span className="font-semibold text-[#261E1E]">Elena Vance</span>
              <span className="text-emerald-700 text-[11px] font-medium">Verified COD Patron</span>
            </div>
          </div>

          <div className="p-6 bg-white border border-[#261E1E]/8 rounded-xl shadow-xs space-y-4">
            <div className="flex text-amber-600">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-[#261E1E] leading-relaxed italic">
              "I bought the Champagne & Amber candle for our penthouse drawing room. The scent projection is divine. And paying Cash on Delivery was seamless and refreshing."
            </p>
            <div className="pt-2 border-t border-[#261E1E]/5 flex items-center justify-between text-xs">
              <span className="font-semibold text-[#261E1E]">Marcus Sterling</span>
              <span className="text-emerald-700 text-[11px] font-medium">Verified COD Patron</span>
            </div>
          </div>

          <div className="p-6 bg-white border border-[#261E1E]/8 rounded-xl shadow-xs space-y-4">
            <div className="flex text-amber-600">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-[#261E1E] leading-relaxed italic">
              "The Velvet Plum Creme restored my sensitized barrier after just three nights. Exceptional formulation, transparent ingredients, and trustworthy cash checkout."
            </p>
            <div className="pt-2 border-t border-[#261E1E]/5 flex items-center justify-between text-xs">
              <span className="font-semibold text-[#261E1E]">Sophia Lindqvist</span>
              <span className="text-emerald-700 text-[11px] font-medium">Verified COD Patron</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DISPATCH REASSURANCE CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="p-10 sm:p-14 bg-[#4A1525] text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-xs text-[#C5A059] uppercase tracking-[0.2em] font-bold">
              Immediate Doorstep Delivery
            </span>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-medium">
              Ready to Experience Haute Botanical Rituals?
            </h3>
            <p className="text-xs text-[#F8EBEF]/80 max-w-lg leading-relaxed">
              Order your curated items today with 100% Cash on Delivery. Enjoy free shipping on all orders over $100.
            </p>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="px-8 py-4 bg-[#C5A059] hover:bg-[#E6CA85] text-[#261E1E] text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-lg whitespace-nowrap"
          >
            Shop All Formulations
          </button>
        </div>
      </section>
    </div>
  );
};
