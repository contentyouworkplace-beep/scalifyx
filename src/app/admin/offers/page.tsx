'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../../lib/api';
import toast from 'react-hot-toast';

interface Offer {
  id: string;
  name: string;
  description: string;
  plan_type: 'trial' | 'pro';
  price: number;
  original_price: number;
  trial_days: number;
  features: string[];
  is_active: boolean;
  sort_order: number;
}

const DEFAULT_FEATURES = [
  'Website + Search Engine Optimization',
  'Unlimited Pages Professional Website',
  'Add Your Custom Domain',
  'Free Hosting',
  'Website Maintenance',
  'On-Page & Technical SEO',
  'Google Search Console Setup',
  'Mobile Responsive Design',
  'SSL Certificate',
  'Priority Chat Support',
  'WhatsApp Chat Button',
  'Contact Form',
  'Social Media Integration',
  'Monthly Analytics & SEO Report',
];

const EMPTY_FORM = {
  name: '', description: '', plan_type: 'pro' as 'trial' | 'pro',
  price: 749, original_price: 1999, trial_days: 0,
  features: [...DEFAULT_FEATURES], is_active: true, sort_order: 0,
};

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Offer | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [newFeature, setNewFeature] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchOffers = useCallback(async () => {
    try {
      const data = await apiFetch('/admin/offers');
      setOffers(data.offers || []);
    } catch (e) { console.error('Fetch offers error:', e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchOffers(); }, [fetchOffers]);

  const openCreate = () => {
    setEditing(null); setForm(EMPTY_FORM); setNewFeature(''); setModalVisible(true);
  };

  const openEdit = (offer: Offer) => {
    setEditing(offer);
    setForm({
      name: offer.name, description: offer.description, plan_type: offer.plan_type,
      price: offer.price, original_price: offer.original_price, trial_days: offer.trial_days,
      features: offer.features || [], is_active: offer.is_active, sort_order: offer.sort_order,
    });
    setNewFeature(''); setModalVisible(true);
  };

  const addFeature = () => {
    const trimmed = newFeature.trim();
    if (!trimmed) return;
    setForm(f => ({ ...f, features: [...f.features, trimmed] }));
    setNewFeature('');
  };

  const removeFeature = (idx: number) => {
    setForm(f => ({ ...f, features: f.features.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Offer name is required');
    setSaving(true);
    try {
      const body = {
        name: form.name.trim(), description: form.description.trim(), plan_type: form.plan_type,
        price: Number(form.price) || 0, original_price: Number(form.original_price) || 0,
        trial_days: form.plan_type === 'trial' ? (Number(form.trial_days) || 7) : 0,
        features: form.features, is_active: form.is_active, sort_order: Number(form.sort_order) || 0,
      };
      if (editing) {
        await apiFetch(`/admin/offers/${editing.id}`, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        await apiFetch('/admin/offers', { method: 'POST', body: JSON.stringify(body) });
      }
      toast.success(editing ? 'Offer updated' : 'Offer created');
      setModalVisible(false); fetchOffers();
    } catch (e: any) { toast.error(e.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (offer: Offer) => {
    if (!confirm(`Delete "${offer.name}"? This cannot be undone.`)) return;
    try {
      await apiFetch(`/admin/offers/${offer.id}`, { method: 'DELETE' });
      toast.success('Deleted'); fetchOffers();
    } catch (e: any) { toast.error(e.message || 'Failed to delete'); }
  };

  const toggleActive = async (offer: Offer) => {
    try {
      await apiFetch(`/admin/offers/${offer.id}`, { method: 'PUT', body: JSON.stringify({ is_active: !offer.is_active }) });
      fetchOffers();
    } catch (e) { console.error('Toggle error:', e); }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold">Offers & Packages</h1>
          <p className="text-xs text-zinc-500 mt-0.5">{offers.length} total · {offers.filter(o => o.is_active).length} active</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-sm font-semibold">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New
        </button>
      </div>

      {/* Offers List */}
      {offers.length === 0 ? (
        <div className="text-center py-20">
          <svg className="mx-auto mb-3 text-zinc-600" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          <p className="text-zinc-500 font-semibold">No offers yet</p>
          <p className="text-xs text-zinc-600 mt-1">Tap &quot;New&quot; to create your first offer</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {offers.map((offer) => {
            const discount = offer.original_price > 0 ? Math.round(((offer.original_price - offer.price) / offer.original_price) * 100) : 0;
            return (
              <div key={offer.id} className={`rounded-[14px] bg-surface border border-border p-4 ${!offer.is_active ? 'opacity-60' : ''}`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex gap-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${offer.plan_type === 'trial' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-primary/20 text-primary'}`}>
                      {offer.plan_type === 'trial' ? 'FREE TRIAL' : 'PAID'}
                    </span>
                    {!offer.is_active && <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-500/20 text-zinc-400">INACTIVE</span>}
                  </div>
                  <button onClick={() => toggleActive(offer)} className="text-zinc-400 hover:text-white">
                    {offer.is_active ? '👁' : '🙈'}
                  </button>
                </div>

                <h3 className="text-base font-bold">{offer.name}</h3>
                {offer.description && <p className="text-xs text-zinc-500 mt-0.5">{offer.description}</p>}

                {/* Price */}
                <div className="flex items-baseline gap-1.5 my-2">
                  {offer.plan_type === 'trial' ? (
                    <>
                      <span className="text-2xl font-extrabold text-yellow-400">FREE</span>
                      <span className="text-sm text-zinc-500">{offer.trial_days} days</span>
                    </>
                  ) : (
                    <>
                      {offer.original_price > offer.price && <span className="text-sm text-zinc-500 line-through">₹{offer.original_price}</span>}
                      <span className="text-2xl font-extrabold text-primary">₹{offer.price}</span>
                      <span className="text-sm text-zinc-500">/month</span>
                      {discount > 0 && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white">{discount}% OFF</span>}
                    </>
                  )}
                </div>

                {/* Features chips */}
                {offer.features.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 my-2">
                    {offer.features.slice(0, 3).map((f, i) => (
                      <span key={i} className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-xs">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
                        <span className="truncate max-w-[120px]">{f}</span>
                      </span>
                    ))}
                    {offer.features.length > 3 && <span className="text-[11px] text-zinc-500 self-center">+{offer.features.length - 3} more</span>}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                  <button onClick={() => openEdit(offer)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-xs font-medium text-primary">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(offer)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-medium text-red-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center" onClick={() => setModalVisible(false)}>
          <div className="bg-bg rounded-t-3xl md:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editing ? 'Edit Offer' : 'New Offer'}</h2>
              <button onClick={() => setModalVisible(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              {/* Type Toggle */}
              <div><label className="text-xs font-semibold text-zinc-500 mb-1.5 block">Type</label>
                <div className="flex gap-2">
                  {(['pro', 'trial'] as const).map((t) => (
                    <button key={t} onClick={() => setForm(f => ({...f, plan_type: t}))}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold border transition ${form.plan_type === t ? 'bg-primary border-primary text-white' : 'bg-surface border-border text-zinc-400'}`}>
                      {t === 'trial' ? '⏱ Free Trial' : '💎 Paid Package'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div><label className="text-xs font-semibold text-zinc-500 mb-1 block">Offer Name</label>
                <input className="w-full px-3.5 py-3 bg-surface border border-border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary" placeholder="e.g. ScalifyX Pro, 7-Day Free Trial" value={form.name} onChange={(e) => setForm(f => ({...f, name: e.target.value}))} /></div>

              {/* Description */}
              <div><label className="text-xs font-semibold text-zinc-500 mb-1 block">Description (optional)</label>
                <textarea className="w-full px-3.5 py-3 bg-surface border border-border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary min-h-[60px]" placeholder="Brief description" value={form.description} onChange={(e) => setForm(f => ({...f, description: e.target.value}))} /></div>

              {/* Pricing */}
              {form.plan_type === 'pro' ? (
                <>
                  <div className="flex gap-2.5">
                    <div className="flex-1"><label className="text-xs font-semibold text-zinc-500 mb-1 block">Offer Price (₹)</label>
                      <input className="w-full px-3.5 py-3 bg-surface border border-border rounded-xl text-sm text-white focus:outline-none focus:border-primary" type="number" value={form.price} onChange={(e) => setForm(f => ({...f, price: Number(e.target.value)}))} /></div>
                    <div className="flex-1"><label className="text-xs font-semibold text-zinc-500 mb-1 block">Regular Price (₹)</label>
                      <input className="w-full px-3.5 py-3 bg-surface border border-border rounded-xl text-sm text-white focus:outline-none focus:border-primary" type="number" value={form.original_price} onChange={(e) => setForm(f => ({...f, original_price: Number(e.target.value)}))} /></div>
                  </div>
                  {form.original_price > form.price && (
                    <p className="text-xs text-primary font-semibold">{Math.round(((form.original_price - form.price) / form.original_price) * 100)}% discount — Save ₹{form.original_price - form.price}/mo</p>
                  )}
                </>
              ) : (
                <div><label className="text-xs font-semibold text-zinc-500 mb-1 block">Trial Duration (days)</label>
                  <input className="w-full px-3.5 py-3 bg-surface border border-border rounded-xl text-sm text-white focus:outline-none focus:border-primary" type="number" value={form.trial_days} onChange={(e) => setForm(f => ({...f, trial_days: Number(e.target.value)}))} /></div>
              )}

              {/* Features */}
              <div><label className="text-xs font-semibold text-zinc-500 mb-1 block">Features</label>
                <div className="flex gap-2">
                  <input className="flex-1 px-3.5 py-3 bg-surface border border-border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary" placeholder="Add a feature..." value={newFeature} onChange={(e) => setNewFeature(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} />
                  <button onClick={addFeature} className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">+</button>
                </div>
                <div className="mt-2 space-y-1">
                  {form.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5 border-b border-border">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary flex-shrink-0"><circle cx="12" cy="12" r="10"/><polyline points="16 10 10.5 15.5 8 13"/></svg>
                      <span className="flex-1 text-sm truncate">{f}</span>
                      <button onClick={() => removeFeature(i)} className="text-zinc-500 hover:text-red-400 text-xs">✕</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active (visible to users)</span>
                <button onClick={() => setForm(f => ({...f, is_active: !f.is_active}))}
                  className={`w-11 h-6 rounded-full transition ${form.is_active ? 'bg-primary' : 'bg-zinc-700'} relative`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${form.is_active ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>

              {/* Sort */}
              <div><label className="text-xs font-semibold text-zinc-500 mb-1 block">Sort Order</label>
                <input className="w-full px-3.5 py-3 bg-surface border border-border rounded-xl text-sm text-white focus:outline-none focus:border-primary" type="number" value={form.sort_order} onChange={(e) => setForm(f => ({...f, sort_order: Number(e.target.value)}))} /></div>
            </div>

            <button onClick={handleSave} disabled={saving} className="w-full mt-5 py-3.5 bg-primary text-white rounded-xl font-bold text-sm disabled:opacity-50">
              {saving ? 'Saving...' : editing ? 'Update Offer' : 'Create Offer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
