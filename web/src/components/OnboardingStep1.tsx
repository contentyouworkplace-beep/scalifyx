'use client';

import React from 'react';

interface OnboardingStep1Props {
  data: any;
  updateData: (updates: any) => void;
}

const BUSINESS_CATEGORIES = [
  'E-commerce',
  'Service',
  'Restaurant',
  'Healthcare',
  'Education',
  'Real Estate',
  'Technology',
  'Fitness',
  'Beauty & Wellness',
  'Entertainment',
  'Travel',
  'Finance',
  'Other',
];

export default function OnboardingStep1({ data, updateData }: OnboardingStep1Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Business Name *</label>
        <input
          type="text"
          value={data.business_name || ''}
          onChange={(e) => updateData({ business_name: e.target.value })}
          className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter your business name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Business Category *</label>
        <select
          value={data.business_category || ''}
          onChange={(e) => updateData({ business_category: e.target.value })}
          className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select a category</option>
          {BUSINESS_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">City/Location *</label>
        <input
          type="text"
          value={data.business_city || ''}
          onChange={(e) => updateData({ business_city: e.target.value })}
          className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter your city"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">WhatsApp Number *</label>
        <input
          type="tel"
          value={data.whatsapp_number || ''}
          onChange={(e) => updateData({ whatsapp_number: e.target.value })}
          className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="e.g., +91 98765 43210"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Business Address *</label>
        <input
          type="text"
          value={data.business_address || ''}
          onChange={(e) => updateData({ business_address: e.target.value })}
          className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter your business address"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Google Maps Link (Optional)</label>
        <input
          type="url"
          value={data.google_maps_link || ''}
          onChange={(e) => updateData({ google_maps_link: e.target.value })}
          className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Paste your Google Maps location link"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Business Description *</label>
        <textarea
          value={data.business_description || ''}
          onChange={(e) => updateData({ business_description: e.target.value })}
          className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="Tell us about your business (2-3 sentences)"
          rows={4}
        />
      </div>
    </div>
  );
}
