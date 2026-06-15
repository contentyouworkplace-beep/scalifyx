import Link from 'next/link';
import { Fredoka, Nunito } from 'next/font/google';

const fredoka = Fredoka({ subsets: ['latin'], weight: ['600', '700'] });
const nunito  = Nunito({ subsets: ['latin'], weight: ['400', '600', '700'] });

export default function PrivacyPolicy() {
  return (
    <div className={`${nunito.className} min-h-screen bg-white`}>
      {/* Header */}
      <div className="border-b px-5 py-4" style={{background:'linear-gradient(135deg,#FFF5F8,#F5F0FF)'}}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/reyyo" className={`${fredoka.className} text-2xl font-bold flex items-center gap-1`}>
            <span style={{color:'#FF2D78'}}>r</span><span style={{color:'#7B2FBE'}}>e</span>
            <span style={{color:'#FF8C00'}}>y</span><span style={{color:'#00AEEF'}}>y</span>
            <span className="rounded-full text-white px-2 py-0.5" style={{background:'#00C853'}}>o</span>
          </Link>
          <Link href="/reyyo" className={`text-sm font-bold text-gray-500 hover:text-gray-900 ${nunito.className}`}>← Back</Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-12">
        <div className="mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
               style={{background:'linear-gradient(135deg,#FFF0F5,#F5F0FF)'}}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L4 7V15C4 21.5 9.5 27.5 16 30C22.5 27.5 28 21.5 28 15V7L16 2Z" fill="#7B2FBE"/>
              <path d="M10 15.5L14 19.5L22 11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className={`${fredoka.className} text-4xl font-bold text-gray-900`}>Privacy Policy</h1>
          <p className={`text-gray-400 font-semibold mt-2`}>Last updated: June 2025</p>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          {[
            {
              title: 'What Information We Collect',
              content: `When you place an order on Reyyo, we collect your name, WhatsApp number, business name, business type, website (optional), and delivery address. This information is used solely to process and deliver your order.

When your customers scan your Reyyo QR code, we collect their name, mobile number, and visit history to power the loyalty rewards system.`
            },
            {
              title: 'How We Use Your Information',
              content: `We use your information to:
• Process and deliver your Reyyo Founder Pack
• Send you order confirmation and updates via WhatsApp
• Provide you access to your business dashboard
• Enable the customer rewards system for your business
• Occasionally send you product updates and important notices

We do not sell, rent, or share your personal information with third parties for marketing purposes.`
            },
            {
              title: 'Data Storage & Security',
              content: `Your data is stored securely on Supabase — a trusted, SOC 2 compliant cloud database. We take reasonable technical measures to protect your information from unauthorized access. Your customer data collected through QR scans is yours — you can export it at any time from your dashboard.`
            },
            {
              title: 'WhatsApp Communication',
              content: `By placing an order, you consent to receive WhatsApp messages related to your order status and Reyyo account. We may occasionally send business tips or product updates. You can opt out at any time by messaging "STOP" to our WhatsApp number.`
            },
            {
              title: 'Your Customer Data',
              content: `As a Reyyo business owner, you are responsible for the data of your customers collected through your QR code. You must not misuse this data or share it with unauthorized third parties. Reyyo provides the platform — you own and control your customer data.`
            },
            {
              title: 'Cookies',
              content: `Our website uses essential cookies only — to keep you logged in and remember your preferences. We do not use tracking cookies for advertising purposes.`
            },
            {
              title: 'Contact Us',
              content: `If you have any questions about this Privacy Policy, please contact us at +91 6353583148 (WhatsApp) or visit our contact page.`
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
            <Link href="/reyyo/terms" className="text-sm font-bold hover:underline" style={{color:'#7B2FBE'}}>Terms</Link>
            <Link href="/reyyo/contact" className="text-sm font-bold hover:underline" style={{color:'#7B2FBE'}}>Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
