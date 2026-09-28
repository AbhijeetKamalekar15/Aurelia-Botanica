import React, { useState } from 'react';
import { Eye, Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onQuickView }) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [imageError, setImageError] = useState(false);
  const isSaved = isInWishlist(product.id);
  const isOutOfStock = product.stockQuantity <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-white border border-[#261E1E]/8 rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
    >
      {/* Visual Slot: 65-75% height on neutral backdrop */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F6F2EB]">
        {!imageError && product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#F6F2EB] to-[#EFE9DF]">
            <span className="font-serif-luxury text-lg font-medium text-[#4A1525]">{product.name}</span>
            <span className="text-[11px] text-[#3D3131] uppercase tracking-wider mt-1">{product.categoryName}</span>
          </div>
        )}

        {/* Subtle Single Text Tag (No pill clusters) */}
        {product.discountPrice ? (
          <div className="absolute top-3 left-3 bg-[#4A1525] text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-sm">
            Save ${(product.price - product.discountPrice).toFixed(0)}
          </div>
        ) : product.newArrival ? (
          <div className="absolute top-3 left-3 bg-[#261E1E] text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-sm">
            New Harvest
          </div>
        ) : product.stockQuantity <= product.minStockThreshold && product.stockQuantity > 0 ? (
          <div className="absolute top-3 left-3 bg-amber-800 text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-sm">
            Only {product.stockQuantity} Left
          </div>
        ) : null}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            isSaved
              ? 'bg-[#4A1525] text-white shadow-md'
              : 'bg-white/80 backdrop-blur-sm text-[#261E1E] hover:bg-white hover:text-[#4A1525] shadow-sm'
          }`}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
        </button>

        {/* Quick View Hover Trigger */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex items-center gap-2">
          <button
            onClick={handleQuickView}
            className="flex-1 py-2 bg-white/95 backdrop-blur-md text-[#261E1E] text-xs font-semibold rounded shadow hover:bg-white transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-[#4A1525]" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Clean Metadata Section */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs text-[#3D3131]/70 mb-1.5">
          <span className="uppercase tracking-wider text-[11px] font-medium">{product.categoryName}</span>
          <div className="flex items-center gap-1 text-amber-700">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-semibold tabular-nums text-[#261E1E]">{product.averageRating.toFixed(1)}</span>
            <span className="text-[10px] text-zinc-500">({product.reviewCount})</span>
          </div>
        </div>

        <h3 className="font-serif-luxury text-base sm:text-lg font-semibold text-[#261E1E] group-hover:text-[#4A1525] transition-colors line-clamp-1">
          {product.name}
        </h3>

        <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
          {product.shortDescription}
        </p>

        {/* Price & Primary CTA Baseline */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-2 border-t border-[#261E1E]/5">
          <div className="flex items-baseline gap-2 tabular-nums">
            {product.discountPrice ? (
              <>
                <span className="text-base sm:text-lg font-bold text-[#4A1525]">
                  ${product.discountPrice.toFixed(2)}
                </span>
                <span className="text-xs text-zinc-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-base sm:text-lg font-bold text-[#261E1E]">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
              isOutOfStock
                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                : 'bg-[#4A1525] hover:bg-[#360D19] text-white shadow-sm hover:shadow'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
