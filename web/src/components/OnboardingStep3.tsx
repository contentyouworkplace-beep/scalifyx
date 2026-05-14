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
    updateData({ services: [...services, { name: '' }] });
  };

  const updateService = (index: number, value: string) => {
    const updated = [...services];
    updated[index] = { name: value };
    updateData({ services: updated });
  };

  const removeService = (index: number) => {
    updateData({ services: services.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-zinc-400">Add at least one service your business offers *</p>

      {services.map((service: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={service.name || ''}
            onChange={(e) => updateService(index, e.target.value)}
            className="flex-1 px-4 py-2.5 bg-surface border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            placeholder={`e.g., ${['Hair Cut', 'Website Design', 'Dental Cleaning', 'AC Repair'][index % 4]}`}
          />
          <button
            onClick={() => removeService(index)}
            className="p-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition flex-shrink-0"
            type="button"
          >
            <TrashIcon size={16} />
          </button>
        </div>
      ))}

      <button
        onClick={addService}
        type="button"
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-border rounded-lg text-primary hover:border-primary transition text-sm font-medium"
      >
        <PlusIcon size={16} />
        Add Service
      </button>
    </div>
  );
}
