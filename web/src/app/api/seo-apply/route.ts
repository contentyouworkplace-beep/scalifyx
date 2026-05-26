import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const BUCKET = 'cv-uploads';
const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];

export async function POST(req: Request) {
  const formData = await req.formData();

  const name    = (formData.get('name')    as string | null)?.trim() || '';
  const email   = (formData.get('email')   as string | null)?.trim() || '';
  const phone   = (formData.get('phone')   as string | null)?.trim() || '';
  const message = (formData.get('message') as string | null)?.trim() || '';
  const file    =  formData.get('file') as File | null;

  if (!name || !email || !phone)
    return Response.json({ error: 'Name, email and phone are required.' }, { status: 400 });

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  // ── 1. Upload file to storage ──────────────────────────────────────────────
  let cvUrl: string | null = null;

  if (file && file.size > 0) {
    if (file.size > MAX_SIZE)
      return Response.json({ error: 'File too large (max 10 MB).' }, { status: 400 });

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_TYPES.includes(ext))
      return Response.json({ error: 'Only PDF, JPG, PNG, or WEBP allowed.' }, { status: 400 });

    const fileName = `cv_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer   = new Uint8Array(await file.arrayBuffer());

    // Create bucket if it doesn't exist yet
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.some(b => b.name === BUCKET))
      await supabase.storage.createBucket(BUCKET, { public: true });

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return Response.json({ error: 'File upload failed: ' + uploadError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

    // ── 2. Shorten with TinyURL ───────────────────────────────────────────────
    try {
      const res = await fetch(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(publicUrl)}`,
        { signal: AbortSignal.timeout(4000) }
      );
      if (res.ok) {
        const text = (await res.text()).trim();
        cvUrl = text.startsWith('https://') ? text : publicUrl;
      } else {
        cvUrl = publicUrl;
      }
    } catch {
      cvUrl = publicUrl;
    }
  }

  // ── 3. Save application to DB ──────────────────────────────────────────────
  const { error: dbError } = await supabase
    .from('seo_intern_applications')
    .insert({ name, email, phone, message: message || null, cv_url: cvUrl });

  if (dbError) {
    console.error('DB insert error:', dbError);
    return Response.json({ error: 'Could not save application: ' + dbError.message }, { status: 500 });
  }

  return Response.json({ success: true, cv_url: cvUrl });
}
