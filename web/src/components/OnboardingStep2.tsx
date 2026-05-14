'use client';

import React, { useRef, useState } from 'react';

interface OnboardingStep2Props {
  data: any;
  updateData: (updates: any) => void;
}

export default function OnboardingStep2({ data, updateData }: OnboardingStep2Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setUploading(true);

    // Show local preview immediately while uploading
    const localUrl = URL.createObjectURL(file);
    updateData({ logo_url: localUrl });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await res.json();

      if (!res.ok || !result.url) {
        setUploadError(result.error || 'Upload failed. Please try again.');
        updateData({ logo_url: '' });
        URL.revokeObjectURL(localUrl);
      } else {
        updateData({ logo_url: result.url });
        URL.revokeObjectURL(localUrl);
      }
    } catch {
      setUploadError('Upload failed. Please try again.');
      updateData({ logo_url: '' });
      URL.revokeObjectURL(localUrl);
    } finally {
      setUploading(false);
      // Reset input so the same file can be re-selected after error
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemoveLogo = () => {
    updateData({ logo_url: '' });
    setUploadError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Business Logo *</label>

        {data.logo_url ? (
          /* Preview with cancel button */
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-xl border border-border bg-surface overflow-hidden flex items-center justify-center">
              <img src={data.logo_url} alt="Logo preview" className="w-full h-full object-contain" />
            </div>
            {/* Cancel / remove button */}
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition"
              title="Remove logo"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            {/* Change button below preview */}
            <div className="mt-2">
              <label className="cursor-pointer text-xs text-primary underline">
                Change logo
                <input ref={inputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            </div>
          </div>
        ) : (
          /* Upload drop zone */
          <label className="block cursor-pointer">
            <input ref={inputRef} type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} className="hidden" />
            <div className={`flex flex-col items-center justify-center gap-2 px-4 py-8 border-2 border-dashed rounded-xl transition ${
              uploading ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary hover:bg-primary/5'
            }`}>
              {uploading ? (
                <>
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-zinc-400">Uploading...</span>
                </>
              ) : (
                <>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-500">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="text-sm font-medium text-zinc-300">Click to upload logo</span>
                  <span className="text-xs text-zinc-500">PNG, JPG, SVG — max 5 MB</span>
                </>
              )}
            </div>
          </label>
        )}

        {uploadError && (
          <p className="mt-2 text-xs text-red-400">{uploadError}</p>
        )}
      </div>

      {/* Instagram */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Instagram Profile URL <span className="text-zinc-500 font-normal">(Optional)</span></label>
        <input
          type="url"
          value={data.instagram_url || ''}
          onChange={(e) => updateData({ instagram_url: e.target.value })}
          className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="https://instagram.com/yourprofile"
        />
      </div>

      {/* Facebook */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Facebook Profile URL <span className="text-zinc-500 font-normal">(Optional)</span></label>
        <input
          type="url"
          value={data.facebook_url || ''}
          onChange={(e) => updateData({ facebook_url: e.target.value })}
          className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="https://facebook.com/yourpage"
        />
      </div>

      {/* Existing Website */}
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
