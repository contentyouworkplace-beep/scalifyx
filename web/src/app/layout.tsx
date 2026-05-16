import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Scalify — Professional Business Website Starting ₹1,499/month',
  description: 'Get a professional, SEO-optimized website for your business. AI-powered website + Google SEO + WhatsApp leads. All starting at ₹1,499/month. Live in 60 seconds.',
  keywords: 'website builder, AI website, business website, SEO, professional website India',
  icons: {
    icon: '/icon.png',
    shortcut: '/favicon.png',
    apple: '/icon.png',
  },
  verification: {
    google: 'googlec1b155cb6acd07f9',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1624622505434138');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1624622505434138&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-VFV2CX4EB2"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-VFV2CX4EB2');
            `,
          }}
        />
      </head>
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
