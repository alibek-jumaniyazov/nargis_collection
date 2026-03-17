import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

interface CheckoutForm {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  addressLine: string;
  zipCode: string;
  paymentMethod: 'cash' | 'card';
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      paymentMethod: 'cash',
    }
  });

  const subtotal = getTotalPrice();
  const shipping = subtotal >= 200 ? 0 : 15;
  const total = subtotal + shipping;

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    // In production, call createOrder API here
    await new Promise((r) => setTimeout(r, 1500));
    clearCart();
    navigate('/order-success');
  };

  const inputClass = (hasError?: boolean) =>
    `w-full border ${hasError ? 'border-red-400' : 'border-[#eaeaea]'} px-4 py-3 text-sm focus:outline-none focus:border-[#111111] transition-colors placeholder:text-[#aaa]`;

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.2em] text-[#6b6b6b] uppercase mb-2">Final Step</p>
        <h1 className="font-serif text-4xl font-light">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid md:grid-cols-3 gap-10 md:gap-16">
          {/* Form */}
          <div className="md:col-span-2 flex flex-col gap-8">
            {/* Personal Info */}
            <div>
              <h2 className="text-xs tracking-[0.12em] font-medium uppercase mb-4">Personal Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    {...register('fullName', { required: 'Full name is required' })}
                    placeholder="Full Name *"
                    className={inputClass(!!errors.fullName)}
                  />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <input
                    {...register('phone', { required: 'Phone is required' })}
                    placeholder="Phone *"
                    className={inputClass(!!errors.phone)}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <input
                    {...register('email', { required: 'Email is required' })}
                    type="email"
                    placeholder="Email *"
                    className={inputClass(!!errors.email)}
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h2 className="text-xs tracking-[0.12em] font-medium uppercase mb-4">Shipping Address</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    {...register('city', { required: true })}
                    placeholder="City *"
                    className={inputClass(!!errors.city)}
                  />
                </div>
                <div>
                  <input
                    {...register('district', { required: true })}
                    placeholder="District *"
                    className={inputClass(!!errors.district)}
                  />
                </div>
                <div className="md:col-span-2">
                  <input
                    {...register('addressLine', { required: true })}
                    placeholder="Address Line *"
                    className={inputClass(!!errors.addressLine)}
                  />
                </div>
                <div>
                  <input
                    {...register('zipCode')}
                    placeholder="ZIP Code"
                    className={inputClass()}
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div>
              <h2 className="text-xs tracking-[0.12em] font-medium uppercase mb-4">Payment Method</h2>
              <div className="flex flex-col gap-3">
                {[
                  { value: 'cash', label: 'Cash on Delivery' },
                  { value: 'card', label: 'Credit / Debit Card' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-3 border border-[#eaeaea] px-4 py-4 cursor-pointer hover:border-[#111111] transition-colors"
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      {...register('paymentMethod')}
                      className="accent-[#111111]"
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-[#f7f7f7] p-6 sticky top-24">
              <h2 className="font-serif text-xl font-light mb-6">Your Order</h2>

              <div className="flex flex-col gap-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.size}`} className="flex items-center gap-3">
                    <div className="w-14 h-18 bg-white overflow-hidden flex-shrink-0">
                      <img src={item.product.coverImage} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium leading-tight">{item.product.name}</p>
                      <p className="text-xs text-[#6b6b6b] mt-0.5">×{item.quantity} · {item.size}</p>
                    </div>
                    <span className="text-xs font-medium flex-shrink-0">
                      ${((item.product.salePrice || item.product.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#eaeaea] pt-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6b6b6b]">Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b6b6b]">Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping}`}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t border-[#eaeaea] mt-2">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 bg-[#111111] text-white text-[11px] tracking-[0.12em] font-medium py-4 hover:bg-[#333] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'PLACING ORDER...' : 'PLACE ORDER'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
