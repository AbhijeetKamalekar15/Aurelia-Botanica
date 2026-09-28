import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { productService } from '../../services/api';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onViewAllResults: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onViewAllResults,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [recentSearches] = useState(['Rose Elixir', 'Plum Creme', 'Artisanal Candle', 'Bakuchiol']);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await productService.getProducts({ search: query });
      setResults(res.slice(0, 5));
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      onViewAllResults(query.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" />

      <div className="flex min-h-full items-start justify-center p-4 pt-20">
        <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-[#261E1E]/10 animate-in fade-in zoom-in-95">
          {/* Search Input Bar */}
          <div className="p-4 border-b border-[#261E1E]/10 flex items-center gap-3">
            <Search className="w-5 h-5 text-[#C5A059] shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search botanical elixirs, cremes, candles..."
              className="w-full text-base bg-transparent text-[#261E1E] placeholder-zinc-400 focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1 text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            )}
            <button onClick={onClose} className="text-xs font-semibold text-zinc-500 hover:text-[#261E1E] px-2 py-1">
              Esc
            </button>
          </div>

          {/* Quick Suggestions / Recent Searches */}
          {!query && (
            <div className="p-6 bg-[#FBF9F5]">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-3">
                Suggested Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 text-xs bg-white border border-[#261E1E]/10 rounded hover:border-[#4A1525] hover:text-[#4A1525] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Results */}
          {query && results.length > 0 && (
            <div className="divide-y divide-[#261E1E]/5 max-h-96 overflow-y-auto">
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="flex items-center gap-4 p-4 hover:bg-[#FBF9F5] cursor-pointer transition-colors"
                >
                  <img
                    src={product.images[0] || '/src/assets/images/product_rose_face_elixir_1790592668403.jpg'}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded bg-[#F6F2EB] shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-[#261E1E] font-serif-luxury">{product.name}</h4>
                    <span className="text-[11px] text-zinc-500">{product.categoryName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#4A1525] tabular-nums">
                      ${(product.discountPrice || product.price).toFixed(2)}
                    </span>
                    <span className="block text-[10px] text-emerald-700">COD Available</span>
                  </div>
                </div>
              ))}

              <div className="p-3 bg-[#F6F2EB] text-center">
                <button
                  onClick={() => {
                    onViewAllResults(query);
                    onClose();
                  }}
                  className="text-xs font-semibold text-[#4A1525] hover:underline inline-flex items-center gap-1.5"
                >
                  <span>View all matching results</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* No results */}
          {query && results.length === 0 && (
            <div className="p-8 text-center text-zinc-500 text-xs">
              No botanical remedies found for "{query}". Try searching for 'Elixir', 'Creme', or 'Candle'.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
