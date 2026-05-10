import Link from 'next/link';
import { Logo } from '@/components/Logo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy — Scalify',
  description: 'Scalify 14-day money-back guarantee and refund policy.',
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-bg text-white">
      {/* Header */}
      <div className="border-b border-border bg-card/30 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <Logo size={32} />
          </Link>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Refund Policy</h1>
          <p className="text-zinc-400 text-lg">Clear and simple. No hidden terms.</p>
        </div>

        {/* Summary Box */}
        <div className="rounded-2xl bg-green-500/5 border border-green-500/20 p-8 mb-12">
          <h2 className="text-2xl font-bold text-green-400 mb-4">14-Day Money Back Guarantee</h2>
          <p className="text-zinc-300 mb-4">
            We're confident you'll love your website. If you're not satisfied within 14 days of purchase, we'll refund your money—no questions asked.
          </p>
          <p className="text-sm text-zinc-400">
            This is our promise. We only succeed when you're happy.
          </p>
        </div>

        <div className="space-y-10">

          <Section title="How to Request a Refund">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center font-bold text-green-400 text-sm">1</div>
                <div>
                  <p className="font-semibold mb-1 text-white">Contact Us Within 14 Days</p>
                  <p className="text-zinc-400">Reach out via <a href="https://wa.me/916353583148" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">WhatsApp (+91 6353583148)</a> within 14 days of your payment.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center font-bold text-green-400 text-sm">2</div>
                <div>
                  <p className="font-semibold mb-1 text-white">Tell Us Why</p>
                  <p className="text-zinc-400">Let us know your reason. Your feedback helps us improve.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center font-bold text-green-400 text-sm">3</div>
                <div>
                  <p className="font-semibold mb-1 text-white">We Process Your Refund</p>
                  <p className="text-zinc-400">Refunds processed within 5-7 business days to your original payment method.</p>
                </div>
              </div>
            </div>
          </Section>

          <Section title="What's Covered">
            <ul>
              <li>You're not satisfied with the website design</li>
              <li>The website doesn't meet your expectations</li>
              <li>You changed your mind about getting a website</li>
              <li>Any reason within the 14-day window</li>
            </ul>
          </Section>

          <Section title="What's NOT Covered">
            <ul>
              <li>Refunds requested after 14 days from payment date</li>
              <li>Monthly subscription refunds for months already completed (after guarantee period)</li>
              <li>Domain registration fees (purchased separately)</li>
              <li>Third-party services or add-ons not included in the base package</li>
            </ul>
          </Section>

          <Section title="Cancellation After 14 Days">
            <p>After the 14-day guarantee period, you can cancel anytime with one click. No lock-in contracts, no penalties.</p>
            <p className="mt-3">
              <strong className="text-white">However:</strong> Once the 14-day window expires, we can't refund fees for months already completed. You can cancel for future months anytime, and you'll keep access until the end of your current billing month.
            </p>
          </Section>

          <Section title="Important Details">
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-white mb-2">The 14-Day Period</p>
                <p className="text-zinc-400 text-sm">The guarantee period starts the day you pay. You must request a refund within this 14-day window.</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-2">Your Website Data</p>
                <p className="text-zinc-400 text-sm">If you request a refund, we'll give you a complete backup of your website and all content. You own your data.</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-2">Processing Time</p>
                <p className="text-zinc-400 text-sm">Approved refunds process to your original payment method within 5-7 business days. Your bank may take 1-2 additional days.</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-2">No Hidden Charges</p>
                <p className="text-zinc-400 text-sm">No auto-debit. You pay only when you choose to renew each month.</p>
              </div>
            </div>
          </Section>

          <Section title="FAQ">
            <div className="space-y-3">
              <details className="rounded-xl border border-border bg-card/50 p-5 cursor-pointer hover:bg-card transition">
                <summary className="flex items-center justify-between font-semibold">
                  <span>Do I need a reason to request a refund?</span>
                  <span className="text-zinc-500">▼</span>
                </summary>
                <p className="mt-3 text-sm text-zinc-400">No. This is a no-questions-asked guarantee. You don't need to justify your refund request.</p>
              </details>
              <details className="rounded-xl border border-border bg-card/50 p-5 cursor-pointer hover:bg-card transition">
                <summary className="flex items-center justify-between font-semibold">
                  <span>What if I cancel after 14 days?</span>
                  <span className="text-zinc-500">▼</span>
                </summary>
                <p className="mt-3 text-sm text-zinc-400">You can cancel anytime with one click. No penalties. But we can't refund completed billing months after the 14-day guarantee ends. You'll keep access until your billing month ends.</p>
              </details>
              <details className="rounded-xl border border-border bg-card/50 p-5 cursor-pointer hover:bg-card transition">
                <summary className="flex items-center justify-between font-semibold">
                  <span>How fast is the refund processed?</span>
                  <span className="text-zinc-500">▼</span>
                </summary>
                <p className="mt-3 text-sm text-zinc-400">Refunds are typically processed within 5-7 business days to your original payment method. Your bank may take 1-2 additional days depending on the payment type.</p>
              </details>
              <details className="rounded-xl border border-border bg-card/50 p-5 cursor-pointer hover:bg-card transition">
                <summary className="flex items-center justify-between font-semibold">
                  <span>What about my website after a refund?</span>
                  <span className="text-zinc-500">▼</span>
                </summary>
                <p className="mt-3 text-sm text-zinc-400">We'll provide you with a complete backup of your website, design files, and all content. Your website data is always yours to keep.</p>
              </details>
            </div>
          </Section>

          <Section title="Have Questions?">
            <p className="mb-4">Reach out anytime. We're here to help.</p>
            <a
              href="https://wa.me/916353583148?text=Hi%20Scalify%20I%20have%20questions%20about%20refund%20policy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 hover:bg-green-400 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Chat on WhatsApp →
            </a>
          </Section>

        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-zinc-500">
          <p>Last updated: May 2026</p>
          <p className="mt-2">For our full terms, visit <Link href="/terms" className="text-green-400 hover:underline">Terms of Service</Link></p>
        </div>

      </main>
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
