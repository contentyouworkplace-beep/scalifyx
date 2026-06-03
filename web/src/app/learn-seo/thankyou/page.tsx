'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function LearnSEOThankYou() {
  useEffect(() => {
    // Fire Meta Pixel Lead event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: 'SEO Masterclass Enquiry',
        content_category: 'SEO Course',
        currency: 'INR',
        value: 4999,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-['Poppins',sans-serif] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">

        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#16A34A] to-[#0EA5E9] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-100">
          <svg width="36" height="28" viewBox="0 0 40 30" fill="none">
            <path d="M3 15L14 26L37 3" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="text-4xl font-extrabold text-[#0F172A] mb-3 tracking-tight">Thank You!</h1>
        <p className="text-[#6B7280] text-base mb-8 leading-relaxed">
          We've received your enquiry. Our team will reach out to you on WhatsApp shortly to confirm your slot.
        </p>

        <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-5 mb-8 text-left">
          <p className="text-[#15803D] text-sm font-semibold mb-1">What happens next?</p>
          <ul className="space-y-1.5 mt-2">
            {[
              'We'll WhatsApp you within a few hours',
              'Confirm your preferred date & time slot',
              'Pay Rs. 99 to lock your seat',
              'Get session link before your class',
            ].map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-[#16A34A]">
                <span className="w-4 h-4 rounded-full bg-[#16A34A] flex items-center justify-center flex-shrink-0">
                  <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <a
          href="https://wa.me/916353583148?text=Hi%2C%20I%20just%20enquired%20about%20the%20SEO%20Masterclass.%20Can%20you%20help%20me%20book%20a%20slot%3F"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#15803D] text-white font-bold text-sm shadow-lg shadow-green-100 hover:opacity-90 transition mb-4 w-full"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp Us Now
        </a>

        <Link href="/learn-seo" className="text-xs text-[#9CA3AF] hover:text-[#0F172A] transition">
          ← Back to course page
        </Link>
      </div>
    </div>
  );
}
