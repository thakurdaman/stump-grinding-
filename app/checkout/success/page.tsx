import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { validateToken } from '@/lib/orders';
import { db } from '@/lib/db';
import { SITE_CONFIG } from '@/config/site';
import { CheckCircle2, Download, BookOpen, FileSpreadsheet, FileText, ArrowRight, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface SuccessPageProps {
  searchParams: {
    session_id?: string;
    token?: string;
    email?: string;
    version_id?: string;
  };
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  let orderData = null;

  // Attempt resolution by token (downloadToken or PayPal providerOrderId)
  if (searchParams.token) {
    const res = await validateToken(searchParams.token);
    if (res.success) {
      orderData = res.order;
    } else {
      // Check if PayPal passed providerOrderId as the token parameter
      const order = await db.order.findFirst({
        where: { providerOrderId: searchParams.token },
      });
      if (order) {
        const tokenRes = await validateToken(order.downloadToken);
        if (tokenRes.success) {
          orderData = tokenRes.order;
        }
      }
    }
  }

  // Attempt resolution by provider session_id or demo order
  if (!orderData && searchParams.session_id) {
    const order = await db.order.findFirst({
      where: { providerOrderId: searchParams.session_id },
    });
    if (order) {
      const res = await validateToken(order.downloadToken);
      if (res.success) {
        orderData = res.order;
      }
    }
  }

  const getFileIcon = (format: string) => {
    if (format === 'PDF') return <BookOpen className="text-orange" size={20} />;
    if (format === 'Excel') return <FileSpreadsheet className="text-forest" size={20} />;
    return <FileText className="text-wood-dark" size={20} />;
  };

  return (
    <>
      <Header />

      <main className="flex-1 py-16 bg-[#FBF6EC]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Order Confirmed Banner */}
          <div className="bg-sand/40 border border-wood/30 rounded-2xl p-8 sm:p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-forest/20 text-forest flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-forest font-sans">
              Payment Successful
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bark">
              Thank you for your purchase!
            </h1>
            <p className="text-sm sm:text-base text-bark/85 max-w-lg mx-auto">
              Your order has been completed and your download links are ready below. A copy has also been sent to your email.
            </p>
          </div>

          {/* Download Area */}
          {orderData ? (
            <div className="bg-white border-2 border-bark/15 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-bark/10 pb-4">
                <div>
                  <h2 className="font-serif font-bold text-xl text-bark">
                    {orderData.productName}
                  </h2>
                  <p className="text-xs text-wood-dark">
                    Delivered to <strong>{orderData.email}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-forest bg-forest/10 px-3 py-1.5 rounded-full font-bold">
                  <CheckCircle2 size={14} />
                  <span>Lifetime Access • Never Expires</span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-bark/60">
                  Your Included Files (Click to Download):
                </p>

                {orderData.allowedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-bark/10 bg-sand/20 hover:border-orange transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-sand/60 shrink-0">
                        {getFileIcon(file.format)}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-base text-bark">
                          {file.name}
                        </h4>
                        <p className="text-xs text-bark/70 mt-0.5">{file.description}</p>
                        <span className="text-[11px] font-mono text-wood-dark mt-1 inline-block">
                          {file.format} • {file.sizeApprox}
                        </span>
                      </div>
                    </div>

                    <a
                      href={`/api/download?token=${orderData.downloadToken}&file=${file.filename}`}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-orange hover:bg-orange-hover text-white text-xs font-bold shadow-sm transition-all shrink-0"
                    >
                      <Download size={14} />
                      Download {file.format}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-sand/30 border border-wood/20 rounded-2xl p-8 text-center space-y-3">
              <h3 className="font-serif font-bold text-xl text-bark">
                Looking for your files?
              </h3>
              <p className="text-xs text-bark/80 max-w-md mx-auto">
                If your payment was just completed via an external portal, please check your inbox for your secure download link, or enter your email on our link recovery page.
              </p>
              <div className="pt-2">
                <Link
                  href="/resend-links"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange text-white text-xs font-bold hover:bg-orange-hover transition-colors"
                >
                  Lookup My Download Links &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* Recommended Start Here Order */}
          <div className="bg-sand/30 border border-bark/15 rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="font-serif font-bold text-lg text-bark">
              Recommended &ldquo;Start Here&rdquo; Order
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-white/80 p-4 rounded-xl border border-bark/10 space-y-1.5">
                <span className="font-bold text-orange uppercase tracking-wider block text-[11px]">
                  Step 1
                </span>
                <p className="font-bold text-bark text-sm">Read the Playbook</p>
                <p className="text-bark/75">
                  Understand 811 utility flags, insurance traps, and the baseline quoting formula.
                </p>
              </div>

              <div className="bg-white/80 p-4 rounded-xl border border-bark/10 space-y-1.5">
                <span className="font-bold text-forest uppercase tracking-wider block text-[11px]">
                  Step 2
                </span>
                <p className="font-bold text-bark text-sm">Open the Calculator</p>
                <p className="text-bark/75">
                  Input your vehicle fuel cost and target hourly profit on the Settings tab.
                </p>
              </div>

              <div className="bg-white/80 p-4 rounded-xl border border-bark/10 space-y-1.5">
                <span className="font-bold text-wood uppercase tracking-wider block text-[11px]">
                  Step 3
                </span>
                <p className="font-bold text-bark text-sm">Customize Templates</p>
                <p className="text-bark/75">
                  Add your company name and phone to the service agreements and pre-job inspection.
                </p>
              </div>
            </div>
          </div>

          {/* Support Notice */}
          <div className="text-center text-xs text-wood-dark space-y-1">
            <p>
              Need assistance? Email support directly at{' '}
              <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-orange underline">
                {SITE_CONFIG.supportEmail}
              </a>
            </p>
            <p>
              Files can be downloaded up to 10 times per file on this link. You can generate fresh links at any time.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
