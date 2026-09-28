import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, ShieldCheck, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onViewFullDetails: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose, onViewFullDetails }) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isSaved = isInWishlist(product.id);
  const effectivePrice = product.discountPrice || product.price;
  const isOutOfStock = product.stockQuantity <= 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-[#FBF9F5] rounded-xl shadow-2xl overflow-hidden border border-[#261E1E]/10 animate-in fade-in zoom-in-95">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full text-zinc-600 hover:text-[#261E1E] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery Left */}
            <div className="bg-[#F6F2EB] p-6 flex flex-col items-center justify-center">
              <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-white shadow-sm mb-4">
                <img
                  src={product.images[selectedImageIdx] || product.images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-2 w-full overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIdx(i)}
                      className={`w-14 h-14 rounded overflow-hidden border-2 transition-all ${
                        selectedImageIdx === i ? 'border-[#4A1525]' : 'border-transparent opacity-70'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Right */}
            <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-[#3D3131]/70 mb-1">
                  <span className="uppercase tracking-wider font-semibold text-[11px]">{product.categoryName}</span>
                  <span className="text-[11px] text-zinc-500 font-mono">SKU: {product.sku}</span>
                </div>

                <h2 className="font-serif-luxury text-2xl font-bold text-[#261E1E] leading-snug">
                  {product.name}
                </h2>

                <div className="flex items-center gap-2 mt-2">
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
                  <span className="text-xs font-semibold text-[#261E1E]">{product.averageRating.toFixed(1)}</span>
                  <span className="text-xs text-zinc-500">({product.reviewCount} customer reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mt-4 tabular-nums">
                  <span className="text-2xl font-bold text-[#4A1525]">${effectivePrice.toFixed(2)}</span>
                  {product.discountPrice && (
                    <span className="text-sm text-zinc-400 line-through">${product.price.toFixed(2)}</span>
                  )}
                  {isOutOfStock ? (
                    <span className="text-xs text-rose-700 font-semibold uppercase tracking-wider">Out of Stock</span>
                  ) : (
                    <span className="text-xs text-emerald-700 font-semibold uppercase tracking-wider flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> In Stock ({product.stockQuantity} available)
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-600 mt-3 leading-relaxed">
                  {product.shortDescription}
                </p>

                {/* COD Guarantee Badge */}
                <div className="mt-4 p-2.5 bg-[#F8EBEF] border border-[#C77D8D]/30 rounded flex items-center gap-2 text-xs text-[#4A1525]">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>Eligible for 100% Cash on Delivery with doorstep inspection</span>
                </div>
              </div>

              {/* Purchase Action */}
              <div className="space-y-3 pt-4 border-t border-[#261E1E]/10">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#261E1E]/20 rounded bg-white">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-zinc-600 hover:text-[#4A1525]"
                    >
                      -
                    </button>
                    <span className="px-3 py-2 text-xs font-bold tabular-nums">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                      className="px-3 py-2 text-zinc-600 hover:text-[#4A1525]"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 py-2.5 px-4 rounded text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm ${
                      isOutOfStock
                        ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                        : 'bg-[#4A1525] hover:bg-[#360D19] text-white'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                    <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-2.5 rounded border transition-colors ${
                      isSaved
                        ? 'bg-[#4A1525] border-[#4A1525] text-white'
                        : 'border-[#261E1E]/20 text-[#261E1E] hover:text-[#4A1525] bg-white'
                    }`}
                    aria-label="Wishlist toggle"
                  >
                    <Heart className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onViewFullDetails(product);
                  }}
                  className="w-full text-center text-xs text-[#4A1525] hover:underline font-semibold"
                >
                  View Full Botanical Specifications & Reviews →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
