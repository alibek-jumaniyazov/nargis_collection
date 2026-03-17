import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { mockProducts, mockCategories } from '../data/mockData';
import ProductGrid from '../components/product/ProductGrid';
import type { Product } from '../types';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'featured', label: 'Featured' },
];

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(1000);
  const [sort, setSort] = useState('newest');

  const category = mockCategories.find((c) => c.slug === slug);
  const isNew = slug === 'new';

  const filtered = useMemo(() => {
    let products = isNew
      ? mockProducts.filter((p) => p.isNewArrival)
      : mockProducts.filter((p) => p.category.slug === slug || p.gender === slug);

    if (selectedSizes.length > 0) {
      products = products.filter((p) =>
        p.sizes.some((s) => selectedSizes.includes(s.size) && s.stock > 0)
      );
    }
    products = products.filter((p) => (p.salePrice || p.price) <= priceMax);

    switch (sort) {
      case 'price-asc':
        return [...products].sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
      case 'price-desc':
        return [...products].sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
      case 'featured':
        return [...products].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      default:
        return [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [slug, selectedSizes, priceMax, sort, isNew]);

  const title = isNew ? 'New Arrivals' : (category?.name || slug?.charAt(0).toUpperCase() + (slug?.slice(1) || ''));

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="py-12 md:py-16 text-center border-b border-[#eaeaea]">
        <p className="text-[10px] tracking-[0.2em] text-[#6b6b6b] uppercase mb-2">Collection</p>
        <h1 className="font-serif text-4xl md:text-5xl font-light">{title}</h1>
        <p className="text-sm text-[#6b6b6b] mt-2">{filtered.length} items</p>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#eaeaea]">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 text-[11px] tracking-[0.1em] hover:text-[#6b6b6b] transition-colors"
          >
            <SlidersHorizontal size={15} />
            FILTER {(selectedSizes.length > 0) ? `(${selectedSizes.length})` : ''}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] tracking-[0.1em] text-[#6b6b6b]">SORT BY</span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none text-[11px] tracking-[0.08em] pl-2 pr-6 py-1 border-b border-[#111111] bg-transparent cursor-pointer focus:outline-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-0 top-1.5 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          {isFilterOpen && (
            <aside className="w-56 flex-shrink-0 animate-fade-in">
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[11px] tracking-[0.1em] font-medium">FILTERS</h3>
                  <button onClick={() => setIsFilterOpen(false)} className="text-[#6b6b6b] hover:text-[#111111]">
                    <X size={16} />
                  </button>
                </div>

                {/* Size Filter */}
                <div className="mb-8">
                  <h4 className="text-xs tracking-[0.08em] font-medium mb-4">SIZE</h4>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() =>
                          setSelectedSizes((prev) =>
                            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
                          )
                        }
                        className={`w-10 h-10 text-xs border transition-all ${
                          selectedSizes.includes(size)
                            ? 'border-[#111111] bg-[#111111] text-white'
                            : 'border-[#eaeaea] hover:border-[#111111]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="mb-8">
                  <h4 className="text-xs tracking-[0.08em] font-medium mb-4">
                    MAX PRICE: ${priceMax}
                  </h4>
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    step={50}
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full accent-[#111111]"
                  />
                  <div className="flex justify-between text-xs text-[#6b6b6b] mt-1">
                    <span>$0</span>
                    <span>$1000</span>
                  </div>
                </div>

                {/* Clear */}
                {(selectedSizes.length > 0 || priceMax < 1000) && (
                  <button
                    onClick={() => { setSelectedSizes([]); setPriceMax(1000); }}
                    className="text-xs underline text-[#6b6b6b] hover:text-[#111111] transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </aside>
          )}

          {/* Products */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-serif text-2xl font-light mb-3">No products found</p>
                <p className="text-sm text-[#6b6b6b]">Try adjusting your filters</p>
              </div>
            ) : (
              <ProductGrid
                products={filtered}
                columns={isFilterOpen ? 3 : 4}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
