import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccessPage() {
  const orderId = `NC-${Date.now().toString().slice(-6)}`;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-[#111111] flex items-center justify-center mb-8">
        <CheckCircle size={28} className="text-white" />
      </div>
      <p className="text-[10px] tracking-[0.2em] text-[#6b6b6b] uppercase mb-3">Thank you</p>
      <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">Order Confirmed</h1>
      <p className="text-sm text-[#6b6b6b] max-w-md leading-relaxed">
        Your order <strong>#{orderId}</strong> has been placed successfully. 
        We'll send you an email confirmation and update you on the delivery status.
      </p>

      <div className="mt-10 bg-[#f7f7f7] p-6 max-w-sm w-full text-left">
        <h3 className="text-xs tracking-[0.1em] font-medium uppercase mb-4">What's Next?</h3>
        <ul className="flex flex-col gap-3">
          {[
            'Order confirmation email sent',
            'Processing & packing (1-2 days)',
            'Shipping notification with tracking',
            'Estimated delivery: 3-5 business days',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[#6b6b6b]">
              <span className="w-5 h-5 rounded-full bg-[#111111] text-white text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <Link
          to="/profile"
          className="border border-[#111111] text-[11px] tracking-[0.12em] px-8 py-4 hover:bg-[#111111] hover:text-white transition-all"
        >
          VIEW MY ORDERS
        </Link>
        <Link
          to="/"
          className="bg-[#111111] text-white text-[11px] tracking-[0.12em] px-8 py-4 hover:bg-[#333] transition-all"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  );
}
