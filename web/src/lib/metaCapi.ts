const PIXEL_ID = '1624622505434138';
const CAPI_URL = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`;

interface UserData {
  email?: string;
  phone?: string;
  client_ip_address?: string;
  client_user_agent?: string;
  fbc?: string;  // _fbc cookie
  fbp?: string;  // _fbp cookie
}

interface EventData {
  eventName: string;
  eventId: string;         // for deduplication with client pixel
  eventSourceUrl?: string;
  userData: UserData;
  customData?: Record<string, unknown>;
}

// Simple SHA-256 hash for PII (Meta requires hashed values)
async function sha256(val: string): Promise<string> {
  const { createHash } = await import('crypto');
  return createHash('sha256').update(val.trim().toLowerCase()).digest('hex');
}

export async function sendCapiEvent(event: EventData): Promise<void> {
  const token = process.env.META_CAPI_TOKEN?.trim();
  if (!token) return;

  const ud: Record<string, string> = {};
  if (event.userData.email) ud.em = await sha256(event.userData.email);
  if (event.userData.phone) ud.ph = await sha256(event.userData.phone.replace(/\D/g, ''));
  if (event.userData.client_ip_address) ud.client_ip_address = event.userData.client_ip_address;
  if (event.userData.client_user_agent) ud.client_user_agent = event.userData.client_user_agent;
  if (event.userData.fbc) ud.fbc = event.userData.fbc;
  if (event.userData.fbp) ud.fbp = event.userData.fbp;

  const payload = {
    data: [{
      event_name: event.eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: event.eventId,
      event_source_url: event.eventSourceUrl || 'https://scalifyapp.com',
      action_source: 'website',
      user_data: ud,
      ...(event.customData ? { custom_data: event.customData } : {}),
    }],
  };

  try {
    await fetch(`${CAPI_URL}?access_token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('Meta CAPI error:', err);
  }
}
