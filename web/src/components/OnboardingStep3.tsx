'use client';

import React from 'react';
import { TrashIcon, PlusIcon } from '@/components/Icons';

interface OnboardingStep3Props {
  data: any;
  updateData: (updates: any) => void;
}

export default function OnboardingStep3({ data, updateData }: OnboardingStep3Props) {
  const services = data.services || [];

  const addService = () => {
    updateData({
      services: [...services, { name: '', description: '', price: '' }],
    });
  };

  const updateService = (index: number, field: string, value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    updateData({ services: updated });
  };

  const removeService = (index: number) => {
    updateData({
      services: services.filter((_: any, i: number) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">Add at least one service your business offers *</p>

      <div className="space-y-3">
        {services.map((service: any, index: number) => (
          <div key={index} className="p-4 border border-border rounded-lg space-y-3">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Service Name *</label>
              <input
                type="text"
                value={service.name || ''}
                onChange={(e) => updateService(index, 'name', e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="e.g., Web Design"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">Description</label>
              <textarea
                value={service.description || ''}
                onChange={(e) => updateService(index, 'description', e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                placeholder="Describe this service"
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-white mb-1">Price (Optional)</label>
                <input
                  type="text"
                  value={service.price || ''}
                  onChange={(e) => updateService(index, 'price', e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  placeholder="e.g., ₹5,000"
                />
              </div>
              <button
                onClick={() => removeService(index)}
                className="mt-6 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                type="button"
              >
                <TrashIcon size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addService}
        type="button"
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-border rounded-lg text-primary hover:border-primary transition"
      >
        <PlusIcon size={18} />
        Add Service
      </button>
    </div>
  );
}
