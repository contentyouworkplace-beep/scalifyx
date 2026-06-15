import Link from 'next/link';
import { Fredoka, Nunito } from 'next/font/google';

const fredoka = Fredoka({ subsets: ['latin'], weight: ['600', '700'] });
const nunito  = Nunito({ subsets: ['latin'], weight: ['400', '600', '700'] });

export default function Terms() {
  return (
    <div className={`${nunito.className} min-h-screen bg-white`}>
      <div className="border-b px-5 py-4" style={{background:'linear-gradient(135deg,#FFF5F8,#F5F0FF)'}}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/reyyo" className={`${fredoka.className} text-2xl font-bold flex items-center gap-1`}>
            <span style={{color:'#FF2D78'}}>r</span><span style={{color:'#7B2FBE'}}>e</span>
            <span style={{color:'#FF8C00'}}>y</span><span style={{color:'#00AEEF'}}>y</span>
            <span className="rounded-full text-white px-2 py-0.5" style={{background:'#00C853'}}>o</span>
          </Link>
          <Link href="/reyyo" className={`text-sm font-bold text-gray-500 hover:text-gray-900`}>← Back</Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-12">
        <div className="mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
               style={{background:'linear-gradient(135deg,#FFF8F0,#FFF0F5)'}}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="4" y="2" width="24" height="28" rx="3" fill="#FF8C00"/>
              <rect x="7" y="8" width="14" height="2.5" rx="1.25" fill="white" opacity="0.9"/>
              <rect x="7" y="13" width="14" height="2.5" rx="1.25" fill="white" opacity="0.7"/>
              <rect x="7" y="18" width="10" height="2.5" rx="1.25" fill="white" opacity="0.5"/>
              <rect x="7" y="23" width="7" height="2.5" rx="1.25" fill="white" opacity="0.3"/>
            </svg>
          </div>
          <h1 className={`${fredoka.className} text-4xl font-bold text-gray-900`}>Terms of Service</h1>
          <p className="text-gray-400 font-semibold mt-2">Last updated: June 2025</p>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          {[
            {
              title: 'Acceptance of Terms',
              content: `By ordering from Reyyo or using the Reyyo platform, you agree to these Terms of Service. If you do not agree, please do not use our service. These terms apply to all business owners ("you") who order the Reyyo Founder Pack or use the Reyyo dashboard.`
            },
            {
              title: 'The Reyyo Founder Plan',
              content: `The Founder Plan at ₹99 (lifetime) is available only to the first 500 businesses who order.

After the first 500 businesses:
• Existing Founder Plan users → retain lifetime access forever at no additional cost
• New businesses joining after slot 500 → ₹99/year (billed annually)

The Founder Plan includes: Reyyo Account, QR Sticker, Acrylic Stand, Business Dashboard, and Customer Rewards System. All items listed as "FREE" are included at no additional cost beyond the one-time ₹99 plan price.`
            },
            {
              title: 'Payment & Delivery',
              content: `Payment is collected on delivery (cash only). You agree to pay ₹99 to the delivery agent upon receiving your kit. Delivery is estimated at 3–4 business days to your provided address.

If you are not available at the time of delivery, the agent may attempt re-delivery or contact you via WhatsApp. Reyyo reserves the right to cancel an order if delivery is unsuccessful after 2 attempts.`
            },
            {
              title: 'Refund Policy',
              content: `Due to the physical nature of the product, we do not offer refunds once the kit has been delivered. If your kit is damaged upon arrival, please WhatsApp us at +91 6353583148 within 24 hours with a photo — we will arrange a replacement.

Digital access (dashboard, rewards system) is non-refundable once activated.`
            },
            {
              title: 'Acceptable Use',
              content: `You agree not to:
• Use the Reyyo platform for any illegal or fraudulent purpose
• Misuse or share your customers' personal data
• Resell or redistribute Reyyo services without written permission
• Attempt to hack, reverse-engineer, or disrupt the Reyyo platform

We reserve the right to suspend or terminate your account for violations.`
            },
            {
              title: 'Service Availability',
              content: `Reyyo is a growing startup. We aim for maximum uptime but cannot guarantee 100% availability. We may occasionally perform maintenance or updates that temporarily affect access. We will notify you in advance via WhatsApp for planned downtime.`
            },
            {
              title: 'Changes to Terms',
              content: `We may update these terms occasionally. We will notify you via WhatsApp if changes are significant. Continued use of the Reyyo platform after changes means you accept the updated terms.`
            },
            {
              title: 'Governing Law',
              content: `These Terms are governed by the laws of India. Any disputes will be resolved in the courts of Vadodara, Gujarat.`
            },
          ].map(s => (
            <section key={s.title}>
              <h2 className={`${fredoka.className} text-2xl font-bold text-gray-900 mb-3`}>{s.title}</h2>
              <p className="text-gray-600 font-semibold whitespace-pre-line">{s.content}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm font-semibold">© 2025 Reyyo by Scalify</p>
          <div className="flex gap-6">
            <Link href="/reyyo/privacy-policy" className="text-sm font-bold hover:underline" style={{color:'#7B2FBE'}}>Privacy Policy</Link>
            <Link href="/reyyo/contact" className="text-sm font-bold hover:underline" style={{color:'#7B2FBE'}}>Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
