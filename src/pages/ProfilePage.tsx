import { Link } from 'react-router-dom';
import { Package, Heart, User, LogOut, MapPin } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import ProductGrid from '../components/product/ProductGrid';

const mockOrders = [
  {
    id: 'NC-001284',
    date: '2025-03-10',
    status: 'delivered',
    total: 540,
    items: [{ name: 'Structured Blazer', image: 'https://images.unsplash.com/photo-1594938298728-73f2f3e2e9ce?auto=format&fit=crop&w=100&h=130&q=80', size: 'M' }],
  },
  {
    id: 'NC-001156',
    date: '2025-02-28',
    status: 'shipped',
    total: 189,
    items: [{ name: 'Wide-Leg Trousers', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=100&h=130&q=80', size: 'S' }],
  },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-blue-50 text-blue-700',
  packed: 'bg-purple-50 text-purple-700',
  shipped: 'bg-orange-50 text-orange-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
};

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const { items: wishlist } = useWishlistStore();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="font-serif text-3xl font-light">Please sign in</p>
        <Link to="/login" className="bg-[#111111] text-white text-[11px] tracking-[0.12em] px-8 py-4">
          SIGN IN
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-10 animate-fade-in">
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.2em] text-[#6b6b6b] uppercase mb-2">Account</p>
        <h1 className="font-serif text-4xl font-light">Hello, {user.fullName.split(' ')[0]}</h1>
      </div>

      <div className="grid md:grid-cols-4 gap-8 md:gap-12">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <div className="flex flex-col gap-1">
            {[
              { icon: Package, label: 'My Orders', id: 'orders' },
              { icon: Heart, label: 'Wishlist', id: 'wishlist' },
              { icon: MapPin, label: 'Addresses', id: 'addresses' },
              { icon: User, label: 'Account Details', id: 'account' },
            ].map(({ icon: Icon, label, id }) => (
              <button
                key={id}
                className="flex items-center gap-3 px-4 py-3.5 text-sm hover:bg-[#f7f7f7] transition-colors text-left border-b border-[#eaeaea]"
              >
                <Icon size={15} className="text-[#6b6b6b]" />
                {label}
              </button>
            ))}
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3.5 text-sm hover:bg-[#f7f7f7] transition-colors text-left text-[#6b6b6b]"
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="md:col-span-3">
          {/* Orders */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-light mb-6">My Orders</h2>
            {mockOrders.length === 0 ? (
              <div className="text-center py-12 border border-[#eaeaea]">
                <Package size={36} className="text-[#eaeaea] mx-auto mb-3" />
                <p className="text-sm text-[#6b6b6b]">You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {mockOrders.map((order) => (
                  <div key={order.id} className="border border-[#eaeaea] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xs font-medium">#{order.id}</span>
                        <p className="text-xs text-[#6b6b6b] mt-0.5">{order.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-[10px] tracking-[0.08em] px-3 py-1.5 uppercase font-medium ${statusColors[order.status] || ''}`}>
                          {order.status}
                        </span>
                        <span className="text-sm font-medium">${order.total}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-12 h-16 bg-[#f7f7f7] overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-xs font-medium">{item.name}</p>
                            <p className="text-xs text-[#6b6b6b]">Size: {item.size}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <div>
            <h2 className="font-serif text-2xl font-light mb-6">Wishlist</h2>
            {wishlist.length === 0 ? (
              <div className="text-center py-12 border border-[#eaeaea]">
                <Heart size={36} className="text-[#eaeaea] mx-auto mb-3" />
                <p className="text-sm text-[#6b6b6b]">Your wishlist is empty.</p>
                <Link to="/" className="text-xs underline mt-2 block hover:text-[#111111] transition-colors">
                  Discover new pieces
                </Link>
              </div>
            ) : (
              <ProductGrid products={wishlist} columns={3} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
