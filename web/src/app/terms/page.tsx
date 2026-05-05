import Link from 'next/link';
import { Logo } from '@/components/Logo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions — Scalify',
  description: 'Terms and Conditions for using Scalify website builder and SEO services.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg text-white">
      {/* Nav */}
      <nav className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/"><Logo size={28} /></Link>
          <Link href="/" className="text-sm text-zinc-500 hover:text-white transition">← Back to Home</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Legal</p>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Terms and Conditions</h1>
          <p className="text-zinc-500 text-sm">Last updated: 4 May 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-10 text-zinc-300 leading-relaxed">

          <Section title="1. Acceptance of Terms">
            <p>By accessing or using Scalify ("we", "our", "us") — available at scalifyapp.com — you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services. These terms apply to all users, including visitors, registered users, and paying subscribers.</p>
          </Section>

          <Section title="2. Description of Service">
            <p>Scalify is an AI-powered website builder and digital marketing platform designed for Indian small businesses. Our services include:</p>
            <ul>
              <li>AI-generated professional business websites</li>
              <li>Local SEO setup including Google Search Console, meta tags, sitemaps, and structured data</li>
              <li>WhatsApp lead capture integration</li>
              <li>Website hosting and SSL certificates</li>
              <li>Analytics dashboard and monthly SEO reports</li>
              <li>24/7 priority customer support</li>
            </ul>
          </Section>

          <Section title="3. Account Registration">
            <p>To access our platform, you must create an account with a valid name, phone number, and email address. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You must immediately notify us at support@scalifyapp.com if you suspect unauthorised access to your account.</p>
            <p>You agree not to create accounts using false identities, create multiple accounts for abusive purposes, or share your account credentials with others.</p>
          </Section>

          <Section title="4. Subscription and Payment">
            <p>Scalify Pro is available at ₹1,499/month (regular price ₹2,499/month). Key payment terms:</p>
            <ul>
              <li><strong>No auto-debit</strong> — payments are manual each month via Razorpay</li>
              <li>Subscription begins on the date of successful payment</li>
              <li>A 7-day free trial is available for new users</li>
              <li>Prices are inclusive of applicable taxes where stated</li>
              <li>GST invoices are provided for all payments upon request</li>
            </ul>
            <p>We reserve the right to modify pricing with 30 days' advance notice to existing subscribers.</p>
          </Section>

          <Section title="5. Your Content">
            <p>You retain ownership of all content you provide to us (business information, photos, logos, text). By submitting content, you grant Scalify a non-exclusive, royalty-free licence to use, display, and process it solely for the purpose of providing our services to you. We will not sell or share your content with third parties without your consent.</p>
            <p>You represent that you own or have permission to use all content you submit, and that it does not infringe any third-party intellectual property rights.</p>
          </Section>

          <Section title="6. Prohibited Uses">
            <p>You agree not to use Scalify to:</p>
            <ul>
              <li>Publish illegal, defamatory, obscene, or fraudulent content</li>
              <li>Violate any applicable Indian or international law</li>
              <li>Infringe the intellectual property rights of others</li>
              <li>Distribute spam, malware, or phishing material</li>
              <li>Attempt to reverse-engineer or copy our proprietary AI systems</li>
              <li>Use automated scraping tools without prior written consent</li>
            </ul>
            <p>Violation of these terms may result in immediate suspension or termination of your account without refund.</p>
          </Section>

          <Section title="7. Intellectual Property">
            <p>All software, designs, trademarks, logos, and content on the Scalify platform (excluding user content) are the exclusive property of Scalify and protected under applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from our platform without explicit written permission.</p>
          </Section>

          <Section title="8. Service Availability">
            <p>We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. Scheduled maintenance, technical issues, or events beyond our control may occasionally affect availability. We will communicate planned downtime in advance whenever possible.</p>
          </Section>

          <Section title="9. Disclaimer of Warranties">
            <p>Our services are provided "as is" without warranties of any kind, express or implied. While we make every effort to ensure accuracy and quality, we do not guarantee specific SEO rankings, traffic numbers, business results, or revenue outcomes. Search engine algorithms are outside our control and results may vary.</p>
          </Section>

          <Section title="10. Limitation of Liability">
            <p>To the maximum extent permitted by law, Scalify shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services. Our maximum liability to you in any month shall not exceed the amount paid by you for our services in that month.</p>
          </Section>

          <Section title="11. Termination">
            <p>You may cancel your subscription at any time from your dashboard. Upon cancellation, you retain access until the end of your current billing period. We reserve the right to terminate accounts that violate these terms. Upon termination, your website will be taken offline; you may export your content within 30 days of cancellation.</p>
          </Section>

          <Section title="12. Governing Law">
            <p>These terms are governed by the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts of Maharashtra, India. We will first attempt to resolve disputes amicably through mutual discussion.</p>
          </Section>

          <Section title="13. Changes to Terms">
            <p>We may update these terms periodically. Material changes will be communicated to registered users via email at least 14 days in advance. Continued use of the service after changes take effect constitutes your acceptance of the revised terms.</p>
          </Section>

          <Section title="14. Contact">
            <p>For questions about these terms, please contact us at <a href="mailto:support@scalifyapp.com" className="text-green-400 hover:underline">support@scalifyapp.com</a> or visit our <Link href="/contact" className="text-green-400 hover:underline">Contact page</Link>.</p>
          </Section>

        </div>
      </main>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      <div className="space-y-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:text-zinc-400 [&_p]:text-zinc-400 [&_strong]:text-zinc-200">
        {children}
      </div>
    </div>
  );
}

function Footer() {
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
