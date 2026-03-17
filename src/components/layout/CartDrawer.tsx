import { useEffect } from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="ml-auto relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-slide-down">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#eaeaea]">
          <div>
            <h2 className="font-serif text-lg font-light tracking-wide">Shopping Bag</h2>
            <p className="text-xs text-[#6b6b6b] mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={closeCart} className="text-[#111111] hover:text-[#6b6b6b] transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={48} className="text-[#eaeaea]" />
              <div>
                <p className="font-serif text-lg font-light">Your bag is empty</p>
                <p className="text-sm text-[#6b6b6b] mt-1">Add items to get started</p>
              </div>
              <button
                onClick={closeCart}
                className="mt-4 border border-[#111111] text-[11px] tracking-[0.12em] px-8 py-3 hover:bg-[#111111] hover:text-white transition-all"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-[#eaeaea]">
              {items.map((item, i) => (
                <li key={`${item.product.id}-${item.size}-${item.color}`} className="py-5 flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-32 bg-[#f7f7f7] flex-shrink-0 overflow-hidden">
                    <img
                      src={item.product.coverImage}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link
                        to={`/product/${item.product.slug}`}
                        onClick={closeCart}
                        className="text-sm font-medium leading-tight hover:text-[#6b6b6b] transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs text-[#6b6b6b]">Size: {item.size}</span>
                        <span className="text-[#eaeaea]">|</span>
                        <span
                          className="w-3 h-3 rounded-full border border-[#eaeaea] inline-block"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                      <p className="text-sm font-medium mt-2">
                        ${(item.product.salePrice || item.product.price).toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity + Remove */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#eaeaea]">
                        <button
                          onClick={() =>
                            item.quantity > 1
                              ? updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)
                              : removeItem(item.product.id, item.size, item.color)
                          }
                          className="w-8 h-8 flex items-center justify-center text-[#6b6b6b] hover:bg-[#f7f7f7] transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-[#6b6b6b] hover:bg-[#f7f7f7] transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id, item.size, item.color)}
                        className="text-[#6b6b6b] hover:text-[#111111] transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#eaeaea] px-6 py-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#6b6b6b]">Subtotal</span>
              <span className="text-sm font-medium">${getTotalPrice().toLocaleString()}</span>
            </div>
            <p className="text-xs text-[#6b6b6b] mb-5">Shipping calculated at checkout</p>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="block w-full bg-[#111111] text-white text-center text-[11px] tracking-[0.12em] font-medium py-4 hover:bg-[#333] transition-colors mb-3"
            >
              PROCEED TO CHECKOUT
            </Link>
            <button
              onClick={closeCart}
              className="block w-full border border-[#111111] text-center text-[11px] tracking-[0.12em] font-medium py-4 hover:bg-[#f7f7f7] transition-colors"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
