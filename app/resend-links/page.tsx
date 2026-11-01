'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SITE_CONFIG } from '@/config/site';
import { RefreshCw, Mail, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';

export default function ResendLinksPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/resend-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to resend links.');

      setStatus('success');
      setMessage(data.message);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 py-20 bg-[#FBF6EC]">
        <div className="max-w-xl mx-auto px-4 sm:px-6 space-y-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-wood hover:text-bark transition-colors"
          >
            <ArrowLeft size={14} /> Back to Homepage
          </Link>

          <div className="bg-sand/35 border border-wood/25 rounded-2xl p-8 sm:p-10 shadow-sm space-y-6">
            <div className="w-12 h-12 rounded-xl bg-orange/15 text-orange flex items-center justify-center">
              <RefreshCw size={24} />
            </div>

            <div className="space-y-2">
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-bark">
                Resend My Download Links
              </h1>
              <p className="text-sm text-bark/80 leading-relaxed">
                Your purchase includes lifetime access. Lost your email or switched devices? Enter the email address you purchased with to instantly re-receive your download links and payment receipt.
              </p>
            </div>

            {status === 'success' ? (
              <div className="p-4 rounded-xl bg-forest/20 border border-forest text-bark text-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-forest">
                  <CheckCircle2 size={18} />
                  <span>Request Processed</span>
                </div>
                <p className="text-xs text-bark/90 leading-relaxed">{message}</p>
                <p className="text-[11px] text-wood-dark pt-1">
                  Please check your inbox (and spam/promotions tab) in 1-2 minutes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bark mb-1.5">
                    Purchase Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@myyardcare.com"
                    className="w-full px-4 py-3 rounded-lg border border-bark/20 bg-white text-bark text-sm focus:outline-none focus:ring-2 focus:ring-orange"
                  />
                </div>

                {status === 'error' && (
                  <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-900 text-xs">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3.5 px-6 rounded-lg bg-orange hover:bg-orange-hover text-white font-bold text-sm shadow focus:outline-none focus:ring-2 focus:ring-orange flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Locating Order...
                    </>
                  ) : (
                    <>
                      <Mail size={16} />
                      Send Fresh Download Links
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="pt-4 border-t border-bark/10 text-xs text-bark/70 text-center">
              Still having trouble? Email us directly at{' '}
              <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-orange underline font-semibold">
                {SITE_CONFIG.supportEmail}
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
