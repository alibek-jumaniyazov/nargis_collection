import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useAuthStore } from "../../store/authStore";
import SearchModal from "./SearchModal";

const NAV_LINKS = [
  { label: "WOMEN", href: "/category/women" },
  { label: "MEN", href: "/category/men" },
  { label: "ACCESSORIES", href: "/category/accessories" },
  { label: "NEW IN", href: "/new-collection" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const totalItems = useCartStore((s) => s.getTotalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const iconButtonClass =
    "relative inline-flex h-10 w-10 items-center justify-center rounded-full text-[#111111] transition-all duration-200 hover:bg-black/[0.04] hover:text-black";

  const badgeClass =
    "absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#111111] text-white text-[10px] leading-none flex items-center justify-center rounded-full font-medium";

  return (
    <>
      <header
        className={`fixed inset-x-0 ml-6 mr-auto top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="grid h-[68px] grid-cols-3 items-center md:h-[84px]">
            {/* Left */}
            <div className="flex items-center justify-start">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#111111] transition hover:bg-black/[0.04] md:hidden"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>

              <nav className="hidden md:flex items-center gap-8 lg:gap-10">
                {NAV_LINKS.map((link) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`relative text-[11px] font-medium tracking-[0.18em] transition-colors duration-200 ${
                        isActive
                          ? "text-black"
                          : "text-[#222222] hover:text-[#777777]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Center */}
            <div className="flex items-center justify-center">
              <Link
                to="/"
                className="select-none font-serif text-[20px] font-semibold tracking-[0.28em] text-[#111111] md:text-[26px]"
              >
                NARGIS
              </Link>
            </div>

            {/* Right */}
            <div className="flex items-center justify-end gap-0.5 sm:gap-1">
              <button
                onClick={() => setIsSearchOpen(true)}
                className={iconButtonClass}
                aria-label="Search"
              >
                <Search size={18} strokeWidth={1.9} />
              </button>

              <Link
                to="/wishlist"
                className={iconButtonClass}
                aria-label="Wishlist"
              >
                <Heart size={18} strokeWidth={1.9} />
                {wishlistCount > 0 && (
                  <span className={badgeClass}>{wishlistCount}</span>
                )}
              </Link>

              <button
                onClick={() => navigate(user ? "/profile" : "/login")}
                className={iconButtonClass}
                aria-label="Account"
              >
                <User size={18} strokeWidth={1.9} />
              </button>

              <button
                onClick={toggleCart}
                className={iconButtonClass}
                aria-label="Cart"
              >
                <ShoppingBag size={18} strokeWidth={1.9} />
                {totalItems > 0 && (
                  <span className={badgeClass}>{totalItems}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${
          isMobileOpen
            ? "pointer-events-auto visible"
            : "pointer-events-none invisible"
        }`}
      >
        <div
          onClick={() => setIsMobileOpen(false)}
          className={`absolute inset-0 bg-black/35 backdrop-blur-[2px] transition-opacity duration-300 ${
            isMobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          className={`absolute left-0 top-0 h-full w-[86%] max-w-[360px] bg-white shadow-2xl transition-transform duration-300 ease-out ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col px-6 pb-6 pt-5">
            <div className="mb-8 flex items-center justify-between">
              <Link
                to="/"
                className="font-serif text-[20px] tracking-[0.24em] text-[#111111]"
              >
                NARGIS
              </Link>

              <button
                onClick={() => setIsMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#111111] transition hover:bg-black/[0.04]"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="flex flex-col gap-5">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`border-b border-[#f1f1f1] pb-4 text-[13px] font-medium tracking-[0.16em] transition-colors ${
                      isActive ? "text-black" : "text-[#111111] hover:text-[#777777]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 space-y-3 border-t border-[#ebebeb] pt-6">
              <Link
                to={user ? "/profile" : "/login"}
                className="block text-sm text-[#444444]"
              >
                {user ? `Hello, ${user.fullName?.split(" ")[0] || "User"}` : "Login / Register"}
              </Link>

              <Link to="/wishlist" className="block text-sm text-[#444444]">
                Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ""}
              </Link>

              <button
                onClick={() => {
                  setIsMobileOpen(false);
                  toggleCart();
                }}
                className="block text-left text-sm text-[#444444]"
              >
                Cart {totalItems > 0 ? `(${totalItems})` : ""}
              </button>
            </div>

            <div className="mt-auto pt-8 text-xs tracking-[0.14em] text-[#9a9a9a]">
              ELEVATED ESSENTIALS
            </div>
          </div>
        </aside>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}