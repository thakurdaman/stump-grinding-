import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TreeRing } from '@/components/TreeRing';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-24 bg-[#FBF6EC] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-sand mx-auto flex items-center justify-center text-wood-dark border border-wood/20">
            <TreeRing size={48} strokeColor="#33241B" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-orange font-sans">
              404 • Page Not Found
            </span>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-bark">
              Hit a bedrock obstruction.
            </h1>
            <p className="text-sm text-bark/80 leading-relaxed">
              The page you are looking for doesn’t exist or has been relocated.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange hover:bg-orange-hover text-white text-sm font-bold shadow transition-colors"
            >
              <ArrowLeft size={16} />
              Return to Homepage
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
