'use client';

import Image from 'next/image';
import React from 'react';

const SEARCH_CONSOLE_IMAGES = [
  '/search-console/1.png',
  '/search-console/2.png',
  '/search-console/3.png',
  '/search-console/4.png',
  '/search-console/5.png',
  '/search-console/6.png',
  '/search-console/7.png',
  '/search-console/8.png',
];

export function SearchConsoleStats() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">Real Results From Our Members</h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            These are actual Google Search Console screenshots from real businesses using Scalify.
            This is what happens when you have the right website, proper SEO, and direct lead capture.
          </p>
        </div>

        {/* Desktop: 2-column 4-row static grid */}
        <div className="hidden md:grid grid-cols-2 gap-4">
          {SEARCH_CONSOLE_IMAGES.map((image, index) => (
            <div key={index} className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-xl shadow-black/40">
              <div className="relative h-64 w-full bg-black/50">
                <Image
                  src={image}
                  alt={`Member Result ${index + 1}`}
                  fill
                  className="object-contain"
                  priority={index < 2}
                />
              </div>
              <div className="px-4 py-2 text-center border-t border-border">
                <p className="text-xs font-semibold text-zinc-500">Member Result {index + 1}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Vertical Stack */}
        <div className="md:hidden space-y-4">
          {SEARCH_CONSOLE_IMAGES.map((image, index) => (
            <div key={index} className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-xl shadow-black/40">
              <div className="relative h-64 w-full bg-black/50">
                <Image
                  src={image}
                  alt={`Member Result ${index + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-4 text-center">
                <p className="text-sm font-semibold text-zinc-400">
                  Member Result {index + 1} of {SEARCH_CONSOLE_IMAGES.length}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Avg. Clicks', value: '380-450' },
            { label: 'Impressions', value: '28.9K-74.3K' },
            { label: 'Avg. CTR', value: '0.9%-3.1%' },
            { label: 'Avg. Position', value: '6.7-17.2' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-surface/50 p-6 text-center hover:border-green-500/30 transition">
              <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">{item.value}</div>
              <div className="text-zinc-400 text-sm font-medium">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Message */}
        <div className="mt-12 text-center">
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
            <span className="text-green-400 font-bold">This is what works.</span> A focused website. Local SEO. WhatsApp leads.
            Consistent results month after month. Your competitors are wondering why you're getting all the customers.
          </p>
        </div>
      </div>
    </section>
  );
}
