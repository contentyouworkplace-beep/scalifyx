import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Reyyo — Turn First-Time Customers Into Regulars',
  description: 'Customer loyalty rewards platform built for Vadodara local businesses. One QR code, lifetime customers.',
  icons: {
    icon: '/reyyo/logo.webp',
    apple: '/reyyo/logo.webp',
  },
};

export default function ReyyoLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
