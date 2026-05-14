'use client';

import React, { useState } from 'react';

interface OnboardingStep2Props {
  data: any;
  updateData: (updates: any) => void;
}

export default function OnboardingStep2({ data, updateData }: OnboardingStep2Props) {
  const [logoPreview, setLogoPreview] = useState<string | null>(data.logo_url || null);
  const [uploading, setUploading] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.url) {
        updateData({ logo_url: result.url });
        setLogoPreview(result.url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Business Logo *</label>
        <div className="flex flex-col gap-3">
          {logoPreview && (
            <div className="w-24 h-24 rounded-lg border border-border overflow-hidden flex items-center justify-center bg-surface">
              <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
            </div>
          )}
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={uploading}
              className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className="px-4 py-2 border-2 border-dashed border-border rounded-lg text-center text-zinc-400 hover:border-primary transition">
              {uploading ? 'Uploading...' : 'Click to upload logo'}
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Instagram Profile URL</label>
        <input
          type="url"
          value={data.instagram_url || ''}
          onChange={(e) => updateData({ instagram_url: e.target.value })}
          className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="https://instagram.com/yourprofile"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Facebook Profile URL</label>
        <input
          type="url"
          value={data.facebook_url || ''}
          onChange={(e) => updateData({ facebook_url: e.target.value })}
          className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="https://facebook.com/yourpage"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Existing Website URL (Optional)</label>
        <input
          type="url"
          value={data.existing_website_url || ''}
          onChange={(e) => updateData({ existing_website_url: e.target.value })}
          className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="https://yourwebsite.com"
        />
      </div>
    </div>
  );
}
