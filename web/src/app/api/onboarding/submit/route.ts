import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function db() {
  return createClient(SUPABASE_URL, SERVICE_KEY || ANON_KEY);
}

async function getUser(req: Request) {
  const jwt = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  if (!jwt) return null;
  const { data: { user } } = await createClient(SUPABASE_URL, ANON_KEY).auth.getUser(jwt);
  return user ?? null;
}

export async function POST(req: Request) {
  const user = await getUser(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const {
    business_name, business_category, business_city, whatsapp_number,
    business_address, google_maps_link, business_description,
    logo_url, instagram_url, facebook_url, existing_website_url,
    services, gallery_images, domain_purchased, domain_name, email,
  } = body;

  // 1. Save profile
  const { error: profileError } = await db()
    .from('profiles')
    .update({
      business_name: business_name || null,
      business_category: business_category || null,
      business_city: business_city || null,
      whatsapp_number: whatsapp_number || null,
      business_address: business_address || null,
      google_maps_link: google_maps_link || null,
      business_description: business_description || null,
      logo_url: logo_url || null,
      instagram_url: instagram_url || null,
      facebook_url: facebook_url || null,
      existing_website_url: existing_website_url || null,
      services: services || [],
      gallery_images: gallery_images || [],
      domain_purchased: domain_purchased ?? false,
      domain_name: domain_name || null,
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (profileError) {
    console.error('Onboarding submit error:', profileError);
    return Response.json({ error: 'Failed to save onboarding data' }, { status: 500 });
  }

  // 2. Auto-create a draft website with all business details
  const siteId = `site_${user.id.replace(/-/g, '').slice(0, 12)}`;

  const contact = {
    whatsapp: whatsapp_number || null,
    address: business_address || null,
    maps_link: google_maps_link || null,
    email: email || user.email || null,
    city: business_city || null,
  };

  const socialLinks = {
    instagram: instagram_url || null,
    facebook: facebook_url || null,
    existing_website: existing_website_url || null,
  };

  // Check if website already exists for this user
  const { data: existingWebsite } = await db()
    .from('websites')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  if (existingWebsite) {
    // Update existing
    await db()
      .from('websites')
      .update({
        business_name: (business_name as string) || 'My Business',
        business_type: (business_category as string) || null,
        description: (business_description as string) || null,
        logo_url: (logo_url as string) || null,
        photos: (gallery_images as unknown[]) || [],
        services: (services as unknown[]) || [],
        contact,
        social_links: socialLinks,
        domain_name: (domain_name as string) || null,
        status: 'draft',
      })
      .eq('id', existingWebsite.id);
  } else {
    // Create new
    await db()
      .from('websites')
      .insert({
        user_id: user.id,
        site_id: siteId,
        business_name: (business_name as string) || 'My Business',
        business_type: (business_category as string) || null,
        description: (business_description as string) || null,
        logo_url: (logo_url as string) || null,
        photos: (gallery_images as unknown[]) || [],
        services: (services as unknown[]) || [],
        contact,
        social_links: socialLinks,
        status: 'draft',
      });
  }

  return Response.json({ success: true });
}
