import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import SearchModal from './SearchModal';

const NAV_LINKS = [
  { label: 'WOMEN', href: '/category/women' },
  { label: 'MEN', href: '/category/men' },
  { label: 'ACCESSORIES', href: '/category/accessories' },
  { label: 'NEW IN', href: '/new-collection' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const totalItems = useCartStore((s) => s.getTotalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isMobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white border-b border-[#eaeaea] shadow-sm' : 'bg-white/95 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 -ml-2 text-[#111111]"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-[11px] font-medium tracking-[0.12em] text-[#111111] hover:text-[#6b6b6b] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Logo */}
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 font-serif text-xl md:text-2xl font-light tracking-[0.25em] text-[#111111] select-none"
            >
              NARGIS
            </Link>

            {/* Icons */}
            <div className="flex items-center gap-1 md:gap-2 ml-auto">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#111111] hover:text-[#6b6b6b] transition-colors"
                aria-label="Search"
              >
                <Search size={19} />
              </button>

              <Link
                to="/wishlist"
                className="relative p-2 text-[#111111] hover:text-[#6b6b6b] transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={19} />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#111111] text-white text-[9px] flex items-center justify-center rounded-full font-medium">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => navigate(user ? '/profile' : '/login')}
                className="p-2 text-[#111111] hover:text-[#6b6b6b] transition-colors"
                aria-label="Account"
              >
                <User size={19} />
              </button>

              <button
                onClick={toggleCart}
                className="relative p-2 text-[#111111] hover:text-[#6b6b6b] transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={19} />
                {totalItems > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#111111] text-white text-[9px] flex items-center justify-center rounded-full font-medium">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative bg-white w-4/5 max-w-sm h-full flex flex-col animate-slide-down p-8">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-5 right-5 text-[#111111]"
            >
              <X size={22} />
            </button>
            <Link to="/" className="font-serif text-xl tracking-[0.25em] mb-10">
              NARGIS
            </Link>
            <nav className="flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="text-sm font-medium tracking-[0.12em] text-[#111111]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto border-t border-[#eaeaea] pt-6 flex flex-col gap-4">
              <Link
                to={user ? '/profile' : '/login'}
                onClick={() => setIsMobileOpen(false)}
                className="text-sm text-[#6b6b6b]"
              >
                {user ? `Hello, ${user.fullName.split(' ')[0]}` : 'Login / Register'}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
