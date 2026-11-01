'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ProductTier } from '@/config/products';
import { 
  X, 
  ShieldCheck, 
  Download, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  Mail, 
  Infinity as InfinityIcon,
  ReceiptText
} from 'lucide-react';

interface CheckoutModalProps {
  product: ProductTier | null;
  onClose: () => void;
}

interface VerificationState {
  status: 'idle' | 'checking' | 'valid' | 'invalid' | 'typo';
  message?: string;
  suggestion?: string | null;
  mxHost?: string | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ product, onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verification, setVerification] = useState<VerificationState>({ status: 'idle' });
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (!product) return null;

  // Real-time live email deliverability verification (like Google / Apple)
  useEffect(() => {
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
    }

    const trimmed = email.trim().toLowerCase();

    if (!trimmed) {
      setVerification({ status: 'idle' });
      return;
    }

    if (!trimmed.includes('@') || !trimmed.split('@')[1]?.includes('.')) {
      setVerification({ status: 'idle' });
      return;
    }

    setVerification({ status: 'checking', message: 'Verifying email & active mail exchange server...' });

    checkTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/verify-email?email=${encodeURIComponent(trimmed)}`);
        if (!res.ok) {
          setVerification({ status: 'idle' });
          return;
        }

        const data = await res.json();
        if (data.suggestion) {
          setVerification({
            status: 'typo',
            message: data.reason || `Did you mean ${data.suggestion}?`,
            suggestion: data.suggestion,
          });
        } else if (data.valid && data.deliverable) {
          setVerification({
            status: 'valid',
            message: `Mail server verified active (${data.mxHost || 'active host'}). Lifetime access & payment receipt will arrive safely.`,
            mxHost: data.mxHost,
          });
        } else {
          setVerification({
            status: 'invalid',
            message: data.reason || 'This email domain does not have active mail servers and cannot receive emails.',
          });
        }
      } catch {
        // Fallback gracefully on network error
        setVerification({ status: 'idle' });
      }
    }, 400);

    return () => {
      if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
    };
  }, [email]);

  const handleApplySuggestion = () => {
    if (verification.suggestion) {
      setEmail(verification.suggestion);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Block submission if live check confirmed email domain is invalid
    if (verification.status === 'invalid') {
      setError(verification.message || 'Please enter a valid, deliverable email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          versionId: product.id,
          email: email.trim().toLowerCase(),
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
      className="fixed inset-0 z-50 bg-bark/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#FBF6EC] max-w-lg w-full rounded-2xl shadow-2xl border border-bark/20 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-bark/10 bg-sand/40 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forest/15 text-forest text-[11px] font-bold uppercase tracking-wider">
              <InfinityIcon size={12} />
              <span>Lifetime Access Included</span>
            </div>
            <h3 className="font-serif font-bold text-xl text-bark mt-1">
              {product.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-bark hover:bg-sand focus:outline-none focus:ring-2 focus:ring-orange"
            aria-label="Close checkout modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          
          {/* Product pricing card */}
          <div className="bg-sand/30 border border-wood/20 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-bark">{product.tagline}</p>
              <p className="text-xs text-wood-dark mt-0.5 flex items-center gap-1">
                <ReceiptText size={13} className="text-forest" />
                <span>Instant payment receipt &amp; proof sent via email</span>
              </p>
            </div>
            <div className="text-right">
              <span className="font-serif font-bold text-2xl text-bark">
                ${product.price}
              </span>
              <span className="text-xs text-wood block font-medium">USD one-time</span>
            </div>
          </div>

          {/* Lifetime Access Promise Callout */}
          <div className="bg-[#EAF2EC] border border-forest/20 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-forest">
            <CheckCircle2 size={16} className="text-forest shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Lifetime Digital Ownership:</span>
              <span className="text-forest/90 block mt-0.5">
                No 7-day expiration. Download and re-download as many times as you want, even 2+ years from now.
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-900 text-xs">
              {error}
            </div>
          )}

          {/* Email input with Live Mailbox Verification */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-bark">
                Delivery Email Address <span className="text-orange">*</span>
              </label>
              <span className="text-[10px] text-wood-dark flex items-center gap-1">
                <Mail size={11} />
                Live Mailbox Verification
              </span>
            </div>

            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@myyardcare.com"
                className={`w-full px-4 py-3 rounded-lg border bg-white text-bark text-sm focus:outline-none focus:ring-2 transition-colors ${
                  verification.status === 'valid'
                    ? 'border-forest/50 focus:ring-forest'
                    : verification.status === 'invalid' || verification.status === 'typo'
                    ? 'border-amber-500 focus:ring-amber-500'
                    : 'border-bark/20 focus:ring-orange'
                }`}
              />

              {/* Status indicator inside input */}
              <div className="absolute right-3 top-3 pointer-events-none">
                {verification.status === 'checking' && (
                  <Loader2 size={18} className="text-orange animate-spin" />
                )}
                {verification.status === 'valid' && (
                  <CheckCircle2 size={18} className="text-forest" />
                )}
                {(verification.status === 'invalid' || verification.status === 'typo') && (
                  <AlertTriangle size={18} className="text-amber-600" />
                )}
              </div>
            </div>

            {/* Live Mailbox Status Feedback Pills */}
            {verification.status === 'checking' && (
              <p className="text-[11px] text-wood-dark mt-1.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse" />
                <span>Checking mail server MX records...</span>
              </p>
            )}

            {verification.status === 'valid' && (
              <p className="text-[11px] text-forest font-medium mt-1.5 flex items-center gap-1">
                <CheckCircle2 size={12} className="shrink-0" />
                <span>{verification.message}</span>
              </p>
            )}

            {verification.status === 'typo' && (
              <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                  <span>Did you mean <strong>{verification.suggestion}</strong>?</span>
                </div>
                <button
                  type="button"
                  onClick={handleApplySuggestion}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] rounded shadow-sm transition-colors shrink-0"
                >
                  Apply Fix
                </button>
              </div>
            )}

            {verification.status === 'invalid' && (
              <p className="text-[11px] text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                <AlertTriangle size={12} className="shrink-0" />
                <span>{verification.message}</span>
              </p>
            )}

            {verification.status === 'idle' && (
              <p className="text-[11px] text-wood-dark mt-1">
                Your lifetime download access and official PayPal payment receipt will be sent here.
              </p>
            )}
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
            disabled={loading || verification.status === 'checking' || verification.status === 'invalid'}
            className="w-full py-3.5 px-6 rounded-lg bg-orange hover:bg-orange-hover text-white font-bold text-base shadow-md focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Securing Payment &amp; Generating Receipt...
              </>
            ) : (
              <>
                <Download size={18} />
                Proceed to Checkout with Proof of Payment (${product.price})
              </>
            )}
          </button>

          <div className="pt-2 border-t border-bark/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-forest font-semibold">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={15} />
              <span>14-Day Money-Back Guarantee</span>
            </div>
            <span className="text-wood-dark">PayPal &bull; Major Cards &bull; Instant Receipt</span>
          </div>
        </form>
      </div>
    </div>
  );
};
