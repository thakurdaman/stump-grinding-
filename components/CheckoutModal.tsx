'use client';

import React, { useState } from 'react';
import { ProductTier } from '@/config/products';
import { X, ShieldCheck, Download, Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  product: ProductTier | null;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ product, onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          versionId: product.id,
          email,
          name,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initiate checkout.');
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received from server.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-bark/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#FBF6EC] max-w-lg w-full rounded-2xl shadow-2xl border border-bark/20 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-bark/10 bg-sand/40 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-forest">
              Direct Checkout
            </span>
            <h3 className="font-serif font-bold text-xl text-bark mt-0.5">
              {product.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-bark hover:bg-sand focus:outline-none focus:ring-2 focus:ring-orange"
            aria-label="Close checkout modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          <div className="bg-sand/30 border border-wood/20 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-bark">{product.tagline}</p>
              <p className="text-xs text-wood-dark mt-0.5">Instant delivery via email</p>
            </div>
            <div className="text-right">
              <span className="font-serif font-bold text-2xl text-bark">
                ${product.price}
              </span>
              <span className="text-xs text-wood block font-medium">USD one-time</span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-900 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-bark mb-1.5">
              Delivery Email Address <span className="text-orange">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@myyardcare.com"
              className="w-full px-4 py-3 rounded-lg border border-bark/20 bg-white text-bark text-sm focus:outline-none focus:ring-2 focus:ring-orange"
            />
            <p className="text-[11px] text-wood-dark mt-1">
              Your secure download link and receipt will be dispatched to this address.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-bark mb-1.5">
              Your Name (Optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Miller"
              className="w-full px-4 py-3 rounded-lg border border-bark/20 bg-white text-bark text-sm focus:outline-none focus:ring-2 focus:ring-orange"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-lg bg-orange hover:bg-orange-hover text-white font-bold text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Securing Checkout...
              </>
            ) : (
              <>
                <Download size={18} />
                Proceed to Secure Checkout (${product.price})
              </>
            )}
          </button>

          <div className="pt-2 border-t border-bark/10 flex items-center justify-center gap-2 text-xs text-forest font-semibold">
            <ShieldCheck size={16} />
            <span>14-Day Money-Back Guarantee • 256-Bit Encrypted</span>
          </div>
        </form>
      </div>
    </div>
  );
};
