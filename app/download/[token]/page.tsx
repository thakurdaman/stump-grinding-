import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { validateToken } from '@/lib/orders';
import { SITE_CONFIG } from '@/config/site';
import { Download, AlertCircle, BookOpen, FileSpreadsheet, FileText, Clock, RefreshCw, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface DownloadPageProps {
  params: {
    token: string;
  };
}

export default async function DownloadTokenPage({ params }: DownloadPageProps) {
  const result = await validateToken(params.token);

  const getFileIcon = (format: string) => {
    if (format === 'PDF') return <BookOpen className="text-orange" size={20} />;
    if (format === 'Excel') return <FileSpreadsheet className="text-forest" size={20} />;
    return <FileText className="text-wood-dark" size={20} />;
  };

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
                {isExpired ? 'Download Link Expired' : 'Invalid Download Link'}
              </h1>
              <p className="text-sm text-bark/80 leading-relaxed">
                {isExpired
                  ? 'For security, download links expire after 7 days. Don&apos;t worry—you can generate a fresh link instantly using the email address you purchased with.'
                  : 'This download link was not found or has been revoked. If you purchased the playbook, you can easily recover your links below.'}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/resend-links"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange hover:bg-orange-hover text-white text-sm font-bold shadow transition-colors"
              >
                <RefreshCw size={16} />
                Generate Fresh Download Link
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-sand/40 border border-wood/30 rounded-2xl p-6 sm:p-8 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-bark/10 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-forest font-sans">
                  Secure Customer Area
                </span>
                <h1 className="font-serif font-bold text-2xl sm:text-3xl text-bark mt-1">
                  {order.productName}
                </h1>
                <p className="text-xs text-wood-dark mt-0.5">
                  Authorized for: <strong>{order.email}</strong>
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-forest bg-forest/10 px-3 py-1.5 rounded-full font-bold self-start sm:self-auto">
                <ShieldCheck size={14} />
                <span>Lifetime Access Granted • Never Expires</span>
              </div>
            </div>

            <p className="text-xs text-bark/80">
              Click any file below to start your download. Your purchase includes lifetime download rights — save your files locally and re-download whenever you need.
            </p>
          </div>

          {/* Files List */}
          <div className="bg-white border-2 border-bark/15 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-bark/60">
              Included Files ({order.allowedFiles.length})
            </h2>

            <div className="space-y-4">
              {order.allowedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-bark/10 bg-sand/20 hover:border-orange transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-sand/60 shrink-0">
                      {getFileIcon(file.format)}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-bark">
                        {file.name}
                      </h3>
                      <p className="text-xs text-bark/70 mt-0.5">{file.description}</p>
                      <span className="text-[11px] font-mono text-wood-dark mt-1 inline-block">
                        {file.format} • {file.sizeApprox}
                      </span>
                    </div>
                  </div>

                  <a
                    href={`/api/download?token=${order.downloadToken}&file=${file.filename}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-orange hover:bg-orange-hover text-white text-xs font-bold shadow-sm transition-all shrink-0"
                  >
                    <Download size={14} />
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-xs text-wood-dark">
            Need help opening files or need assistance? Email us at{' '}
            <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-orange underline">
              {SITE_CONFIG.supportEmail}
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
