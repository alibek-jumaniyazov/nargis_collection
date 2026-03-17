import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ChevronDown, ChevronUp, ArrowLeft, Star } from 'lucide-react';
import { mockProducts } from '../data/mockData';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import ProductGrid from '../components/product/ProductGrid';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = mockProducts.find((p) => p.slug === slug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');
  const [added, setAdded] = useState(false);

  const { addItem } = useCartStore();
  const { isWishlisted, toggleItem } = useWishlistStore();

  const related = mockProducts.filter((p) => p.id !== product?.id && p.category.id === product?.category.id).slice(0, 4);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-serif text-3xl font-light">Product not found</p>
        <Link to="/" className="text-sm underline text-[#6b6b6b]">Back to Home</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    addItem(product, selectedSize, selectedColor || product.colors[0], quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const displayPrice = product.salePrice || product.price;
  const wishlisted = isWishlisted(product.id);

  const accordions = [
    {
      id: 'description',
      label: 'Description',
      content: product.description,
    },
    {
      id: 'details',
      label: 'Product Details',
      content: `Collection: ${product.collection || 'Essentials'}\nGender: ${product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}\nTags: ${product.tags.join(', ')}`,
    },
    {
      id: 'shipping',
      label: 'Shipping & Returns',
      content: 'Free standard shipping on orders over $200. Express delivery available. Returns accepted within 30 days of purchase for unworn items in original packaging.',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs text-[#6b6b6b]">
          <Link to="/" className="hover:text-[#111111] transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/category/${product.category.slug}`} className="hover:text-[#111111] transition-colors">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-[#111111]">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 pb-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          {/* Images */}
          <div className="flex gap-3">
            {/* Thumbnails */}
            <div className="hidden md:flex flex-col gap-2 w-16">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-[3/4] overflow-hidden border transition-all ${
                    selectedImage === i ? 'border-[#111111]' : 'border-[#eaeaea] hover:border-[#aaa]'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 aspect-[3/4] overflow-hidden bg-[#f7f7f7] relative">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.salePrice && (
                <span className="absolute top-4 left-4 bg-white text-[#111111] text-[9px] tracking-[0.1em] px-3 py-1.5 font-medium">
                  SALE
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Category */}
            <Link
              to={`/category/${product.category.slug}`}
              className="text-[10px] tracking-[0.15em] text-[#6b6b6b] uppercase hover:text-[#111111] transition-colors"
            >
              {product.category.name}
            </Link>

            <h1 className="font-serif text-3xl md:text-4xl font-light mt-2 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < Math.floor(product.rating) ? 'fill-[#111111] text-[#111111]' : 'text-[#eaeaea] fill-[#eaeaea]'}
                  />
                ))}
              </div>
              <span className="text-xs text-[#6b6b6b]">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-2xl font-medium">${displayPrice.toLocaleString()}</span>
              {product.salePrice && (
                <span className="text-base text-[#6b6b6b] line-through">
                  ${product.price.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-sm text-[#6b6b6b] mt-4 leading-relaxed">{product.shortDescription}</p>

            <div className="border-t border-[#eaeaea] my-6" />

            {/* Color Selector */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs tracking-[0.08em] font-medium">COLOR</span>
                </div>
                <div className="flex items-center gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color ? 'border-[#111111] scale-110' : 'border-[#eaeaea]'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs tracking-[0.08em] font-medium ${sizeError ? 'text-red-500' : ''}`}>
                  SIZE {sizeError && '— Please select a size'}
                </span>
                <button className="text-xs underline text-[#6b6b6b] hover:text-[#111111] transition-colors">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sizeObj) => (
                  <button
                    key={sizeObj.size}
                    onClick={() => { setSelectedSize(sizeObj.size); setSizeError(false); }}
                    disabled={sizeObj.stock === 0}
                    className={`min-w-[3rem] h-11 px-3 text-xs border transition-all ${
                      selectedSize === sizeObj.size
                        ? 'border-[#111111] bg-[#111111] text-white'
                        : sizeObj.stock === 0
                        ? 'border-[#eaeaea] text-[#ccc] cursor-not-allowed line-through'
                        : 'border-[#eaeaea] hover:border-[#111111]'
                    }`}
                  >
                    {sizeObj.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs tracking-[0.08em] font-medium">QUANTITY</span>
              <div className="flex items-center border border-[#eaeaea]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[#f7f7f7] transition-colors"
                >
                  −
                </button>
                <span className="w-10 h-10 flex items-center justify-center text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[#f7f7f7] transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#111111] text-white text-[11px] tracking-[0.15em] font-medium py-4 hover:bg-[#333] transition-colors"
              >
                {added ? 'ADDED TO BAG ✓' : 'ADD TO BAG'}
              </button>
              <button
                onClick={() => toggleItem(product)}
                className="w-full border border-[#eaeaea] text-[11px] tracking-[0.12em] font-medium py-4 flex items-center justify-center gap-2 hover:bg-[#f7f7f7] transition-colors"
              >
                <Heart size={14} className={wishlisted ? 'fill-[#111111]' : ''} />
                {wishlisted ? 'SAVED TO WISHLIST' : 'ADD TO WISHLIST'}
              </button>
            </div>

            {/* Accordions */}
            <div className="mt-8 border-t border-[#eaeaea]">
              {accordions.map((acc) => (
                <div key={acc.id} className="border-b border-[#eaeaea]">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === acc.id ? null : acc.id)}
                    className="w-full flex items-center justify-between py-4 text-left"
                  >
                    <span className="text-xs tracking-[0.08em] font-medium uppercase">{acc.label}</span>
                    {openAccordion === acc.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                  {openAccordion === acc.id && (
                    <div className="pb-4 text-sm text-[#6b6b6b] leading-relaxed whitespace-pre-line animate-fade-in">
                      {acc.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20 md:mt-28">
            <div className="text-center mb-10">
              <p className="text-[10px] tracking-[0.2em] text-[#6b6b6b] uppercase mb-2">You May Also Like</p>
              <h2 className="font-serif text-3xl font-light">Related Products</h2>
            </div>
            <ProductGrid products={related} columns={4} />
          </div>
        )}
      </div>
    </div>
  );
}
