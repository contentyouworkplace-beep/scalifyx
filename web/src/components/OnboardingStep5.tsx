'use client';

import React, { useState } from 'react';

interface OnboardingStep5Props {
  data: any;
  updateData: (updates: any) => void;
}

export default function OnboardingStep5({ data, updateData }: OnboardingStep5Props) {
  const [domainPurchased, setDomainPurchased] = useState<boolean | null>(data.domain_purchased);
  const [domainError, setDomainError] = useState('');

  const handleDomainPurchased = (purchased: boolean) => {
    setDomainPurchased(purchased);
    setDomainError('');
    if (!purchased) {
      updateData({ domain_purchased: false, domain_name: '', domain_skipped_until: new Date().toISOString() });
    } else {
      updateData({ domain_purchased: true, domain_skipped_until: null });
    }
  };

  const handleDomainNameChange = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !trimmed.includes('.')) {
      setDomainError('Domain must contain a dot (e.g., example.com)');
    } else {
      setDomainError('');
    }
    updateData({ domain_name: trimmed });
  };

  const handleSkipDomain = () => {
    setDomainPurchased(null);
    setDomainError('');
    updateData({
      domain_purchased: false,
      domain_name: '',
      domain_skipped_until: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Review Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Review Your Information</h3>

        {/* Business Info Review */}
        <div className="p-4 border border-border rounded-lg bg-surface/50 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-400 uppercase">Business Name</label>
              <p className="text-sm text-white mt-1">{data.business_name || '—'}</p>
            </div>
            <div>
              <label className="text-xs text-zinc-400 uppercase">Category</label>
              <p className="text-sm text-white mt-1">{data.business_category || '—'}</p>
            </div>
            <div>
              <label className="text-xs text-zinc-400 uppercase">City</label>
              <p className="text-sm text-white mt-1">{data.business_city || '—'}</p>
            </div>
            <div>
              <label className="text-xs text-zinc-400 uppercase">WhatsApp</label>
              <p className="text-sm text-white mt-1">{data.whatsapp_number || '—'}</p>
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-400 uppercase">Address</label>
            <p className="text-sm text-white mt-1">{data.business_address || '—'}</p>
          </div>
          <div>
            <label className="text-xs text-zinc-400 uppercase">Description</label>
            <p className="text-sm text-white mt-1">{data.business_description || '—'}</p>
          </div>
        </div>

        {/* Branding Review */}
        <div className="p-4 border border-border rounded-lg bg-surface/50 space-y-3">
          <h4 className="text-sm font-medium text-white">Branding</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-400 uppercase">Logo</label>
              {data.logo_url ? (
                <img src={data.logo_url} alt="Logo" className="w-16 h-16 object-contain rounded mt-1" />
              ) : (
                <p className="text-sm text-zinc-400 mt-1">—</p>
              )}
            </div>
            <div>
              <label className="text-xs text-zinc-400 uppercase">Instagram</label>
              <p className="text-sm text-white mt-1 truncate">{data.instagram_url || '—'}</p>
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-400 uppercase">Facebook</label>
            <p className="text-sm text-white mt-1 truncate">{data.facebook_url || '—'}</p>
          </div>
        </div>

        {/* Services Review */}
        {data.services && data.services.length > 0 && (
          <div className="p-4 border border-border rounded-lg bg-surface/50 space-y-3">
            <h4 className="text-sm font-medium text-white">Services ({data.services.length})</h4>
            <div className="space-y-2">
              {data.services.map((service: any, index: number) => (
                <div key={index} className="text-sm">
                  <p className="text-white font-medium">{service.name}</p>
                  {service.price && <p className="text-zinc-400 text-xs">{service.price}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Review */}
        {data.gallery_images && data.gallery_images.length > 0 && (
          <div className="p-4 border border-border rounded-lg bg-surface/50 space-y-3">
            <h4 className="text-sm font-medium text-white">Gallery Images ({data.gallery_images.length})</h4>
            <div className="grid grid-cols-4 gap-2">
              {data.gallery_images.map((image: string, index: number) => (
                <img key={index} src={image} alt={`Gallery ${index + 1}`} className="w-full aspect-square object-cover rounded" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Domain Verification Section */}
      <div className="space-y-4 p-4 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5">
        <h3 className="text-lg font-semibold text-white">Did you purchase a domain name? *</h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="domain_purchase"
              checked={domainPurchased === true}
              onChange={() => handleDomainPurchased(true)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-white">Yes, I purchased a domain</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="domain_purchase"
              checked={domainPurchased === false && data.domain_skipped_until}
              onChange={() => handleDomainPurchased(false)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-white">No, I don't have a domain yet</span>
          </label>
        </div>

        {/* Domain Input - Shows when Yes is selected */}
        {domainPurchased === true && (
          <div className="space-y-2 mt-4 p-3 bg-surface rounded-lg">
            <label className="block text-sm font-medium text-white">Enter your domain name *</label>
            <input
              type="text"
              value={data.domain_name || ''}
              onChange={(e) => handleDomainNameChange(e.target.value)}
              placeholder="e.g., example.com"
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            {domainError && <p className="text-xs text-red-400">{domainError}</p>}
            <p className="text-xs text-zinc-400">Include the full domain (e.g., businessname.com)</p>
          </div>
        )}

        {/* Hostinger Link - Shows when No is selected */}
        {domainPurchased === false && data.domain_skipped_until && (
          <div className="space-y-3 mt-4 p-3 bg-surface rounded-lg">
            <p className="text-sm text-zinc-300">
              Get a domain name from our partner Hostinger:
            </p>
            <a
              href="https://www.hostinger.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition text-sm"
            >
              Get Domain at Hostinger
            </a>
            <p className="text-xs text-zinc-400 mt-2">
              You can add your domain later from the My Website section
            </p>
          </div>
        )}

        {/* Skip Button - Shows when no selection yet */}
        {domainPurchased === null && (
          <button
            onClick={handleSkipDomain}
            type="button"
            className="mt-4 px-4 py-2 border border-border rounded-lg text-zinc-400 hover:text-white hover:border-primary transition text-sm"
          >
            Skip for Now - Add Domain Later
          </button>
        )}
      </div>
    </div>
  );
}
