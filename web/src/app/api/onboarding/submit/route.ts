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
    services, gallery_images, domain_purchased, domain_name,
  } = body;

  const { error } = await db()
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

  if (error) {
    console.error('Onboarding submit error:', error);
    return Response.json({ error: 'Failed to save onboarding data' }, { status: 500 });
  }

  return Response.json({ success: true });
}
