import Link from 'next/link';
import { Logo } from '@/components/Logo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy — Scalify',
  description: 'Scalify cancellation and refund policy for subscriptions.',
};

export default function RefundPage() {
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
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Cancellation &amp; Refund Policy</h1>
          <p className="text-zinc-500 text-sm">Last updated: 4 May 2026</p>
        </div>

        {/* Summary Box */}
        <div className="rounded-2xl bg-green-500/5 border border-green-500/20 p-6 mb-12">
          <h2 className="text-lg font-bold text-green-400 mb-3">Quick Summary</h2>
          <ul className="space-y-2 text-sm text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold mt-0.5">✓</span>
              <span>Cancel anytime — no questions asked, no lock-in</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold mt-0.5">✓</span>
              <span>7-day money-back guarantee on your first payment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold mt-0.5">✓</span>
              <span>Access continues until end of paid period after cancellation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold mt-0.5">✓</span>
              <span>No auto-debit — you pay manually each month</span>
            </li>
          </ul>
        </div>

        <div className="space-y-10 text-zinc-400 leading-relaxed">

          <Section title="1. Cancellation Policy">
            <p>You may cancel your Scalify Pro subscription at any time by:</p>
            <ul>
              <li>Clicking "Cancel Subscription" in your dashboard under <strong>Plans</strong></li>
              <li>Emailing us at <a href="mailto:support@scalifyapp.com" className="text-green-400 hover:underline">support@scalifyapp.com</a> with your registered email</li>
              <li>Messaging us on WhatsApp at +91 63535 83148</li>
            </ul>
            <p>Upon cancellation:</p>
            <ul>
              <li>Your subscription will not auto-renew</li>
              <li>You retain full access to all features until the end of your current billing month</li>
              <li>Your website will remain live until the end of the paid period</li>
              <li>After expiry, your website will be taken offline but your data is retained for 30 days</li>
            </ul>
          </Section>

          <Section title="2. Refund Policy — 7-Day Guarantee">
            <p>We offer a <strong>7-day money-back guarantee</strong> on your first subscription payment. If you are unsatisfied with Scalify for any reason within 7 days of your first payment, we will issue a full refund — no questions asked.</p>
            <p>To claim your refund within 7 days:</p>
            <ul>
              <li>Email <a href="mailto:support@scalifyapp.com" className="text-green-400 hover:underline">support@scalifyapp.com</a> with subject: "Refund Request — [Your Email]"</li>
              <li>Include your payment receipt or order ID from Razorpay</li>
              <li>Refunds are processed within 5–7 business days to your original payment method</li>
            </ul>
          </Section>

          <Section title="3. Refunds After 7 Days">
            <p>After the 7-day window, subscription payments are generally non-refundable. However, we consider refund requests on a case-by-case basis for:</p>
            <ul>
              <li>Duplicate payments or billing errors</li>
              <li>Technical issues that prevented you from using the service for an extended period due to our fault</li>
              <li>Accidental payments</li>
            </ul>
            <p>For these situations, please contact us within 30 days of the payment at <a href="mailto:support@scalifyapp.com" className="text-green-400 hover:underline">support@scalifyapp.com</a> with your payment details.</p>
          </Section>

          <Section title="4. Free Trial">
            <p>Our 7-day free trial does not require payment. No refund is needed or applicable for the trial period. At the end of the trial, your account moves to a free plan — we will never charge you without your explicit action.</p>
          </Section>

          <Section title="5. Failed Payments">
            <p>Since Scalify uses a manual payment model (no auto-debit), there are no automatic failed payment scenarios. You choose when to renew. If a payment is initiated and fails, Razorpay will not capture the amount and no charge will be made to your account.</p>
          </Section>

          <Section title="6. Refund Processing Time">
            <p>Approved refunds will be credited to your original payment method within:</p>
            <ul>
              <li>UPI / Net Banking: 2–3 business days</li>
              <li>Credit / Debit Card: 5–7 business days</li>
              <li>Wallet: 1–2 business days</li>
            </ul>
            <p>You will receive an email confirmation once your refund is processed. The exact timing depends on your bank or payment provider.</p>
          </Section>

          <Section title="7. Contact for Refund or Cancellation">
            <p>For any payment or cancellation queries, reach us at:</p>
            <ul>
              <li>Email: <a href="mailto:support@scalifyapp.com" className="text-green-400 hover:underline">support@scalifyapp.com</a></li>
              <li>WhatsApp: <a href="https://wa.me/916353583148" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">+91 63535 83148</a></li>
              <li>Response time: within 24 hours on business days</li>
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
