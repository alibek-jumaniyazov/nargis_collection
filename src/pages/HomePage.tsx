import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getBanners, getFeaturedProducts, getNewArrivals, getCategories } from '../api/services';
import type { Banner, Product, Category } from '../types';
import ProductGrid from '../components/product/ProductGrid';

export default function HomePage() {
  const [bannerIndex, setBannerIndex] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getBanners().then(res => setBanners(res.data));
    getNewArrivals().then(res => setNewArrivals(res.data.data)); // Assumed backend wraps arrays in data 
    getFeaturedProducts().then(res => setFeatured(res.data.data));
    getCategories().then(res => setCategories(res.data));
  }, []);

  const activeBanners = banners.filter((b) => b.isActive);

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((i) => (activeBanners.length ? (i + 1) % activeBanners.length : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const banner = activeBanners[bannerIndex];

  return (
    <div className="animate-fade-in">
      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <section className="relative h-[85vh] md:h-screen overflow-hidden">
        {activeBanners.map((b, i) => (
          <div
            key={b.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === bannerIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={b.image}
              alt={b.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
          </div>
        ))}

        {/* Banner Content */}
        <div className="relative h-full flex flex-col items-center justify-end pb-16 text-center px-4">
          <p className="text-[11px] tracking-[0.2em] text-white/80 uppercase mb-3 font-light">
            Spring / Summer 2025
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight max-w-2xl">
            {banner?.title}
          </h1>
          <p className="text-white/80 text-sm md:text-base mt-4 mb-8 font-light max-w-md">
            {banner?.subtitle}
          </p>
          <Link
            to={banner?.buttonLink || '/new-collection'}
            className="inline-flex items-center gap-3 bg-white text-[#111111] text-[11px] tracking-[0.15em] font-medium px-8 py-4 hover:bg-[#111111] hover:text-white transition-all group"
          >
            {banner?.buttonText || 'SHOP NOW'}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Banner Controls */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={() => setBannerIndex((i) => (i - 1 + activeBanners.length) % activeBanners.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setBannerIndex((i) => (i + 1) % activeBanners.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-all"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {activeBanners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setBannerIndex(i)}
                  className={`h-0.5 transition-all ${
                    i === bannerIndex ? 'w-8 bg-white' : 'w-4 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── Category Bar ─────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 px-4 md:px-8 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group relative overflow-hidden block aspect-3/4 img-zoom"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all" />
              <div className="absolute inset-0 flex items-end p-5">
                <div>
                  <h3 className="text-white font-serif text-xl font-light">{cat.name}</h3>
                  <span className="text-white/70 text-xs tracking-[0.1em] flex items-center gap-2 mt-1 group-hover:gap-3 transition-all">
                    SHOP <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Editorial Banner ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden h-64 md:h-96 mb-0">
        <div className="absolute inset-0 bg-[#111111]" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <p className="text-[11px] tracking-[0.25em] text-[#6b6b6b] uppercase mb-4">
              The Edit
            </p>
            <h2 className="font-serif text-4xl md:text-6xl font-light text-white leading-tight max-w-2xl">
              Effortless Luxury,<br />Defined
            </h2>
            <Link
              to="/new-collection"
              className="inline-flex items-center gap-2 mt-6 text-[11px] tracking-[0.15em] text-white border-b border-white/40 pb-0.5 hover:border-white transition-colors"
            >
              EXPLORE THE COLLECTION
            </Link>
          </div>
        </div>
      </section>

      {/* ── New Arrivals ──────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-screen-xl mx-auto">
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <p className="text-[10px] tracking-[0.2em] text-[#6b6b6b] uppercase mb-2">Just In</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light">New Arrivals</h2>
          </div>
          <Link
            to="/new-collection"
            className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.1em] hover:gap-3 transition-all"
          >
            VIEW ALL <ArrowRight size={12} />
          </Link>
        </div>
        <ProductGrid products={newArrivals} columns={4} />
        <div className="mt-8 text-center md:hidden">
          <Link
            to="/new-collection"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.1em] border-b border-[#111111] pb-0.5"
          >
            VIEW ALL NEW ARRIVALS <ArrowRight size={12} />
          </Link>
        </div>
      </section>

      {/* ── Full-Width Campaign Image ──────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative h-96 md:h-[600px] img-zoom">
            <img
              src="https://images.unsplash.com/photo-1515372039744-245a8b66c1c8?auto=format&fit=crop&w=800&h=1000&q=80"
              alt="Women's Collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute bottom-8 left-8">
              <h3 className="font-serif text-2xl text-white font-light mb-3">Women</h3>
              <Link
                to="/category/women"
                className="text-[10px] tracking-[0.15em] text-white/90 border-b border-white/50 pb-0.5 hover:border-white transition-colors"
              >
                SHOP WOMEN
              </Link>
            </div>
          </div>
          <div className="relative h-96 md:h-[600px] img-zoom">
            <img
              src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&h=1000&q=80"
              alt="Men's Collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute bottom-8 left-8">
              <h3 className="font-serif text-2xl text-white font-light mb-3">Men</h3>
              <Link
                to="/category/men"
                className="text-[10px] tracking-[0.15em] text-white/90 border-b border-white/50 pb-0.5 hover:border-white transition-colors"
              >
                SHOP MEN
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-screen-xl mx-auto">
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <p className="text-[10px] tracking-[0.2em] text-[#6b6b6b] uppercase mb-2">Curated</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light">Featured Pieces</h2>
          </div>
          <Link
            to="/category/women"
            className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.1em] hover:gap-3 transition-all"
          >
            VIEW ALL <ArrowRight size={12} />
          </Link>
        </div>
        <ProductGrid products={featured} columns={4} />
      </section>

      {/* ── Brand Story ───────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-4 text-center bg-[#f7f7f7]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] tracking-[0.25em] text-[#6b6b6b] uppercase mb-6">Our Philosophy</p>
          <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight mb-8">
            "Luxury is not about being expensive.{' '}
            <em>It's about being intentional."</em>
          </h2>
          <p className="text-sm text-[#6b6b6b] leading-relaxed max-w-xl mx-auto mb-8">
            Nargis Collection was born from a belief that great fashion should feel effortless —
            pieces that become part of your story, not just your wardrobe.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] border-b border-[#111111] pb-0.5 hover:text-[#6b6b6b] transition-colors"
          >
            READ OUR STORY <ArrowRight size={11} />
          </Link>
        </div>
      </section>

      {/* ── Marquee Strip ─────────────────────────────────────────────── */}
      <div className="overflow-hidden bg-[#111111] py-3">
        <div className="animate-marquee flex gap-12 whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="text-[10px] tracking-[0.3em] text-white/60 uppercase">
              Free shipping over $200 &nbsp;·&nbsp; New Collection Available &nbsp;·&nbsp; Exclusive Members Access
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
