import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Website & SEO Services in Vadodara | Scalify',
  description: 'We build professional websites and do SEO for local businesses in Vadodara. Get found on Google, get leads on WhatsApp. Results from Month 2. Free quote.',
  openGraph: {
    title: 'Website & SEO Services in Vadodara | Scalify',
    description: 'We build professional websites and do SEO for local businesses in Vadodara. Get found on Google, get leads on WhatsApp. Results from Month 2.',
    url: 'https://scalifyapp.com/vadodara',
    siteName: 'Scalify',
    type: 'website',
  },
};

export default function VadodaraLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
