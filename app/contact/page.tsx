'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SITE_CONFIG } from '@/config/site';
import { Mail, CheckCircle2, Loader2, ArrowLeft, Send } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot honeypot
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, honeypot }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message.');

      setStatus('success');
      setFeedback(data.message || 'Message sent successfully.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setStatus('error');
      setFeedback(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[#FBF6EC]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-wood hover:text-bark transition-colors"
          >
            <ArrowLeft size={14} /> Back to Homepage
          </Link>

          <div className="bg-sand/35 border border-wood/25 rounded-2xl p-8 sm:p-10 shadow-sm space-y-6">
            <div className="w-12 h-12 rounded-xl bg-orange/15 text-orange flex items-center justify-center">
              <Mail size={24} />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest font-sans">
                Customer Support
              </span>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-bark mt-1">
                Contact Us
              </h1>
              <p className="text-sm text-bark/80 leading-relaxed mt-1">
                Have a question about the calculator, need help with your download links, or want to ask about bulk licensing? Send a note below.
              </p>
            </div>

            {status === 'success' ? (
              <div className="p-5 rounded-xl bg-forest/20 border border-forest text-bark space-y-2">
                <div className="flex items-center gap-2 font-bold text-forest">
                  <CheckCircle2 size={18} />
                  <span>Message Sent</span>
                </div>
                <p className="text-xs text-bark/90 leading-relaxed">{feedback}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot hidden input */}
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    name="website_url"
                    tabIndex={-1}
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bark mb-1.5">
                    Your Name <span className="text-orange">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    className="w-full px-4 py-3 rounded-lg border border-bark/20 bg-white text-bark text-sm focus:outline-none focus:ring-2 focus:ring-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bark mb-1.5">
                    Email Address <span className="text-orange">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marcus@treeservice.com"
                    className="w-full px-4 py-3 rounded-lg border border-bark/20 bg-white text-bark text-sm focus:outline-none focus:ring-2 focus:ring-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-bark mb-1.5">
                    Message <span className="text-orange">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 rounded-lg border border-bark/20 bg-white text-bark text-sm focus:outline-none focus:ring-2 focus:ring-orange"
                  />
                </div>

                {status === 'error' && (
                  <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-900 text-xs">
                    {feedback}
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
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="pt-4 border-t border-bark/10 text-xs text-wood-dark text-center">
              Direct email:{' '}
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
