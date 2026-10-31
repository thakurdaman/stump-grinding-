'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, Loader2 } from 'lucide-react';

export const LeadCapture: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to sign up.');

      setStatus('success');
      setMessage(data.message || 'Check your inbox for the cheat sheet!');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section className="py-16 bg-wood-dark text-sand">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-bark/80 border border-sand/20 rounded-2xl p-8 sm:p-10 shadow-lg text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-sand/15 text-orange flex items-center justify-center mx-auto">
            <Mail size={24} />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#FBF6EC]">
              Get the Free Stump Pricing Cheat Sheet
            </h3>
            <p className="text-sand/80 text-sm leading-relaxed">
              Not ready for the full kit yet? Download our 1-page quick formula card on measuring diameters, identifying buried rock zones, and avoiding the 3 most common quoting mistakes.
            </p>
          </div>

          {status === 'success' ? (
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-forest/30 border border-forest text-[#FBF6EC] text-sm font-semibold">
              <CheckCircle2 size={18} className="text-forest-light" />
              <span>{message}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-[#FBF6EC] text-bark placeholder-bark/50 text-sm focus:outline-none focus:ring-2 focus:ring-orange"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3 rounded-lg bg-orange hover:bg-orange-hover text-white font-bold text-sm shadow focus:outline-none focus:ring-2 focus:ring-orange flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {status === 'loading' ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  'Send Cheat Sheet'
                )}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="text-red-300 text-xs mt-2">{message}</p>
          )}

          <p className="text-[11px] text-sand/60">
            No spam, ever. Unsubscribe with one click anytime.
          </p>
        </div>
      </div>
    </section>
  );
};
