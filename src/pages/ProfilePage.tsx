import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Heart, User, LogOut, MapPin } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import ProductGrid from '../components/product/ProductGrid';
import { getMyOrders } from '../api/services';
import type { Order } from '../types';

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (user) {
      getMyOrders()
        .then(res => {
          setOrders(res.data);
          setLoadingOrders(false);
        })
        .catch(err => {
          console.error("Failed to fetch orders:", err);
          setLoadingOrders(false);
        });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="font-serif text-3xl font-light">Please sign in</p>
        <Link to="/login" className="bg-[#111111] text-white text-[11px] tracking-[0.12em] px-8 py-4 cursor-pointer hover:bg-black transition-colors">
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
            {loadingOrders ? (
              <p className="text-sm text-[#6b6b6b]">Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 border border-[#eaeaea]">
                <Package size={36} className="text-[#eaeaea] mx-auto mb-3" />
                <p className="text-sm text-[#6b6b6b]">You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-[#eaeaea] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xs font-medium">#{order.id.slice(0, 8)}</span>
                        <p className="text-xs text-[#6b6b6b] mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-[10px] tracking-[0.08em] px-3 py-1.5 uppercase font-medium ${statusColors[order.status] || ''}`}>
                          {order.status}
                        </span>
                        <span className="text-sm font-medium">${order.total}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 max-w-[200px] mb-2">
                          <div className="w-12 h-16 bg-[#f7f7f7] overflow-hidden flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-xs font-medium truncate w-[130px]">{item.name}</p>
                            {(item.size || item.color) && (
                              <p className="text-[10px] text-[#6b6b6b]">
                                {item.size && `Size: ${item.size} `}
                                {item.color && `Color: ${item.color}`}
                              </p>
                            )}
                            <p className="text-[10px] text-[#6b6b6b]">Qty: {item.quantity}</p>
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
                <Link to="/" className="text-xs underline mt-2 inline-block hover:text-[#111111] transition-colors">
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
