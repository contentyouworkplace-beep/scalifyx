import Link from 'next/link';
import { Fredoka, Nunito } from 'next/font/google';

const fredoka = Fredoka({ subsets: ['latin'], weight: ['600', '700'] });
const nunito  = Nunito({ subsets: ['latin'], weight: ['400', '600', '700', '800'] });

export default function Contact() {
  return (
    <div className={`${nunito.className} min-h-screen`} style={{background:'linear-gradient(160deg,#fff,#FFF5F8,#F5F0FF)'}}>
      <div className="border-b px-5 py-4 bg-white">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/reyyo" className={`${fredoka.className} text-2xl font-bold flex items-center gap-1`}>
            <span style={{color:'#FF2D78'}}>r</span><span style={{color:'#7B2FBE'}}>e</span>
            <span style={{color:'#FF8C00'}}>y</span><span style={{color:'#00AEEF'}}>y</span>
            <span className="rounded-full text-white px-2 py-0.5" style={{background:'#00C853'}}>o</span>
          </Link>
          <Link href="/reyyo" className="text-sm font-bold text-gray-500 hover:text-gray-900">← Back</Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-16 text-center">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
             style={{background:'linear-gradient(135deg,#00C853,#00AEEF)'}}>
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
            <path d="M3 6C3 4 4 3 6 3H26C28 3 29 4 29 6V19C29 21 28 22 26 22H18L10 29V22H6C4 22 3 21 3 19V6Z" fill="white"/>
            <circle cx="10" cy="12.5" r="2" fill="#00C853"/>
            <circle cx="16" cy="12.5" r="2" fill="#00C853"/>
            <circle cx="22" cy="12.5" r="2" fill="#00C853"/>
          </svg>
        </div>

        <h1 className={`${fredoka.className} text-5xl font-bold text-gray-900 mb-4`}>Say Hello!</h1>
        <p className="text-gray-500 text-xl font-semibold mb-12 max-w-md mx-auto leading-relaxed">
          We're a Vadodara startup — real people, real support. Just drop us a WhatsApp message!
        </p>

        {/* Primary CTA */}
        <a href="https://wa.me/916353583148?text=Hi%20Reyyo%20team!%20I%20have%20a%20question%20about%20your%20service."
           target="_blank" rel="noreferrer"
           className={`${fredoka.className} inline-flex items-center gap-3 text-xl font-bold text-white px-10 py-5 rounded-2xl shadow-2xl transition-all hover:scale-105 mb-6`}
           style={{background:'linear-gradient(135deg,#00C853,#00AEEF)'}}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="white"/>
            <path d="M10 22L12 19.5C13.5 20.5 15 21 16 21C20 21 23 18 23 14.5C23 11 20 8 16 8C12 8 9 11 9 14.5C9 16 9.5 17.5 10.5 18.5L10 22Z" fill="#00C853"/>
            <path d="M13 13C13 13 13.5 12 14.5 12C15.5 12 16 13 16 13L17.5 16L18.5 16.5C18.5 16.5 19 17 18.5 17.5L17.5 18.5C17.5 18.5 17 19 16.5 18.5C16 18 14.5 16.5 13.5 15C12.5 13.5 12.5 13 13 13Z" fill="white"/>
          </svg>
          Chat on WhatsApp
        </a>

        <p className="text-gray-400 font-bold text-lg mb-16">+91 63535 83148</p>

        {/* Contact cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-16">
          {[
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" fill="#00C853"/>
                  <path d="M10 22L12 19.5C13.5 20.5 15 21 16 21C20 21 23 18 23 14.5C23 11 20 8 16 8C12 8 9 11 9 14.5C9 16 9.5 17.5 10.5 18.5L10 22Z" fill="white"/>
                </svg>
              ),
              label: 'WhatsApp',
              value: '+91 63535 83148',
              link: 'https://wa.me/916353583148',
              color: '#00C853',
              bg: '#F0FFF4',
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="2" y="6" width="28" height="20" rx="4" fill="#00AEEF"/>
                  <path d="M4 8L16 18L28 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              label: 'Email',
              value: 'hello@reyyo.in',
              link: 'mailto:hello@reyyo.in',
              color: '#00AEEF',
              bg: '#F0F8FF',
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 2C10.5 2 6 6.5 6 12C6 19 16 30 16 30C16 30 26 19 26 12C26 6.5 21.5 2 16 2Z" fill="#FF2D78"/>
                  <circle cx="16" cy="12" r="5" fill="white"/>
                  <circle cx="16" cy="12" r="3" fill="#FF2D78"/>
                </svg>
              ),
              label: 'Location',
              value: 'Vadodara, Gujarat',
              link: 'https://maps.google.com/?q=Vadodara,Gujarat',
              color: '#FF2D78',
              bg: '#FFF0F5',
            },
          ].map(c => (
            <a key={c.label} href={c.link} target="_blank" rel="noreferrer"
               className="rounded-2xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 block"
               style={{background:c.bg,border:`2px solid ${c.color}20`}}>
              <div className="flex justify-center mb-3">{c.icon}</div>
              <p className={`${fredoka.className} text-lg font-bold`} style={{color:c.color}}>{c.label}</p>
              <p className="text-gray-600 font-semibold text-sm mt-1">{c.value}</p>
            </a>
          ))}
        </div>

        {/* Hours */}
        <div className="rounded-2xl p-6 text-left" style={{background:'white',border:'2px solid #E5E7EB'}}>
          <h3 className={`${fredoka.className} text-2xl font-bold text-gray-900 mb-4`}>Support Hours</h3>
          <div className="space-y-3">
            {[
              { day:'Monday – Saturday', time:'10:00 AM – 7:00 PM', active:true },
              { day:'Sunday',             time:'Closed',              active:false },
            ].map(h => (
              <div key={h.day} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <span className="font-bold text-gray-700">{h.day}</span>
                <span className={`font-bold text-sm px-3 py-1 rounded-full ${h.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {h.time}
                </span>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-sm font-semibold mt-4">
            We usually respond within 1–2 hours on WhatsApp during support hours.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm font-semibold">© 2025 Reyyo by Scalify</p>
          <div className="flex gap-6">
            <Link href="/reyyo/privacy-policy" className="text-sm font-bold hover:underline" style={{color:'#7B2FBE'}}>Privacy Policy</Link>
            <Link href="/reyyo/terms" className="text-sm font-bold hover:underline" style={{color:'#7B2FBE'}}>Terms</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
