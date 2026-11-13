import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Support',
  description: 'Get in touch with customer support for The Stump Grinding Playbook.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
