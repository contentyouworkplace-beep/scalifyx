'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

export default function SEOInternsHiringPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUploadError('');
    const f = e.target.files?.[0] ?? null;
    if (!f) { setFile(null); return; }
    const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
    if (!['pdf', 'jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
      setUploadError('Only PDF, JPG, PNG, or WEBP allowed.');
      setFile(null);
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setUploadError('File must be under 10 MB.');
      setFile(null);
      return;
    }
    setFile(f);
  }

  function removeFile() {
    setFile(null);
    setUploadError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);

    let cvUrl = '';
    if (file) {
      try {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload-cv', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.url) cvUrl = data.url;
        else setUploadError(data.error || 'Upload failed — continuing without file.');
      } catch {
        setUploadError('Upload failed — continuing without file.');
      }
    }

    const text = encodeURIComponent(
      `Hi Scalify! I'm applying for the SEO Intern position.\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}${form.message ? `\n\nAbout me: ${form.message}` : ''}${cvUrl ? `\n\nCV / Portfolio: ${cvUrl}` : ''}`
    );

    setUploading(false);
    setSubmitted(true);
    window.open(`https://wa.me/916353583148?text=${text}`, '_blank');
  }

  const responsibilities = [
    'Keyword research & intent mapping',
    'On-page SEO optimization',
    'Google Search Console setup',
    'Technical SEO & site audits',
    'Link building & outreach',
    'Monthly analytics & reporting',
  ];

  const perks = [
    { icon: '🏠', label: '100% Remote' },
    { icon: '⏰', label: 'Flexible Hours' },
    { icon: '🎓', label: 'Real Experience' },
    { icon: '🏆', label: 'Certificate' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] font-['Poppins',sans-serif]">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#27272A]">
        <Link href="/" className="text-white font-bold text-xl tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F97316] to-[#A855F7]">Scalify</span>
        </Link>
        <a
          href="https://scalifyapp.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#71717A] hover:text-white transition-colors"
        >
          scalifyapp.com
        </a>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12 md:py-20">

        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Left — Info */}
          <div>
            <p className="text-white text-4xl md:text-5xl font-bold leading-tight mb-4">
              we are<br />hiring
            </p>

            <div className="inline-block mb-6">
              <span className="text-white text-3xl md:text-4xl font-extrabold px-5 py-2 rounded-full bg-gradient-to-r from-[#F97316] to-[#A855F7]">
                SEO INTERNS
              </span>
            </div>

            <p className="text-[#A1A1AA] text-base leading-relaxed mb-8">
              Scalify is hiring SEO interns across India. Perfect for students, freshers,
              freelancers, and digital marketing enthusiasts to gain real project experience,
              mentorship, and portfolio-building opportunities.
            </p>

            <div className="mb-8">
              <p className="text-white font-semibold mb-4 uppercase tracking-widest text-sm">
                responsibilities
              </p>
              <div className="h-px w-48 bg-gradient-to-r from-[#F97316] to-transparent mb-4" />
              <ul className="space-y-3">
                {responsibilities.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-[#D4D4D8]">
                    <span className="mt-1.5 w-2.5 h-2.5 rounded-sm bg-gradient-to-br from-[#F97316] to-[#EC4899] flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-4">
              {perks.map((p) => (
                <div
                  key={p.label}
                  className="flex items-center gap-2 bg-[#141419] border border-[#27272A] rounded-full px-4 py-2 text-sm text-[#D4D4D8]"
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-[#141419] border border-[#27272A] rounded-2xl p-8">
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-white text-xl font-bold mb-2">Opening WhatsApp…</h3>
                <p className="text-[#71717A] text-sm mb-6">
                  A WhatsApp chat has been opened with your details pre-filled. Send the message to apply!
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFile(null); setUploadError(''); }}
                  className="text-sm text-[#A855F7] hover:underline"
                >
                  Apply again
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-white text-2xl font-bold mb-1">Send your CV</h2>
                <p className="text-[#71717A] text-sm mb-6">
                  Fill in your details and we'll connect on WhatsApp.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[#A1A1AA] text-sm mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full bg-[#0A0A0F] border border-[#27272A] rounded-lg px-4 py-3 text-white placeholder-[#3F3F46] focus:outline-none focus:border-[#A855F7] transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A1A1AA] text-sm mb-1.5">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full bg-[#0A0A0F] border border-[#27272A] rounded-lg px-4 py-3 text-white placeholder-[#3F3F46] focus:outline-none focus:border-[#A855F7] transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A1A1AA] text-sm mb-1.5">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 00000 00000"
                      className="w-full bg-[#0A0A0F] border border-[#27272A] rounded-lg px-4 py-3 text-white placeholder-[#3F3F46] focus:outline-none focus:border-[#A855F7] transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A1A1AA] text-sm mb-1.5">
                      Tell us about yourself or your portfolio link <span className="text-[#3F3F46]">(optional)</span>
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Your background, skills, why you want to join… or paste a portfolio link"
                      className="w-full bg-[#0A0A0F] border border-[#27272A] rounded-lg px-4 py-3 text-white placeholder-[#3F3F46] focus:outline-none focus:border-[#A855F7] transition-colors text-sm resize-none"
                    />
                  </div>

                  {/* File upload */}
                  <div>
                    <label className="block text-[#A1A1AA] text-sm mb-1.5">
                      CV / Portfolio <span className="text-[#3F3F46]">(optional · PDF, JPG, PNG · max 10 MB)</span>
                    </label>

                    {file ? (
                      <div className="flex items-center gap-3 bg-[#0A0A0F] border border-[#27272A] rounded-lg px-4 py-3">
                        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#F97316] to-[#A855F7] flex items-center justify-center flex-shrink-0">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-white">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm truncate">{file.name}</p>
                          <p className="text-[#71717A] text-xs">{(file.size / 1024).toFixed(0)} KB</p>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-[#71717A] hover:text-white transition-colors flex-shrink-0"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-[#3F3F46] rounded-lg px-4 py-6 cursor-pointer hover:border-[#A855F7] transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-[#1A1A22] flex items-center justify-center group-hover:bg-[#27272A] transition-colors">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-[#71717A]">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </div>
                        <span className="text-[#71717A] text-sm group-hover:text-white transition-colors">
                          Click to upload your CV or portfolio
                        </span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.webp"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}

                    {uploadError && (
                      <p className="text-red-400 text-xs mt-1.5">{uploadError}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#F97316] to-[#A855F7] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Uploading…
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Apply via WhatsApp
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Bottom sections */}
        <div className="mt-20 grid md:grid-cols-3 gap-6">

          {/* Requirements */}
          <div className="bg-[#141419] border border-[#27272A] rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F97316] to-[#EC4899] flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-white">
                <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-lg mb-4">Requirements</h3>
            <ul className="space-y-3">
              {[
                'Basic SEO knowledge',
                'Google tools familiarity',
                'Attention to detail',
                'Willingness to learn',
                'Any location in India',
              ].map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-[#A1A1AA] text-sm">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Who Should Apply */}
          <div className="bg-[#141419] border border-[#27272A] rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#6366F1] flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-white">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-lg mb-4">Who Should Apply</h3>
            <ul className="space-y-3">
              {[
                'Students & Freshers',
                'Career Changers',
                'Freelancers looking for work',
                'Digital Marketing enthusiasts',
              ].map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-[#A1A1AA] text-sm">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#A855F7] flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Why Join Scalify */}
          <div className="bg-[#141419] border border-[#27272A] rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981] to-[#6366F1] flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-white">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-lg mb-4">Why Join Scalify</h3>
            <ul className="space-y-3">
              {[
                'Work on 100+ real SMB websites',
                'Learn from industry experts',
                'Build a strong portfolio',
                'Mentorship & guidance included',
                'Flexible work-life balance',
              ].map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-[#A1A1AA] text-sm">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center text-[#3F3F46] text-xs mt-16">
          © 2026 Scalify — <a href="https://scalifyapp.com" className="hover:text-[#71717A] transition-colors">scalifyapp.com</a>
        </p>
      </main>
    </div>
  );
}
