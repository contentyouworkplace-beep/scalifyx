import Link from 'next/link';
import { Logo } from '@/components/Logo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping & Service Delivery — Scalify',
  description: 'How Scalify delivers its digital services and handles service exchanges.',
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-bg text-white">
      <nav className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/"><Logo size={28} /></Link>
          <Link href="/" className="text-sm text-zinc-500 hover:text-white transition">← Back to Home</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Legal</p>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Shipping &amp; Service Delivery</h1>
          <p className="text-zinc-500 text-sm">Last updated: 4 May 2026</p>
        </div>

        {/* Info Banner */}
        <div className="rounded-2xl bg-indigo-500/5 border border-indigo-500/20 p-5 mb-12 flex items-start gap-4">
          <span className="text-2xl mt-0.5">📦</span>
          <div>
            <p className="text-sm font-semibold text-white">Scalify is a 100% Digital Service</p>
            <p className="text-sm text-zinc-400 mt-1">We do not sell or ship any physical products. All our services — websites, SEO, analytics, and support — are delivered entirely online. This page describes how our digital service delivery works.</p>
          </div>
        </div>

        <div className="space-y-10 text-zinc-400 leading-relaxed">

          <Section title="1. Service Delivery Method">
            <p>All Scalify services are delivered digitally, immediately upon subscription activation. There is no physical shipping involved. Here is what you receive and when:</p>
            <ul>
              <li><strong>Account access</strong> — Instant, upon successful signup</li>
              <li><strong>AI chat and website builder</strong> — Available immediately after subscribing to Pro</li>
              <li><strong>Website goes live</strong> — Within 60 seconds of completing the AI chat onboarding</li>
              <li><strong>Free subdomain (yourbusiness.scalifyapp.com)</strong> — Active immediately after website creation</li>
              <li><strong>SSL certificate</strong> — Provisioned automatically within minutes</li>
              <li><strong>Google Search Console setup</strong> — Within 24 hours of website creation</li>
              <li><strong>First SEO report</strong> — Delivered to your email within 7 days of going live</li>
            </ul>
          </Section>

          <Section title="2. Custom Domain Connection">
            <p>If you choose to connect a custom domain (purchased separately from any registrar):</p>
            <ul>
              <li>Our team will guide you through the DNS configuration process</li>
              <li>Domain propagation typically takes 1–24 hours after DNS changes</li>
              <li>Your website remains live on your free Scalify subdomain during propagation</li>
              <li>Custom domain connection is provided free of charge as part of your subscription</li>
            </ul>
          </Section>

          <Section title="3. Service Availability and Access">
            <p>Once your subscription is active, you have uninterrupted access to:</p>
            <ul>
              <li>Your Scalify dashboard at scalifyapp.com</li>
              <li>AI chat for website creation and updates</li>
              <li>Website analytics and SEO performance data</li>
              <li>24/7 customer support via chat, email, and WhatsApp</li>
            </ul>
            <p>Access continues for the full duration of your paid billing period. If you cancel, access remains until the end of the current month.</p>
          </Section>

          <Section title="4. Service Changes (Exchange Policy)">
            <p>Since Scalify is a digital service, "exchanges" refer to modifications and updates to your delivered service:</p>
            <ul>
              <li><strong>Website design changes</strong> — Unlimited. Simply chat with our AI or contact support</li>
              <li><strong>Content updates</strong> — Unlimited. Update text, images, or sections at any time</li>
              <li><strong>Template changes</strong> — You may switch to any of our 12+ templates at any time</li>
              <li><strong>Plan upgrades/downgrades</strong> — Effective from the next billing cycle</li>
            </ul>
            <p>We do not offer plan-to-plan "exchanges" mid-cycle. If you wish to change your plan, the change takes effect on your next renewal date.</p>
          </Section>

          <Section title="5. Delivery Failures">
            <p>In the rare event that a service is not delivered as expected (e.g., website fails to deploy, SSL not provisioned), please contact us immediately:</p>
            <ul>
              <li>Email: <a href="mailto:support@scalifyapp.com" className="text-green-400 hover:underline">support@scalifyapp.com</a></li>
              <li>WhatsApp: <a href="https://wa.me/916353583148" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">+91 63535 83148</a></li>
            </ul>
            <p>We will resolve all technical delivery issues within 24 hours. If we are unable to deliver the subscribed service due to our fault, you are entitled to a full refund for that period.</p>
          </Section>

          <Section title="6. Data Export on Service Termination">
            <p>When your subscription ends or you choose to leave Scalify:</p>
            <ul>
              <li>You may request an export of your website content within 30 days of account closure</li>
              <li>Content exports include all text, images, and settings in a downloadable format</li>
              <li>To request an export, email <a href="mailto:support@scalifyapp.com" className="text-green-400 hover:underline">support@scalifyapp.com</a></li>
            </ul>
          </Section>

          <Section title="7. Questions">
            <p>For any questions about service delivery, please contact us at:</p>
            <ul>
              <li>Email: <a href="mailto:support@scalifyapp.com" className="text-green-400 hover:underline">support@scalifyapp.com</a></li>
              <li>WhatsApp: <a href="https://wa.me/916353583148" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">+91 63535 83148</a></li>
              <li>Or visit: <Link href="/contact" className="text-green-400 hover:underline">Contact Us</Link></li>
            </ul>
          </Section>

        </div>
      </main>

      <LegalFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      <div className="space-y-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:text-zinc-500 [&_p]:text-zinc-400 [&_strong]:text-zinc-200 [&_a]:text-green-400">
        {children}
      </div>
    </div>
  );
}

function LegalFooter() {
  return (
    <footer className="border-t border-border mt-20 py-10 px-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
        <p>© 2026 Scalify. All rights reserved.</p>
        <div className="flex flex-wrap gap-5">
          <Link href="/terms" className="hover:text-white transition">Terms</Link>
          <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          <Link href="/refund" className="hover:text-white transition">Refund Policy</Link>
          <Link href="/shipping" className="hover:text-white transition">Shipping</Link>
          <Link href="/contact" className="hover:text-white transition">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
