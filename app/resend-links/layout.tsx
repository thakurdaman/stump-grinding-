import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resend Download Links',
  description: 'Access and resend your purchase download links for The Stump Grinding Playbook.',
  alternates: {
    canonical: '/resend-links',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ResendLinksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
