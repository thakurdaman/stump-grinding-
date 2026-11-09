import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { validateToken } from '@/lib/orders';
import { SITE_CONFIG } from '@/config/site';
import { Mail, AlertCircle, RefreshCw, Lock, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface DownloadPageProps {
  params: {
    token: string;
  };
}

export default async function DownloadTokenPage({ params }: DownloadPageProps) {
  const result = await validateToken(params.token);

  if (!result.success) {
    const isExpired = result.error === 'expired';

    return (
      <>
        <Header />
        <main className="flex-1 py-20 bg-[#FBF6EC]">
          <div className="max-w-xl mx-auto px-4 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-orange/15 text-orange flex items-center justify-center mx-auto">
              <AlertCircle size={32} />
            </div>

            <div className="space-y-2">
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-bark">
                {isExpired ? 'Access Link Updated' : 'Invalid Access Link'}
              </h1>
              <p className="text-sm text-bark/80 leading-relaxed">
                {isExpired
                  ? 'Your access has been updated. You can generate a fresh delivery email instantly to your verified email address.'
                  : 'This order link was not found or has been revoked. If you purchased the playbook, you can easily recover your materials below.'}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/resend-links"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange hover:bg-orange-hover text-white text-sm font-bold shadow transition-colors"
              >
                <RefreshCw size={16} />
                Resend Materials to Verified Email
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { order } = result;

  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[#FBF6EC]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-white border-2 border-bark/15 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-forest/15 text-forest flex items-center justify-center mx-auto">
              <Mail size={32} className="text-forest" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-mono font-bold uppercase tracking-wider">
                <CheckCircle2 size={14} />
                <span>Verified Buyer &bull; Lifetime Access Active</span>
              </div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-bark mt-1">
                Delivered Directly to Your Email
              </h1>
              <p className="text-sm text-bark/85">
                All materials for <strong>{order.productName}</strong> have been licensed and dispatched directly to your verified inbox:
              </p>
              <div className="inline-block px-4 py-2 rounded-xl bg-sand/40 border border-bark/15 font-mono text-sm sm:text-base font-bold text-bark">
                {order.email}
              </div>
            </div>

            {/* Privacy & Anti-Piracy Notice */}
            <div className="bg-[#FAF4EB] border border-bark/15 rounded-2xl p-5 text-left space-y-2 text-xs sm:text-sm text-bark/80">
              <div className="flex items-center gap-2 font-bold text-bark">
                <Lock size={16} className="text-forest shrink-0" />
                <span>Why resources are sent via email only:</span>
              </div>
              <p className="leading-relaxed">
                Each resource (the Playbook PDF, Pricing Calculator XLSX, and Templates Pack DOCX) contains your permanent watermark and buyer identity. To protect your licensing privacy, <strong>no files or customer details are exposed publicly on this website</strong>.
              </p>
              <p className="leading-relaxed text-forest font-medium">
                You can download, view, and store your files offline straight from the email sent to you anytime, anywhere, for as long as you want.
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`mailto:${order.email}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-orange hover:bg-orange-hover text-white text-sm font-bold shadow transition-all"
              >
                <Mail size={16} />
                Open Email Inbox
              </a>
              <Link
                href="/resend-links"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-bark/5 hover:bg-bark/10 text-bark text-sm font-bold border border-bark/15 transition-colors"
              >
                <RefreshCw size={16} />
                Resend Files to {order.email}
              </Link>
            </div>

            {/* Direct Instant Download Links */}
            {order.allowedFiles && order.allowedFiles.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-bark/10 text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-bark/60">
                  Instant Browser Download:
                </div>
                <div className="flex flex-col gap-2">
                  {order.allowedFiles.map((file) => (
                    <a
                      key={file.filename}
                      href={`/api/download?token=${params.token}&file=${encodeURIComponent(file.filename)}`}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-bark/15 hover:border-orange bg-sand/20 hover:bg-orange/5 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-bark/10 text-bark font-mono">
                          {file.format}
                        </span>
                        <span className="text-sm font-bold text-bark group-hover:text-orange transition-colors">
                          {file.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-orange">
                        Download &darr;
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="text-center text-xs text-wood-dark">
            Need support? Email our team at{' '}
            <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-orange underline font-semibold">
              {SITE_CONFIG.supportEmail}
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
