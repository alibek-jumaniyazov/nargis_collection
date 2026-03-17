import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import type { Product } from '../../types';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { isWishlisted, toggleItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const wishlisted = isWishlisted(product.id);
  const hasSecondImage = product.images.length > 1;
  const displayPrice = product.salePrice || product.price;
  const defaultSize = product.sizes.find((s) => s.stock > 0)?.size || product.sizes[0]?.size;
  const defaultColor = product.colors[0] || '#111111';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!defaultSize) return;
    addItem(product, defaultSize, defaultColor);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  return (
    <article
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="block relative overflow-hidden bg-[#f7f7f7]">
        <div className="aspect-[3/4] relative img-zoom">
          <img
            src={isHovered && hasSecondImage ? product.images[1] : product.coverImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNewArrival && (
            <span className="bg-[#111111] text-white text-[9px] tracking-[0.1em] px-2 py-1 font-medium">
              NEW
            </span>
          )}
          {product.salePrice && (
            <span className="bg-white text-[#111111] text-[9px] tracking-[0.1em] px-2 py-1 font-medium border border-[#eaeaea]">
              SALE
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); toggleItem(product); }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={14}
            className={wishlisted ? 'fill-[#111111] text-[#111111]' : 'text-[#111111]'}
          />
        </button>

        {/* Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-white/95 backdrop-blur-sm text-[#111111] text-[10px] tracking-[0.12em] font-medium py-3 hover:bg-[#111111] hover:text-white transition-all"
          >
            {addedToCart ? 'ADDED ✓' : 'QUICK ADD'}
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="mt-3 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-sm font-medium leading-tight line-clamp-2 hover:text-[#6b6b6b] transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`text-sm font-medium ${product.salePrice ? 'text-[#111111]' : ''}`}>
            ${displayPrice.toLocaleString()}
          </span>
          {product.salePrice && (
            <span className="text-xs text-[#6b6b6b] line-through">
              ${product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Color dots */}
        {product.colors.length > 1 && (
          <div className="flex items-center gap-1.5 mt-2">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color}
                className="w-3 h-3 rounded-full border border-[#eaeaea] cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-[#6b6b6b]">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
