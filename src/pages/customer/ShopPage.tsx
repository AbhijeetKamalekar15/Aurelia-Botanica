import React, { useState, useEffect, useMemo } from 'react';
import { Filter, SlidersHorizontal, X, Search, RotateCcw } from 'lucide-react';
import { Product, Category } from '../../types';
import { productService, categoryService } from '../../services/api';
import { ProductCard } from '../../components/common/ProductCard';

interface ShopPageProps {
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  initialCategory?: string;
  initialSearch?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  onSelectProduct,
  onQuickView,
  initialCategory = 'all',
  initialSearch = '',
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [allCats, allProds] = await Promise.all([
          categoryService.getCategories(),
          productService.getProducts(),
        ]);
        setCategories(allCats);
        setProducts(allProds);
      } catch (err) {
        console.error('Failed to load shop products', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;

        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchCat = p.categoryName.toLowerCase().includes(q);
          const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchCat && !matchTags) return false;
        }

        // Price
        const effectivePrice = p.discountPrice || p.price;
        if (effectivePrice > maxPrice) return false;

        // Rating
        if (minRating > 0 && p.averageRating < minRating) return false;

        // In Stock
        if (inStockOnly && p.stockQuantity <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') {
          return (a.discountPrice || a.price) - (b.discountPrice || b.price);
        } else if (sortBy === 'price-desc') {
          return (b.discountPrice || b.price) - (a.discountPrice || a.price);
        } else if (sortBy === 'rating') {
          return b.averageRating - a.averageRating;
        } else if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else {
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
      });
  }, [products, selectedCategory, searchQuery, maxPrice, minRating, inStockOnly, sortBy]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, maxPrice, minRating, inStockOnly, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
    setMinRating(0);
    setMaxPrice(200);
    setInStockOnly(false);
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    searchQuery.trim() !== '' ||
    minRating > 0 ||
    maxPrice < 200 ||
    inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header Banner */}
      <div className="border-b border-[#261E1E]/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
            Artisanal Dispensary
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#261E1E]">
            All Formulations & Home Scents
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Showing {filteredProducts.length} small-batch items available for instant Cash on Delivery dispatch.
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex-1 py-2 px-4 bg-white border border-[#261E1E]/15 rounded text-xs font-semibold flex items-center justify-center gap-2 text-[#261E1E]"
          >
            <Filter className="w-3.5 h-3.5 text-[#4A1525]" />
            <span>Refine Catalog ({hasActiveFilters ? 'Active' : 'All'})</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-xl border border-[#261E1E]/8 h-fit sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-[#261E1E]/10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#261E1E]">
              <SlidersHorizontal className="w-4 h-4 text-[#4A1525]" />
              <span>Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-[#4A1525] hover:underline font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Search Field */}
          <div>
            <label className="text-xs font-semibold text-[#261E1E] uppercase tracking-wider block mb-2">
              Keywords
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search botanicals..."
                className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded px-3 py-2 pl-8 focus:outline-none focus:border-[#4A1525]"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2.5 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-xs font-semibold text-[#261E1E] uppercase tracking-wider block mb-2">
              Discipline
            </label>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left py-1.5 px-2 rounded transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#F8EBEF] text-[#4A1525] font-bold'
                    : 'text-[#3D3131] hover:bg-[#FBF9F5]'
                }`}
              >
                All Categories ({products.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left py-1.5 px-2 rounded transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-[#F8EBEF] text-[#4A1525] font-bold'
                      : 'text-[#3D3131] hover:bg-[#FBF9F5]'
                  }`}
                >
                  {cat.name} ({cat.productCount || 0})
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#261E1E] uppercase tracking-wider">
                Max Price
              </label>
              <span className="text-xs font-bold tabular-nums text-[#4A1525]">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="40"
              max="200"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#4A1525] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
              <span>$40</span>
              <span>$200</span>
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="text-xs font-semibold text-[#261E1E] uppercase tracking-wider block mb-2">
              Minimum Rating
            </label>
            <div className="space-y-1 text-xs">
              {[0, 4.5, 4.8].map((stars) => (
                <label key={stars} className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="radio"
                    name="minRating"
                    checked={minRating === stars}
                    onChange={() => setMinRating(stars)}
                    className="accent-[#4A1525]"
                  />
                  <span className="text-zinc-600">
                    {stars === 0 ? 'Any Rating' : `${stars}+ Stars`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="pt-2 border-t border-[#261E1E]/10">
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-[#4A1525] rounded"
              />
              <span className="text-[#261E1E] font-medium">In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* PRODUCTS LISTING AREA */}
        <main className="lg:col-span-3 space-y-6">
          {/* Sorting and Results Count Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg border border-[#261E1E]/8 text-xs">
            <span className="text-zinc-500 font-medium">
              Showing {paginatedProducts.length} of {filteredProducts.length} remedies
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-zinc-600 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-[#FBF9F5] border border-[#261E1E]/15 rounded px-3 py-1.5 text-xs text-[#261E1E] focus:outline-none focus:border-[#4A1525] w-full sm:w-auto cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest Harvest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Patron Rating</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 bg-zinc-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-[#261E1E]/10 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#F8EBEF] text-[#4A1525] flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#261E1E]">No Formulations Found</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                We could not find any items matching your active filter criteria. Try expanding your price range or resetting keywords.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-[#4A1525] text-white text-xs font-semibold rounded hover:bg-[#360D19] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  onQuickView={onQuickView}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-white border border-[#261E1E]/15 rounded text-xs text-[#261E1E] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FBF9F5]"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded text-xs font-semibold transition-colors ${
                      currentPage === pageNum
                        ? 'bg-[#4A1525] text-white'
                        : 'bg-white border border-[#261E1E]/15 text-[#261E1E] hover:bg-[#FBF9F5]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-white border border-[#261E1E]/15 rounded text-xs text-[#261E1E] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FBF9F5]"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE FILTER MODAL */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto lg:hidden">
          <div onClick={() => setMobileFilterOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="relative min-h-screen bg-white p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#261E1E]/10">
                <h3 className="font-serif-luxury text-xl font-bold text-[#261E1E]">Filter Catalog</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-zinc-500">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#261E1E] block mb-2">Category</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded text-xs ${
                      selectedCategory === 'all' ? 'bg-[#4A1525] text-white font-bold' : 'bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    All
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`px-3 py-1.5 rounded text-xs ${
                        selectedCategory === c.id ? 'bg-[#4A1525] text-white font-bold' : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold uppercase tracking-wider text-[#261E1E]">Max Price</span>
                  <span className="font-bold text-[#4A1525]">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="200"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#4A1525]"
                />
              </div>

              {/* In Stock */}
              <label className="flex items-center gap-2 text-xs font-medium">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#4A1525]"
                />
                <span>In Stock Items Only</span>
              </label>
            </div>

            <div className="pt-6 border-t border-[#261E1E]/10 flex gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 bg-zinc-100 text-zinc-800 text-xs font-semibold rounded"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 bg-[#4A1525] text-white text-xs font-semibold rounded"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
