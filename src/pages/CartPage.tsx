import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 animate-fade-in">
        <ShoppingBag size={56} className="text-[#eaeaea]" />
        <div className="text-center">
          <h1 className="font-serif text-3xl font-light mb-2">Your bag is empty</h1>
          <p className="text-sm text-[#6b6b6b]">Looks like you haven't added anything yet</p>
        </div>
        <Link
          to="/"
          className="mt-4 bg-[#111111] text-white text-[11px] tracking-[0.12em] px-8 py-4 hover:bg-[#333] transition-colors"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal >= 200 ? 0 : 15;
  const total = subtotal + shipping;

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.2em] text-[#6b6b6b] uppercase mb-2">Review</p>
        <h1 className="font-serif text-4xl font-light">Shopping Bag</h1>
        <p className="text-sm text-[#6b6b6b] mt-1">{items.length} item{items.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-10 md:gap-16">
        {/* Items */}
        <div className="md:col-span-2">
          <div className="border-t border-[#eaeaea]">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.size}-${item.color}`}
                className="flex gap-5 py-6 border-b border-[#eaeaea]">
                {/* Image */}
                <Link to={`/product/${item.product.slug}`} className="flex-shrink-0">
                  <div className="w-24 h-32 bg-[#f7f7f7] overflow-hidden">
                    <img src={item.product.coverImage} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link to={`/product/${item.product.slug}`}
                        className="font-medium text-sm hover:text-[#6b6b6b] transition-colors">
                        {item.product.name}
                      </Link>
                      <div className="text-xs text-[#6b6b6b] mt-1.5 flex items-center gap-2">
                        <span>Size: {item.size}</span>
                        <span>·</span>
                        <span
                          className="w-3 h-3 rounded-full border border-[#eaeaea] inline-block"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium flex-shrink-0">
                      ${((item.product.salePrice || item.product.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Qty */}
                    <div className="flex items-center border border-[#eaeaea]">
                      <button
                        onClick={() =>
                          item.quantity > 1
                            ? updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)
                            : removeItem(item.product.id, item.size, item.color)
                        }
                        className="w-9 h-9 flex items-center justify-center hover:bg-[#f7f7f7] transition-colors"
                      >−</button>
                      <span className="w-9 h-9 flex items-center justify-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-[#f7f7f7] transition-colors"
                      >+</button>
                    </div>

                    <button
                      onClick={() => removeItem(item.product.id, item.size, item.color)}
                      className="text-[#6b6b6b] hover:text-[#111111] transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={clearCart}
            className="mt-4 text-xs text-[#6b6b6b] underline hover:text-[#111111] transition-colors"
          >
            Clear bag
          </button>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-[#f7f7f7] p-6 sticky top-24">
            <h2 className="font-serif text-xl font-light mb-6">Order Summary</h2>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6b6b6b]">Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b6b6b]">Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-[#6b6b6b]">
                  Add ${(200 - subtotal).toFixed(0)} more for free shipping
                </p>
              )}
            </div>

            <div className="border-t border-[#eaeaea] mt-4 pt-4 flex justify-between">
              <span className="font-medium">Total</span>
              <span className="font-medium">${total.toLocaleString()}</span>
            </div>

            <Link
              to="/checkout"
              className="block w-full mt-6 bg-[#111111] text-white text-center text-[11px] tracking-[0.12em] font-medium py-4 hover:bg-[#333] transition-colors"
            >
              PROCEED TO CHECKOUT
            </Link>

            <div className="mt-6 text-center">
              <p className="text-xs text-[#6b6b6b]">Secure checkout · Free returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
