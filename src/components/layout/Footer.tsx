import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";

const SHOP_LINKS = [
  { label: "Women", href: "/category/women" },
  { label: "Men", href: "/category/men" },
  { label: "Accessories", href: "/category/accessories" },
  { label: "New Arrivals", href: "/new-collection" },
  { label: "Sale", href: "/sale" },
];

const INFO_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Shipping & Returns", href: "/shipping" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "Privacy Policy", href: "/privacy" },
];

export default function Footer() {
  return (
    <footer className="mt-24 w-full bg-[#111111] text-white">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 py-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-12 lg:py-16">
          {/* Brand */}
          <div className="lg:pr-8">
            <Link
              to="/"
              className="mb-5 inline-block font-serif text-[24px] font-semibold tracking-[0.22em] text-white"
            >
              NARGIS
            </Link>

            <p className="max-w-[280px] text-sm leading-7 text-[#9a9a9a]">
              Minimalist luxury fashion for the modern wardrobe. Crafted with
              intention, worn with purpose.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-[#9a9a9a] transition-all duration-200 hover:border-white hover:text-white"
              >
                <Instagram size={18} />
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-[#9a9a9a] transition-all duration-200 hover:border-white hover:text-white"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-5 text-[11px] font-medium tracking-[0.18em] text-white/90">
              SHOP
            </h3>

            <ul className="space-y-3.5">
              {SHOP_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-[#9a9a9a] transition-colors duration-200 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="mb-5 text-[11px] font-medium tracking-[0.18em] text-white/90">
              INFORMATION
            </h3>

            <ul className="space-y-3.5">
              {INFO_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-[#9a9a9a] transition-colors duration-200 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:pl-2">
            <h3 className="mb-5 text-[11px] font-medium tracking-[0.18em] text-white/90">
              NEWSLETTER
            </h3>

            <p className="mb-4 max-w-[320px] text-sm leading-7 text-[#9a9a9a]">
              Subscribe for exclusive access to new collections and offers.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-3"
            >
              <input
                type="email"
                placeholder="Your email address"
                className="h-12 w-full border border-white/15 bg-transparent px-4 text-sm text-white placeholder:text-[#666] outline-none transition-colors focus:border-white"
              />

              <button
                type="submit"
                className="h-12 border border-white bg-white text-[11px] font-medium tracking-[0.16em] text-[#111111] transition-all duration-200 hover:bg-transparent hover:text-white"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-[#6f6f6f]">
            © {new Date().getFullYear()} Nargis Collection. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            {["Visa", "Mastercard", "PayPal"].map((method) => (
              <span key={method} className="text-xs text-[#6f6f6f]">
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}