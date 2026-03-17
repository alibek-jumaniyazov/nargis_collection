import { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockProducts } from '../../data/mockData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim().length > 1
    ? mockProducts.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5)
    : [];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white max-w-2xl mx-auto mt-20 mx-4 shadow-2xl animate-fade-in">
        {/* Search Input */}
        <div className="flex items-center border-b border-[#eaeaea] px-6 py-5">
          <Search size={18} className="text-[#6b6b6b] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="flex-1 ml-4 text-sm bg-transparent outline-none placeholder:text-[#aaa]"
          />
          <button onClick={onClose} className="text-[#6b6b6b] hover:text-[#111111] transition-colors ml-4">
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul className="py-2 max-h-80 overflow-y-auto">
            {results.map((product) => (
              <li key={product.id}>
                <Link
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 px-6 py-3 hover:bg-[#f7f7f7] transition-colors"
                >
                  <div className="w-12 h-16 bg-[#f7f7f7] flex-shrink-0 overflow-hidden">
                    <img
                      src={product.coverImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-[#6b6b6b] mt-0.5">{product.category.name}</p>
                    <p className="text-sm font-medium mt-1">
                      ${(product.salePrice || product.price).toLocaleString()}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {query.trim().length > 1 && results.length === 0 && (
          <div className="py-8 text-center text-sm text-[#6b6b6b]">
            No results for "{query}"
          </div>
        )}

        {query.trim().length < 2 && (
          <div className="px-6 py-6">
            <p className="text-xs text-[#6b6b6b] tracking-[0.1em] uppercase mb-4">Trending</p>
            <div className="flex flex-wrap gap-2">
              {['Blazer', 'Silk Dress', 'Coat', 'Knitwear', 'Leather Bag'].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="text-xs border border-[#eaeaea] px-4 py-2 hover:border-[#111111] hover:bg-[#111111] hover:text-white transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
