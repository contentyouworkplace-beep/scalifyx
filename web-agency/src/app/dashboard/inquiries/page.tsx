'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const PROJECT_TYPES = [
  'Web Design & Development',
  'E-commerce Solutions',
  'Branding & Logo Design',
  'Digital Marketing',
  'SEO & Content Strategy',
  'Other Services'
];

const BUDGET_RANGES = [
  '₹50,000 - ₹1,00,000',
  '₹1,00,000 - ₹2,50,000',
  '₹2,50,000 - ₹5,00,000',
  '₹5,00,000 - ₹10,00,000',
  '₹10,00,000+'
];

const TIMELINE_OPTIONS = [
  'ASAP (within 2 weeks)',
  '1-2 months',
  '2-3 months',
  'Not decided yet'
];

export default function InquiriesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    projectType: 'Web Design & Development',
    description: '',
    budget: '',
    timeline: 'Not decided yet',
    additionalNotes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="max-w-2xl mx-auto px-4 py-32">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Thank You!</h1>
            <p className="text-lg text-zinc-400 mb-2">Your project inquiry has been received.</p>
            <p className="text-zinc-500 mb-8">Our team will review your details and get back to you within 24 hours.</p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-400 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Project Inquiry Form</h1>
          <p className="text-zinc-400">Tell us about your project and we'll get back to you with a proposal.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Type */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">What type of project do you need?</label>
            <select
              value={formData.projectType}
              onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
              className="w-full rounded-xl border border-border bg-inputBg px-4 py-3 text-white focus:border-green-500/50 focus:outline-none transition"
            >
              {PROJECT_TYPES.map((type) => (
                <option key={type} value={type} className="bg-zinc-950">{type}</option>
              ))}
            </select>
          </div>

          {/* Project Description */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">Describe your project</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={5}
              className="w-full rounded-xl border border-border bg-inputBg px-4 py-3 text-white placeholder-zinc-600 focus:border-green-500/50 focus:outline-none transition resize-none"
              placeholder="What do you want to build? What are your goals?"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">Budget Range</label>
            <select
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full rounded-xl border border-border bg-inputBg px-4 py-3 text-white focus:border-green-500/50 focus:outline-none transition"
            >
              <option value="" className="bg-zinc-950">Select a budget range</option>
              {BUDGET_RANGES.map((range) => (
                <option key={range} value={range} className="bg-zinc-950">{range}</option>
              ))}
            </select>
          </div>

          {/* Timeline */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">When do you need this completed?</label>
            <select
              value={formData.timeline}
              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              className="w-full rounded-xl border border-border bg-inputBg px-4 py-3 text-white focus:border-green-500/50 focus:outline-none transition"
            >
              {TIMELINE_OPTIONS.map((option) => (
                <option key={option} value={option} className="bg-zinc-950">{option}</option>
              ))}
            </select>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">Additional Notes (optional)</label>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-border bg-inputBg px-4 py-3 text-white placeholder-zinc-600 focus:border-green-500/50 focus:outline-none transition resize-none"
              placeholder="Any other details we should know?"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-green-500 px-6 py-4 text-sm font-bold text-white transition hover:bg-green-400 active:scale-[0.99] disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Project Inquiry'}
          </button>
        </form>
      </div>
    </div>
  );
}
