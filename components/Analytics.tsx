'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';

export function trackEvent(eventName: string, props?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  // Plausible
  if ((window as any).plausible) {
    (window as any).plausible(eventName, { props });
  }

  // Google Analytics (gtag)
  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, props);
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics Event] ${eventName}:`, props || {});
  }
}

export const Analytics: React.FC = () => {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <>
      {plausibleDomain && (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
        />
      )}

      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { page_path: window.location.pathname });
            `}
          </Script>
        </>
      )}
    </>
  );
};
