export type LandingConfig = {
  slug: string;
  nicheName: string;
  heroTitle: string;
  heroSubtitle: string;
  heroSupport: string;
  keywordLine: string;
  audienceLabel: string;
  primaryCta: string;
  monthlyPrice: number;
  packageName: string;
  packageSummary: string;
  painPoints: string[];
  outcomes: string[];
  serviceFocus: string[];
  deliverables: string[];
  whyChoose: string[];
  testimonials: Array<{ name: string; role: string; quote: string }>;
  faqs: Array<{ question: string; answer: string }>;
  proof: string;
};

const DEFAULT_PRICE = 2000;
const DEFAULT_CTA = 'Get My Website & SEO Setup';

export const DEFAULT_LANDING_CONFIG: LandingConfig = {
  slug: '',
  nicheName: 'Local Businesses',
  heroTitle: 'Get a High-Converting Business Website That Brings Monthly Leads',
  heroSubtitle:
    'We build niche-focused landing pages with local SEO, WhatsApp lead capture, and a structure designed to turn visitors into enquiries.',
  heroSupport:
    'Built for serious businesses that want predictable inbound leads, stronger positioning, and a professional online presence.',
  keywordLine:
    'Best for clinics, consultants, local services, manufacturers, installers, and premium businesses.',
  audienceLabel: 'Growth-Focused Local Businesses',
  primaryCta: DEFAULT_CTA,
  monthlyPrice: DEFAULT_PRICE,
  packageName: 'Landing Page + Local SEO Package',
  packageSummary:
    'A done-for-you website and SEO package created to improve trust, search visibility, and lead conversion.',
  painPoints: [
    'Your business looks generic online and fails to stand out against stronger competitors.',
    'Visitors land on your page but do not get a clear reason to enquire immediately.',
    'Google visibility stays weak because your page is not structured for local search demand.',
  ],
  outcomes: [
    'A focused landing page built around your exact niche and customer intent.',
    'Local SEO setup that improves discoverability for service and city-level searches.',
    'Lead capture that moves visitors directly into enquiry instead of passive browsing.',
  ],
  serviceFocus: [
    'Niche positioning and conversion-focused copywriting',
    'Trust-building structure with service and proof sections',
    'WhatsApp and enquiry-first CTA flow',
    'Local SEO setup for service and city keywords',
  ],
  deliverables: [
    '1 long-form landing page',
    'Niche-specific copywriting',
    'Lead form + WhatsApp CTA',
    'Mobile responsive design',
    'On-page SEO setup',
    'Hosting and monthly updates support',
  ],
  whyChoose: [
    'Built to sell a service, not just look modern.',
    'Focused structure instead of generic template sections.',
    'Clear pricing and direct response positioning.',
  ],
  testimonials: [
    {
      name: 'Amit Sharma',
      role: 'Business Owner',
      quote: 'The new landing page made our offer much clearer and improved lead quality within the first few weeks.',
    },
    {
      name: 'Neha Mehta',
      role: 'Founder',
      quote: 'Visitors understood what we do faster and enquiries became more serious and relevant.',
    },
  ],
  faqs: [
    {
      question: 'What is included in the Rs 2000 per month package?',
      answer: 'It includes one niche-focused landing page, SEO setup, mobile optimization, lead capture integration, hosting support, and monthly maintenance updates.',
    },
    {
      question: 'Will this page be written specifically for my industry?',
      answer: 'Yes. The page structure, messaging, service sections, and CTA flow are tailored to your niche instead of using generic copy.',
    },
    {
      question: 'Can this help generate local leads?',
      answer: 'Yes. The page is designed around local search intent and enquiry conversion so it supports both ad traffic and organic search discovery.',
    },
  ],
  proof: 'Built for businesses that want lead generation and better market positioning, not just another brochure website.',
};

