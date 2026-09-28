import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { productService } from '../../services/api';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

interface WishlistPageProps {
  onSelectProduct: (product: Product) => void;
  onExplore: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onSelectProduct, onExplore }) => {
  const { wishlistIds, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlist() {
      setLoading(true);
      try {
        const all = await productService.getProducts();
        setProducts(all.filter((p) => wishlistIds.includes(p.id)));
      } catch (err) {
        console.error('Failed to load wishlist items', err);
      } finally {
        setLoading(false);
      }
    }
    loadWishlist();
  }, [wishlistIds]);

  const handleMoveToBag = (product: Product) => {
    const success = addItem(product, 1);
    if (success) {
      removeFromWishlist(product.id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      <div className="border-b border-[#261E1E]/10 pb-4">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
          Saved Remedies
        </span>
        <h1 className="font-serif-luxury text-3xl font-bold text-[#261E1E]">Your Curated Wishlist</h1>
        <p className="text-xs text-zinc-500 mt-1">
          {products.length} formulation{products.length === 1 ? '' : 's'} saved for future Cash on Delivery ordering.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 bg-zinc-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-[#261E1E]/10 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F8EBEF] text-[#4A1525] flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-serif-luxury text-xl font-bold text-[#261E1E]">Your Wishlist is Empty</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Save botanical elixirs, restorative cremes, and candles as you browse our collections.
          </p>
          <button
            onClick={onExplore}
            className="px-6 py-2.5 bg-[#4A1525] text-white text-xs font-semibold rounded hover:bg-[#360D19] inline-flex items-center gap-2"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const effectivePrice = product.discountPrice || product.price;
            const isOutOfStock = product.stockQuantity <= 0;

            return (
              <div
                key={product.id}
                className="bg-white border border-[#261E1E]/8 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div
                  onClick={() => onSelectProduct(product)}
                  className="cursor-pointer aspect-[4/3] bg-[#F6F2EB] relative overflow-hidden"
                >
                  <img
                    src={product.images[0] || '/src/assets/images/product_rose_face_elixir_1790592668403.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full text-zinc-500 hover:text-rose-600 transition-colors shadow-xs"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                      {product.categoryName}
                    </span>
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="font-serif-luxury text-base font-semibold text-[#261E1E] hover:text-[#4A1525] cursor-pointer transition-colors"
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1 tabular-nums">
                      <span className="text-base font-bold text-[#4A1525]">${effectivePrice.toFixed(2)}</span>
                      {product.discountPrice && (
                        <span className="text-xs text-zinc-400 line-through">${product.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#261E1E]/8 flex items-center gap-2">
                    <button
                      onClick={() => handleMoveToBag(product)}
                      disabled={isOutOfStock}
                      className={`flex-1 py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        isOutOfStock
                          ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                          : 'bg-[#4A1525] hover:bg-[#360D19] text-white shadow-xs'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{isOutOfStock ? 'Sold Out' : 'Move to Bag'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
