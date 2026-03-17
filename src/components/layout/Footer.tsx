import { Link } from 'react-router-dom';
import { Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white mt-24">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-serif text-2xl tracking-[0.25em] block mb-4">
              NARGIS
            </Link>
            <p className="text-[#6b6b6b] text-sm leading-relaxed max-w-[220px]">
              Minimalist luxury fashion for the modern wardrobe. Crafted with intention, worn with purpose.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-[#6b6b6b] hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-[#6b6b6b] hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-[11px] tracking-[0.15em] font-medium mb-5">SHOP</h3>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'Women', href: '/category/women' },
                { label: 'Men', href: '/category/men' },
                { label: 'Accessories', href: '/category/accessories' },
                { label: 'New Arrivals', href: '/new-collection' },
                { label: 'Sale', href: '/sale' },
              ].map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="text-sm text-[#6b6b6b] hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-[11px] tracking-[0.15em] font-medium mb-5">INFORMATION</h3>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Shipping & Returns', href: '/shipping' },
                { label: 'Size Guide', href: '/size-guide' },
                { label: 'Privacy Policy', href: '/privacy' },
              ].map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="text-sm text-[#6b6b6b] hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-[11px] tracking-[0.15em] font-medium mb-5">NEWSLETTER</h3>
            <p className="text-sm text-[#6b6b6b] mb-4 leading-relaxed">
              Subscribe for exclusive access to new collections and offers.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-transparent border border-[#333] text-white text-sm px-4 py-3 placeholder:text-[#555] focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                className="bg-white text-[#111111] text-[11px] tracking-[0.12em] font-medium py-3 hover:bg-[#eaeaea] transition-colors"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-[#222] mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#555] text-xs">
            © {new Date().getFullYear()} Nargis Collection. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Visa', 'Mastercard', 'PayPal'].map((method) => (
              <span key={method} className="text-xs text-[#555]">{method}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
