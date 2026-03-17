import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '../store/wishlistStore';
import ProductGrid from '../components/product/ProductGrid';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-10 animate-fade-in">
      <div className="mb-10 text-center">
        <p className="text-[10px] tracking-[0.2em] text-[#6b6b6b] uppercase mb-2">Saved Items</p>
        <h1 className="font-serif text-4xl font-light">Wishlist</h1>
        <p className="text-sm text-[#6b6b6b] mt-2">{items.length} item{items.length !== 1 ? 's' : ''}</p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <Heart size={48} className="text-[#eaeaea]" />
          <div className="text-center">
            <p className="font-serif text-2xl font-light mb-2">Nothing saved yet</p>
            <p className="text-sm text-[#6b6b6b]">Browse our collections and save your favourite pieces</p>
          </div>
          <Link
            to="/"
            className="mt-4 bg-[#111111] text-white text-[11px] tracking-[0.12em] px-8 py-4 hover:bg-[#333] transition-colors"
          >
            START EXPLORING
          </Link>
        </div>
      ) : (
        <ProductGrid products={items} columns={4} />
      )}
    </div>
  );
}