export const NICHE_LANDING_CONFIGS: LandingConfig[] = [
  {
    slug: 'hair-transplant-skin-clinics',
    nicheName: 'Hair Transplant & Skin Clinics',
    heroTitle: 'Get More Hair Restoration and Skin Treatment Enquiries Every Month',
    heroSubtitle:
      'We create a long-form landing page specifically for hair transplant, PRP, GFC, acne, pigmentation, laser, and dermatology clinics so patients trust you faster and book consultations with more confidence.',
    heroSupport:
      'This is designed for clinics selling appearance, trust, doctor expertise, and visible results across both hair and skin services.',
    keywordLine:
      'Targets searches like hair transplant clinic, PRP hair treatment, acne scar treatment, pigmentation treatment, dermatologist near me.',
    audienceLabel: 'Hair + Skin Clinics',
    primaryCta: DEFAULT_CTA,
    monthlyPrice: DEFAULT_PRICE,
    packageName: 'Hair & Skin Clinic Growth Package',
    packageSummary:
      'A niche-specific website and SEO package built for aesthetic trust, consultation enquiries, and treatment visibility.',
    painPoints: [
      'Patients compare multiple clinics and trust the one that explains results, doctor expertise, and treatment options clearly.',
      'Most clinic websites mix all treatments together and fail to rank for separate hair and skin intent searches.',
      'Without strong trust sections, visitors hesitate before sharing their number or booking a consultation.',
    ],
    outcomes: [
      'Separate positioning for hair transplant, PRP, GFC, acne, pigmentation, laser, and skin care services.',
      'Doctor-trust sections, treatment pages, and CTA flow built to convert consultation seekers.',
      'SEO structure focused on hair and skin treatment keywords instead of generic clinic copy.',
    ],
    serviceFocus: [
      'Hair transplant consultation positioning',
      'PRP and GFC treatment visibility',
      'Acne, scars, pigmentation, and laser treatment sections',
      'Doctor expertise, before-after trust flow, and booking CTA',
    ],
    deliverables: [
      '1 long-form hair and skin clinic landing page',
      'Hair treatment + skin treatment content structure',
      'Doctor bio and trust section',
      'Consultation form + WhatsApp CTA',
      'Local SEO for treatment keywords',
      'Monthly content and technical updates',
    ],
    whyChoose: [
      'Built for both hair and skin demand, not just general clinic branding.',
      'Separates high-ticket transplant intent from skin treatment enquiries clearly.',
      'Improves trust before the patient reaches out.',
    ],
    testimonials: [
      {
        name: 'Dr. Riya Verma',
        role: 'Skin & Hair Clinic Director',
        quote: 'Our new page finally explained both hair restoration and skin treatments properly, and consultation quality improved immediately.',
      },
      {
        name: 'Dr. Karan Sethi',
        role: 'Hair Transplant Surgeon',
        quote: 'Patients now arrive better informed about transplant and PRP options, which makes follow-up much easier.',
      },
    ],
    faqs: [
      {
        question: 'Can the page cover both hair transplant and skin treatments?',
        answer: 'Yes. The page is structured to give separate attention to hair restoration services and skin treatment services so both convert well.',
      },
      {
        question: 'Will you optimize for treatment-specific Google searches?',
        answer: 'Yes. We build around treatment-level search intent such as PRP, hair transplant, acne treatment, pigmentation treatment, and dermatologist keywords.',
      },
      {
        question: 'Is this suitable for premium aesthetic clinics?',
        answer: 'Yes. The design and copy are positioned to support high-trust, premium-value consultation journeys.',
      },
    ],
    proof: 'Made for clinics that need stronger patient trust, better treatment presentation, and more consultation enquiries from both hair and skin categories.',
  },
  {
    slug: 'visa-consultants',
    nicheName: 'Visa Consultants',
    heroTitle: 'Turn Study, Tourist, Work, and PR Visa Searches into Serious Enquiries',
    heroSubtitle:
      'We build a visa consultant landing page that explains your process clearly, builds authority, and converts higher-intent applicants for study, visitor, work, and PR cases.',
    heroSupport:
      'Ideal for consultants who need to pre-qualify cases, create credibility, and reduce low-quality leads.',
    keywordLine:
      'Targets study visa consultant, tourist visa consultant, Canada PR consultant, work visa consultant, student visa guidance.',
    audienceLabel: 'Visa and Immigration Consultants',
    primaryCta: DEFAULT_CTA,
    monthlyPrice: DEFAULT_PRICE,
    packageName: 'Visa Consultant Lead Package',
    packageSummary: 'A long-form landing page and SEO setup built to attract serious immigration and visa applicants.',
    painPoints: [
      'Applicants do not trust consultants unless the process, countries, and document flow are explained clearly.',
      'Generic pages attract irrelevant leads because they do not separate study, tourist, work, and PR intent.',
      'Weak credibility elements make prospects continue researching competitors instead of contacting you.',
    ],
    outcomes: [
      'Structured sections for study visa, tourist visa, work visa, and PR consultation services.',
      'Authority-focused copy that improves trust and case seriousness before the first call.',
      'SEO and CTA flow designed to convert people actively searching for visa support.',
    ],
    serviceFocus: [
      'Study visa and admission guidance sections',
      'Tourist and visitor visa case positioning',
      'Work permit and PR intent conversion blocks',
      'Document checklist and consultation funnel setup',
    ],
    deliverables: [
      '1 long-form visa consultant landing page',
      'Service sections by visa type',
      'Trust + process explanation blocks',
      'Lead capture form + WhatsApp CTA',
      'Local SEO setup',
      'Monthly updates and support',
    ],
    whyChoose: [
      'Filters better-quality applicants with clearer service segmentation.',
      'Builds trust before prospects call your office.',
      'Improves conversion from search and referrals.',
    ],
    testimonials: [
      {
        name: 'Rohit Malhotra',
        role: 'Immigration Consultant',
        quote: 'The new page helped us explain our visa categories clearly and reduced casual low-intent enquiries.',
      },
      {
        name: 'Sneha Arora',
        role: 'Study Visa Consultant',
        quote: 'Students now understand our process faster, which makes first calls more productive.',
      },
    ],
    faqs: [
      {
        question: 'Can the page show multiple visa services clearly?',
        answer: 'Yes. We separate your study, tourist, work, and PR offerings into structured conversion sections.',
      },
      {
        question: 'Will this help with local search visibility?',
        answer: 'Yes. The page is written for city-based visa consultant and immigration service searches.',
      },
      {
        question: 'Is the package suitable for small consultancy teams?',
        answer: 'Yes. It is designed to help both solo consultants and growing agencies present themselves professionally.',
      },
    ],
    proof: 'Built for visa consultants who need more qualified applicants and stronger pre-call trust.',
  },
  {
    slug: 'packers-and-movers',
    nicheName: 'Packers & Movers',
    heroTitle: 'Capture More Local Shifting and Relocation Leads Before Competitors Do',
    heroSubtitle:
      'We create a detailed landing page for packers and movers businesses that highlights shifting services, trust, response speed, and city-level search visibility.',
    heroSupport:
      'Designed for businesses where the fastest trusted response usually wins the job.',
    keywordLine:
      'Targets packers and movers near me, home shifting, office shifting, local relocation, intercity movers.',
    audienceLabel: 'Packers and Movers Businesses',
    primaryCta: DEFAULT_CTA,
    monthlyPrice: DEFAULT_PRICE,
    packageName: 'Movers Lead Generation Package',
    packageSummary: 'A long-form moving services landing page built for urgency, trust, and quote request conversion.',
    painPoints: [
      'Customers make fast decisions and usually contact the first mover that looks reliable and available.',
      'Generic pages do not separate home shifting, office shifting, local relocation, and interstate services properly.',
      'Slow response and weak quote flow cause lead leakage to faster competitors.',
    ],
    outcomes: [
      'Clear service positioning for house shifting, office shifting, and intercity relocation.',
      'Stronger trust through process explanation, safety positioning, and quick enquiry CTAs.',
      'SEO-ready structure for local moving demand in your service cities.',
    ],
    serviceFocus: [
      'House shifting page structure',
      'Office relocation and commercial moving sections',
      'Packing, loading, transport, unloading explanation',
      'Quote request and quick call CTA flow',
    ],
    deliverables: [
      '1 long-form movers landing page',
      'Service sections by move type',
      'Quote enquiry and WhatsApp CTA',
      'Trust, process, and safety content',
      'Local SEO setup',
      'Monthly edits and support',
    ],
    whyChoose: [
      'Built for urgent lead capture, not slow browsing.',
      'Explains reliability and service clarity faster.',
      'Improves conversion for city-based moving searches.',
    ],
    testimonials: [
      {
        name: 'Anil Yadav',
        role: 'Relocation Business Owner',
        quote: 'We started receiving more serious home shifting calls because the page explained our process and reliability better.',
      },
      {
        name: 'Pooja Mehra',
        role: 'Operations Head',
        quote: 'The city-specific structure helped us get better local enquiries than before.',
      },
    ],
    faqs: [
      {
        question: 'Can the page cover local and intercity moving both?',
        answer: 'Yes. We structure the landing page so both local shifting and long-distance relocation services are explained clearly.',
      },
      {
        question: 'Does the package include lead forms and WhatsApp?',
        answer: 'Yes. The package includes direct enquiry forms and WhatsApp conversion points.',
      },
      {
        question: 'Will this help us rank for city moving searches?',
        answer: 'Yes. The page is optimized around relocation-related service keywords and city-based search intent.',
      },
    ],
    proof: 'Built for movers that need faster enquiries, stronger trust, and better city-level visibility.',
  },
  {
    slug: 'packaging-manufacturers',
    nicheName: 'Packaging Manufacturers',
    heroTitle: 'Generate More RFQs for Custom Boxes, Corrugated Packaging, and Bulk Orders',
    heroSubtitle:
      'We build a packaging manufacturer landing page that presents your capability, product range, order capacity, and trust factors in a way serious buyers understand quickly.',
    heroSupport:
      'Ideal for B2B manufacturers selling corrugated boxes, mono cartons, labels, pouches, and custom packaging solutions.',
    keywordLine:
      'Targets corrugated box manufacturer, custom packaging manufacturer, mono carton supplier, industrial packaging company.',
    audienceLabel: 'Packaging and Box Manufacturers',
    primaryCta: DEFAULT_CTA,
    monthlyPrice: DEFAULT_PRICE,
    packageName: 'Packaging Manufacturer B2B Package',
    packageSummary: 'A B2B landing page and SEO setup built to attract genuine packaging enquiries and RFQs.',
    painPoints: [
      'Buyers want proof of scale, customization ability, and delivery capacity before they send an enquiry.',
      'Most packaging sites hide product categories and fail to make bulk buyers feel confident quickly.',
      'Weak enquiry flow leads to low-quality leads or missed RFQ opportunities.',
    ],
    outcomes: [
      'Product and capability sections that speak to procurement managers and bulk buyers clearly.',
      'Service structure for custom packaging, corrugated boxes, mono cartons, and industrial packaging.',
      'Lead flow focused on RFQs instead of casual browsing.',
    ],
    serviceFocus: [
      'Corrugated and carton packaging sections',
      'Custom printed and branded packaging highlights',
      'MOQ, dispatch, and production capability positioning',
      'RFQ and bulk enquiry funnel setup',
    ],
    deliverables: [
      '1 long-form B2B packaging landing page',
      'Product and capability content blocks',
      'RFQ form + enquiry CTA',
      'Factory credibility and process section',
      'On-page SEO setup',
      'Monthly maintenance support',
    ],
    whyChoose: [
      'Built for B2B buyers who want clarity fast.',
      'Makes your production capability easier to trust.',
      'Improves inbound RFQ conversion.',
    ],
    testimonials: [
      {
        name: 'Nitin Bansal',
        role: 'Packaging Unit Owner',
        quote: 'The page helped buyers understand our capabilities faster and improved serious enquiry quality.',
      },
      {
        name: 'Mehul Shah',
        role: 'Director, Packaging Company',
        quote: 'RFQ conversations became smoother because the site already answered key buyer questions.',
      },
    ],
    faqs: [
      {
        question: 'Can this page position us for bulk packaging orders?',
        answer: 'Yes. The structure is designed for B2B enquiry generation and bulk order credibility.',
      },
      {
        question: 'Will the page show our packaging categories clearly?',
        answer: 'Yes. We organize your packaging categories so buyers can understand your range immediately.',
      },
      {
        question: 'Is this useful for manufacturers doing custom packaging?',
        answer: 'Yes. The page can position both stock and custom packaging capabilities effectively.',
      },
    ],
    proof: 'Built for packaging manufacturers who need better B2B trust, better RFQs, and stronger product visibility.',
  },
  {
    slug: 'cosmetic-surgery-clinics',
    nicheName: 'Cosmetic Surgery Clinics',
    heroTitle: 'Position Your Cosmetic Surgery Clinic to Attract Premium Consultation Leads',
    heroSubtitle:
      'We build a premium long-form landing page for cosmetic surgery clinics that showcases procedures, trust, doctor credibility, and discreet high-value consultation positioning.',
    heroSupport:
      'Ideal for clinics offering rhinoplasty, liposuction, facelifts, breast procedures, body contouring, and cosmetic enhancements.',
    keywordLine:
      'Targets cosmetic surgeon, rhinoplasty clinic, liposuction clinic, facelift consultation, aesthetic surgery specialist.',
    audienceLabel: 'Cosmetic Surgery Clinics',
    primaryCta: DEFAULT_CTA,
    monthlyPrice: DEFAULT_PRICE,
    packageName: 'Cosmetic Surgery Premium Package',
    packageSummary: 'A premium website and SEO package built for aesthetic trust, high-value consultations, and procedure visibility.',
    painPoints: [
      'Premium cosmetic patients judge safety, expertise, and discretion before making contact.',
      'Generic clinic pages do not build enough confidence for high-ticket procedure enquiries.',
      'Weak procedure positioning reduces both trust and perceived value.',
    ],
    outcomes: [
      'Procedure-led structure built for premium surgical consultation journeys.',
      'Trust-driven copy focused on expertise, outcomes, and patient confidence.',
      'SEO and CTA flow designed for serious cosmetic procedure enquiries.',
    ],
    serviceFocus: [
      'Rhinoplasty and facial procedure positioning',
      'Body contouring and liposuction sections',
      'Premium trust, discretion, and doctor expertise blocks',
      'Consultation-focused conversion flow',
    ],
    deliverables: [
      '1 long-form cosmetic surgery landing page',
      'Procedure and trust-focused content',
      'Doctor profile and consultation CTA',
      'Lead capture form + WhatsApp contact',
      'SEO setup for cosmetic surgery intent',
      'Monthly maintenance and edits',
    ],
    whyChoose: [
      'Designed for premium-value patients, not general traffic.',
      'Improves procedure clarity and trust before consultation.',
      'Supports better positioning for high-ticket cosmetic work.',
    ],
    testimonials: [
      {
        name: 'Dr. Sana Kapoor',
        role: 'Cosmetic Surgeon',
        quote: 'The landing page improved how we present premium procedures and made our consultations feel more qualified.',
      },
      {
        name: 'Clinic Operations Lead',
        role: 'Aesthetic Center',
        quote: 'We finally have a page that looks aligned with the value of our procedures.',
      },
    ],
    faqs: [
      {
        question: 'Can the page position multiple cosmetic procedures?',
        answer: 'Yes. The page can be structured around your major procedure lines while maintaining premium positioning.',
      },
      {
        question: 'Will it feel premium enough for high-ticket patients?',
        answer: 'Yes. The page is designed for authority, trust, and premium enquiry behavior.',
      },
      {
        question: 'Does this package include ongoing updates?',
        answer: 'Yes. The Rs 2000 monthly package includes ongoing support and updates.',
      },
    ],
    proof: 'Built for cosmetic surgery clinics that need premium positioning and stronger consultation conversion.',
  },
  {
    slug: 'pest-control-services',
    nicheName: 'Pest Control Services',
    heroTitle: 'Convert Urgent Pest Control Searches into Immediate Service Enquiries',
    heroSubtitle:
      'We create a detailed pest control landing page that explains treatments, builds response trust, and captures emergency enquiries faster.',
    heroSupport:
      'Designed for termite treatment, bed bug control, cockroach control, rodent solutions, and residential or commercial pest management.',
    keywordLine:
      'Targets pest control near me, termite treatment, bed bug treatment, cockroach control, pest control services.',
    audienceLabel: 'Pest Control Businesses',
    primaryCta: DEFAULT_CTA,
    monthlyPrice: DEFAULT_PRICE,
    packageName: 'Pest Control Lead Package',
    packageSummary: 'A conversion-driven landing page and SEO setup for urgent pest control searches and fast lead response.',
    painPoints: [
      'Pest control customers often contact the first company that appears credible and fast to respond.',
      'Generic pages do not explain treatment categories clearly enough to build confidence quickly.',
      'Weak call-to-action placement reduces enquiries during high-urgency moments.',
    ],
    outcomes: [
      'Clear treatment sections for termite, bed bug, rodent, cockroach, and sanitization services.',
      'Fast-response positioning and CTA flow designed for emergency intent.',
      'Local search structure to improve visibility in urgent pest-related searches.',
    ],
    serviceFocus: [
      'Termite and wood protection sections',
      'Bed bug, cockroach, rodent, and insect treatment positioning',
      'Residential and commercial pest services',
      'Urgency-focused lead capture flow',
    ],
    deliverables: [
      '1 long-form pest control landing page',
      'Service category sections',
      'Emergency lead form + WhatsApp CTA',
      'Trust and treatment process blocks',
      'Local SEO setup',
      'Monthly maintenance support',
    ],
    whyChoose: [
      'Designed for urgent response conversion.',
      'Improves clarity around treatment types and trust.',
      'Better fit for local service intent.',
    ],
    testimonials: [
      {
        name: 'Suresh Patil',
        role: 'Pest Control Owner',
        quote: 'The new page made our termite and bed bug services easier to understand, and calls became more focused.',
      },
      {
        name: 'Priya Nair',
        role: 'Operations Manager',
        quote: 'We saw better enquiry quality because visitors could find the right treatment section quickly.',
      },
    ],
    faqs: [
      {
        question: 'Can the page show multiple pest treatments?',
        answer: 'Yes. The structure supports multiple treatment categories clearly and conversion-first.',
      },
      {
        question: 'Will this help urgent customers contact us faster?',
        answer: 'Yes. The CTA placement and service layout are designed for fast enquiry action.',
      },
      {
        question: 'Is the package good for city-based service providers?',
        answer: 'Yes. It is built for local service discovery and lead generation.',
      },
    ],
    proof: 'Built for pest control businesses that need faster response conversion and better local lead flow.',
  },
  {
    slug: 'exporters',
    nicheName: 'Exporters',
    heroTitle: 'Build a Stronger Export Brand Presence That Attracts Global Buyer Enquiries',
    heroSubtitle:
      'We create a professional exporter landing page that presents your product range, compliance strength, and shipment readiness in a way global buyers trust.',
    heroSupport:
      'Ideal for exporters selling food, industrial, manufacturing, agricultural, or private-label products internationally.',
    keywordLine:
      'Targets exporter from India, bulk export supplier, international supplier, product exporter, private label exporter.',
    audienceLabel: 'Export and Trade Businesses',
    primaryCta: DEFAULT_CTA,
    monthlyPrice: DEFAULT_PRICE,
    packageName: 'Exporter Enquiry Package',
    packageSummary: 'A professional export-focused website and SEO package designed to attract buyer enquiries and improve credibility.',
    painPoints: [
      'International buyers need clear trust signals, product categories, and compliance positioning before sending enquiries.',
      'Many exporter sites feel generic and fail to communicate reliability or shipment capability well.',
      'Poor structure reduces confidence among serious bulk and global buyers.',
    ],
    outcomes: [
      'A structured exporter page that communicates credibility, product range, and market readiness.',
      'Better inquiry flow for international buyers, importers, and distributors.',
      'Positioning built around trust, export capability, and product clarity.',
    ],
    serviceFocus: [
      'Product range and category positioning',
      'Compliance and export market trust blocks',
      'Bulk enquiry and buyer conversion flow',
      'Professional brand presentation for trade buyers',
    ],
    deliverables: [
      '1 long-form exporter landing page',
      'Product category and buyer-trust sections',
      'International enquiry form + CTA',
      'Professional export credibility structure',
      'SEO setup',
      'Monthly edits and support',
    ],
    whyChoose: [
      'Built to earn buyer trust quickly.',
      'Improves export brand credibility.',
      'Supports higher-quality inbound trade enquiries.',
    ],
    testimonials: [
      {
        name: 'Harsh Vora',
        role: 'Export Business Owner',
        quote: 'The new landing page made us look far more professional to overseas buyers and improved enquiry quality.',
      },
      {
        name: 'Trade Manager',
        role: 'Export Firm',
        quote: 'Our page now communicates product range and export readiness much more clearly.',
      },
    ],
    faqs: [
      {
        question: 'Can this page help us appear more credible to global buyers?',
        answer: 'Yes. The page is designed around trust, product clarity, and export professionalism.',
      },
      {
        question: 'Will the page support multiple product categories?',
        answer: 'Yes. We can structure your categories to make them easier for buyers to evaluate quickly.',
      },
      {
        question: 'Is the package suitable for growing exporters?',
        answer: 'Yes. It works well for both established exporters and businesses expanding their international presence.',
      },
    ],
    proof: 'Built for exporters who need stronger credibility, better presentation, and more serious inbound buyer enquiries.',
  },
  {
    slug: 'cctv-security-system-installation',
    nicheName: 'CCTV & Security System Installation',
    heroTitle: 'Get More CCTV Installation and Site Survey Enquiries from Homes and Businesses',
    heroSubtitle:
      'We build a long-form landing page for CCTV and security system installers that explains solution types, trust factors, and survey-based conversion clearly.',
    heroSupport:
      'Designed for installers serving homes, offices, societies, shops, warehouses, and commercial properties.',
    keywordLine:
      'Targets CCTV installation, security camera setup, home CCTV, office surveillance installation, security system installation.',
    audienceLabel: 'CCTV and Security Installers',
    primaryCta: DEFAULT_CTA,
    monthlyPrice: DEFAULT_PRICE,
    packageName: 'CCTV Installer Lead Package',
    packageSummary: 'A lead-generation landing page and SEO setup for CCTV installers who need more site visits and survey enquiries.',
    painPoints: [
      'Customers compare vendors based on trust, technical clarity, warranty, and after-installation confidence.',
      'Generic pages fail to explain home, office, and commercial solution differences properly.',
      'Weak enquiry flow reduces booked site surveys and consultation requests.',
    ],
    outcomes: [
      'Solution-focused structure for home, office, retail, society, and warehouse installations.',
      'Trust-building positioning around brands, installation quality, and maintenance support.',
      'Lead flow optimized for site survey booking and quotation conversion.',
    ],
    serviceFocus: [
      'Residential CCTV installation sections',
      'Office and commercial security coverage blocks',
      'Warranty, maintenance, and installation trust messaging',
      'Site survey CTA and consultation funnel',
    ],
    deliverables: [
      '1 long-form CCTV installation landing page',
      'Use-case based solution sections',
      'Survey form + WhatsApp CTA',
      'Trust and technical clarity sections',
      'Local SEO setup',
      'Monthly maintenance support',
    ],
    whyChoose: [
      'Designed to sell security confidence, not just camera products.',
      'Explains installation services more clearly.',
      'Improves local lead capture and site survey bookings.',
    ],
    testimonials: [
      {
        name: 'Deepak Rana',
        role: 'Security Systems Installer',
        quote: 'The new page helped clients understand our CCTV solutions better and increased survey requests.',
      },
      {
        name: 'Monika S.',
        role: 'Operations Manager',
        quote: 'Our commercial leads improved because the page now explains business use cases clearly.',
      },
    ],
    faqs: [
      {
        question: 'Can this page show both home and commercial CCTV services?',
        answer: 'Yes. The page can clearly segment your residential, office, and commercial offerings.',
      },
      {
        question: 'Does the package support local lead generation?',
        answer: 'Yes. It is designed to improve local discoverability and direct enquiry conversion.',
      },
      {
        question: 'Will this help us get more site visits booked?',
        answer: 'Yes. The CTA flow is built around booking surveys and consultations faster.',
      },
    ],
    proof: 'Built for CCTV installers who need stronger trust, clearer technical messaging, and more site survey leads.',
  },
  {
    slug: 'luxury-property-consultants',
    nicheName: 'Luxury Property Consultants',
    heroTitle: 'Position Your Luxury Property Brand to Attract Higher-Value Buyer Enquiries',
    heroSubtitle:
      'We create a premium real estate landing page for luxury property consultants that communicates exclusivity, market understanding, and buyer confidence with long-form detail.',
    heroSupport:
      'Ideal for consultants selling villas, luxury apartments, branded residences, investor opportunities, and premium projects.',
    keywordLine:
      'Targets luxury real estate consultant, premium property advisor, villa consultant, NRI property consultant, luxury apartment consultant.',
    audienceLabel: 'Luxury Real Estate Consultants',
    primaryCta: DEFAULT_CTA,
    monthlyPrice: DEFAULT_PRICE,
    packageName: 'Luxury Property Consultant Package',
    packageSummary: 'A premium positioning website and SEO package for high-value real estate leads and better brand perception.',
    painPoints: [
      'Luxury buyers judge brand perception and consultant credibility before they respond to any property offer.',
      'Generic property pages fail to create aspiration, trust, and exclusivity.',
      'Weak digital presentation reduces confidence among NRI, investor, and premium lifestyle buyers.',
    ],
    outcomes: [
      'Premium long-form structure designed for affluent buyers, investors, and NRI prospects.',
      'Improved perception through aspirational positioning, curated sections, and trust-driven messaging.',
      'SEO and CTA flow built for high-value real estate enquiry conversion.',
    ],
    serviceFocus: [
      'Luxury apartment and villa positioning',
      'Investor and NRI enquiry flow',
      'Brand perception and premium trust messaging',
      'Consultation and site visit conversion CTA',
    ],
    deliverables: [
      '1 premium long-form property landing page',
      'Luxury-focused copy and content flow',
      'Lead form + WhatsApp CTA',
      'Investor and buyer trust sections',
      'SEO setup',
      'Monthly edits and support',
    ],
    whyChoose: [
      'Designed for premium positioning, not mass-market listings.',
      'Supports better perception among affluent prospects.',
      'Improves enquiry quality for high-value deals.',
    ],
    testimonials: [
      {
        name: 'Arjun Khanna',
        role: 'Luxury Property Consultant',
        quote: 'The landing page finally matched the kind of buyers we wanted to attract.',
      },
      {
        name: 'Ritika Malhotra',
        role: 'Real Estate Advisor',
        quote: 'Premium prospects responded better once our positioning became more polished online.',
      },
    ],
    faqs: [
      {
        question: 'Can this page be positioned for premium real estate only?',
        answer: 'Yes. The structure is designed specifically for high-value property positioning and enquiry conversion.',
      },
      {
        question: 'Will it work for NRI and investor audiences too?',
        answer: 'Yes. The page can address end users, investors, and NRI decision-makers clearly.',
      },
      {
        question: 'Does the package include ongoing support?',
        answer: 'Yes. The Rs 2000 monthly package includes updates and maintenance support.',
      },
    ],
    proof: 'Built for luxury consultants who need premium positioning and stronger high-value enquiry conversion.',
  },
  {
    slug: 'solar-panel-installation',
    nicheName: 'Solar Panel Installation',
    heroTitle: 'Get More Rooftop Solar Enquiries from Homeowners and Commercial Buyers',
    heroSubtitle:
      'We build a long-form solar installation landing page that explains savings, ROI, subsidy opportunity, and installation trust in a way buyers can act on faster.',
    heroSupport:
      'Designed for residential rooftop solar, commercial solar setups, maintenance, and energy-saving solution providers.',
    keywordLine:
      'Targets solar panel installation, rooftop solar provider, residential solar setup, commercial solar installer, solar company near me.',
    audienceLabel: 'Solar Installation Companies',
    primaryCta: DEFAULT_CTA,
    monthlyPrice: DEFAULT_PRICE,
    packageName: 'Solar Lead Generation Package',
    packageSummary: 'A conversion-led landing page and SEO setup for solar businesses that need more site assessments and installation enquiries.',
    painPoints: [
      'Prospects hesitate when savings, ROI, and subsidy information are not explained simply.',
      'Generic solar pages do not convert because they fail to answer commercial and residential concerns clearly.',
      'Weak CTA flow reduces assessment bookings and installation enquiries.',
    ],
    outcomes: [
      'A clearer sales narrative around savings, payback period, and trust in installation quality.',
      'Service sections for residential, commercial, and maintenance offerings.',
      'Better conversion from local solar-related searches and assessment requests.',
    ],
    serviceFocus: [
      'Residential rooftop solar sections',
      'Commercial and industrial solar positioning',
      'Savings, subsidy, and ROI explanation blocks',
      'Assessment and consultation CTA flow',
    ],
    deliverables: [
      '1 long-form solar landing page',
      'Savings and service-focused copy',
      'Assessment form + WhatsApp CTA',
      'Trust and process blocks',
      'Local SEO setup',
      'Monthly support and updates',
    ],
    whyChoose: [
      'Built to convert education-stage buyers into enquiries.',
      'Explains technical value more clearly.',
      'Supports both residential and commercial lead generation.',
    ],
    testimonials: [
      {
        name: 'Vikram Joshi',
        role: 'Solar Installation Owner',
        quote: 'The page made our offer easier to understand and helped us get better assessment enquiries.',
      },
      {
        name: 'Anusha Rao',
        role: 'Clean Energy Consultant',
        quote: 'Visitors now understand savings and payback much faster, which improved call quality.',
      },
    ],
    faqs: [
      {
        question: 'Can the page explain both home and commercial solar services?',
        answer: 'Yes. The structure can separate residential and commercial buyer concerns clearly.',
      },
      {
        question: 'Will this help improve local enquiries?',
        answer: 'Yes. The page is built around local search intent and assessment conversion.',
      },
      {
        question: 'Is the package suitable for growing solar installers?',
        answer: 'Yes. It is designed for solar businesses that want more serious inbound leads every month.',
      },
    ],
    proof: 'Built for solar companies that need stronger education-led conversion and more installation enquiries.',
  },
];

export const NICHE_SLUGS = NICHE_LANDING_CONFIGS.map((item) => item.slug);

export function getNicheConfigBySlug(slug: string): LandingConfig | undefined {
  return NICHE_LANDING_CONFIGS.find((item) => item.slug === slug);
}
