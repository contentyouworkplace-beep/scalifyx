'use client';

import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { GlobeIcon, DiamondIcon, SearchIcon, ShieldIcon, SparklesIcon } from '../../../components/Icons';

const SERVICES = [
  {
    id: 'web-design',
    name: 'Web Design & Development',
    description: 'Custom-designed and fully functional websites',
    price: 'Starting at ₹50,000',
    icon: GlobeIcon,
    features: [
      'Custom UI/UX Design',
      'Fully Responsive',
      'Mobile Optimized',
      '5 Revision Rounds',
      'Content Upload',
      'Basic SEO Setup',
    ],
    popular: false,
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce Solutions',
    description: 'Complete online store setup and management',
    price: 'Starting at ₹1,00,000',
    icon: DiamondIcon,
    features: [
      'Product Catalog Setup',
      'Payment Gateway Integration',
      'Inventory Management',
      'Order Tracking System',
      'Customer Dashboard',
      'Marketing Tools',
      'SEO Optimization',
    ],
    popular: true,
  },
  {
    id: 'seo',
    name: 'SEO & Digital Marketing',
    description: 'Boost your online visibility and traffic',
    price: 'Starting at ₹25,000/month',
    icon: SearchIcon,
    features: [
      'Keyword Research',
      'On-Page Optimization',
      'Technical SEO Audit',
      'Monthly Reports',
      'Content Strategy',
      'Link Building',
      'Monthly Maintenance',
    ],
    popular: false,
  },
  {
    id: 'branding',
    name: 'Branding & Design',
    description: 'Create a strong brand identity',
    price: 'Starting at ₹35,000',
    icon: SparklesIcon,
    features: [
      'Logo Design',
      'Brand Guidelines',
      'Color Palette',
      'Typography Guide',
      'Brand Messaging',
      'Business Card Design',
      'Email Template Design',
    ],
    popular: false,
  },
];

export default function ServicesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-zinc-700 border-t-green-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Our Services</h1>
        <p className="text-zinc-400">Choose the perfect service package for your project needs</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {SERVICES.map((service) => {
          const IconComponent = service.icon;
          return (
            <div
              key={service.id}
              className={`rounded-2xl p-6 border transition ${
                service.popular
                  ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/40'
                  : 'bg-card border-border hover:border-green-500/30'
              }`}
            >
              {service.popular && (
                <div className="inline-block mb-3 px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
                  POPULAR
                </div>
              )}

              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0">
                  <IconComponent size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{service.name}</h3>
                  <p className="text-sm text-zinc-400 mt-1">{service.description}</p>
                </div>
              </div>

              <div className="mb-4 py-4 border-t border-b border-border">
                <p className="text-2xl font-bold text-green-400">{service.price}</p>
              </div>

              <div className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400 flex-shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/dashboard/inquiries"
                className="w-full inline-block text-center px-4 py-3 rounded-lg border border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20 transition font-semibold text-sm"
              >
                Request This Service
              </Link>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="rounded-2xl bg-card border border-border p-6">
        <h2 className="text-lg font-bold text-white mb-4">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { number: '01', title: 'Submit Inquiry', desc: 'Tell us about your project' },
            { number: '02', title: 'Discovery Call', desc: 'We discuss your goals & requirements' },
            { number: '03', title: 'Custom Proposal', desc: 'Detailed plan & timeline' },
            { number: '04', title: 'Project Delivery', desc: 'Get your deliverables on time' },
          ].map((step) => (
            <div key={step.number} className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{step.number}</div>
              <div className="font-semibold text-white mb-1">{step.title}</div>
              <p className="text-xs text-zinc-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
