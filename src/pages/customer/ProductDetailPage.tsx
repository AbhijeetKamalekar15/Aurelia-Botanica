import React, { useState, useEffect } from 'react';
import {
  Star,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { Product, Review } from '../../types';
import { reviewService, productService } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ProductCard } from '../../components/common/ProductCard';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onProceedToCheckout: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  onSelectProduct,
  onProceedToCheckout,
}) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { currentUser, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'rituals'>('details');

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImage(0);
    setQuantity(1);

    async function loadProductData() {
      try {
        const [revs, allProds] = await Promise.all([
          reviewService.getProductReviews(product.id),
          productService.getProducts({ categoryId: product.categoryId }),
        ]);
        setReviews(revs);
        setRelatedProducts(allProds.filter((p) => p.id !== product.id).slice(0, 3));
      } catch (err) {
        console.error('Error fetching product details', err);
      }
    }
    loadProductData();
  }, [product.id, product.categoryId]);

  const isSaved = isInWishlist(product.id);
  const effectivePrice = product.discountPrice || product.price;
  const isOutOfStock = product.stockQuantity <= 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    const success = addItem(product, quantity);
    if (success) {
      onProceedToCheckout();
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !currentUser) {
      showToast('Please sign in to submit a review.', 'info');
      return;
    }
    if (!newTitle.trim() || !newComment.trim()) {
      showToast('Please provide both a title and review feedback.', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      const added = await reviewService.addReview(
        product.id,
        currentUser.id,
        currentUser.name,
        newRating,
        newTitle,
        newComment
      );
      setReviews((prev) => [added, ...prev]);
      setNewTitle('');
      setNewComment('');
      setNewRating(5);
      showToast('Thank you! Your verified review has been published.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumbs & Back Navigation */}
      <nav className="flex items-center justify-between text-xs text-zinc-500">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[#4A1525] font-semibold hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span>Home</span>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <span>{product.categoryName}</span>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <span className="text-[#261E1E] font-medium truncate max-w-xs">{product.name}</span>
        </div>
      </nav>

      {/* CONTIGUOUS PURCHASE MODULE & GALLERY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Gallery Left (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Visual Display */}
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#F6F2EB] shadow-md border border-[#261E1E]/8">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all bg-[#F6F2EB] ${
                    selectedImage === idx
                      ? 'border-[#4A1525] shadow-sm'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Reassurance Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#261E1E]/10">
            <div className="flex items-center gap-2.5 text-xs text-[#261E1E]">
              <ShieldCheck className="w-4 h-4 text-[#4A1525] shrink-0" />
              <span>Strict Cash on Delivery</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#261E1E]">
              <Truck className="w-4 h-4 text-[#4A1525] shrink-0" />
              <span>Insulated Express Dispatch</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#261E1E]">
              <RotateCcw className="w-4 h-4 text-[#4A1525] shrink-0" />
              <span>Doorstep Inspection Policy</span>
            </div>
          </div>
        </div>

        {/* Purchase Module Right (5 cols on desktop, sticky) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-[#261E1E]/10 shadow-sm space-y-6 lg:sticky lg:top-28">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
              <span className="uppercase tracking-widest font-semibold text-[#4A1525] text-[11px]">
                {product.categoryName}
              </span>
              <span className="font-mono text-[11px]">SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#261E1E] leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2.5">
              <div className="flex text-amber-600">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.averageRating) ? 'fill-current' : 'text-zinc-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-[#261E1E] tabular-nums">
                {product.averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-zinc-500">
                · {reviews.length} Verified Patron Reviews
              </span>
            </div>

            {/* Price Line */}
            <div className="flex items-baseline gap-3 mt-4 pt-4 border-t border-[#261E1E]/8 tabular-nums">
              <span className="text-3xl font-bold text-[#4A1525]">${effectivePrice.toFixed(2)}</span>
              {product.discountPrice && (
                <span className="text-sm text-zinc-400 line-through">${product.price.toFixed(2)}</span>
              )}
              {product.discountPrice && (
                <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Save ${(product.price - product.discountPrice).toFixed(0)}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            <div className="mt-2 text-xs">
              {isOutOfStock ? (
                <span className="text-rose-700 font-semibold uppercase tracking-wider">
                  Out of Stock — Register for harvest restock alert
                </span>
              ) : product.stockQuantity <= product.minStockThreshold ? (
                <span className="text-amber-800 font-semibold">
                  Only {product.stockQuantity} bottles left in this small batch
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> In Stock for Immediate Dispatch
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-600 mt-3 leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          {/* COD Notice Box */}
          <div className="p-3.5 bg-[#F8EBEF] border border-[#C77D8D]/30 rounded-lg flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#4A1525] shrink-0 mt-0.5" />
            <div className="text-xs text-[#3D3131] leading-relaxed">
              <strong className="text-[#4A1525] block font-semibold">100% Cash on Delivery (COD)</strong>
              Pay ${((effectivePrice) * quantity).toFixed(2)} in cash directly to our courier upon arrival. Inspect your items with confidence before handing over payment.
            </div>
          </div>

          {/* Quantity Selector & CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[#261E1E]/20 rounded-md bg-[#FBF9F5]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2.5 text-zinc-600 hover:text-[#4A1525] font-semibold"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 py-2 text-sm font-bold tabular-nums text-[#261E1E]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                  className="px-3.5 py-2.5 text-zinc-600 hover:text-[#4A1525] font-semibold"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Bag */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3 px-4 rounded-md text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm ${
                  isOutOfStock
                    ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                    : 'bg-[#4A1525] hover:bg-[#360D19] text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-md border transition-colors ${
                  isSaved
                    ? 'bg-[#4A1525] border-[#4A1525] text-white shadow-xs'
                    : 'border-[#261E1E]/20 text-[#261E1E] hover:text-[#4A1525] bg-white'
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Buy Now (Immediate Checkout) */}
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full py-3 bg-[#C5A059] hover:bg-[#E6CA85] text-[#261E1E] text-xs font-bold uppercase tracking-wider rounded-md transition-colors shadow-sm"
            >
              Order Now with Cash on Delivery
            </button>
          </div>
        </div>
      </div>

      {/* TABS: Description / Specs / Rituals */}
      <section className="bg-white rounded-2xl border border-[#261E1E]/8 p-6 sm:p-10 shadow-xs">
        {/* Tabs Bar */}
        <div className="flex border-b border-[#261E1E]/10 gap-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === 'details' ? 'text-[#4A1525]' : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            Formulation & Ethos
            {activeTab === 'details' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#4A1525]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === 'specs' ? 'text-[#4A1525]' : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            Artisanal Specifications
            {activeTab === 'specs' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#4A1525]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('rituals')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === 'rituals' ? 'text-[#4A1525]' : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            Application Ritual
            {activeTab === 'rituals' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#4A1525]" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-6">
          {activeTab === 'details' && (
            <div className="space-y-4 max-w-3xl">
              <p className="text-xs sm:text-sm text-[#3D3131] leading-relaxed">
                {product.description}
              </p>
              <div className="p-4 bg-[#FBF9F5] rounded-lg border border-[#261E1E]/5 mt-4">
                <h4 className="text-xs font-bold text-[#4A1525] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Harvest Integrity</span>
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Extracted without chemical solvents. Formulated in recyclable heavy European glass vessels to shield active phytonutrients from photochemical degradation.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <dl className="divide-y divide-[#261E1E]/8 text-xs">
                {Object.entries(product.specifications || {}).map(([key, val]) => (
                  <div key={key} className="py-2.5 grid grid-cols-3">
                    <dt className="font-semibold text-[#261E1E]">{key}</dt>
                    <dd className="col-span-2 text-zinc-600">{val}</dd>
                  </div>
                ))}
                <div className="py-2.5 grid grid-cols-3">
                  <dt className="font-semibold text-[#261E1E]">Payment Mode</dt>
                  <dd className="col-span-2 text-[#4A1525] font-semibold">Exclusively Cash on Delivery</dd>
                </div>
              </dl>
            </div>
          )}

          {activeTab === 'rituals' && (
            <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-[#3D3131] leading-relaxed">
              <h4 className="font-serif-luxury text-lg font-semibold text-[#261E1E]">The Aurelia Sensory Ritual</h4>
              <p>
                1. Warm 3 to 4 drops between the palms of your hands to activate cold-pressed botanical lipids.
              </p>
              <p>
                2. Inhale deeply for three slow diaphragmatic breaths, taking in natural Damascena notes.
              </p>
              <p>
                3. Gently press onto cleansed damp skin in upward sweeping motions across collarbones, neck, and cheekbones.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CUSTOMER REVIEWS & FORM */}
      <section className="bg-white rounded-2xl border border-[#261E1E]/8 p-6 sm:p-10 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between border-b border-[#261E1E]/10 pb-4 gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
              Patron Commentary
            </span>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#261E1E]">
              Verified Reviews & Testimonials ({reviews.length})
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-amber-700 text-base">{product.averageRating.toFixed(1)} / 5.0</span>
            <span className="text-zinc-500">Overall Satisfaction</span>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6 divide-y divide-[#261E1E]/8">
          {reviews.length === 0 ? (
            <p className="text-xs text-zinc-500 py-4">
              Be the first patron to share your experience with this formulation.
            </p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="pt-6 first:pt-0 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#261E1E]">{rev.userName}</span>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex text-amber-600">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-zinc-200'}`}
                    />
                  ))}
                </div>

                <h4 className="text-xs font-bold text-[#261E1E]">{rev.title}</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          )}
        </div>

        {/* Submit Review Form */}
        <div className="pt-8 border-t border-[#261E1E]/10">
          <h4 className="font-serif-luxury text-xl font-bold text-[#261E1E] mb-2">Write a Patron Review</h4>
          <p className="text-xs text-zinc-500 mb-6">
            Share your candid feedback with our atelier community.
          </p>

          {isAuthenticated ? (
            <form onSubmit={handleSubmitReview} className="max-w-xl space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#261E1E] block mb-1">Your Rating</label>
                <div className="flex items-center gap-1 text-amber-600 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${star <= newRating ? 'fill-current' : 'text-zinc-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#261E1E] block mb-1">Headline Summary</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Sublime fragrance and deeply replenishing"
                  className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded p-2.5 focus:outline-none focus:border-[#4A1525]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#261E1E] block mb-1">Detailed Commentary</label>
                <textarea
                  required
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Describe texture, skin feel, longevity..."
                  className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded p-2.5 focus:outline-none focus:border-[#4A1525]"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2.5 bg-[#4A1525] hover:bg-[#360D19] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors"
              >
                {submittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          ) : (
            <div className="p-4 bg-[#FBF9F5] rounded border border-[#261E1E]/10 text-xs text-zinc-600">
              Please sign in with your customer account to submit a verified patron review.
            </div>
          )}
        </div>
      </section>

      {/* RELATED FORMULATIONS */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="border-b border-[#261E1E]/10 pb-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
              Complementary Rituals
            </span>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#261E1E]">
              Related Formulations
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onSelect={onSelectProduct}
                onQuickView={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
