import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'ScalifyX — Professional Website in 60 Seconds',
  description: 'Get a professional, SEO-optimized website for your business in 60 seconds. Just chat with our AI and go live. Starting at ₹199/month.',
  keywords: 'website builder, AI website, business website, SEO, cheap website',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg text-white antialiased">
        <Providers>
          {children}
        </Providers>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1A1A22', color: '#F0F0F5', border: '1px solid #27272A' },
          }}
        />
      </body>
    </html>
  );
}
