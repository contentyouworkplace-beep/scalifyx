import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const BUCKET = 'logos';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return Response.json({ error: 'No file provided' }, { status: 400 });

  const maxSize = 5 * 1024 * 1024; // 5 MB
  if (file.size > maxSize) return Response.json({ error: 'File too large (max 5 MB)' }, { status: 400 });

  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  if (!allowed.includes(ext)) return Response.json({ error: 'Invalid file type' }, { status: 400 });

  const fileName = `logo_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY || ANON_KEY);

  // Ensure bucket exists (create if not)
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(b => b.name === BUCKET);
  if (!bucketExists) {
    await supabase.storage.createBucket(BUCKET, { public: true });
  }

  const { error } = await supabase.storage.from(BUCKET).upload(fileName, buffer, {
    contentType: file.type || 'image/png',
    upsert: false,
  });

  if (error) {
    console.error('Storage upload error:', error);
    return Response.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

  return Response.json({ url: publicUrl });
}
