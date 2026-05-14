'use client';

import React, { useState } from 'react';
import { TrashIcon, ArrowUpIcon, ArrowDownIcon } from '@/components/Icons';

interface OnboardingStep4Props {
  data: any;
  updateData: (updates: any) => void;
}

export default function OnboardingStep4({ data, updateData }: OnboardingStep4Props) {
  const images = data.gallery_images || [];
  const [uploading, setUploading] = useState(false);
  const maxImages = 10;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const canAdd = maxImages - images.length;
    if (canAdd <= 0) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    if (files.length > canAdd) {
      alert(`Can only add ${canAdd} more images`);
      return;
    }

    setUploading(true);
    try {
      const uploadedUrls = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        if (result.url) {
          uploadedUrls.push(result.url);
        }
      }

      if (uploadedUrls.length > 0) {
        updateData({
          gallery_images: [...images, ...uploadedUrls],
        });
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= newImages.length) return;

    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    updateData({ gallery_images: newImages });
  };

  const removeImage = (index: number) => {
    updateData({
      gallery_images: images.filter((_: any, i: number) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">
        Upload business photos (Optional) - {images.length}/{maxImages} images
      </p>

      <div className="grid grid-cols-2 gap-3">
        {images.map((image: string, index: number) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`Gallery ${index + 1}`}
              className="w-full aspect-square object-cover rounded-lg border border-border"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center gap-1">
              {index > 0 && (
                <button
                  onClick={() => moveImage(index, 'up')}
                  className="p-1 bg-primary rounded hover:bg-primary/80 transition"
                  type="button"
                >
                  <ArrowUpIcon size={16} />
                </button>
              )}
              {index < images.length - 1 && (
                <button
                  onClick={() => moveImage(index, 'down')}
                  className="p-1 bg-primary rounded hover:bg-primary/80 transition"
                  type="button"
                >
                  <ArrowDownIcon size={16} />
                </button>
              )}
              <button
                onClick={() => removeImage(index)}
                className="p-1 bg-red-500 rounded hover:bg-red-600 transition"
                type="button"
              >
                <TrashIcon size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {images.length < maxImages && (
        <div className="relative">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="px-4 py-3 border-2 border-dashed border-border rounded-lg text-center text-zinc-400 hover:border-primary transition">
            {uploading ? 'Uploading...' : 'Click to upload more photos'}
          </div>
        </div>
      )}
    </div>
  );
}
