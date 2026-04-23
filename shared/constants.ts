export const APP_NAME = 'ScalifyX';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.EXPO_PUBLIC_API_URL ||
  'https://api.scalifyx.com/api';

export const PLANS = [
  {
    id: 'pro',
    name: 'ScalifyX Pro',
    price: 749,
    originalPrice: 1999,
    period: 'month',
    features: [
      'Website & SEO',
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
    ],
    popular: true,
    color: '#6C5CE7',
  },
];

export const BUSINESS_TYPES = [
  { id: 'restaurant', label: 'Restaurant / Cafe', icon: '🍽️' },
  { id: 'salon', label: 'Salon / Spa', icon: '💇' },
  { id: 'doctor', label: 'Doctor / Clinic', icon: '🏥' },
  { id: 'lawyer', label: 'Lawyer / CA', icon: '⚖️' },
  { id: 'shop', label: 'Retail Shop', icon: '🛍️' },
  { id: 'tutor', label: 'Tutor / Coaching', icon: '📚' },
  { id: 'gym', label: 'Gym / Fitness', icon: '💪' },
  { id: 'realestate', label: 'Real Estate', icon: '🏠' },
  { id: 'freelancer', label: 'Freelancer', icon: '💻' },
  { id: 'photographer', label: 'Photographer', icon: '📸' },
  { id: 'ngo', label: 'NGO / Trust', icon: '🤝' },
  { id: 'other', label: 'Other', icon: '🏢' },
];

export const CHAT_TOOLS = [
  { id: 'screenshot', label: 'Send Screenshot', icon: '📸', desc: 'Upload a reference design' },
  { id: 'url', label: 'Paste Website URL', icon: '🔗', desc: 'Clone / get inspired from a site' },
  { id: 'template', label: 'Browse Templates', icon: '🎨', desc: 'Pick a ready-made design' },
  { id: 'photo', label: 'Upload Photos', icon: '🖼️', desc: 'Add business/product images' },
  { id: 'logo', label: 'Upload Logo', icon: '✏️', desc: 'Add your brand logo' },
];

export const WEBSITE_TEMPLATES = [
  { id: 'modern-business', name: 'Modern Business', category: 'business', icon: '🏢', preview: 'Clean corporate look with hero section' },
  { id: 'restaurant-menu', name: 'Restaurant & Menu', category: 'restaurant', icon: '🍽️', preview: 'Menu cards, gallery, reservation CTA' },
  { id: 'portfolio', name: 'Creative Portfolio', category: 'freelancer', icon: '🎨', preview: 'Project grid, about me, contact form' },
  { id: 'medical', name: 'Doctor / Clinic', category: 'doctor', icon: '🏥', preview: 'Appointments, services, trust badges' },
  { id: 'salon-beauty', name: 'Salon & Spa', category: 'salon', icon: '💇', preview: 'Services menu, before/after gallery' },
  { id: 'ecommerce', name: 'Product Catalog', category: 'shop', icon: '🛒', preview: 'Product grid with prices and Buy Now' },
  { id: 'education', name: 'Coaching Center', category: 'tutor', icon: '📚', preview: 'Courses, testimonials, enrollment' },
  { id: 'gym-fitness', name: 'Gym & Fitness', category: 'gym', icon: '💪', preview: 'Plans, trainers, class schedule' },
  { id: 'realestate-listing', name: 'Real Estate', category: 'realestate', icon: '🏠', preview: 'Property listings with filters' },
  { id: 'event-landing', name: 'Event / Landing', category: 'other', icon: '🎉', preview: 'Countdown, ticket CTA, speaker list' },
  { id: 'ngo-charity', name: 'NGO / Charity', category: 'ngo', icon: '🤝', preview: 'Cause, donation CTA, impact stats' },
  { id: 'dark-minimal', name: 'Dark Minimal', category: 'freelancer', icon: '🖤', preview: 'Dark theme, minimal text, bold imagery' },
];

export const ONBOARDING_SLIDES = [
  {
    id: '1',
    title: 'Your Website in 60 Seconds',
    description: 'Just chat with our AI assistant and get a professional website for your business — no technical skills needed!',
    icon: '🚀',
  },
  {
    id: '2',
    title: 'Starting at Just ₹199/month',
    description: 'Get a mobile-responsive, SEO-optimized website with free hosting, SSL, and 24/7 chat support.',
    icon: '💰',
  },
  {
    id: '3',
    title: 'Grow Your Business Online',
    description: 'Track visitors, get found on Google, and manage everything from this app. Join 50,000+ businesses!',
    icon: '📈',
  },
];
