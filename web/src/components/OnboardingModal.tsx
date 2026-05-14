'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';
import OnboardingStep3 from './OnboardingStep3';
import OnboardingStep4 from './OnboardingStep4';
import OnboardingStep5 from './OnboardingStep5';

interface OnboardingData {
  // Step 1: Business Info
  business_name: string;
  business_category: string;
  business_city: string;
  whatsapp_number: string;
  email: string;
  business_address: string;
  google_maps_link: string;
  business_description: string;
  // Step 2: Branding
  logo_url: string;
  instagram_url: string;
  facebook_url: string;
  existing_website_url: string;
  // Step 3: Services
  services: Array<{ name: string; description: string; price?: string }>;
  // Step 4: Gallery
  gallery_images: string[];
  // Step 5: Domain
  domain_purchased: boolean;
  domain_name: string;
}

interface OnboardingModalProps {
  onComplete?: () => void;
}

const INITIAL_DATA: OnboardingData = {
  business_name: '',
  business_category: '',
  business_city: '',
  whatsapp_number: '',
  email: '',
  business_address: '',
  google_maps_link: '',
  business_description: '',
  logo_url: '',
  instagram_url: '',
  facebook_url: '',
  existing_website_url: '',
  services: [],
  gallery_images: [],
  domain_purchased: false,
  domain_name: '',
};

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    ...INITIAL_DATA,
    email: user?.email || '',
    whatsapp_number: user?.phone || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
    setError('');
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(data.business_name && data.business_category && data.business_city &&
                  data.whatsapp_number && data.business_address && data.business_description);
      case 2:
        return !!data.logo_url;
      case 3:
        return data.services.length > 0;
      case 4:
        return true; // Gallery is optional
      case 5:
        return true; // Validation happens during submission
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    } else {
      setError('Please fill in all required fields before proceeding.');
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) {
      setError('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiFetch('/onboarding/submit', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (onComplete) {
        onComplete();
      } else {
        window.location.href = '/dashboard/website';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <OnboardingStep1 data={data} updateData={updateData} />;
      case 2:
        return <OnboardingStep2 data={data} updateData={updateData} />;
      case 3:
        return <OnboardingStep3 data={data} updateData={updateData} />;
      case 4:
        return <OnboardingStep4 data={data} updateData={updateData} />;
      case 5:
        return <OnboardingStep5 data={data} updateData={updateData} />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-2xl bg-card border border-border p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Complete Your Profile in 5 Steps</h2>
        <p className="text-zinc-400">to Activate Your Website</p>

        {/* Progress bar */}
        <div className="mt-4 flex gap-2">
          {[1, 2, 3, 4, 5].map(step => (
            <div
              key={step}
              className={`h-2 flex-1 rounded-full transition ${
                step <= currentStep ? 'bg-primary' : 'bg-zinc-700'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-zinc-500 mt-2">Step {currentStep} of 5</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Step content */}
      <div className="mb-8">
        {renderStep()}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3 justify-between">
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="px-6 py-2 rounded-lg border border-border text-zinc-400 hover:text-white hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Back
        </button>

        {currentStep < 5 ? (
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? 'Completing...' : 'Complete Setup'}
          </button>
        )}
      </div>
    </div>
  );
}
