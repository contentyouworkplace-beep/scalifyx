import Link from 'next/link';
import { Logo } from '@/components/Logo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Scalify',
  description: 'How Scalify collects, uses, and protects your personal data.',
};

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-zinc-500 text-sm">Last updated: 4 May 2026</p>
        </div>

        <div className="space-y-10 text-zinc-400 leading-relaxed">

          <Section title="1. Introduction">
            <p>At Scalify ("we", "our", "us"), we are committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights regarding it. This policy applies to all users of scalifyapp.com and our mobile application.</p>
            <p>By using our services, you consent to the practices described in this policy.</p>
          </Section>

          <Section title="2. Information We Collect">
            <p><strong>Information you provide directly:</strong></p>
            <ul>
              <li>Name, email address, and phone number (at signup)</li>
              <li>Business name, type, city, and description (for website creation)</li>
              <li>Payment information (processed securely by Razorpay — we never store card details)</li>
              <li>Photos, logos, and business content you upload</li>
              <li>Messages sent via our chat support</li>
            </ul>
            <p><strong>Information collected automatically:</strong></p>
            <ul>
              <li>Device type, browser, and operating system</li>
              <li>IP address and approximate location</li>
              <li>Pages visited and features used within our platform</li>
              <li>Referring website and session duration</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <p>We use your data to:</p>
            <ul>
              <li>Create and maintain your account and website</li>
              <li>Process payments and issue GST invoices</li>
              <li>Provide AI-generated website content tailored to your business</li>
              <li>Set up SEO, Google Search Console, and analytics for your site</li>
              <li>Send transactional notifications (payment confirmations, subscription alerts)</li>
              <li>Send marketing communications (you may opt out at any time)</li>
              <li>Improve our AI models and service quality (using anonymised data)</li>
              <li>Comply with legal obligations</li>
            </ul>
          </Section>

          <Section title="4. Data Sharing">
            <p>We do not sell your personal data. We share data only with:</p>
            <ul>
              <li><strong>Razorpay</strong> — for payment processing (governed by their privacy policy)</li>
              <li><strong>Supabase</strong> — our secure database infrastructure</li>
              <li><strong>Anthropic (Claude AI)</strong> — for generating website content (anonymised business descriptions only)</li>
              <li><strong>Google Analytics</strong> — aggregated, anonymised website traffic data</li>
              <li><strong>Law enforcement</strong> — only when required by a valid legal order</li>
            </ul>
          </Section>

          <Section title="5. Data Security">
            <p>We implement industry-standard security measures to protect your data:</p>
            <ul>
              <li>All data transmitted via HTTPS/TLS encryption</li>
              <li>Passwords are hashed and never stored in plain text</li>
              <li>Payment data is handled entirely by Razorpay (PCI-DSS compliant)</li>
              <li>Database access is restricted to authorised personnel only</li>
              <li>Regular security audits and monitoring</li>
            </ul>
          </Section>

          <Section title="6. Cookies">
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Keep you logged in across sessions</li>
              <li>Remember your preferences</li>
              <li>Analyse website usage via Google Analytics</li>
            </ul>
            <p>You can disable cookies in your browser settings, but some features may not function correctly without them.</p>
          </Section>

          <Section title="7. Your Rights">
            <p>Under Indian data protection law, you have the right to:</p>
            <ul>
              <li><strong>Access</strong> — request a copy of your personal data</li>
              <li><strong>Correction</strong> — update inaccurate or incomplete data</li>
              <li><strong>Deletion</strong> — request deletion of your account and data</li>
              <li><strong>Portability</strong> — receive your data in a structured format</li>
              <li><strong>Opt-out</strong> — unsubscribe from marketing communications at any time</li>
            </ul>
            <p>To exercise any of these rights, email us at <a href="mailto:support@scalifyapp.com" className="text-green-400 hover:underline">support@scalifyapp.com</a>.</p>
          </Section>

          <Section title="8. Data Retention">
            <p>We retain your personal data for as long as your account is active or as needed to provide our services. After account deletion, we retain data for a maximum of 90 days before permanent removal, unless a longer retention period is required by law.</p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>Our services are not directed at individuals under the age of 18. We do not knowingly collect personal information from minors. If you believe a minor has provided us with personal information, please contact us immediately.</p>
          </Section>

          <Section title="10. Third-Party Links">
            <p>Our platform may contain links to third-party websites (such as Google, Razorpay, or social media platforms). We are not responsible for their privacy practices and encourage you to review their individual privacy policies.</p>
          </Section>

          <Section title="11. Changes to This Policy">
            <p>We may update this Privacy Policy periodically. We will notify registered users of significant changes via email. The "Last updated" date at the top of this page will reflect the most recent revision.</p>
          </Section>

          <Section title="12. Contact Us">
            <p>For any privacy-related questions or to exercise your rights, contact us at:</p>
            <ul>
              <li>Email: <a href="mailto:support@scalifyapp.com" className="text-green-400 hover:underline">support@scalifyapp.com</a></li>
              <li>Website: <Link href="/contact" className="text-green-400 hover:underline">scalifyapp.com/contact</Link></li>
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
