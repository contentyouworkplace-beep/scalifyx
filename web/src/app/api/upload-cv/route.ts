import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const BUCKET = 'cv-uploads';
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return Response.json({ error: 'No file provided' }, { status: 400 });

  if (file.size > MAX_SIZE)
    return Response.json({ error: 'File too large (max 10 MB)' }, { status: 400 });

  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_TYPES.includes(ext))
    return Response.json({ error: 'Only PDF, JPG, PNG, or WEBP allowed' }, { status: 400 });

  const fileName = `cv_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = new Uint8Array(await file.arrayBuffer());
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.some(b => b.name === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, { public: true });
  }

  const { error } = await supabase.storage.from(BUCKET).upload(fileName, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    console.error('CV upload error:', error);
    return Response.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

  // Shorten the URL so it fits cleanly in WhatsApp
  let shortUrl = publicUrl;
  try {
    const res = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(publicUrl)}`,
      { signal: AbortSignal.timeout(4000) }
    );
    if (res.ok) {
      const text = (await res.text()).trim();
      if (text.startsWith('https://')) shortUrl = text;
    }
  } catch {
    // fall back to full URL if shortener is unavailable
  }

  return Response.json({ url: shortUrl });
}
